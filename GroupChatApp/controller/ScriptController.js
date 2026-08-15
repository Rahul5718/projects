const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Op } = require('sequelize');

const User = require('../model/user');
const Admin = require('../model/admin');
// const { use } = require('react');

const JWT_SECRET = '98745632'; // Keep this safe

// signup (user)
exports.singup = async (req,res)=>{
     try{
          const {name, email, phone, password} = req.body;

          // support both possible keys from frontend (phone) and older HTML (phn)
          const resolvedPhone =  phone;

          if (!name || !email || !resolvedPhone || !password) {
               return res.status(400).json({ success: false, message: "All fields are required" });
          }

          const normalizedEmail = String(email).toLowerCase();
          const normalizedPhone = String(resolvedPhone);

          const hashedPassword = await bcrypt.hash(password, 10)
          await User.create({
               name,
               email: normalizedEmail,
               phone: normalizedPhone,
               password: hashedPassword
          })
          return res.status(201).json({
            success:true,
            message:"user registered successfully!"})
        }catch (error) {
          if (error.name === 'SequelizeUniqueConstraintError') {
               return res.status(409).send('Email already exists. Try another.');
          }
          console.error('Error occurred while submitting form:', error);
          res.status(500).send('Internal Server Error');
     }
}


// 3. USER LOGOUT (Tracks Logout Timestamp in Database)
exports.logout = async (req, res) => {
    try {
        // Extract token from the Authorization header (Format: "Bearer <token>")
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        if (!token) {
            return res.status(401).json({ success: false, message: "Access token missing" });
        }

        // Verify and decode the JWT token
        jwt.verify(token, JWT_SECRET, async (err, decoded) => {
            if (err) {
                return res.status(403).json({ success: false, message: "Invalid or expired token" });
            }

            // Find the user by the ID stored in the token payload
            const user = await User.findByPk(decoded.userId);
            
            if (!user) {
                return res.status(404).json({ success: false, message: "User not found" });
            }

            // Capture the exact moment of logout and save to MySQL
            user.lastLogout = new Date();
            await user.save();

            return res.status(200).json({ 
                success: true, 
                message: "Logged out successfully. Timing recorded." 
            });
        });

    } catch (error) {
        console.error("Logout Error:", error);
        return res.status(500).json({ success: false, message: "Server error during logout" });
    }
};

exports.unifiedLogin = async (req, res) => {
    try {
        const { email, password } = req.body; // 'credential' accepts email OR phone

        if (!email || !password) {
            console.log('data not passing');
            
            return res.status(400).json({ success: false, message: "Please provide credentials and password" });
        }

        const normalizedCredential = email.toLowerCase();

        //  CHECK IF IT'S AN ADMIN
        let account = await Admin.findOne({
            where: {
                [Op.or]: [{ email: normalizedCredential }]
            }
        });
        let role = 'admin';

        // IF NOT AN ADMIN, CHECK IF IT'S A USER
        if (!account) {
            account = await User.findOne({
                where: {
                    [Op.or]: [{ email: normalizedCredential }]
                }
            });
            role = 'user';
        }

        // NEITHER EXIST
        if (!account) {
            return res.status(400).json({ success: false, message: "Invalid email/phone or password" });
        }

        // 4. VERIFY PASSWORD
        const isMatch = await bcrypt.compare(password, account.password);
        if (!isMatch) {
            return res.status(400).json({ success: false, message: "Invalid email/phone or password" });
        }

        // IF USER, UPDATE LOGIN TIMING
        if (role === 'user') {
            account.lastLogin = new Date();
            await account.save();
        }

        // GENERATE TOKEN (Include the role so the frontend knows where to redirect)
        const token = jwt.sign(
            { 
                id:account.id,
                userId: account.id, 
                email: account.email, 
                name:account.name || 'User',
                role: role 
            },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        return res.status(200).json({
            success: true,
            message: `Login successful as ${role}`,
            token,
            role, // Sending role back to the frontend
            user: { id: account.id, name: account.name, email: account.email }
            
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Server error during login" });
    }
};

//getUserData

exports.getProfile = async (req, res) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        if (!token) {
            return res.status(401).json({ success: false, message: "Access token missing" });
        }

        const decoded = jwt.verify(token, JWT_SECRET);
        const user = await User.findByPk(decoded.userId);

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        return res.status(200).json({
            success: true,
            user: { id: user.id, name: user.name, email: user.email, phone: user.phone }
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Server error retrieving profile" });
    }
};