import express from 'express';
import { registerUser, loginUser, logoutUser, getMe } from '../controllers/userController.js';
import { protect } from '../middleware/auth.js';
import { validate, registerSchema, loginSchema } from '../validation/schemas.js';

const router = express.Router();

router.post('/register', validate(registerSchema), registerUser);
router.post('/login', validate(loginSchema), loginUser);
router.post('/logout', logoutUser);
router.get('/me', protect, getMe);

export default router;
