import { Request, Response, NextFunction } from 'express';
import { AuthService, JWTPayload } from '../services/auth.service';

// Extender la interfaz Request para incluir el usuario autenticado
declare global {
  namespace Express {
    interface Request {
      user?: JWTPayload;
    }
  }
}

export class AuthMiddleware {
  // Middleware para verificar autenticación
  static async authenticate(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // Obtener el token del header Authorization
      const authHeader = req.headers.authorization;
      
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(401).json({
          success: false,
          message: 'Token de autenticación requerido'
        });
        return;
      }

      // Extraer el token (remover 'Bearer ')
      const token = authHeader.substring(7);

      // Verificar el token
      const payload = await AuthService.verifyToken(token);
      
      if (!payload) {
        res.status(401).json({
          success: false,
          message: 'Token inválido o expirado'
        });
        return;
      }

      // Agregar la información del usuario a la request
      req.user = payload;
      
      // Continuar al siguiente middleware o controlador
      next();

    } catch (error) {
      console.error('Error en middleware de autenticación:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  }

  // Middleware opcional para verificar autenticación (no bloquea si no hay token)
  static async optionalAuth(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const authHeader = req.headers.authorization;
      
      if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.substring(7);
        const payload = await AuthService.verifyToken(token);
        
        if (payload) {
          req.user = payload;
        }
      }
      
      next();
    } catch (error) {
      // En este caso, no bloqueamos la request si hay error
      next();
    }
  }

  // Middleware para verificar roles específicos (ejemplo para futuras implementaciones)
  static requireRole(roles: string[]) {
    return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      try {
        // Primero verificar autenticación
        if (!req.user) {
          res.status(401).json({
            success: false,
            message: 'Autenticación requerida'
          });
          return;
        }

        // Aquí podrías verificar roles desde la base de datos
        // Por ahora, solo verificamos que el usuario esté autenticado
        // En una implementación completa, verificarías los roles del usuario
        
        next();
      } catch (error) {
        console.error('Error en middleware de roles:', error);
        res.status(500).json({
          success: false,
          message: 'Error interno del servidor'
        });
      }
    };
  }
} 