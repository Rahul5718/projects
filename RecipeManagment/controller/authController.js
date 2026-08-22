const User = require("../models/user")
const jwt = require("jsonwebtoken")

const generateToken = (id,role)=>{
     return jwt.sign({id,role},process.env.JWT_SECRET,{
          expiresIn:process.env.JWT_EXPIRE || "7d"
     })
}

exports.registerUser = async (req,res) =>{
     try{
          const {name,email,phone,password}= req.body

          const userExists = await User.findOne({ email })
          if(userExists){
               return res.status(400).json({message:'Email is already registerd'})
          }

          const user = await User.create({
               name,email,phone,password,role:"user"
          })
          res.status(201).json({
               _id: user._id,
               name: user.name,
               email: user.email,
               role: user.role,
               token: generateToken(user._id, user.role)
          })
     }catch(error){
          res.status(500).json({message:error.message})
     }
}

exports.registerAdmin = async (req,res) => {
     try{
          const {name,email,phone,password}=req.body

          const existsAdmin = await User.findOne({email})
          if(existsAdmin){
               return res.status(400).json({message:'Admin email already exists'})
          }

          const admin = await User.create({
               name,email,password,role:"admin"
          })
          
          res.status(201).json({
               _id: admin._id,
               name: admin.name,
               email: admin.email,
               role: admin.role,
               token: generateToken(admin._id, admin.role)
          })
     }catch(error){
          return res.status(500).json({message:error.message})
     }
}

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    if (user.isBanned) {
      return res.status(403).json({ message: "Account is banned. Contact support." });
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      bio: user.bio,
      token: generateToken(user._id, user.role)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}