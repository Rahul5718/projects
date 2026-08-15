const express = require('express')
const { authenticateToken } = require('../middleware/aouth')
const premiumController = require('../Controller/premium')
const leaderboardController = require('../Controller/leaderboard')
const controller = require('../Controller/controller')
const resetpassword = require('../Controller/forgotPasswordRequest')
const passwordController = require('../Controller/passwordController')
const path = require('path')

const router = express.Router()

router.post('/user/register', controller.register)
router.post('/user/login', controller.login)

router.post('/password/forgotpassword',resetpassword.sendResetEmail)
router.get('/password/verifyreset/:id',passwordController.verifyResetLink)
router.post('/password/updatepassword',resetpassword.updatePasswordInDB)
router.get('/password/resetpassword/:id',(req, res) => {
    const { id } = req.params
    res.sendFile(path.join(__dirname,'../login','resetpassword.html'));
})

router.get('/users', authenticateToken, controller.getAllUsers)
router.get('/user/me', authenticateToken, controller.getCurrentUser)

router.get('/expenses/getexpenses', authenticateToken, controller.getAllExpenses)
router.post('/expenses/addexpense', authenticateToken, controller.addExpense)
router.get('/expenses/download', authenticateToken, controller.downloadExpenses)
router.get('/expenses/download-history', authenticateToken, controller.downloadExpenseHistory)
router.get('/expenses/summary', authenticateToken, controller.getExpenseSummary)
router.delete('/expenses/delete/:id', authenticateToken, controller.delete)
router.get('/user/expense-summary', authenticateToken,controller.getUserExpenseSummary)


router.get('/premium/membership', authenticateToken, premiumController.buyPremium)
router.get('/premium/status', premiumController.updateTransactionStatus)
router.get('/premium/leaderboard', authenticateToken, leaderboardController.getUserLeaderboard)

router.post('/api/expenses/categorize', controller.autoCategorize)

module.exports = router