const mongoose=require('mongoose')

const cartSchema=new mongoose.Schema({
    itemimage:{
        type:String,
        required:true
    },
    itemname:{
        type:String,
        required:true
    },
    price:{
        type:String,
        required:true
    },
    quantity:{
        type:Number,
    },
    delivery:{
        type:String,
        required:true

    },
    chefname:{
        type:String,
        required:true
    },
    chefimage:{
        type:String,
    },
    location:{
        type:String,
        required:true
    },
    timetomake:{
        type:String,
        required:true  
    },
    userId:{
        type:String,
        required:true  

    },
    chefId: {
        type: String,
        required: true
    },
    itemId: {
        type: mongoose.Schema.Types.ObjectId, // Assuming items are stored in a MongoDB collection
        ref: 'items', // Reference to the items collection
        required: true
    }


})

const carts=mongoose.model('carts',cartSchema)

module.exports=carts