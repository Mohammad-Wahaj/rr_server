// app.js
import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import dotenv from 'dotenv'
import userRoutes from './routes/userRoutes.js'
import SOSRoutes from './routes/SOSRoutes.js'
import { connectDB } from './config/database.js'

dotenv.config()
connectDB()

const app = express()

app.use(cors({
  origin: (origin, callback) => {
    callback(null, origin); // Allow all origins
  },
  credentials: true
}));
app.use(express.json())
app.use(cookieParser())

app.use('/api/v1', userRoutes)
app.use('/api/v1', SOSRoutes)

// ❌ REMOVE THIS FOR VERCEL:
// const PORT = process.env.PORT || 5000
// app.listen(PORT, () => console.log(`Server running on ${PORT}`))

// ✅ EXPORT for Vercel
export default app
