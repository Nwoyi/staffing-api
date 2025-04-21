const express = require('express');
const { body, param, query } = require('express-validator');
const { validateRequest } = require('../middleware/validation');
const staffController = require('../controllers/staff.controller');

const router = express.Router();

// Validation schemas
const createStaffSchema = [
  body('firstName').notEmpty().withMessage('First name is required'),
  body('lastName').notEmpty().withMessage('Last name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('position').notEmpty().withMessage('Position is required'),
  body('department').optional().isString(),
];

const updateStaffSchema = [
  param('id').isUUID().withMessage('Valid UUID is required'),
  body('firstName').optional().isString(),
  body('lastName').optional().isString(),
  body('email').optional().isEmail(),
  body('position').optional().isString(),
  body('department').optional().isString(),
  body('status').optional().isIn(['active', 'inactive', 'on_leave']),
];

const getStaffSchema = [
  param('id').isUUID().withMessage('Valid UUID is required'),
];

const listStaffSchema = [
  query('page').optional().isInt({ min: 1 }).toInt(),
  query('limit').optional().isInt({ min: 1, max: 100 }).toInt(),
];

// Routes
router.post('/', createStaffSchema, validateRequest, staffController.createStaff);
router.get('/', listStaffSchema, validateRequest, staffController.listStaff);
router.get('/:id', getStaffSchema, validateRequest, staffController.getStaffById);
router.put('/:id', updateStaffSchema, validateRequest, staffController.updateStaff);
router.delete('/:id', getStaffSchema, validateRequest, staffController.deleteStaff);

module.exports = router; 