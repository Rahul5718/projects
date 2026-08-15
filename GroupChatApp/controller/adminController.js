
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Op } = require('sequelize'); 
const User = require('../model/user'); 
const Admin = require('../model/admin');

const JWT_SECRET = '98745632'; // must match ScriptController JWT_SECRET

exports.createAdminSeed = async (req, res) => {
    try {
        const { name, email, phone, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);

        await Admin.create({
            name,
            email: email.toLowerCase(),
            phone,
            password: hashedPassword
        });

        return res.status(201).json({ success: true, message: "Admin initialized successfully via Postman!" });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Failed to create Admin seed" });
    }
};

//ADMIN LOGIN ONLY
exports.adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        const admin = await Admin.findOne({ where: { email: email.toLowerCase() } });

        if (!admin) {
            return res.status(400).json({ success: false, message: "Invalid Admin Credentials" });
        }

        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) {
            return res.status(400).json({ success: false, message: "Invalid Admin Credentials" });
        }

        // Issue token clearly identifying them as admin
        const token = jwt.sign(
            { adminId: admin.id, role: 'admin' },
            JWT_SECRET,
            { expiresIn: '12h' }
        );

        return res.status(200).json({ success: true, message: "Welcome Admin", token });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Admin login error" });
    }
};

//  ADMIN PORTAL: Get all users with login/logout activities
exports.getAllUsersForAdmin = async (req, res) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        if (!token) return res.status(401).json({ success: false, message: "Unauthorized access" });

        const decoded = jwt.verify(token, JWT_SECRET);
        
        // Safety lock: check if token actually belongs to an admin role
        if (decoded.role !== 'admin') {
            return res.status(403).json({ success: false, message: "Access forbidden. Admins only." });
        }

        // Fetch user data containing specific tracking information
        const users = await User.findAll({
            attributes: ['id', 'name', 'email', 'phone', 'lastLogin', 'lastLogout']
        });

        return res.status(200).json({ success: true, users });
    } catch (error) {
        return res.status(401).json({ success: false, message: "Invalid session token" });
    }
};

exports.deleteUserRecord = async (req, res) => {
    try {
        // Guard check: Ensure the actor calling this is actually an verified admin
        if (req.user.role !== 'admin') {
            return res.status(403).json({ success: false, message: "Forbidden: Administrative access required." });
        }

        const targetUserId = req.params.id;

        const userExists = await User.findByPk(targetUserId);
        if (!userExists) {
            return res.status(404).json({ success: false, message: "Target account records do not exist." });
        }

        // 1. Delete all chat history messages sent by this specific user first (Prevent database foreign-key breaking errors)
        await Message.destroy({ where: { senderId: targetUserId } });

        // 2. Permanently delete the user profile row data mapping context
        await User.destroy({ where: { id: targetUserId } });

        console.log(`[ADMIN FORCE ACTION] Admin wiped User ID ${targetUserId} records from system tables.`);
        return res.status(200).json({ success: true, message: "User records successfully vaporized." });

    } catch (err) {
        console.error("Administrative account tracking deletion failure state:", err);
        return res.status(500).json({ success: false, message: "Internal application failure executing request deletion run." });
    }
};