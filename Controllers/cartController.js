const carts = require('../Models/cartModel');
const mongoose=require('mongoose')

exports.addtoCart = async (req, res) => {
    try {
        const { 
            itemimage, 
            itemname, 
            price, 
            time, 
            delivery, 
            quantity, 
            chefname,  
            chefimage,
            location,
            timetomake,
            chefId,
            itemId // New field
        } = req.body;

        const userId = req.payload; // Extracted from JWT middleware

        // Validate required fields, including itemId
        if (!itemimage || !itemname || !price || !delivery || !quantity || !chefname || !location || !timetomake || !itemId) {
            return res.status(406).json("Enter Valid Data");
        }

        // Check if the item already exists in the user's cart
        const existingCartItem = await carts.findOne({ userId, itemId });
        if (existingCartItem) {
            return res.status(409).json("Item already exists in the cart.");
        }

        // Create a new cart entry
        const newCart = new carts({
            itemimage, 
            itemname, 
            price, 
            time, 
            delivery, 
            quantity, 
            chefname,  
            chefimage,
            location,
            timetomake,
            chefId,
            userId,
            itemId // Add itemId here
        });

        // Save the new cart entry to the database
        await newCart.save();
        res.status(200).json(newCart);
    } catch (err) {
        console.error("Error adding item to cart:", err);
        res.status(400).json(err);
    }
};

exports.getCartList = async (req, res) => {
    try {
        const userId = req.payload;
        console.log("Chef ID from payload:", userId);

        const cartList = await carts.find({ userId });
        if (cartList.length === 0) {
            console.log("No items found for chef ID:", userId);
        }
        console.log("Payload received:", req.payload);
        console.log("Item List Query Result:", cartList);



        res.status(200).json(cartList);
    } catch (err) {
        console.error("Error fetching item list:", err);
        res.status(400).json({ error: "Error fetching items", details: err });
    }
};

exports.deleteCartItem=async(req,res)=>{
    try{
        const {id}=req.params
    const result = await carts.findOneAndDelete({_id:id})
    res.status(200).json(result)
    }
    catch(err){
        console.log(err);
        res.status(400).json(err)
        
    }
    
}

exports.editCart = async (req, res) => {
    try {
        const userId = req.payload; // Ensure this is the logged-in user's ID
        const cartUpdates = req.body; // Expecting an array of items with their IDs and updated quantities

        // Validate the input
        if (!Array.isArray(cartUpdates) || cartUpdates.length === 0) {
            return res.status(400).json({ error: "Invalid data format. Expected an array of cart items." });
        }

        // Iterate over the items and update each one
        const updatePromises = cartUpdates.map(async (update) => {
            const { id, quantity } = update;

            // Validate required fields
            if (!id || !quantity) {
                throw new Error(`Invalid data for item with ID: ${id}`);
            }

            // Find and update the cart item
            const cartItem = await carts.findOne({ _id: id, userId });
            if (!cartItem) {
                throw new Error(`Item not found or unauthorized for ID: ${id}`);
            }

            cartItem.quantity = quantity; // Only updating quantity for simplicity
            return cartItem.save();
        });

        // Wait for all updates to complete
        const updatedItems = await Promise.all(updatePromises);

        res.status(200).json({ message: "Cart updated successfully", data: updatedItems });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to update cart items", details: err.message });
    }
};



exports.deleteOrderedItem = async (req, res) => {
    try {
        const userId = req.payload || req.user?.userId; // Ensure userId is extracted correctly
        const itemId = req.params.id; // Extract the ID from request params

        // Validate input
        if (!itemId || !mongoose.Types.ObjectId.isValid(itemId)) {
            console.error("Invalid item ID:", itemId);
            return res.status(400).json({ success: false, message: "Invalid or missing item ID" });
          }
          
          if (!userId) {
            console.error("User ID is missing");
            return res.status(401).json({ success: false, message: "User ID is missing" });
          }
          

        // Perform delete operation
        const result = await carts.deleteOne({ _id: itemId, userId });
        if (result.deletedCount > 0) {
            return res.status(200).json({ success: true, message: "Item deleted successfully." });
        } else {
            return res.status(404).json({ success: false, message: "Item not found." });
        }
    } catch (error) {
        console.error("Error deleting items:", error.message);
        return res.status(500).json({ success: false, message: "Failed to delete items.", details: error.message });
    }
};
