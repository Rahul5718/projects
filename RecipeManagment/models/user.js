const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")

const userSchema = new mongoose.Schema({
     name:{
          type:String,
          required:true,
          trim:true
     },
     email: { 
          type: String, 
          required: true, 
          unique: true, 
          lowercase: true, 
          trim: true 
     },
     phone: { 
          type: String, 
          trim: true 
     },
     password: { 
          type: String, 
          required: true, 
          minlength: 6 
     },
     role: { 
          type: String, 
          enum: ["user", "admin"], 
          default: "user" },
     bio: { 
          type: String, 
          default: "" 
     },
     location: { 
          type: String, 
          default: "" 
     },
     isBanned: { 
          type: Boolean, 
          default: false 
     },
     favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: "Recipe" }]
})

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
     next();
})

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
}

module.exports = mongoose.models.User || mongoose.model("User", userSchema) 