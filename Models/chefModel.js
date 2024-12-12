const mongoose=require('mongoose')

const chefSchema=new mongoose.Schema({
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    whatsapp:{
        type:String,
        required:true,
        unique:true
    },
    chefname:{
        type:String,
        required:true,
    },
    location:{
        type:String,
        required:true,

    },
    profile:{
        type:String
    }
})

const chefs=mongoose.model('chefs',chefSchema)

module.exports=chefs