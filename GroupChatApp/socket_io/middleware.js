const User = require("../model/user");
const jwt = require('jsonwebtoken')
const JWT_SECRET = '98745632'

module.exports = (io)=>{
     io.use(async(socket,next)=>{
     
       const token = socket.handshake.auth && socket.handshake.auth.token
     
       if(!token){
         console.log('token inot provided');
         return next(new Error('Authentication error'))
       }
     
       try{
         const decoded = jwt.verify(token,JWT_SECRET)

         if(!decoded){
          return next(new Error('invalid or expire tokens'))
         }

         const user = await User.findByPk(decoded.id)

         if(!user){
          return next(new Error('User not found'))
         }
     
         socket.user = user
     
         console.log(`Socket pre-auth success: User ID ${socket.user.id} (${socket.user.role})`);
         next()
       }
       catch(err){
         console.log("connection rejected");
         return next(new Error("Authentication error"))
       }
     })
}