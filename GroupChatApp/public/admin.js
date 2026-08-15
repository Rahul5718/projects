// public/admin.js

// const { authenticate } = require("../middleware/auth");

// const { io } =require('socket.io')

let adminSocket = null
const ADMIN_ID = 1
let activeChatPartnerId = null
let isSubmitting = false
let currentAdminId= null;
let currentActivePrivateRoomId = null



document.addEventListener("DOMContentLoaded", () => {
    // 1. ROUTE PROTECTION: Ensure only an authorized admin can view this page
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');

    if (!token || role !== 'admin') {
        alert("Access Denied! Admins only.");
        window.location.href = '/login'; 
        return;
    }

    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const decoded = JSON.parse(atob(base64));
        currentAdminId = decoded.userId || decoded.id;
    } catch (e) {
        console.error("JWT parsing error:", e);
        currentAdminId = 1; // Fallback default
    }

    //fetch user data
    fetchUserActivities();

    //for synchronization link
    initializeAdminSocket();

    // Bind the logout handler onto click event tracking triggers
    document.getElementById('logoutBtn').addEventListener('click', handleLogout);

    const chatForm = document.getElementById('adminChatForm');
    if (chatForm) {
        chatForm.onsubmit = handleAdminFormSubmit;
    }
});

function initializeAdminSocket(){

    const adminToken = localStorage.getItem('token');

    if(!window.globalAdminSocket){
        window.globalAdminSocket = io('http://localhost:3000',{

            auth:{
                token:adminToken
            }
        })
    }

    adminSocket = window.globalAdminSocket;
    
    adminSocket.off('new_message')

    adminSocket.on('new_message', (incomingMessage) => {
        if (!incomingMessage) return

        if (incomingMessage.id && document.getElementById(`msg_trace_${incomingMessage.id}`)) {
            console.log(`Blocked duplicate event draw for message ID: ${incomingMessage.id}`)
            return
        }

        const msgSender = Number(incomingMessage.senderId)
        // const msgReceiver = Number(incomingMessage.receiverId)

        // const isCurrentActiveChat = (msgSender === activeChatPartnerId || msgReceiver === activeChatPartnerId)

        if (incomingMessage.roomId === currentActivePrivateRoomId) {
            appendSingleBubbleToAdminFeed(incomingMessage);
        } else {
            console.log(`Live notification: New unread message from User ID ${msgSender}`) 
            highlightUnreadUserRow(msgSender)
        }
    })
}


// 2. FETCH AND CONSTRUCT USER DATA ROWS
async function fetchUserActivities() {
    const tableBody = document.getElementById('userTableBody');

    try {
        const response = await fetch('/admin/users-activity', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });

        const data = await response.json();

        if (data.success) {
            tableBody.innerHTML = ''; // Clear loading indicator
            const userList = data.users || data.data || []

            if (userList.length === 0) {
                tableBody.innerHTML = `<tr><td colspan="6" style="text-align:center;" class="no-data">No users registered yet.</td></tr>`;
                return;
            }

            userList.forEach(user => {
            const userId = user.id;
            const loginStr = user.lastLogin ? new Date(user.lastLogin).toLocaleString() : 'Never logged in';
            const logoutStr = user.lastLogout ? new Date(user.lastLogout).toLocaleString() : 'Active';

            // Added a dedicated "Delete Account" column with a dangerous styling hook
            const row = `
                <tr id="user_row_${userId}">
                    <td>${userId}</td>
                    <td><strong>${user.name}</strong></td>
                    <td>${user.email}</td>
                    <td>${user.phone || 'N/A'}</td>
                    <td class="timestamp login-time">${loginStr}</td>
                    <td class="timestamp logout-time">${logoutStr}</td>
                    <td>
                        <button onclick="deleteUserAccount(${userId})" style="background-color:#ff3b30; color:white; border:none; padding:5px 10px; cursor:pointer; border-radius:4px;">
                            Delete Account
                        </button>
                    </td>
                </tr>
                `;
                tableBody.innerHTML += row;
            });
        } else {
                showError(data.message || "Failed to load system data.");
            }
    } catch (error) {
        console.error("Error fetching logs:", error);
        showError("Could not establish connection with the server.");
    }
}

