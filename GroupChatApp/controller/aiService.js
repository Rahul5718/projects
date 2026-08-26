// controller/aiService.js
const { GoogleGenAI } = require('@google/genai');

// Keep the model configurable because Google retires model aliases over time.
const MODEL_NAME = process.env.GOOGLE_GENAI_MODEL || 'gemini-3.5-flash-lite';

const ai = new GoogleGenAI({
    apiKey: process.env.GOOGLE_GENAI_API_KEY
});

// Cache map: stores previous replies with a TTL to prevent repeated responses
const smartReplyCache = new Map();
const predictiveCache = new Map();

// Helper to safely parse JSON from Gemini
function parseAndCleanJson(rawText) {
    if (!rawText) return [];
    try {
        const cleaned = typeof rawText === 'function' ? rawText() : rawText;
        const stripped = cleaned.replace(/```json/g, '').replace(/```/g, '').trim();
        const parsed = JSON.parse(stripped);
        return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
        console.error("JSON parsing error:", e);
        return [];
    }
}

/**
 * Generates 3 to 4 distinct contextual smart replies based on the sender's message.
 * First internally classifies the message intent (emergency, question, emotional,
 * casual, request/favor, information/update, greeting) so the replies actually fit
 * what kind of message it is — e.g. an "emergency" text gets replies like
 * "What happened?", "Do you need help right now?", "Call me immediately" —
 * instead of generic replies like "Sounds good!".
 *
 * @param {string} incomingMessageText - The message received by the user.
 * @param {string} tonePreference - e.g. "casual with emojis"
 * @returns {Promise<string[]>}
 */
exports.getSmartReplies = async (incomingMessageText, tonePreference = "casual with emojis") => {
    if (!incomingMessageText || typeof incomingMessageText !== "string") return [];

    const trimmedInput = incomingMessageText.trim();
    if (trimmedInput.length === 0) return [];

    // Don't generate smart replies for URLs or file paths
    if (trimmedInput.includes('http://') || trimmedInput.includes('https://')) return [];

    const cacheKey = `${trimmedInput.toLowerCase()}_${tonePreference}`;
    if (smartReplyCache.has(cacheKey)) {
        return smartReplyCache.get(cacheKey);
    }

    try {
        const prompt = `You are replying on behalf of the RECEIVER of a chat message.

Step 1 - Classify the incoming message's intent into ONE of these categories:
- "emergency" (danger, accident, urgent help needed, distress)
- "emotional" (sad, angry, excited, venting, sharing feelings)
- "question" (sender is asking something specific)
- "request" (sender is asking for a favor, item, or action)
- "information" (sender is sharing news, an update, a fact)
- "greeting" (hello, checking in, small talk)
- "other" (anything that doesn't fit the above)

Step 2 - Based on that category, generate 3 to 4 short WhatsApp-style replies the RECEIVER could send back, that genuinely fit the situation.

Category-specific reply behavior:
- emergency: prioritize urgency and care. e.g. "What happened?", "Are you okay??", "Do you need help right now?", "Calling you now"
- emotional: acknowledge the feeling first, then offer support or ask what happened.
- question: directly answer or address the question, don't dodge it.
- request: either agree, ask for more details, or politely decline/offer an alternative.
- information: react to the specific news/update, ask a relevant follow-up.
- greeting: respond warmly and naturally, can ask what's up.
- other: respond naturally based on the actual content.

Incoming sender message: "${trimmedInput}"
Tone: ${tonePreference}

Rules:
    1. Replies must respond to the sender's actual message content/meaning; do not repeat the sender's words.
    2. Each reply should reflect a different natural angle (e.g. direct response, follow-up question, offer of help/action) appropriate to the classified category.
    3. Never use generic filler replies such as "Sounds good!", "Nice!", or "Let's talk soon" unless the message specifically calls for them.
    4. Keep each reply between 2 and 12 words and make each one meaningfully different from the others.
    5. Return ONLY a valid JSON array of exactly 3 to 4 strings. No markdown, no commentary, no category label in the output — just the reply strings.`;

        const response = await ai.models.generateContent({
            model: MODEL_NAME,
            config: {
                systemInstruction: "You are an intelligent real-time conversational chat reply engine. You first silently classify the sender's message intent, then produce natural, context-aware, situationally-appropriate reply suggestions. Return only strict JSON arrays of strings.",
                responseMimeType: "application/json",
                temperature: 0.7
                

            },
            contents: prompt
        });

        const rawContent = response.text ? (typeof response.text === 'function' ? response.text() : response.text) : '';
        const parsedReplies = parseAndCleanJson(rawContent);

        // Filter duplicates and empty strings
        const distinctReplies = parsedReplies
            .filter(text => typeof text === 'string' && text.trim().length > 0)
            .map(text => text.trim())
            .filter((text, index, replies) => replies.findIndex(reply => reply.toLowerCase() === text.toLowerCase()) === index)
            .slice(0, 4);

        if (distinctReplies.length > 0) {
            // Cache for 3 minutes to keep suggestions fresh
            smartReplyCache.set(cacheKey, distinctReplies);
            setTimeout(() => smartReplyCache.delete(cacheKey), 3 * 60 * 1000);
            return distinctReplies;
        }

        return [];
    } catch (err) {
        console.error('Smart reply generative error:', err.message || err);
        return [];
    }
};

/**
 * Generates inline predictive typing autocomplete suggestions.
 */
exports.getPredictiveTyping = async (currentTypedString, tonePreference = "Professional") => {
    if (!currentTypedString || currentTypedString.trim().length < 3) return [];

    const trimmedInput = currentTypedString.trim();
    const cacheKey = `${trimmedInput.toLowerCase()}_${tonePreference}`;

    if (predictiveCache.has(cacheKey)) {
        return predictiveCache.get(cacheKey);
    }

    try {
        const response = await ai.models.generateContent({
            model: MODEL_NAME,
            config: {
                systemInstruction: "You are a chat input auto-complete engine. Complete the user's sentence naturally. Return ONLY a valid JSON array of strings under 4 words.",
                responseMimeType: "application/json",
                temperature: 0.2
            },
            contents: `User is typing: "${trimmedInput}". Tone: ${tonePreference}. Suggest completions.`
        });

        const rawContent = response.text ? (typeof response.text === 'function' ? response.text() : response.text) : '';
        const parsed = parseAndCleanJson(rawContent);
        const result = Array.isArray(parsed) ? parsed.slice(0, 3) : [];

        if (result.length > 0) {
            predictiveCache.set(cacheKey, result);
            setTimeout(() => predictiveCache.delete(cacheKey), 3 * 60 * 1000);
        }

        return result;
    } catch (err) {
        if (isQuotaError(err)) {
            blockAiQuota();
        } else {
            console.error('Predictive typing error:', err.message || err);
        }
        return [];
    }
};