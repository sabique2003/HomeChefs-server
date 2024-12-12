const express=require('express')

const userController=require('../Controllers/userController')
const itemController=require('../Controllers/itemController')
const cartController=require('../Controllers/cartController')
const orderController=require('../Controllers/orderController')
const razorController=require('../Controllers/razorpayController')

const jwtmiddle=require('../Middleware/jwtmiddleware')
const multerMiddle=require('../Middleware/multerMiddleware')


const routes=express.Router()

routes.post('/reg',userController.userRegistration)
routes.post('/log',userController.userLogin)
routes.get('/allitems',jwtmiddle,itemController.allItems)
routes.get('/item/:id', jwtmiddle, itemController.itemView);
routes.put('/edituser',jwtmiddle,multerMiddle.single('userImage'),userController.UserProfileUpdate)
routes.post('/addtocart',jwtmiddle,cartController.addtoCart)
routes.get('/mycart',jwtmiddle,cartController.getCartList)
routes.delete('/delcart/:id',jwtmiddle,cartController.deleteCartItem)
routes.put('/editcart',jwtmiddle,cartController.editCart)
routes.post('/neworder',jwtmiddle,orderController.addtoOrder)
routes.post('/create-order',jwtmiddle,razorController.createOrder );
routes.delete('/removeorder/:id',jwtmiddle,cartController.deleteOrderedItem)
routes.get('/getuserorder',jwtmiddle,orderController.getUserOrderList)
routes.patch('/cancelOrder/:id', jwtmiddle, orderController.cancelOrder);
routes.post('/addRating/:id', jwtmiddle, orderController.AddRating);




module.exports=routes