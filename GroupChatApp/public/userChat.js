// userChat.js - Isolated UI Mechanics Engine

const chatStreamBody = document.getElementById('chatStreamBody');
const chatSubmissionForm = document.getElementById('chatSubmissionForm');
const rawMessageInputField = document.getElementById('rawMessageInputField');
const displayUserName = document.getElementById('displayUserName');
const typingIndicatorContainer = document.getElementById('typingIndicatorContainer');


// 1. ROUTE GUARD: Ensure user has valid authentication token
const activeSessionToken = localStorage.getItem('token');
const loggedUserRole = localStorage.getItem('role');

if (!activeSessionToken || loggedUserRole !== 'user') {
    alert("Unauthorized entry path detected. Returning to home landing page.");
    window.location.href = "/login";
}

if (!window.globalChatSocket) {
    window.globalChatSocket = io('http://localhost:3000', {
        auth: {
            token: activeSessionToken 
        }
    });
}
const socket = window.globalChatSocket;
socket.on('connect_error', (err) => {
    console.error("Socket Connection Error:", err.message)
    if (err.message.includes('expired') || err.message.includes('auth') || err.message.includes('Authentication')) {
        alert("Your session has expired. Please log back in.");
        logoutSession(); // Clears localStorage and redirects to /login
    }
});

socket.emit('join_room', 'global');

let currentUserId = null;
let currentUserName = null;
let currentActivePrivateRoomId = null; 
let activeTargetPartnerId = 1;
let activeSmartReplyOptions = [];
let isSmartReplyModeActive = false;

const urlParams = new URLSearchParams(window.location.search);
const targetChatPartnerId = Number(urlParams.get('with')) || 1;



try {
    const base64Url = activeSessionToken.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const decoded = JSON.parse(atob(base64));
    currentUserId = decoded.userId || decoded.id;
    currentUserName = decoded.name || decoded.username || 'Unknown User';
} catch (e) {
    console.error("JWT decoding failure", e);
}

let isSubmitting = false

