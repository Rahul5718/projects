// socket/handlers/personalChat.js
module.exports = (io, socket) => {
  socket.on("send_personal_message", (data) => {
    const { recipientId, message } = data;
    const senderId = socket.user?.id || data.senderId;
    const senderName = socket.user?.name || data.senderName || "User";

    const payload = {
      recipientId,
      senderId,
      senderName,
      message,
      timestamp: new Date()
    };

    // 1. Send actual chat message to recipient's socket room
    io.to(recipientId).emit("receive_personal_message", payload);

    // 2. Emit notification to recipient
    io.to(recipientId).emit("new_notification", {
      type: "personal",
      senderId,
      senderName,
      title: `New message from ${senderName}`,
      message: message,
      timestamp: new Date()
    });
  });
};