// 3. SHOW ERROR MESSAGES ABOVE THE TABLE
function showError(msg) {
    const errorAlert = document.getElementById('errorAlert');
    errorAlert.textContent = msg;
    errorAlert.style.display = 'block';
}

// 4. SECURE LOGOUT SYSTEM
async function handleLogout() {
    try {
        // Notifies your backend server to log out tracking timings
        await fetch('/chatbord/logout', {
            method: 'POST',
            headers: { 
                'Authorization': `Bearer ${localStorage.getItem('token')}` 
            }
        });
    } catch (err) {
        console.error("Failed to safely alert logout on backend server", err);
    }
    
    // Clear identity state tokens and shift back to unified login interface
    localStorage.clear();
    window.location.href = '/login';
}

async function openAdminChatDrawer(userId, userName) {
    activeChatPartnerId = Number(userId);
    
    // UI Update: Reveal chat interface wrapper container and change target headers
    const chatContainer = document.getElementById('adminChatContainer');
    const chatTitle = document.getElementById('adminChatTitle');

    const sortedIds = [Number(currentAdminId), Number(activeChatPartnerId)].sort((a, b) => a - b);
    const uniqueRoomId = `private-${sortedIds[0]}-${sortedIds[1]}`;

    if (chatContainer) chatContainer.style.display = 'block';
    if (chatTitle) chatTitle.innerText = `Chatting with: ${userName} (ID: ${userId})`;

    if (currentActivePrivateRoomId && currentActivePrivateRoomId !== uniqueRoomId) {
        adminSocket.emit('leave_room', currentActivePrivateRoomId);
        console.log(`Left old room path: ${currentActivePrivateRoomId}`);
    }

    currentActivePrivateRoomId = uniqueRoomId;

    // const chatContainer = document.getElementById('adminChatContainer');
    // const chatTitle = document.getElementById('adminChatTitle');
    // if (chatContainer) chatContainer.style.display = 'block';
    // if (chatTitle) chatTitle.innerText = `Chatting with: ${userName} (ID: ${userId})`;

   if (adminSocket) {
        adminSocket.emit('join_room', currentActivePrivateRoomId);
        console.log(`Admin shifted channels into unique private room target: ${currentActivePrivateRoomId}`);
    }
    const userRow = document.getElementById(`user_row_${userId}`);
    if (userRow) userRow.style.backgroundColor = '';

    // Fetch message history for this specific user
    try {
        const response = await fetch(`http://localhost:3000/chatbord/history?with=${userId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });

        if (!response.ok) throw new Error("History collection fault response state caught.");
        
        const payload = await response.json();
        const messages = payload.messages || [];
        
        renderAdminChatFeed(messages);
    } catch (err) {
        console.error("Failed to extract specific conversation lines:", err);
    }
}

function renderAdminChatFeed(messages) {
    const feedBody = document.getElementById('adminChatStreamBody');
    if (!feedBody) return;

    feedBody.innerHTML = ''; // Wipe old layouts safely

    messages.forEach(msg => {
        appendSingleBubbleToAdminFeed(msg);
    });
}

function appendSingleBubbleToAdminFeed(message) {
    const feedBody = document.getElementById('adminChatStreamBody');
    if (!feedBody || !message) return;

    if (message.id && document.getElementById(`msg_trace_${message.id}`)) return;

    const isMe = Number(message.senderId) === Number(currentAdminId);
    const bubble = document.createElement('div');
    
    if (message.id) {
        bubble.id = `msg_trace_${message.id}`;
    }

    bubble.style.padding = '8px';
    bubble.style.margin = '6px 0';
    bubble.style.borderRadius = '4px';
    bubble.style.maxWidth = '70%';

    if (isMe) {
        bubble.className = 'neon-bubble-msg sent admin';
        bubble.style.background = 'rgba(121, 40, 202, 0.2)';
        bubble.style.marginLeft = 'auto';
        bubble.innerHTML = `
            <span class="sender-tag" style="display:block;font-size:11px;color:#7928ca;">You (Support)</span>
            ${escapeHTML(message.text || message.message || '')}
            <span class="time-stamp" style="display:block;font-size:9px;opacity:0.5;text-align:right;">${formatTimestamp(message.createdAt)}</span>
        `;
    } else {
        bubble.className = 'neon-bubble-msg received user';
        bubble.style.background = 'rgba(255, 255, 255, 0.05)';
        bubble.innerHTML = `
            <span class="sender-tag" style="display:block;font-size:11px;color:#ff007f;">User</span>
            ${escapeHTML(message.text || message.message || '')}
            <span class="time-stamp" style="display:block;font-size:9px;opacity:0.5;text-align:right;">${formatTimestamp(message.createdAt)}</span>
        `;
    }

    feedBody.appendChild(bubble);
    feedBody.scrollTop = feedBody.scrollHeight;
}

// --- COMMITTING ADMIN TEXT GENERATIONS TO CONTROLLERS ---
async function handleAdminFormSubmit(event) {
    event.preventDefault();
    if (isSubmitting || !activeChatPartnerId) return;

    const inputField = document.getElementById('adminMessageInputField');
    const textContent = inputField.value.trim();
    if (!textContent) return;

    try {
        isSubmitting = true;

        adminSocket.emit('send_private_message', {
            roomId: currentActivePrivateRoomId,
            text: textContent,
            senderId: currentAdminId
        });

        const response = await fetch('http://localhost:3000/chatbord/send', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({
                text: textContent,
                receiverId: activeChatPartnerId,
                senderRole: 'admin'
            })
        });

        if (response.ok) {
            inputField.value = ''; // Clean up layout input frame instantly
        } else {
            console.error("Failed message post tracking context response status:", response.status);
        }
    } catch (networkError) {
        console.error("Network pipe crash on Admin submission run:", networkError);
    } finally {
        isSubmitting = false;
    }
}

// --- HELPERS ---
function highlightUnreadUserRow(userId) {
    const row = document.getElementById(`user_row_${userId}`);
    if (row && Number(activeChatPartnerId) !== Number(userId)) {
        row.style.backgroundColor = '#341242'; // Dark neon purple alert shade
    }
}

function formatTimestamp(rawStr) {
    return new Date(rawStr).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function escapeHTML(str) {
    return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}

function showError(msg) {
    const errorAlert = document.getElementById('errorAlert');
    if (errorAlert) {
        errorAlert.textContent = msg;
        errorAlert.style.display = 'block';
    }
}

async function handleLogout() {
    try {
        await fetch('/chatbord/logout', {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });
    } catch (err) {
        console.error("Failed to safely alert logout on backend server", err);
    }
    localStorage.clear();
    window.location.href = '/login';
}

async function deleteUserAccount(userId) {
    if (!confirm(`CRITICAL WARNING: Are you sure you want to permanently delete User Account ID: ${userId}? This cannot be undone.`)) {
        return;
    }

    try {
        const response = await fetch(`http://localhost:3000/admin/delete-user/${userId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });

        const data = await response.json();

        if (response.ok && data.success) {
            alert("User account successfully dropped from system tracking registers.");
            
            // Remove the row instantly from the HTML UI view memory frame
            const targetRow = document.getElementById(`user_row_${userId}`);
            if (targetRow) targetRow.remove();
        } else {
            alert(data.message || "Failed to complete administration deletion procedure.");
        }
    } catch (err) {
        console.error("Network communication failure executing deletion run:", err);
        alert("Server failed to respond to the deletion command execution request.");
    }
}