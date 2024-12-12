const Razorpay = require('razorpay');

const razorpay = new Razorpay({
    key_id: 'rzp_test_4kAwk6IV0YcZCP',
    key_secret: process.env.KEY_SECRET,
});

const createOrder = async (req, res) => {
    const { amount, currency } = req.body;

    try {
        const options = {
            amount: amount * 100, // Amount in paise
            currency: currency,
            receipt: `receipt_${Date.now()}`,
        };
        const order = await razorpay.orders.create(options);

        res.status(200).json({
            success: true,
            order,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Error creating Razorpay order",
        });
    }
};

module.exports = { createOrder };
