// Socket.js
import { Server } from 'socket.io'
import http from 'http'
import express from 'express'
import redisAdapter from 'socket.io-redis'
import jwt from 'jsonwebtoken'
import { createClient } from 'redis'
import { sendUndeliveredMessges } from '../controllers/messageController.js'

const app = express()
const server = http.createServer(app)
const redisClient = createClient()

const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
})
io.adapter(redisAdapter(redisClient))

const userSocketMap = {}

export const getReceiverSocketId = (receiverId) => {
  return userSocketMap[receiverId]
}

io.use((socket, next) => {
  const token = socket.handshake.query.token

  try {
    const user = jwt.verify(token, process.env.JWT_SECRET)

    socket.userId = user.userId
    next()
  } catch (err) {
    next(new Error('Authentication error'))
  }
})

io.on('connection', (socket) => {
  const userId = socket.userId

  if (userId) {
    if (!userSocketMap[userId]) {
      userSocketMap[userId] = new Set()
    }
    userSocketMap[userId].add(socket.id)

    io.emit('userConnected', userId)
    // sendUndeliveredMessges(userId)

    socket.on('disconnect', () => {
      userSocketMap[userId].delete(socket.id)
      if (userSocketMap[userId].size === 0) {
        delete userSocketMap[userId]
        io.emit('userDisconnected', userId)
      }
    })
  } else {
    socket.disconnect()
  }
})

export { app, io, server }
