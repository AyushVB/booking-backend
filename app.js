import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import connectDb from './config/connectDB.js'
import userRoutes from './routes/userRoutes.js'
import bookingRoutes from './routes/bookingRoutes.js'

dotenv.config()

const app=express()

const PORT=process.env.PORT ||3000
const DB_URL=process.env.DB_URL

// CORS policy
app.use(cors())

// connect DataBase
connectDb(DB_URL)

// JSON
app.use(express.json())

// LOAD user routes
app.use('/api/user',userRoutes)

// LOAD booking routes
app.use('/api/booking',bookingRoutes)

app.listen(PORT,()=>{
    console.log(`listen on PORT: ${PORT}`)
})