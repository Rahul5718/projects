// controller/aiController.js (or in your routes/router.js)
const aiService = require('./aiService');

exports.handleSmartReplies = async (req, res) => {
  try {
    const { messageText, tone } = req.body;
    
    // Call Gemini directly with the incoming sender message
    const replies = await aiService.getSmartReplies(messageText, tone);
    
    return res.json({ replies });
  } catch (error) {
    console.error('Smart reply route error:', error);
    return res.status(500).json({ replies: [] });
  }
};