async function fetchCurrentProfile() {
    try {
        const response = await fetch('http://localhost:3000/auth/profile', {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${activeSessionToken}` }
        });
        if (response.ok) {
            const userData = await response.json();
            currentUserName = userData.name; // Assign it globally
        }
    } catch (err) {
        console.error("Failed to fetch current user profile details:", err);
    }
}

// 2. RUNTIME LIFECYCLE INITIALIZATION
window.addEventListener('DOMContentLoaded', () => {

    fetchCurrentProfile(); // Ensure we have the latest user profile data

    if (displayUserName) {
        displayUserName.innerText = 'Global Group Chat Room'
    }
    
    refreshChatPipeline();
    setupSocketListeners();

    if (chatSubmissionForm) {
        chatSubmissionForm.onsubmit = null; // Kill any inline or old listeners
        chatSubmissionForm.onsubmit = handleFormSubmit; // Attach exactly ONE handler cleanly
    }

    const searchBtn = document.getElementById('initiateRoomSearchBtn');
    if (searchBtn) {
        searchBtn.onclick = connectToUserBySearchPayload;
    }
});
    //socket listener
function setupSocketListeners() {
    socket.off('new_message'); // Strip old listeners to prevent duplicates
    socket.off('user_typing');
    socket.off('user_stopped_typing');
    socket.off('new_notification');
    socket.off('connect');

    socket.on('connect', () => {
        console.log('Socket connected:', socket.id);

        socket.emit('join_room', 'global');
        if (currentUserId) {
            socket.emit('join_room', String(currentUserId));
        }
        setTimeout(() => {
            if (currentActivePrivateRoomId) {
                socket.emit('join_room', currentActivePrivateRoomId);
            }
        }, 250);
    });

    socket.on('new_message', (incomingMessage) => {
        if (!incomingMessage) return;

        const isFromMe = Number(incomingMessage.senderId) === Number(currentUserId);
        const insideThisPrivateRoom = currentActivePrivateRoomId && incomingMessage.roomId === currentActivePrivateRoomId;
        const insideGlobalRoom = !currentActivePrivateRoomId && incomingMessage.roomId === 'global';

        if (insideThisPrivateRoom) {
            renderVisualChatFeed(incomingMessage);
        } else if (insideGlobalRoom) {
            appendGroupBubble(incomingMessage);
        }

        if (!isFromMe && typeof incomingMessage.text === 'string' && incomingMessage.text.trim()) {
            notifyIncomingMessage(incomingMessage);
            handleIncomingSmartReplyTrigger(incomingMessage.text);
        }

    });

    socket.on('new_notification', (data) => {
        if (!data) return;
        if(Number(data.senderId)=== Number(currentUserId)) return
        console.log('Notification event received:', data);
        notifyIncomingMessage({
            text: data.message || data.text || '',
            senderName: data.senderName || data.title || 'New message'
        });
    });

    socket.on('user_typing', (data) => {
        if (typingIndicatorContainer) {
            typingIndicatorContainer.innerText = `${data.senderName} is typing...`;
        }
    });

    socket.on('user_stopped_typing', () => {
        if (typingIndicatorContainer) {
            typingIndicatorContainer.innerText = ''; // Clears the display completely
        }
    });
}


// 3. PERSISTENCE ENGINE: Fetch historical records from server endpoints
async function refreshChatPipeline() {
    try {
            let cleanToken = activeSessionToken;
            if (cleanToken && cleanToken.startsWith('Bearer ')) {
                cleanToken = cleanToken.slice(7).trim();
            }
            console.log("Transmission Token Payload:", cleanToken);
            if (!cleanToken || cleanToken === "null" || cleanToken === "undefined") {
            console.error("CRITICAL: Frontend token variable is totally empty or unassigned.");
            return;
            }

            // Target endpoint matches backend design. Passing 'with=1' target assuming Admin ID is 1
            const response = await fetch('http://localhost:3000/chatbord/history', 
            {
                method: 'GET',
                headers: {
                Authorization : `Bearer ${cleanToken}`
            }
            });

            const payload = await response.json();
            const messages = payload.messages || [];

            chatStreamBody.innerHTML = ''; 
            messages.forEach(msg => appendGroupBubble(msg));
        } catch (err) {
            console.error("Failed to load group history:", err);
        }
}
        

// 4. RENDERING & SCROLL LOGIC
function renderVisualChatFeed(messages) {
    // Detect layout boundary context before purging view memory tree
    // Checks if the user is currently tracking the newest message blocks near the floor threshold

    const userIsTrackingBottom = chatStreamBody.scrollHeight - chatStreamBody.clientHeight <= chatStreamBody.scrollTop + 100;

    const isArray = Array.isArray(messages);

    const messageList = isArray ? messages : [messages];
    
    if (isArray) {
        chatStreamBody.innerHTML = ''; 
    }

    messageList.forEach(message => {
        if(!message) return;

        if (message.id && document.getElementById(`msg_trace_${message.id}`)) {
            console.log(`Skipped duplicate DOM rendering for message trace ID: ${message.id}`);
            return; 
        }

        const bubble = document.createElement('div');

        
        if (message.id) {
            bubble.id = `msg_trace_${message.id}`;
        }
        
        const myId = parseInt(currentUserId, 10);
        const senderId = parseInt(message.senderId, 10);
        const isMe = currentUserId && Number(message.senderId) === Number(currentUserId);

        bubble.className = isMe ? 'neon-bubble-msg sent' : 'neon-bubble-msg received';
        
        const displayLabel = isMe ? 'You' : (message.senderName || 'Direct Message');

        const isMediaFile = message.isMedia || (message.text && message.text.includes('amazonaws.com/uploads'))
        let messageContentHTML = ''

        if (isMediaFile) {
            const fileUrl = message.text || message.message || ''
            const mimeType = message.fileType || ''

            if (mimeType.startsWith('video/') || fileUrl.match(/\.(mp4|webm|mov|avi)$/i)) {
                messageContentHTML = `
                    <video src="${fileUrl}" controls style="max-width: 100%; max-height: 250px; borderRadius: 8px; margin-top: 5px;">
                        Your browser does not support the video tag.
                    </video>`;
            } else {
                messageContentHTML = `
                    <a href="${fileUrl}" target="_blank">
                        <img src="${fileUrl}" alt="Media payload" style="max-width: 100%; max-height: 250px; border-radius: 8px; margin-top: 5px; object-fit: cover;" />
                    </a>`;
            }
        } else {messageContentHTML = `<div>${escapeHTML(message.text || message.message || '')}</div>`;
        }

        bubble.innerHTML = `
            <span class="sender-tag" style="font-weight:bold; display:block;">${displayLabel}</span>
            ${messageContentHTML}
            <span class="time-stamp" style="font-size:10px; opacity:0.6; display:block; text-align:right; margin-top: 4px;">
                ${formatDatabaseTimestamp(message.createdAt || new Date())}
            </span>
        `;
        chatStreamBody.appendChild(bubble);
    });

    if (userIsTrackingBottom || chatStreamBody.scrollTop === 0) {
        chatStreamBody.scrollTop = chatStreamBody.scrollHeight;
    }
}


// Helper: Transform dates to clean timestamps (e.g., "04:12 PM")
function formatDatabaseTimestamp(rawDateString) {
    const parsedDate = new Date(rawDateString);
    return parsedDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

// Helper: Escape code values to block basic text injection hacks
function escapeHTML(str) {
    return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}

// Termination block to scrub runtime context variables cleanly
function logoutSession() {
    localStorage.clear();
    window.location.href = "/login";
}

function appendGroupBubble(message) {
    if (!message || document.getElementById(`msg_trace_${message.id}`)) return;

    const bubble = document.createElement('div');
    if (message.id) bubble.id = `msg_trace_${message.id}`;

    const isMe = Number(message.senderId) === Number(currentUserId);
    bubble.className = isMe ? 'neon-bubble-msg sent' : 'neon-bubble-msg received';

    bubble.style.padding = '8px';
    bubble.style.margin = '6px 0';
    bubble.style.borderRadius = '4px';
    bubble.style.maxWidth = '70%';
    if (isMe) bubble.style.marginLeft = 'auto';

    const senderLabel = isMe ? 'You' : (message.senderName || 'User');
    const actualText = message.text || message.message || '';

    // Initialize layout body content default format
    let displayBodyContent = `<div>${escapeHTML(actualText)}</div>`;
    
    // Check if message is a secure S3 link string location pointer
    if (actualText.startsWith('https://') && actualText.includes('.amazonaws.com/')) {
        const lowercaseUrl = actualText.toLowerCase();
        
        if (['.jpg', '.jpeg', '.png', '.gif', '.webp'].some(ext => lowercaseUrl.includes(ext))) {
            displayBodyContent = `<img src="${actualText}" alt="Sent Image" style="max-width:100%; border-radius:4px; margin-top:5px; display:block; box-shadow: 0 0 5px rgba(0,0,0,0.3);">`;
        } else if (['.mp4', '.webm', '.ogg'].some(ext => lowercaseUrl.includes(ext))) {
            displayBodyContent = `<video src="${actualText}" controls style="max-width:100%; border-radius:4px; margin-top:5px; display:block;"></video>`;
        } else {
            displayBodyContent = `<a href="${actualText}" target="_blank" style="color:#00ffff; font-weight:bold; text-decoration:underline; display:block; margin-top:5px;">📎 Download Shared Document File</a>`;
        }
    }

    bubble.innerHTML = `
        <span class="sender-tag" style="font-weight:bold; color:#ff007f; display:block; margin-bottom:2px;">${senderLabel}</span>
        ${displayBodyContent}
        <span class="time-stamp" style="font-size:10px; opacity:0.6; display:block; text-align:right; margin-top:4px;">
            ${formatDatabaseTimestamp(message.createdAt || new Date())}
        </span>
    `;

    if (chatStreamBody) {
        chatStreamBody.appendChild(bubble);
        chatStreamBody.scrollTop = chatStreamBody.scrollHeight;
    }
}

async function handleFormSubmit(event) {
    event.preventDefault();
    if (isSubmitting || !rawMessageInputField || !chatSubmissionForm) return;

    const fileInput = document.getElementById('mediaFileInputField');
    const selectedFile = fileInput && fileInput.files && fileInput.files.length > 0 ? fileInput.files[0] : null;
    const receiverId = currentActivePrivateRoomId ? activeTargetPartnerId : 0;
    //multi media file upload handling
    if (selectedFile) {
        try {
            isSubmitting = true;
            const formData = new FormData();
            formData.append('mediaFile', selectedFile);
            formData.append('receiverId', receiverId);

            const response = await fetch('http://localhost:3000/chatbord/media-upload', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${activeSessionToken}`
                },
                body: formData
            });

            const result = await response.json().catch(() => ({}));
            if (!response.ok || !result.success) {
                throw new Error(result.message || 'Media upload failed');
            }

            chatSubmissionForm.reset();
        } catch (networkError) {
            console.error('Media upload failed:', networkError);
            alert('Unable to send attachment.');
        } finally {
            isSubmitting = false;
        }
        return;
    }

    const messageContent = rawMessageInputField.value.trim();
    if (!messageContent) return;

    //message submission block
    try {
        isSubmitting = true;

        const response = await fetch('http://localhost:3000/chatbord/send', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${activeSessionToken}`
            },
            body: JSON.stringify({
                text: messageContent,
                receiverId: receiverId
            })
        });

        const result = await response.json().catch(() => ({}));
        if (result.success && result.message) {
            const liveMessage = {
                id: result.message.id,
                text: result.message.text,
                senderId: currentUserId,
                senderName: currentUserName || 'You',
                createdAt: result.message.createdAt || new Date(),
                roomId: currentActivePrivateRoomId || 'global'
            };

            if (currentActivePrivateRoomId) {
                renderVisualChatFeed(liveMessage);
            } else {
                appendGroupBubble(liveMessage);
            }
        }

        chatSubmissionForm.reset();
    } catch (networkError) {
        console.error(networkError);
    } finally {
        isSubmitting = false;
    }
}

function toggleSearchTray() {
    const tray = document.getElementById('searchRoutingTray');
    if (tray.style.display === 'none') {
        tray.style.display = 'block';
        document.getElementById('emailSearchInputField').focus();
    } else {
        tray.style.display = 'none';
    }
}

window.connectToUserBySearchPayload = async function() {
    const searchField = document.getElementById('emailSearchInputField');
    const contextBanner = document.getElementById('activeChatContextBanner');
    const contextStatusText = document.getElementById('contextStatusText');
    const typingIndicatorContainer=document.getElementById('typingIndicatorContainer')

    if (!searchField) return;
    
    const queryValue = searchField.value.trim();
    if (!queryValue) return alert("Please enter an email or search footprint target.");

    try {
        // Fetch matching profile metrics from backend
        const response = await fetch(`http://localhost:3000/chatbord/searchUser?query=${encodeURIComponent(queryValue)}`, {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${activeSessionToken}` }
        });

        if (!response.ok) {
            if (response.status === 404) {
                alert(`User matching "${queryValue}" was not found in the system.`);
            } else {
                alert("Server encountered an issue executing the search request.");
            }
            return; 
        }
        
        const result = await response.json();

        if (!result.success || !result.user) {
            return alert(result.message || "No matching active profiles tracked.");
        }

        const targetedPeer = result.user;
        
    
        activeTargetPartnerId = Number(targetedPeer.id)
        const dynamicRoomName = getPrivateRoomId(currentUserId, activeTargetPartnerId)
        if (currentActivePrivateRoomId && currentActivePrivateRoomId !== dynamicRoomName) {
            socket.emit('leave_room', currentActivePrivateRoomId);
        }

        currentActivePrivateRoomId = dynamicRoomName
      
        socket.emit('join_room', currentActivePrivateRoomId);
        if (currentUserId) {
            socket.emit('join_room', String(currentUserId));
        }

        if (displayUserName) displayUserName.innerText = `Direct Line: ${targetedPeer.name}`;
        if (contextStatusText) contextStatusText.innerText = `Chatting with: ${targetedPeer.name} (${targetedPeer.email})`;
        if (contextBanner) contextBanner.style.display = 'block';
        
        chatStreamBody.innerHTML = '<div id="loadingTranscripts" style="text-align:center;color:#666;padding:20px;">Fetching private transcripts...</div>';
        searchField.value = '';


        const historyResponse = await fetch(`http://localhost:3000/chatbord/history?with=${activeTargetPartnerId}`, {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${activeSessionToken}` }
        });
        
        const historyPayload = await historyResponse.json();
        const historyMessages = historyPayload.messages || historyPayload.data || [];
        
        chatStreamBody.innerHTML = ''; 
        
        if (historyMessages.length === 0) {
            chatStreamBody.innerHTML = '<div style="text-align:center;color:#999;padding:20px;font-style:italic;">No messages here yet. Send a message to start the conversation!</div>';
        } else {
            renderVisualChatFeed(historyMessages)

        if (typingIndicatorContainer) {
            typingIndicatorContainer.innerText = ''; 
        }

    
    }
} catch (err) {
        console.error("Failed executing dynamic channel routing sequence on click:", err);
        alert("An error occurred while connecting to the private chat.");
    }
}
window.returnToGlobalChat = function() {
    const contextBanner = document.getElementById('activeChatContextBanner');
    
    if (!currentActivePrivateRoomId) return;

   
    socket.emit('leave_room', currentActivePrivateRoomId);
    console.log(`Abandoned private channel tracking instance: ${currentActivePrivateRoomId}`);

    
    currentActivePrivateRoomId = null;
    activeTargetPartnerId = 1; 

    
    if (displayUserName) displayUserName.innerText = 'Global Group Chat Room';
    if (contextBanner) contextBanner.style.display = 'none'; 

    chatStreamBody.innerHTML = '<div style="text-align:center;color:#666;padding:20px;">Reconnecting group workspace records...</div>';
   
    refreshChatPipeline();
}

function getPrivateRoomId(userId1, userId2) {
    const sortedIds = [Number(userId1), Number(userId2)].sort((a, b) => a - b);
    return `private-${sortedIds[0]}-${sortedIds[1]}`;
}

const typinIndicator = document.getElementById('typingIndicatorContainer')
let typingTimeout= null

if(rawMessageInputField){
    rawMessageInputField.addEventListener('input',()=>{
        const currentRoomContext = currentActivePrivateRoomId ||'global'

        socket.emit('typing_start',{
            roomId:currentRoomContext,
            senderName:displayUserName.innerHTML.includes('Direct Line') ? 'Someone':currentUserName
        })

        clearTimeout(typingTimeout)

        typingTimeout = setTimeout(() => {
            socket.emit('typing_stop',{
                roomId:currentRoomContext
            })
        }, 1500);
    })
}



const attachButton = document.getElementById('attach-btn');
if (attachButton) {
    attachButton.addEventListener('click', () => {
        document.getElementById('mediaFileInputField')?.click();
    });
}

const mediaFileInputField = document.getElementById('mediaFileInputField');

if (mediaFileInputField) {
    mediaFileInputField.addEventListener('change', async (event) => {
        const fileTarget = event.target.files[0];
        if (!fileTarget) return;

        // Visual alert notification to block interface collisions during active transmissions
        // chatStreamBody.innerHTML += `<div id="uploadLoader" style="text-align:center; color:#ff007f; font-style:italic; padding:5px;">Uploading file media payload...</div>`;

        const loader = document.createElement('div');
        loader.id = "uploadLoader";
        loader.style = "text-align:center; color:#ff007f; font-style:italic; padding:5px;";
        loader.innerText = "Uploading file media payload...";
        chatStreamBody.appendChild(loader);
        chatStreamBody.scrollTop = chatStreamBody.scrollHeight;

        const multipartFormPayload = new FormData();
        multipartFormPayload.append('mediaFile', fileTarget); // Matches 'mediaFile' field parameter key name in backend router setup
        
        // Append context room identifiers if working inside a private room workspace
        const actualReceiverId = currentActivePrivateRoomId ? activeTargetPartnerId : 0;
        multipartFormPayload.append('receiverId', actualReceiverId);

        try {
            const uploadResponse = await fetch('http://localhost:3000/chatbord/media-upload', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${activeSessionToken}`
                    // NOTE: NEVER manually specify Content-Type header when dispatching FormData payloads. Browser handles multi-part boundary flags natively.
                },
                body: multipartFormPayload
            });

            if (uploadResponse.ok) {
                console.log("Cloud asset successfully saved.");
                chatSubmissionForm.reset();
            }

            if (!uploadResponse.ok) {
                throw new Error("HTTP connection error during file processing.");
            }

            console.log("Cloud S3 asset successfully locked in place.");
        } catch (uploadError) {
            console.error("Multimedia delivery sequence failure:", uploadError);
            alert("Unable to deliver attachment payload.");
        } finally {
            // Drop visual loading message block indicator safely
            const loader = document.getElementById('uploadLoader');
            if (loader) loader.remove();
            mediaFileInputField.value = ''; // Reset file input selection cleanly
        }
    });
}

