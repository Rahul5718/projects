// socket/handlers/chat.js
module.exports = (io, socket) => {
  const currentUserId = socket.user?.id;
  const currentUserName = socket.user?.name || "User";

  if (currentUserId) {
    socket.join(String(currentUserId));
  }

  // Allow clients to join specific group rooms dynamically
  socket.on("join_room", (roomName) => {
    if (roomName) {
      socket.join(roomName);
      console.log(`User ${currentUserId} joined room: ${roomName}`);
    }
  });

  socket.on("leave_room", (roomName) => {
    if (roomName) {
      socket.leave(roomName);
      console.log(`User ${currentUserId} left room: ${roomName}`);
    }
  });

  // Group message handler
  socket.on("send_group_message", (data) => {
    const { groupId, groupName, message } = data;
    const targetRoom = groupId || "group_chat"; // Fallback to global group if no ID

    const payload = {
      groupId: targetRoom,
      groupName: groupName || "Group Chat",
      senderId: currentUserId,
      senderName: currentUserName,
      message,
      timestamp: new Date()
    };

    // 1. Send chat message to EVERYONE in room (including sender)
    io.to(targetRoom).emit("receive_group_message", payload);

    // 2. Send notification to EVERYONE in room EXCEPT sender
    socket.to(targetRoom).emit("new_notification", {
      type: "group",
      groupId: targetRoom,
      senderId: currentUserId,
      senderName: currentUserName,
      title: `${currentUserName} in ${groupName || "Group Chat"}`,
      message: message,
      timestamp: new Date()
    });
  });

  // Typing indicators
  socket.on("typing_start", (data) => {
    socket.broadcast.to(data.roomId).emit("user_typing", {
      senderId: currentUserId,
      senderName: currentUserName
    });
  });

  socket.on("typing_stop", (data) => {
    socket.broadcast.to(data.roomId).emit("user_stopped_typing", {
      senderId: currentUserId
    });
  });
};