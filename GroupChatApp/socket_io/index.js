const { Server } = require("socket.io")
const socketAuth = require('./middleware')
const chatHandler = require('./handlers/chat')
const personalChatHandler = require('./handlers/personalChat.js')


module.exports =(server)=>{

     const io = new Server(server,{
       cors : {
         origin: "http://localhost:3000",
         methods:["GET","POST"]
       }
     })

     socketAuth(io)

     io.on('connection',(socket)=>{
        const currentUserId = socket.user?.id;
        if (currentUserId) {
          socket.join(String(currentUserId));
        }
        socket.join('global')
        console.log(`Socket connected & auto-joined global. User: ${currentUserId || 'Guest'}`)
        chatHandler(io, socket)
        personalChatHandler(io, socket)
     })
     return io
}