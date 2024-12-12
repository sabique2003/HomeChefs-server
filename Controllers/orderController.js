const orders = require('../Models/orderModel');
const { v4: uuidv4 } = require('uuid'); // Ensure this library is installed
const mongoose=require('mongoose')

const items = require('../Models/itemModel');

exports.addtoOrder = async (req, res) => {
    try {
        const { 
            itemId,  // Include the itemId in the request body
            itemimage, 
            itemname, 
            price, 
            currentTime, 
            delivery, 
            quantity, 
            chefname,  
            chefimage,
            location,
            timetomake,
            chefId,
            paymentStatus,
            username,
            contact
        } = req.body;

        const userId = req.payload; // Extracted from JWT middleware

        // Log the request body and userId
        console.log("Incoming Request Body:", req.body);
        console.log("Authenticated User ID:", userId);

        // Validate required fields
        if (!itemId || !itemimage || !itemname || !price || !delivery || !quantity || !chefname || !location || !timetomake || !currentTime || !paymentStatus || !username || !contact) {
            return res.status(406).json("Enter Valid Data");
        }

        // Validate itemId
        const item = await items.findById(itemId);
        if (!item) {
            return res.status(404).json("Item not found.");
        }

        // Generate orderId
        const orderId = uuidv4();

        // Check for duplicate orders
        const existingOrder = await orders.findOne({ orderId });
        if (existingOrder) {
            return res.status(409).json("Duplicate order.");
        }

        // Create the new order
        const newOrder = new orders({
            itemId,  // Store the itemId reference
            itemimage, 
            itemname, 
            price, 
            currentTime, 
            delivery, 
            quantity, 
            chefname,  
            chefimage,
            location,
            timetomake,
            chefId,
            userId,
            orderId,
            paymentStatus,
            username,
            contact
        });

        await newOrder.save();
        res.status(200).json(newOrder);
    } catch (err) {
        console.error("Error saving order:", err);
        res.status(400).json(err);
    }
};


exports.getOrderList = async (req, res) => {
    try {
        const chefId = req.payload;
        console.log("Chef ID from payload:", chefId);

        const itemList = await orders.find({ chefId });
        if (itemList.length === 0) {
            console.log("No items found for chef ID:", chefId);
        }
        console.log("Payload received:", req.payload);
        console.log("Item List Query Result:", itemList);



        res.status(200).json(itemList);
    } catch (err) {
        console.error("Error fetching item list:", err);
        res.status(400).json({ error: "Error fetching items", details: err });
    }
};


exports.getUserOrderList = async (req, res) => {
    try {
        const userId = req.payload;
        console.log("Chef ID from payload:", userId);

        const itemList = await orders.find({ userId });
        if (itemList.length === 0) {
            console.log("No items found for chef ID:", userId);
        }
        console.log("Payload received:", req.payload);
        console.log("Item List Query Result:", itemList);



        res.status(200).json(itemList);
    } catch (err) {
        console.error("Error fetching item list:", err);
        res.status(400).json({ error: "Error fetching items", details: err });
    }
};


exports.cancelOrder = async (req, res) => {
    try {
        const orderId = req.params.id;
        const userId = req.payload;

        console.log("Cancelling order for orderId:", orderId, "and userId:", userId);

        // Find and update the order by setting the cancelled field to true
        const updatedOrder = await orders.findOneAndUpdate(
            { _id: orderId, userId },
            { $set: { cancelled: true, status: 'Cancelled' } },
            { new: true }
        );

        if (updatedOrder) {
            res.status(200).json({ message: 'Order cancelled successfully.', order: updatedOrder });
        } else {
            res.status(404).json({ message: 'Order not found or already cancelled.' });
        }
    } catch (error) {
        console.error('Error cancelling order:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};


// Add a new controller to update order status
exports.updateOrderStatus = async (req, res) => {
    try {
        const orderId = req.params.id;
        const { newStatus } = req.body;

        console.log("Updating status for orderId:", orderId, "to newStatus:", newStatus);

        // Update the order status
        const updatedOrder = await orders.findOneAndUpdate(
            { _id: orderId },
            { $set: { orderStatus: newStatus } },
            { new: true }
        );

        if (updatedOrder) {
            res.status(200).json({ message: 'Order status updated successfully.', order: updatedOrder });
        } else {
            res.status(404).json({ message: 'Order not found or cannot be updated.' });
        }
    } catch (error) {
        console.error('Error updating order status:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};


exports.deleteOrder = async (req, res) => {
    try {
        const orderId = req.params.id;
        const chefId = req.payload; // Assuming you want to verify the user

        console.log("Deleting order for orderId:", orderId, "and userId:", chefId);

        // Find and delete the order
        const deletedOrder = await orders.findOneAndDelete({ _id: orderId, chefId });

        if (deletedOrder) {
            res.status(200).json({ message: 'Order deleted successfully.', order: deletedOrder });
        } else {
            res.status(404).json({ message: 'Order not found or already deleted.' });
        }
    } catch (error) {
        console.error('Error deleting order:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};


exports.AddRating = async (req, res) => {
    const { id } = req.params; // Extract itemId from URL parameters
    const { rating } = req.body; // Extract rating value from request body

    console.log("Received Request:");
    console.log("ItemId (from params):", id);
    console.log("Request Body:", req.body);

    try {
        // Validate the itemId format
        if (!mongoose.Types.ObjectId.isValid(id)) {
            console.error("Invalid itemId format:", id);
            return res.status(400).json({ message: "Invalid itemId format" });
        }

        // Find the item in the database
        const item = await items.findById(id);
        if (!item) {
            console.error("Item not found in database:", id);
            return res.status(404).json({ message: "Item not found" });
        }

        console.log("Item found:", item);

        // Update the item with the new rating
        if (!Array.isArray(item.rating)) {
            item.rating = [];
        }
        item.rating.push(rating);

        // Calculate the average rating
        const totalRatings = item.rating.reduce((sum, r) => sum + r, 0);
        const averageRating = (totalRatings / item.rating.length).toFixed(2);

        // Update the item's average rating and save
        item.averageRating = Number(averageRating); // Convert to number for consistent data type
        await item.save();

        console.log("Rating successfully added to item:", id);

        res.status(200).json({ message: "Rating added successfully", item });
    } catch (error) {
        console.error("Error processing request:", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};
