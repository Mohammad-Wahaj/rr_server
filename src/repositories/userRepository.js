import DeativatedUsers from '../models/deactivatedUsersModel.js'

import User from '../models/userModel.js'

export const getUserByEmail = async (email) => {
  if (email) {
    let user = await User.findOne({ email: email })
    return user
  }
}

export const getUserById = async (userId) => {
  if (userId) {
    let user = await User.findById(userId).select('-password')
    return user
  }
}

export const createNewUser = async (
  name,
  email,
  phone,
  address,
  userType,
  password
) => {
  const newUser = new User({
    name: name,
    email: email,
    phone: phone,
    address: address,
    // permanentLocation: {
    //   type: 'Point',
    //   coordinates: [longitude, latitude],
    // },
    userType: userType,
    password: password,
  })
  console.log(newUser)

  await newUser.save()

  return newUser
}

export const createLoginHistory = async (
  userId,
  ipAddress,
  device,
  browser,
  isSuccess
) => {
  await LoginHistory.create({
    userId,
    ipAddress,
    device,
    isSuccess,
  })
}

// deactivate user - by user
export const deactivationByUser = async (userId, username) => {
  const deactivatedUser = await DeativatedUsers.create({
    userId,
    isReactivated,
    username,
  })
  deactivatedUser.save()
  return deactivatedUser
}

// update isDeactivated in User model
export const updateDeactivationStatusInUser = async (userId) => {
  const effectDeactivation = await User.findByIdAndUpdate(
    userId,
    { isActive: false, isDeactivated: true },
    { new: true }
  )
}
