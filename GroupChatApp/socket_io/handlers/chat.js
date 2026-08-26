// socket/handlers/chat.js
module.exports = (io, socket) => {
  const currentUserId = socket.user?.id;
  const currentUserName = socket.user?.name || "User";

  // Dynamic join room handler
  socket.on("join_room", (roomName) => {
    if (roomName !== undefined && roomName !== null && roomName !== "") {
      const room = String(roomName);
      socket.join(room);
      console.log(`User ${currentUserId} joined room: ${room}`);
    }
  });

  socket.on("leave_room", (roomName) => {
    if (roomName !== undefined && roomName !== null && roomName !== "") {
      const room = String(roomName);
      socket.leave(room);
      console.log(`User ${currentUserId} left room: ${room}`);
    }
  });

  // Group / Global message handler
  socket.on("send_group_message", (data) => {
    const { groupId, groupName, message } = data;

    // Standardize: if groupId is 0, empty, or 'global' -> use 'global'
    const targetRoom = (groupId && String(groupId) !== "0" && String(groupId) !== "global") 
      ? String(groupId) 
      : "global";

    const payload = {
      id: Date.now(),
      groupId: targetRoom,
      groupName: groupName || (targetRoom === "global" ? "Global Chat" : "Group Chat"),
      senderId: currentUserId,
      senderName: currentUserName,
      text: message,
      type: targetRoom === "global" ? "group" : "group",
      createdAt: new Date()
    };

    // 1. Send chat message to EVERYONE in the target room
    io.to(targetRoom).emit("new_message", payload);

    // 2. Send notification to everyone in room EXCEPT sender
    socket.to(targetRoom).emit("new_notification", {
      type: "group",
      groupId: targetRoom,
      senderId: currentUserId,
      senderName: currentUserName,
      title: `${currentUserName} in ${payload.groupName}`,
      message: message,
      timestamp: new Date()
    });
  });

  // Typing indicators
  socket.on("typing_start", (data) => {
    if (data?.roomId) {
      socket.to(String(data.roomId)).emit("user_typing", {
        senderId: currentUserId,
        senderName: currentUserName
      });
    }
  });

  socket.on("typing_stop", (data) => {
    if (data?.roomId) {
      socket.to(String(data.roomId)).emit("user_stopped_typing", {
        senderId: currentUserId
      });
    }
  });
};