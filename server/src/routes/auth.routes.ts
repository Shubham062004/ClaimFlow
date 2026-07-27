import { Router } from 'express';
import { login, register, logout, getMe } from '../controllers/auth.controller.js';
import { loginValidation, registerValidation } from '../validators/auth.validator.js';
import { validateRequest } from '../middleware/validation.middleware.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = Router();

router.post('/login', loginValidation, validateRequest, login);
router.post('/register', registerValidation, validateRequest, register);
router.post('/logout', logout);
router.get('/me', authenticate, getMe);

export default router;