let typingDebounceTimer;
const aiDeck = document.getElementById('aiAssistSuggestionsDeck');
const inputField = document.getElementById('rawMessageInputField');

const doneTypingInterval = 300; // Wait 350ms after the user stops typing
// const chatInput = document.getElementById('chat-input');

function renderAIChips(optionsArray, isSmartReply = false) {
    if (!optionsArray || optionsArray.length === 0) {
        if (!isSmartReply) {
            aiDeck.innerHTML = '';
            isSmartReplyModeActive = false;
            activeSmartReplyOptions = [];
        }
        return;
    }

    aiDeck.innerHTML = '';
    if (isSmartReply) {
        activeSmartReplyOptions = optionsArray.slice();
        isSmartReplyModeActive = true;
    } else {
        activeSmartReplyOptions = [];
        isSmartReplyModeActive = false;
    }

    optionsArray.forEach(phrase => {
        const chip = document.createElement('button');
        chip.type = 'button';
        chip.innerText = phrase;
        chip.style.cssText = "background: #ff007f; color: #fff; border: none; padding: 4px 10px; border-radius: 12px; font-size: 12px; cursor: pointer; white-space: nowrap; opacity: 0.9; transition: 0.2s;";
        
        chip.addEventListener('mouseover', () => chip.style.opacity = "1");
        chip.addEventListener('mouseout', () => chip.style.opacity = "0.9");
        
        chip.addEventListener('click', () => {
            if (isSmartReply) {
                inputField.value = phrase;
            } else {
                const currentText = inputField.value;
                const lastSpaceIdx = currentText.lastIndexOf(' ');
                if (lastSpaceIdx === -1) {
                    inputField.value = phrase + ' ';
                } else {
                    inputField.value = currentText.substring(0, lastSpaceIdx + 1) + phrase + ' ';
                }
            }
            inputField.focus();
        });
        
        aiDeck.appendChild(chip);
    });
}

