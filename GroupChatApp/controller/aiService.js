// controller/aiService.js
const { GoogleGenAI } = require('@google/genai');

// const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const MODEL_NAME = 'gemini-1.5-flash'; // Or 'gemini-2.0-flash'

const ai = new GoogleGenAI({
    apiKey: process.env.GOOGLE_GENAI_API_KEY
});

// Using stable model name (adjust if using gemini-2.5-flash / gemini-1.5-flash)
// const modelName = 'gemini-2.5-flash';

// Simple in-memory caches to prevent repeated calls within a 5-minute window
const predictiveCache = new Map();
const smartReplyCache = new Map();

// function buildFallbackPredictiveSuggestions(text) {
//     const cleaned = (text || '').trim();
//     if (!cleaned) return [];

//     const lower = cleaned.toLowerCase();
//     if (lower.includes('hello') || lower.includes('hi')) return ['Hi there!', 'How are you?'];
//     if (lower.includes('thanks') || lower.includes('thank')) return ['You’re welcome!', 'Happy to help!'];
//     if (lower.includes('bye') || lower.includes('goodbye')) return ['See you soon!', 'Take care!'];
//     if (lower.includes('work') || lower.includes('meeting')) return ['Sounds good!', 'Let’s discuss it'];

//     return ['Nice!', 'Sounds good!', 'Let’s talk soon'];
// }

// function buildFallbackSmartReplies(text) {
//     const cleaned = (text || '').trim();
//     if (!cleaned) return ['Sounds good! 😊', 'Let’s chat soon'];

//     const lower = cleaned.toLowerCase();
//     if (lower.includes('hello') || lower.includes('hi')) return ['Hi! 👋', 'Hello there!'];
//     if (lower.includes('thanks') || lower.includes('thank')) return ['You’re welcome! 😊', 'Happy to help!'];
//     if (lower.includes('bye') || lower.includes('goodbye')) return ['Take care! 👋', 'See you soon!'];
//     if (lower.includes('help')) return ['I’m here for you! 💛', 'Tell me more'];

//     return ['Sounds good! 😊', 'I’m on it!', 'Let’s talk soon'];
// }

// Helper to sanitize JSON response string from Gemini
function parseAndCleanJson(rawText) {
    if (!rawText) return null;
    // Strip markdown code fences if Gemini accidentally wraps output (```json ... ```)
    const cleanedText = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
    try {
        return JSON.parse(cleanedText);
    } catch (e) {
        return null;
    }
}

exports.getPredictiveTyping = async (currentTypedString, tonePreference = "Professional") => {
    if (!currentTypedString || currentTypedString.trim().length < 3) return [];

    const trimmedInput = currentTypedString.trim();
    const cacheKey = `${trimmedInput.toLowerCase()}_${tonePreference}`;

    // 1. Check in-memory cache first
    if (predictiveCache.has(cacheKey)) {
        return predictiveCache.get(cacheKey);
    }

    try {
        const response = await ai.models.generateContent({
            model: modelName,
            config: {
                systemInstruction: "You are a chat input auto-complete engine. Predict the next 2 to 4 words or short phrases that naturally finish the user's sentence block. Return ONLY a valid JSON array of strings. Do not include markdown formatting or wrapping code blocks. Keep entries under 4 words.",
                responseMimeType: "application/json",
                temperature: 0.2
            },
            contents: `The user typed: "${trimmedInput}". Tone adaptation context profile: ${tonePreference}. Output completion options now.`
        });

        const parsed = parseAndCleanJson(response.text);
        const result = Array.isArray(parsed) ? parsed : [];

        // 2. Cache successful results for 5 minutes
        if (result.length > 0) {
            predictiveCache.set(cacheKey, result);
            setTimeout(() => predictiveCache.delete(cacheKey), 5 * 60 * 1000);
        }

        return result;

    } catch (err) {
        // 3. Graceful handling for 429 Rate Limits or Quota exhaustion
        if (err.status === 429 || err.message?.includes("429") || err.message?.includes("Quota")) {
            console.warn("⚠️ Gemini API Rate Limit (429) hit in getPredictiveTyping. Using fallback.");
            return buildFallbackPredictiveSuggestions(trimmedInput);
        }

        console.error('predictive autocomplete pipeline error:', err);
        return buildFallbackPredictiveSuggestions(trimmedInput);
    }
};

