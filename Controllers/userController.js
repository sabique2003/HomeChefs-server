const users=require('../Models/userModel')
const jwt=require('jsonwebtoken')

exports.userRegistration=async(req,res)=>{
    console.log(req.body);
    const {email,name,password,mobile,location}=req.body
    if(!email || !name || !password || !mobile || !location){
        res.status(400).json("Invalid Data")
    }
    else{
        const newUser=new users({
            email,name,password,mobile,location,userImage:""
        })
        await newUser.save()
        res.status(200).json("Success")
    }
    
}

exports.userLogin=async(req,res)=>{
    try{
    const {email,password}=req.body
    const existing=await users.findOne({email,password})
    if(existing){
        const token=jwt.sign({userId:existing._id},process.env.SECRET_KEY)
        res.status(200).json({token,name:existing.name,email:existing.email,mobile:existing.mobile,location:existing.location,userImage:existing.userImage})
    }
    else{
        res.status(404).json("Invalid Email/Password")
    }
}
catch(err){
    res.status(400).json(err)
}
}

exports.UserProfileUpdate=async(req,res)=>{
    try{
        const userId=req.payload
    if(req.file){
        var userImage=req.file.filename
        var {name,email,mobile,location}=req.body

    }
    else{
        var{name,email,mobile,location}=req.body
    }

    const existingUser=await users.findOne({_id:userId})
    existingUser.name=name
    existingUser.email=email
    existingUser.mobile=mobile
    existingUser.location=location
    existingUser.userImage=userImage
    await existingUser.save()
    res.status(200).json("Profile Updated!!")
    }
    catch(err){
        console.log(err);
        res.status(400).json(err)
        
    }
    
}