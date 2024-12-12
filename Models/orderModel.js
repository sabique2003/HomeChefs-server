const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    itemimage: {
        type: String,
        required: true
    },
    itemname: {
        type: String,
        required: true
    },
    price: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
    },
    delivery: {
        type: String,
        required: true
    },
    chefname: {
        type: String,
        required: true
    },
    chefimage: {
        type: String,
    },
    location: {
        type: String,
        required: true
    },
    timetomake: {
        type: String,
        required: true
    },
    userId: {
        type: String,
        required: true
    },
    chefId: {
        type: String,
        required: true
    },
    currentTime: {
        type: String,
        required: true
    },
    orderId: { // New field for Razorpay orderId
        type: String,
        required: true
    },
    paymentStatus: {
        type: String,
        enum: ["Pending", "Fulfilled"],
        default: "Pending",
        required: true
    },
    username: {
        type: String,
        required: true
    },
    contact: {
        type: String,
        required: true
    },
    orderStatus: { // Changed from status to orderStatus
        type: String,
        default: "Just Ordered"
    },
    cancelled: {
        type: Boolean,
        default: false
    },
    itemId: {
        type: mongoose.Schema.Types.ObjectId, // Assuming items are stored in a MongoDB collection
        ref: 'items', // Reference to the items collection
        required: true
    }
});

const orders = mongoose.model('orders', orderSchema);

module.exports = orders;