// exports.getSmartReplies = async (incomingMessageText, tonePreference = "casual with emojis") => {
//     if (!incomingMessageText || typeof incomingMessageText !== "string") return [];

//     const trimmedInput = incomingMessageText.trim();
//     if (trimmedInput.length === 0) return [];

//     const cacheKey = `${trimmedInput.toLowerCase()}_${tonePreference}`;

//     // 1. Check in-memory cache first
//     if (smartReplyCache.has(cacheKey)) {
//         return smartReplyCache.get(cacheKey);
//     }

//     try {
//         const response = await ai.models.generateContent({
//             model: modelName,
//             config: {
//                 systemInstruction: "You are an in-app messaging smart reply engine. Read the incoming message context and output exactly 3 contextual, natural, and helpful short alternative replies. Return ONLY a valid JSON array of strings. Do not include markdown or backticks.",
//                 responseMimeType: "application/json"
//             },
//             contents: `Incoming message to answer: "${trimmedInput}". Personalization setting: ${tonePreference}. Provide reply options.`
//         });

//         const parsed = parseAndCleanJson(response.text);
//         const result = Array.isArray(parsed) ? parsed : [];

//         // 2. Cache successful results for 5 minutes
//         if (result.length > 0) {
//             smartReplyCache.set(cacheKey, result);
//             setTimeout(() => smartReplyCache.delete(cacheKey), 5 * 60 * 1000);
//         }

//         return result;

//     } catch (err) {
//         // 3. Graceful handling for 429 Rate Limits
//         if (err.status === 429 || err.message?.includes("429") || err.message?.includes("Quota")) {
//             console.warn("⚠️ Gemini API Rate Limit (429) hit in getSmartReplies. Using fallback.");
//             return buildFallbackSmartReplies(trimmedInput);
//         }

//         console.error("Smart replies generative failure:", err);
//         return buildFallbackSmartReplies(trimmedInput);
//     }
// };


// controller/aiService.js


/**
 * Generates dynamic smart replies based on the sender's incoming message text.
 * @param {string} senderMessage - The text received from the sender.
 * @param {string} tone - Optional tone preference (e.g., "casual with emojis").
 * @returns {Promise<Array<string>>}
 */
exports.getSmartReplies = async (senderMessage, tone = 'casual with emojis') => {
  const cleanedMessage = (senderMessage || '').trim();
  if (!cleanedMessage) return [];

  const prompt = `
You are an AI assistant in a messaging application. 
Generate exactly 3 short, natural, context-aware reply suggestions for a user replying to this incoming message.

Sender's Message: "${cleanedMessage}"
Desired Tone: ${tone}

Rules:
1. Provide exactly 3 short response options (1 to 6 words each).
2. Base the choices directly on the context of the sender's message.
3. Return ONLY a valid JSON array of 3 strings. Example format: ["Option 1", "Option 2", "Option 3"]
4. Do NOT include markdown code blocks, explanatory text, or extra characters.
`;

  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
    });

    const rawText = response.text ? response.text().trim() : '';
    // Clean markdown backticks if Gemini wraps the array in ```json ... ```
    const sanitizedText = rawText.replace(/```json|```/g, '').trim();

    const parsedReplies = JSON.parse(sanitizedText);
    if (Array.isArray(parsedReplies) && parsedReplies.length > 0) {
      return parsedReplies.slice(0, 3);
    }
  } catch (err) {
    console.error('Error generating AI smart replies:', err);
  }

  // Return empty array if generation fails so the UI gracefully handles it
  return [];
};