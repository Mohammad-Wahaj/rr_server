import express from 'express'
import {
  findNearest,
  getActiveSOSRequest,
  getDriverAssignment,
  getUsersByHospital,
  SOSRequest,
  updateUserLocation,
} from '../controllers/SOSController.js'
import { protect } from '../middlewares/protectMiddleware.js'

const router = express.Router()

router.post('/createSOSRequest', protect, SOSRequest)
router.post('/updateUserLocation', protect, updateUserLocation)
router.get('/findNearest', findNearest)
router.get('/getDriverAssignment', protect, getDriverAssignment)
router.get('/getActiveSOSRequest', protect, getActiveSOSRequest)
router.get('/hospital/:hospitalId/users', protect, getUsersByHospital)

export default router
