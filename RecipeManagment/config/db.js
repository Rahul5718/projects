const mongoose = require("mongoose")

const connectDB = async ()=>{
     try{
          const con = await mongoose.connect(process.env.MONGO_URI)
          console.log('Mongode connected :',con.connection.host);
          
     }catch(error){
              console.error('MongoDB connection failed:', error.message);
              throw error;
     }
}

module.exports = connectDB