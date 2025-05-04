import mongoose from 'mongoose'
// Define the schema for storing minimal deactivation/reactivation information
const DeativatedUsersSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User', // If you have a separate User model
  },
  username: {
    type: String,
    required: true,
  },
  effectiveDate: {
    type: Date,
    required: true,
    default: Date.now,
  },
  isReactivated: {
    type: Boolean,
    required: true,
    default: false, // Default is false, meaning the user is not reactivated
  },
})

// Create the model
const DeativatedUsers = mongoose.model(
  'DeactivatedUsers',
  DeativatedUsersSchema
)

export default DeativatedUsers
