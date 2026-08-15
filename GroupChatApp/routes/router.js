const express = require('express')

const router=express.Router()

const controller = require('../controller/ScriptController')
const AdminController = require('../controller/adminController')
const chatController = require('../controller/chatController')
const userAuthentication = require('../middleware/auth')

const multer = require('multer')
const mediaController = require('../controller/mediaController')


//password reset 

router.post('/password/forgotpassword',resetpassword.sendResetEmail)
router.get('/password/verifyreset/:id',passwordController.verifyResetLink)
router.post('/password/updatepassword',resetpassword.updatePasswordInDB)
router.get('/password/resetpassword/:id', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'view', 'resetpassword.html'));
})
router.get('/forgotpassword', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'view', 'forgotpassword.html'));
})


router.post('/chatbord/register',controller.singup)
router.post('/chatbord/login',controller.unifiedLogin)
router.post('/chatbord/logout',controller.logout)
router.get('/chatbord/user',controller.getProfile)


//admin
router.post('/admin/register',AdminController.createAdminSeed)
router.get('/admin/users-activity',AdminController.getAllUsersForAdmin)

//chats

router.post('/chatbord/send',userAuthentication.authenticate, chatController.sendMessage)
router.get('/chatbord/history',userAuthentication.authenticate, chatController.getChatHistory)
router.delete('/admin/delete_user/:id',userAuthentication.authenticate,AdminController.deleteUserRecord)
router.get('/chatbord/searchUser',userAuthentication.authenticate,chatController.searchUser)

const uploadMemoryStorage = multer({
     storage:multer.memoryStorage(),
     limits:{fileSize:10 *1024*1024} //10mb limit
})

router.post('/chatbord/media-upload',userAuthentication.authenticate,uploadMemoryStorage.single('mediaFile'),mediaController.uploadMediaMessage)

const aiService = require("../controller/aiService");

// POST /chatbord/ai/predictive-typing
router.post("/chatbord/ai/predictive-typing", async (req, res) => {
    try {
        const { text, tone } = req.body;
        // Optional fallback optimization: fallback to user preferences profile if tone is empty
        const suggestions = await aiService.getPredictiveTyping(text, tone || "casual");
        return res.status(200).json({ success: true, suggestions });
    } catch (error) {
        return res.status(500).json({ success: false, suggestions: [] });
    }
});

// POST /chatbord/ai/smart-replies
router.post("/chatbord/ai/smart-replies", async (req, res) => {
    try {
        const { incomingText, tone } = req.body;
        const replies = await aiService.getSmartReplies(incomingText, tone || "casual with emojis");
        return res.status(200).json({ success: true, replies });
    } catch (error) {
        return res.status(500).json({ success: false, replies: [] });
    }
});

// routes/router.js
router.post("/chatbord/ai/smart-replies", aiController.handleSmartReplies);

module.exports=router