inputField.addEventListener('input', (e) => {
    clearTimeout(typingDebounceTimer);
    const value = e.target.value.trim();

    if (value.length < 5) {
        if (isSmartReplyModeActive) {
            return;
        }
        aiDeck.innerHTML = '';
        return;
    }
    if (isSmartReplyModeActive) {
        return; // Keep smart replies visible until dialogs change or page unloads
    }
    typingDebounceTimer = setTimeout(async () => {
        try {
            const response = await fetch('http://localhost:3000/chatbord/ai/predictive-typing', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${activeSessionToken}`
                },
                body: JSON.stringify({ text: value, tone: "casual with emojis" })
            });
            const data = await response.json();
            if (data.success) {
                const suggestions = Array.isArray(data.suggestions) && data.suggestions.length > 0
                    ? data.suggestions
                    : ['Sounds good!', 'Let’s talk soon'];
                renderAIChips(suggestions, false);
            }
        } catch (err) {
            console.error("Predictive parsing error", err);
        }
    }, doneTypingInterval);
});

function handleIncomingSmartReplyTrigger(incomingMessageText) {
    // Skip trying to generate smart replies for S3 file URL strings
    if (incomingMessageText.includes('amazonaws.com/uploads/')) return;

    fetch('http://localhost:3000/chatbord/ai/smart-replies', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${activeSessionToken}`
        },
        body: JSON.stringify({ incomingText: incomingMessageText, tone: "casual with emojis" })
    })
    .then(res => res.json())
    .then(data => {
        if (data.success) {
            const replies = Array.isArray(data.replies) && data.replies.length > 0
                ? data.replies
                : ['Sounds good! 😊', 'Let’s chat soon'];
            renderAIChips(replies, true);
        }
    })
    .catch(err => console.error("Smart quick replies fetch failed:", err));
}

document.addEventListener("DOMContentLoaded", () => {
  if ("Notification" in window) {
    if (Notification.permission === "default") {
      Notification.requestPermission().catch(() => {});
    }
  }
});

function notifyIncomingMessage(messageData) {
  const senderName = messageData.senderName || 'New message';
  const messageText = messageData.text || messageData.message || 'You received a new message';

//   showLiveToast(messageText, senderName);
  renderInAppNotification({ title: senderName, message: messageText });

  if (document.hidden) {
    showBrowserNotification(senderName, messageText);
  }

  try {
    const audioContext = window.audioContext || new (window.AudioContext || window.webkitAudioContext)();
    window.audioContext = audioContext;
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    oscillator.type = 'sine';
    oscillator.frequency.value = 880;
    gainNode.gain.value = 0.08;
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    oscillator.start();
    gainNode.gain.exponentialRampToValueAtTime(0.0001, audioContext.currentTime + 0.25);
    oscillator.stop(audioContext.currentTime + 0.25);
  } catch (err) {
    console.warn('Notification sound failed:', err);
  }

  const originalTitle = document.title.replace(/^●\s*/, '');
  document.title = `● ${originalTitle}`;
  clearTimeout(window._chatTitleResetTimer);
  window._chatTitleResetTimer = setTimeout(() => {
    document.title = originalTitle;
  }, 4000);
}

function showLiveToast(message, title = 'New message') {
  const toast = document.createElement('div');
  toast.className = 'notification-toast';
  toast.innerText = `${title}: ${message}`;
  toast.style.cssText = `
    position: fixed; top: 16px; right: 16px; z-index: 99999;
    background: #ff007f; color: #fff; padding: 10px 14px;
    border-radius: 8px; box-shadow: 0 8px 24px rgba(0,0,0,0.2);
    max-width: 320px; line-height: 1.4;
  `;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 4000);
}

function showBrowserNotification(title, body) {
  if ("Notification" in window && Notification.permission === "granted") {
    // Only trigger browser pop-up if the user is currently on another tab

    if (document.hidden) {
      const notification = new Notification(title, {
        body: body,
        icon: "/images/chat-icon.png" // optional icon path
      });

      notification.onclick = () => {
        window.focus();
        notification.close();
      };
    }
  }
}

function appendMessageToChatUI(data) {
  const chatContainer = document.getElementById("chat-messages"); // Ensure this matches your HTML element ID
  if (!chatContainer) return;

  const messageElement = document.createElement("div");
  
  // Add CSS class based on whether current user sent it or received it
  const isSelf = data.senderId === currentUserId; // Ensure currentUserId variable is set in your scope
  messageElement.className = isSelf ? "message sent" : "message received";

  messageElement.innerHTML = `
    <div class="message-sender">${data.senderName || "User"}</div>
    <div class="message-text">${data.message}</div>
    <div class="message-time">${new Date(data.timestamp || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
  `;

  chatContainer.appendChild(messageElement);

  // Auto-scroll to the bottom of the chat container
  chatContainer.scrollTop = chatContainer.scrollHeight;
}

function renderInAppNotification(data) {
  console.log("Notification received:", data);

  const badge = document.getElementById("unread-count");
  if (badge) {
    let currentCount = parseInt(badge.innerText || "0", 10);
    badge.innerText = currentCount + 1;
    badge.style.display = "block";
  }

  const toast = document.createElement("div");
  toast.className = "notification-toast";
  toast.innerText = `${data.title || 'New message'}: ${data.message || 'You received a message'}`;
  toast.style.cssText = `
    position: fixed; top: 20px; right: 20px; 
    background: #ff007f; color: #fff; padding: 12px 20px; 
    border-radius: 8px; z-index: 9999; box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    max-width: 320px; display: block; font-family: Arial, sans-serif;
  `;
  const host = document.body || document.documentElement;
  host.appendChild(toast);

  setTimeout(() => toast.remove(), 4000);

}

// Keep the smart-reply UI tied to the existing renderer so chips appear in the chat panel.
function showSmartReplyChips(replies) {
  const container = document.getElementById('aiAssistSuggestionsDeck');
  if (!container) return;

  if (!replies || replies.length === 0) {
    container.innerHTML = '';
    return;
  }

  renderAIChips(replies, true);
}

// public/userChat.js

async function fetchAndRenderSmartReplies(senderMessageText) {
  if (!senderMessageText || !senderMessageText.trim()) return;

  try {
    const response = await fetch('/api/smart-replies', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messageText: senderMessageText
      })
    });

    const data = await response.json();
    if (data.replies && data.replies.length > 0) {
      displaySmartReplyChips(data.replies);
    }
  } catch (err) {
    console.warn('Failed to fetch AI smart replies:', err);
  }
}