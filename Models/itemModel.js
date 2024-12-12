const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
    image: {
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
    ingredients: {
        type: String,
        required: true
    },
    time: {
        type: String,
        required: true
    },
    delivery: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    category :{
        type: String,
        required: true
    },
    chefId: {
        type: String,
        required: true
    },
    chefname:{ 
        type:String,
        required:true
    },  
    chefImage:
    {
        type:String
    } ,
    location:{
        type:String,
        required:true
    },
    whatsapp:{
        type:String,
        required:true
    },
    rating:{
        type:[Number],
        default:[]
    },
    averageRating: { 
        type: Number,
         default: 0
        }
});

const items = mongoose.model('items', itemSchema);

module.exports = items;
