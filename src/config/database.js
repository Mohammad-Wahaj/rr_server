import mongoose from 'mongoose'

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      maxPoolSize: 10, // Replaces `poolSize`
      serverSelectionTimeoutMS: 5000, // Timeout after 5 seconds instead of 30 seconds
      socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
    })

    console.log(`Database connected: ${conn.connection.host}`)
  } catch (error) {
    console.error(`Error: ${error.message}`)
    process.exit(1)
  }

  // Handle connection events for better monitoring
  mongoose.connection.on('connected', () => {
    console.log('Mongoose connected to DB')
  })

  mongoose.connection.on('error', (err) => {
    console.error(`Mongoose connection error: ${err.message}`)
  })

  mongoose.connection.on('disconnected', () => {
    console.log('Mongoose disconnected')
  })

  // Graceful shutdown
  process.on('SIGINT', async () => {
    await mongoose.connection.close()
    console.log('Mongoose connection disconnected through app termination')
    process.exit(0)
  })
}
