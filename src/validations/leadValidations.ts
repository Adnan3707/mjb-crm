
import { body, query, validationResult } from "express-validator";
import { NextFunction, Request, Response } from "express";
import HttpStatus from '../constant/httpStatus';

export const validateCreateLead = [
  body("value")
    .notEmpty().withMessage('Value is required')
    .custom(value => {
      if (!/^\d+$/.test(value)) {
        throw new Error('Value must contain only numbers');
      }
      return true; // Return true if validation passes
    }),
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(HttpStatus.BAD_REQUEST).json({ errors: errors.array() });
    }
    next();
  },
];
export{}