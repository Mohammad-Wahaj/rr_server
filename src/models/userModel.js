import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    permanentLocation: {
      type: {
        type: String,
        enum: ['Point'],
        required: false,
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        required: false,
      },
    },
    userType: {
      type: String,
      enum: ['user', 'driver', 'hospital'],
      required: true,
      default: 'user',
    },

    password: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
)

// Geo index for responder location search
userSchema.index({ permanentLocation: '2dsphere' })

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next()

  try {
    const saltRounds = 10
    this.password = await bcrypt.hash(this.password, saltRounds)
    next()
  } catch (error) {
    next(error)
  }
})

const User = mongoose.model('User', userSchema)

export default User
