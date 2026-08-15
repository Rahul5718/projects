const jwt = require('jsonwebtoken');
const User = require('../model/user');

const JWT_SECRET = '98745632'; // must match ScriptController + chatController

function getBearerToken(req) {
  const authHeader = req.headers['authorization'];
  if (!authHeader) return null;
  const parts = authHeader.split(' ');
  if (parts.length !== 2) return null;
  if (parts[0] !== 'Bearer') return null;
  return parts[1];
}

const authenticate = async (req, res, next) => {
  try {
    
    const authHeader = req.headers['authorization']
    const token = getBearerToken(req);

    if (!token) {
      return res.status(401).json({ success: false, message: 'Token Missing' });
    }

    const decoded = jwt.verify(token, JWT_SECRET)
    
    const user = await User.findByPk(decoded.userId || decoded.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    // attach user for downstream controllers
    
    req.user = user 
    next();

  } catch (err) {
    console.error('Authentication faulty:', err);

    if (err.name === 'TokenExpiredError') {
      return res.status(403).json({ success: false, message: 'jwt expired' });
    }
    
    return res.status(401).json({ success: false, message: 'Invalid Session Authorization Token' });
  }
};

module.exports = { authenticate };
