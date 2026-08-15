const User = require('../Model/UserdataSetCreation');
const Expense = require('../Model/expenseDataset');
const Order = require('../Model/order');
const sequelize = require('../util/database');

exports.getUserLeaderboard = async (req, res) => {
    try {
        // Fetch all users alongside their summed aggregate expense values
        const leaderboardData = await User.findAll({
            attributes: [
                'id',
                'name',
                [sequelize.fn('sum', sequelize.col('expenses.amount')), 'totalExpenses']
            ],
            include: [{
                model: Expense,
                attributes: [] // Empty array as we only want aggregated data, not individual rows
            }],
            group: ['user.id'],
            order: [[sequelize.literal('totalExpenses'), 'DESC']]
        });

        res.status(200).json(leaderboardData);
    } catch (error) {
        console.error('Leaderboard Error:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};