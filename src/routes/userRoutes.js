import express from 'express'
import { login, logout, register } from '../controllers/userController.js'
import {
  validateLogin,
  validateRegistration,
} from '../middlewares/ValidationMiddleware.js'
import { protect } from '../middlewares/protectMiddleware.js'
const router = express.Router()

// auth
router.post('/register', register)
router.post('/login', login)
router.post('/logout', logout)
// router.post('/deactivationByUser', protect, deactivateByUser)

export default router
