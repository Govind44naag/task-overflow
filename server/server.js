import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import userRouter from './routes/userRoute.js'
import {connectDB} from './config/db.js'
import taskRouter from './routes/taskRoute.js'
const app=express()

const port=process.env.PORT || 4000

app.use(express.json())
app.use(cors({
  origin: 'http://localhost:5173', // adjust to frontend origin
  credentials: true,
  
}));

app.use(express.urlencoded({extended:true}))
//connect db
connectDB()
//route

app.use('/api/user',userRouter)
app.use('/api/tasks',taskRouter)
app.get('/',(req,res)=>{
    res.send('api working')
})
app.listen(port,()=>{
    console.log(`Server is running on port number http://localhost:${port}`)
})