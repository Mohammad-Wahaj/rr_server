import { body, check, validationResult } from 'express-validator'
import { createResponse } from '../utils/responseHelper.js'

export const validateRegistration = [
  // Validate firstname
  body('firstname')
    .notEmpty()
    .withMessage('First name is required')
    .isLength({ min: 2 })
    .withMessage('First name must be at least 2 characters long'),

  // Validate lastname
  body('lastname')
    .notEmpty()
    .withMessage('Last name is required')
    .isLength({ min: 2 })
    .withMessage('Last name must be at least 2 characters long'),

  // Validate username
  body('username')
    .notEmpty()
    .withMessage('Username is required')
    .isAlphanumeric()
    .withMessage('Username must be alphanumeric'),

  // Validate email
  body('email').isEmail().withMessage('Please provide a valid email address'),

  // Validate password
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),

  // Middleware to handle errors
  (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res
        .status(400)
        .json(
          createResponse(
            false,
            'one or more validation errors',
            [],
            errors.array()
          )
        )
    }
    next()
  },
]

export const validateLogin = [
  check('username')
    .notEmpty()
    .withMessage('Username is required')
    .isLength({ min: 3 })
    .withMessage('Username must be at least 3 characters long'),
  check('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res
        .status(400)
        .json(
          createResponse(
            false,
            'one or more validation errors',
            [],
            [errors.array()]
          )
        )
    }
    next()
  },
]

// Validation for following a user
export const validateFollow = [
  body('userToFollowId')
    .notEmpty()
    .withMessage('User ID to follow is required')
    .isMongoId()
    .withMessage('Invalid user ID format.'),
  (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res
        .status(400)
        .json(
          createResponse(
            false,
            'one or more validation errors',
            [],
            errors.array()
          )
        )
    }
    next()
  },
]

// Validation for unfollowing a user
export const validateUnfollow = [
  body('unfollowUserId')
    .notEmpty()
    .withMessage('User ID to unfollow is required')
    .isMongoId()
    .withMessage('Invalid user ID format.'),
  (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res
        .status(400)
        .json(
          createResponse(
            false,
            'one or more validation errors',
            [],
            errors.array()
          )
        )
    }
    next()
  },
]

export const validateSubscribeAndUnsubscribe = [
  body('creatorId')
    .notEmpty()
    .withMessage('Creator Id to unfollow is required')
    .isMongoId()
    .withMessage('Invalid creator Id format.'),
  (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res
        .status(400)
        .json(
          createResponse(
            false,
            'one or more validation errors',
            [],
            errors.array()
          )
        )
    }
    next()
  },
]
