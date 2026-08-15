
const jwt = require('jsonwebtoken');
const User = require('../Model/UserdataSetCreation');

// Ensure you have a JWT_SECRET defined in your .env file!
const JWT_SECRET = process.env.JWT_SECRET || '987456321';

exports.authenticateToken = async (req, res, next) => {
    try {
        // Extract token from header: "Bearer <token>"
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        if (!token) {
            return res.status(401).json({ error: 'Access Denied: No Token Provided' });
        }

        // Verify token
        const verifiedUser = jwt.verify(token, JWT_SECRET);

        // Load full user data so premium initiation can pass required Cashfree customer details.
        const dbUser = await User.findByPk(verifiedUser.userId);
        if (!dbUser) {
            return res.status(404).json({ error: 'User not found for this token' });
        }

        // Prefer DB value to avoid stale JWT payload after premium purchase.
        req.user = {
            id: verifiedUser.userId,
            isPremiumUser: !!dbUser.isPremiumUser,
            name: dbUser.name,
            email: dbUser.email,
            phn: dbUser.phn
        };

        next(); // Pass control to your controller function
    } catch (error) {
        console.error('JWT Verification Error:', error);
        return res.status(403).json({ error: 'Invalid or Expired Token' });
    }
};

