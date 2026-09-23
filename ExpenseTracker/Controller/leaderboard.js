const User = require('../Model/UserdataSetCreation');
const Expense = require('../Model/expenseDataset');

exports.getUserLeaderboard = async (req, res) => {
    try {
        const users = await User.findAll();
        const leaderboardData = await Promise.all(users.map(async user => ({
            id: user.id,
            name: user.name,
            totalExpenses: await Expense.sum('amount', { where: { userId: user.id, type: 'expense' } })
        })));
        leaderboardData.sort((left, right) => right.totalExpenses - left.totalExpenses);

        res.status(200).json(leaderboardData);
    } catch (error) {
        console.error('Leaderboard Error:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};