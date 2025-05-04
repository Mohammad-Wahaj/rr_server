import { getUserById } from '../repositories/userRepository.js'
import { createResponse } from '../utils/responseHelper.js'
import jwt from 'jsonwebtoken'

export const protect = async (req, res, next) => {
  try {
    const token = req.cookies.jwt || req.headers.authorization?.split(' ')[1]

    if (!token) {
      return res
        .status(401)
        .json(createResponse(false, 'unauthorized', [], 'No token provided'))
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    if (!decoded) {
      return res
        .status(401)
        .json(createResponse(false, 'Unauthorized', [], 'Invalid Token'))
    }

    const user = await getUserById(decoded.userId)

    if (!user) {
      return res
        .status(401)
        .json(createResponse(false, 'Unauthorized', [], 'No user found'))
    }

    req.user = user
    next() // Proceed to the next middleware or route handler
  } catch (error) {
    res
      .status(500)
      .json(
        createResponse(
          false,
          'Internal server error',
          [],
          'Something went wrong'
        )
      )
  }
}
