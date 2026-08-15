const { Cashfree, CFEnvironment } = require('cashfree-pg');

const cashfree = new Cashfree(
    CFEnvironment.SANDBOX,
    'TEST430329ae80e0f32e41a393d78b923034',
    'TESTaf195616268bd6202eeb3bf8dc458956e7192a85'
);

exports.createOrder = async (
    orderId,
    orderAmount,
    orderCurrency = 'INR',
    customerId,
    customerName,
    customerPhone,
    customerEmail
) => {
    try {
        const sanitizePhone = (phone) => {
            if (!phone) return '9999999999';
            const clean = phone.toString().replace(/\D/g, '');
            return clean.length >= 10 ? clean.slice(-10) : '9999999999';
        };

        const request = {
            order_amount: Number(orderAmount),
            order_currency: orderCurrency,
            order_id: String(orderId),
            customer_details: {
                customer_id: String(customerId),
                customer_phone: sanitizePhone(customerPhone),
                customer_email: customerEmail || 'test@gmail.com',
                customer_name: customerName || 'Premium User'
            },
            order_meta: {
                return_url: `http://localhost:3000/premium/status?order_id=${orderId}`,
                payment_methods: 'cc,upi,nb'
            }
        };

        const response = await cashfree.PGCreateOrder(request);
        return response.data;
    } catch (err) {
        console.error('Cashfree order creation error:', err.response?.data || err.message || err);
        throw new Error('Something went wrong initiating payment');
    }
};

exports.fetchCashfreeOrderStatus = async (orderId) => {
    try {
        const response = await cashfree.PGOrderFetchPayments(orderId);
        const payments = response.data;

        if (!Array.isArray(payments) || payments.length === 0) {
            return 'PENDING';
        }

        // Cashfree may return different status strings depending on integration/response shape.
        // Treat SUCCESS/PAID as paid.
        const hasSucceeded = payments.some(transaction => {
            const status = String(transaction.payment_status || '').toUpperCase();
            return status === 'SUCCESS' || status === 'PAID';
        });
        if (hasSucceeded) return 'PAID';

        const hasPending = payments.some(transaction => {
            const status = String(transaction.payment_status || '').toUpperCase();
            return status === 'PENDING' || status === 'PROCESSING';
        });
        if (hasPending) return 'PENDING';

        return 'FAILED';
    } catch (error) {
        console.error('Error fetching order status inside Service:', error.response?.data || error);
        throw new Error(error.response?.data?.message || 'Cashfree Status Retrieval Failed');
    }
};