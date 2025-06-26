import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { AuthMiddleware } from '../middlewares/auth.middleware';

const router = Router();

// Ruta para login (POST /auth/login)
router.post('/login', AuthController.login);

// Ruta para verificar token (GET /auth/verify)
router.get('/verify', AuthMiddleware.authenticate, AuthController.verifyToken);

// Ruta para logout (POST /auth/logout)
router.post('/logout', AuthMiddleware.authenticate, AuthController.logout);

export default router; 