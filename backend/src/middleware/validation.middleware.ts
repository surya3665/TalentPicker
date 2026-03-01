import { body, validationResult } from 'express-validator';
import type { Request, Response, NextFunction, RequestHandler } from 'express';
import { sendError } from '../utils/apiResponse';

export const handleValidationErrors = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const message = errors
      .array()
      .map((e) => e.msg as string)
      .join(', ');
    sendError(res, message, 400);
    return;
  }
  next();
};

export const registerValidation: RequestHandler[] = [
  body('name').trim().notEmpty().withMessage('Name is required').isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
  body('email').isEmail().withMessage('Valid email required').normalizeEmail(),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('role').isIn(['admin', 'company', 'candidate']).withMessage('Invalid role'),
  body('companyName')
    .if(body('role').equals('company'))
    .notEmpty()
    .withMessage('Company name is required for company accounts'),
  handleValidationErrors,
];

export const loginValidation: RequestHandler[] = [
  body('email').isEmail().withMessage('Valid email required').normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required'),
  handleValidationErrors,
];

export const createJobValidation: RequestHandler[] = [
  body('title').trim().notEmpty().withMessage('Job title is required'),
  body('description').trim().notEmpty().withMessage('Description is required'),
  body('location').trim().notEmpty().withMessage('Location is required'),
  body('salary').trim().notEmpty().withMessage('Salary is required'),
  body('type').isIn(['full-time', 'part-time', 'remote', 'internship']).withMessage('Invalid job type'),
  handleValidationErrors,
];