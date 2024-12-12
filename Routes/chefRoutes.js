const express=require('express')

const chefController=require('../Controllers/chefController')
const itemController=require('../Controllers/itemController')
const orderController=require('../Controllers/orderController')
const multerMiddle=require('../Middleware/multerMiddleware')
const jwtmiddle=require('../Middleware/jwtmiddleware')



const routes=express.Router()

routes.post('/chefreg',chefController.chefRegistration)
routes.post('/cheflog',chefController.chefLogin)
routes.put('/editchef',jwtmiddle,multerMiddle.single('profile'),chefController.ChefProfileUpdate)


routes.post('/additem',jwtmiddle,multerMiddle.single('image'),itemController.addItem)
routes.get('/itemlist',jwtmiddle,itemController.getItemList)
routes.delete('/delitem/:id',jwtmiddle,itemController.deleteItem)
routes.put('/edititem/:id',jwtmiddle,multerMiddle.single('image'),itemController.editItem)

routes.get('/orderlist',jwtmiddle,orderController.getOrderList)
routes.patch('/updateOrderStatus/:id', jwtmiddle, orderController.updateOrderStatus);
routes.delete('/delorder/:id',jwtmiddle,orderController.deleteOrder)
routes.get('/getchefs',chefController.AllChefs)





module.exports=routes