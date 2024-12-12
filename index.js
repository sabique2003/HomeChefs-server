require('dotenv').config()
const express=require('express')
const cors=require('cors')
const userRouter=require('./Routes/userRoutes')
const chefRouter=require('./Routes/chefRoutes')
require('./Connection/db')

const server=express()


server.use(cors())//cors is a middleware
server.use(express.json())
server.use(userRouter)
server.use(chefRouter)


server.use('/uploads',express.static('./uploads'))


const PORT=3000 || process.env.PORT

server.listen(PORT,()=>{
 console.log(`Server Running at ${PORT}`);
 
})