const chefs=require('../Models/chefModel')
const jwt=require('jsonwebtoken')

exports.chefRegistration=async(req,res)=>{
    console.log(req.body);
    const {email,password,whatsapp,chefname,location}=req.body
    if(!email || !password || !whatsapp || !chefname || !location){
        res.status(400).json("Invalid Data")
    }
    else{
        const newChef=new chefs({
            email,password,whatsapp,chefname,location,profile:""
        })
        await newChef.save()
        res.status(200).json("Success")
    }
    
}

exports.chefLogin=async(req,res)=>{
    try{
    const {email,password}=req.body
    const existing=await chefs.findOne({email,password})
    if(existing){
        const token=jwt.sign({chefId:existing._id},process.env.SECRET_KEY)
        res.status(200).json({token,chefname:existing.chefname,email:existing.email,whatsapp:existing.whatsapp,location:existing.location,profile:existing.profile})
    }
    else{
        res.status(404).json("Invalid Email/Password")
    }
}
catch(err){
    res.status(400).json(err)
}
}

exports.ChefProfileUpdate=async(req,res)=>{
    try{
        const chefId=req.payload
    if(req.file){
        var profile=req.file.filename
        var {chefname,email,whatsapp,location}=req.body

    }
    else{
        var{chefname,email,whatsapp,location}=req.body
    }

    const existingProfile=await chefs.findOne({_id:chefId})
    existingProfile.chefname=chefname
    existingProfile.email=email
    existingProfile.whatsapp=whatsapp
    existingProfile.location=location
    existingProfile.profile=profile
    await existingProfile.save()
    res.status(200).json("Profile Updated!!")
    }
    catch(err){
        console.log(err);
        res.status(400).json(err)
        
    }
    
}

exports.AllChefs=async(req,res)=>{
    try{
        const cheflist=await chefs.find()
        res.status(200).json(cheflist)
    } catch (err) {
        console.log(err);
        res.status(400).json(err);
        
      }
    }
