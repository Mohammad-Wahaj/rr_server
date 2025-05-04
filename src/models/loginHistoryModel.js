import mongoose from 'mongoose'

const loginHistorySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // This references the User model
  },
  loginTime: {
    type: Date,
    default: Date.now, // Automatically sets the current date/time when a record is created
  },
  ipAddress: {
    type: String,
    required: true,
  },
  device: {
    type: String, // Optionally store the device name or type
  },
  browser: {
    type: String, // Optionally store the browser name
  },
  isSuccess: {
    type: Boolean, // Indicates whether the login attempt was successful
    default: true,
  },
})

const LoginHistory = mongoose.model('LoginHistory', loginHistorySchema)

export default LoginHistory
