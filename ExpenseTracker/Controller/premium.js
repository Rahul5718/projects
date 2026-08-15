const crypto = require('crypto');
const Order = require('../Model/order');
const User = require('../Model/UserdataSetCreation');
const Expense = require('../Model/expenseDataset');
const PremiumLeader = require('../Model/premiumLeaders');
const cashfreeService = require('../services/cashfreeService');

exports.buyPremium = async (req, res) => {
    try {
        const generatedOrderId = 'order_' + crypto.randomBytes(8).toString('hex');
        const premiumAmount = 1.0;

        const userPhone = req.user?.phn || req.user?.phone || '9999999999';
        const userEmail = req.user?.email || 'testuser@gmail.com';
        const userName = req.user?.name || 'Customer App User';
        const userId = String(req.user?.id || 'anonymous_id');

        const cashfreeOrderData = await cashfreeService.createOrder(
            generatedOrderId,
            premiumAmount,
            'INR',
            userId,
            userName,
            userPhone,
            userEmail
        );

        // req.user here is the normalized JWT payload (not a Sequelize model instance)
        // so we cannot call req.user.createOrder().
        // Persist order status in DB instead.
        await Order.create({
            orderId: generatedOrderId,
            status: 'PENDING',
            userId: req.user.id
        });

        return res.status(201).json({
            payment_session_id: cashfreeOrderData.payment_session_id,
            order_id: generatedOrderId
        });
    } catch (error) {
        console.error('Controller Error:', error);
        return res.status(500).json({ success: false, message: error?.message || 'Internal Error' });
    }
};

exports.updateTransactionStatus = async (req, res) => {
    try {
        const { order_id } = req.query;
        const orderStatus = await cashfreeService.fetchCashfreeOrderStatus(order_id);

        const order = await Order.findOne({ where: { orderId: order_id } });
        if (!order) {
            return res.status(404).send('Order registry tracking missing from system.');
        }

        const user = await User.findByPk(order.userId);
        if (!user) {
            return res.status(404).send('Associated user not found for this order.');
        }

        if (orderStatus === 'PAID') {
            await order.update({ status: 'SUCCESSFUL' });
            await user.update({ isPremiumUser: true });

            try {
                const total = (await Expense.sum('amount', { where: { userId: user.id } })) || 0;

                await PremiumLeader.create({
                    name: user.name,
                    totalExpenses: total,
                    userId: user.id
                });
            } catch (err) {
                console.error('Error creating premium leader entry:', err);
            }

            return res.redirect('/expenses/addexpense?payment=success');
        } else {
            await order.update({ status: 'FAILED' });
            return res.redirect('/expenses/addexpense?payment=fail');
        }
    } catch (error) {
        console.error(error);
        return res.status(500).send('Error occurred while resolving status workflow updates.');
    }
};

