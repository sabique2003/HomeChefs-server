const items = require('../Models/itemModel');

exports.addItem = async (req, res) => {
    try {
        const { 
            itemname, 
            price, 
            ingredients, 
            time, 
            delivery, 
            description, 
            category, 
            chefname,  
            chefimage,
            location,
            whatsapp
        } = req.body;

        const image = req.file.filename;
        const chefId = req.payload;

        
        if (!itemname || !price || !ingredients || !time || !delivery || !description || !category || !chefname || !location || !whatsapp) {
            return res.status(406).json("Enter Valid Data");
        }

        const newItem = new items({
            image, 
            itemname, 
            price, 
            ingredients, 
            time, 
            delivery, 
            description, 
            category, 
            chefId, 
            chefname,  
            chefimage,
            location,
            whatsapp,
            rating: ""
        });
        
        await newItem.save();
        res.status(200).json(newItem);
    } catch (err) {
        console.log(err);
        res.status(400).json(err);
    }
};

exports.getItemList = async (req, res) => {
    try {
        const chefId = req.payload;
        console.log("Chef ID from payload:", chefId);

        const itemList = await items.find({ chefId });
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

exports.deleteItem=async(req,res)=>{
    try{
        const {id}=req.params
    const result = await items.findOneAndDelete({_id:id})
    res.status(200).json(result)
    }
    catch(err){
        console.log(err);
        res.status(400).json(err)
        
    }
    
}

exports.editItem = async (req, res) => {
    try {
        const { id } = req.params;
        const chefId = req.payload;

        // Check if a new file is uploaded
        let image = req.body.image;
        if (req.file) {
            image = req.file.filename;
        }

        const { itemname, price, ingredients, time, delivery, description, category } = req.body;

        if (!itemname || !price || !ingredients || !time || !delivery || !image || !description || !category) {
            return res.status(406).json("Invalid Data");
        }

        // Ensure the item belongs to the chef
        const existing = await items.findOne({ _id: id, chefId });
        if (!existing) {
            return res.status(404).json("Item not found or unauthorized");
        }

        existing.itemname = itemname;
        existing.price = price;
        existing.ingredients = ingredients;
        existing.time = time;
        existing.delivery = delivery;
        existing.image = image;
        existing.description = description;
        existing.category = category;

        await existing.save();
        res.status(200).json(existing);
    } catch (err) {
        console.error(err);
        res.status(400).json({ error: "Failed to update item", details: err.message });
    }
};

exports.allItems=async(req,res)=>{
    try{
        const itemslist=await items.find()
        res.status(200).json(itemslist)
    } catch (err) {
        console.log(err);
        res.status(400).json(err);
        
      }
    }


    exports.itemView = async (req, res) => {
        try {
            const item = await items.findById(req.params.id);
            if (!item) {
                return res.status(404).json({ message: 'Item not found' });
            }
            res.status(200).json(item);
        } catch (error) {
            console.error('Error fetching item:', error.message);
            if (error.name === 'CastError') {
                return res.status(400).json({ message: 'Invalid item ID format' });
            }
            res.status(500).json({ message: 'Server error' });
        }
    };
        
    