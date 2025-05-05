import User from '../models/userModel.js'
import {
  createLoginHistory,
  createNewUser,
  deactivationByUser,
  getUserByEmail,
  updateDeactivationStatusInUser,
} from '../repositories/userRepository.js'
import { generateToken } from '../utils/jwtHelper.js'
import { createResponse } from '../utils/responseHelper.js'
import bcrypt from 'bcryptjs'

// Register
export const register = async (req, res) => {
  const { name, email, phone, address, password, userType } = req.body

  let alreadyExist = await getUserByEmail(email)

  if (alreadyExist) {
    res.status(200).json(createResponse(false, 'user already exist', [], ''))
    return
  } else {
    const newUser = await createNewUser(
      name,
      email,
      phone,
      address,
      userType,
      password
    )

    if (newUser) {
      let token = generateToken(newUser._id, res)
      const userData = {
        name: newUser.email,
        email: newUser.name,
        phone: newUser.phone,
        address: newUser.address,
        userType: newUser.userType,
        token: token,
      }
      res.status(201).json(createResponse(true, 'user created', userData, null))
    }
  }
}

// Login
export const login = async (req, res) => {
  const { email, password, latitude, longitude } = req.body

  try {
    const userFound = await getUserByEmail(email)
    if (userFound) {
      // Compare the provided password with the stored hashed password
      const passwordMatch = await bcrypt.compare(password, userFound.password)
      if (!passwordMatch) {
        console.log(userFound)

        // Log failed login attempt and respond with an error if the password does not match
        // await createLoginHistory(
        //   userFound._id,
        //   req.ip,
        //   req.headers['user-agent'],
        //   req.headers['user-agent'],
        //   false
        // )
        return res
          .status(401)
          .json(
            createResponse(false, 'Login failed', [], ['Invalid Credentials'])
          )
      }

      await User.findOneAndUpdate(
      { email: userFound.email }, // Search by email
      {
        $set: {
          permanentLocation: {
            type: 'Point',
            coordinates: [longitude, latitude], // Update with new coordinates
          },
        },
      }
    )
      
      // Password is correct, proceed with token generation
      const token = generateToken(userFound._id, res)
      const userData = {
        userId: userFound._id,
        name: userFound.name,
        email: userFound.email,
        userType: userFound.userType,
        address: userFound.address,
        token: token,
      }

      res
        .status(200)
        .json(createResponse(true, 'Login successful', userData, null))
    } else {
      // Log failed login attempt when user not found

      res
        .status(401)
        .json(
          createResponse(false, 'Login failed', [], ['Invalid Credentials'])
        )
    }
  } catch (error) {
    console.log(error)

    res
      .status(500)
      .json(createResponse(false, 'Something went wrong', [], error.message))
  }
}

// // Deactivation by user
// export const deactivateByUser = async (req, res) => {
//   const userId = req.user._id
//   const username = req.user.username

//   try {
//     const deactivatedUser = await deactivationByUser(userId, username)
//     if (deactivatedUser) {
//       await updateDeactivationStatusInUser(userId)
//       res.cookie('jwt', '', { maxAge: 0 })
//       res.status(200).json(createResponse(true, 'user deactivated', [], ''))
//     } else {
//       res
//         .status(500)
//         .json(
//           createResponse(
//             false,
//             'something went wrong',
//             [],
//             'unable to deactivate account'
//           )
//         )
//     }
//   } catch (error) {
//     res
//       .status(500)
//       .json(createResponse(false, 'something went wrong', [], error.message))
//   }
// }

// Logout
export const logout = async (req, res) => {
  try {
    res.cookie('jwt', '', { maxAge: 0 })
    res.status(200).json(createResponse(true, 'logged out', [], null))
  } catch (error) {
    res
      .status(500)
      .json(createResponse(false, 'something went wrong', [], error.message))
  }
}
