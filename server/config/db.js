import mongoose from 'mongoose'

export const connectDB=async ()=>{
    await mongoose.connect(`${process.env.MONGO_URL}/Taskflow`)
    .then (()=>console.log('MongoDb Connected'))
}