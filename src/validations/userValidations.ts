import { NextFunction, Request, Response } from "express";
 import { body } from "express-validator";
 import { ERROR_MESSAGE } from "../constant/messages/user";




export const validateCreateUser = [
     body('email_id').notEmpty().withMessage('Email Id is required'),
    body('phone_number').notEmpty().withMessage('Phone Number is required'),

]

export const loginValidator = [
    // Validate email field
    body('email_id')
        .notEmpty()
        .withMessage(ERROR_MESSAGE.EMAIL_REQUIRED_)
        .bail()
        .isEmail()
        .withMessage(ERROR_MESSAGE.INVALID_EMAIL)
    ,
    // Validate password field
    body('password')
        .notEmpty()
        .withMessage(ERROR_MESSAGE.PASSWORD_REQUIRED),
]

