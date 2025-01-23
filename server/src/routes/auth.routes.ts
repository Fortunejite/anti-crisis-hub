import { Router } from 'express';
import { register, login, getProfile } from '@/controllers/auth.controller';
import { auth } from '@/middlewares/authorization';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.get('/profile', auth, getProfile);

export default router;
