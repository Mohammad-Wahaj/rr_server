// app.js
import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import dotenv from 'dotenv'
import userRoutes from './routes/userRoutes.js'
import SOSRoutes from './routes/SOSRoutes.js'
import { connectDB } from './config/database.js'

const app = express()

const PORT = process.env.PORT || 5000;


dotenv.config()
app.use(cors({
  origin: (origin, callback) => {
    callback(null, origin); // Allow all origins
  },
  credentials: true
}));

connectDB()
app.use(express.json())
app.use(cookieParser())

app.use('/api/v1', userRoutes)
app.use('/api/v1', SOSRoutes)

app.listen(PORT, () => {
  console.log(`server is running on ${PORT}`)
})
