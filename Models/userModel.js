const mongoose=require('mongoose')

const userSchema=new mongoose.Schema({
    email:{
        type:String,
        required:true,
        unique:true
    },
    name:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    mobile:{
        type:String,
        required:true,
        unique:true

    },
    location:{
        type:String,
        required:true,

    },
    userImage:{
        type:String
    }
})

const users=mongoose.model('users',userSchema)

module.exports=users