import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';

export class AuthController {
  // Método para manejar el login
  static async login(req: Request, res: Response): Promise<void> {
    try {
      const { username, password } = req.body;

      // Validar que se proporcionen username y password
      if (!username || !password) {
        res.status(400).json({
          success: false,
          message: 'Username y password son requeridos'
        });
        return;
      }

      // Intentar autenticar
      const result = await AuthService.login(username, password);

      if (result.success) {
        // Login exitoso
        res.status(200).json({
          success: true,
          token: result.token,
          user: result.user,
          message: 'Login exitoso'
        });
      } else {
        // Login fallido
        res.status(401).json({
          success: false,
          message: result.message || 'Credenciales inválidas'
        });
      }

    } catch (error) {
      console.error('Error en controlador de login:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  }

  // Método para verificar si el token es válido
  static async verifyToken(req: Request, res: Response): Promise<void> {
    try {
      const token = req.headers.authorization?.replace('Bearer ', '');

      if (!token) {
        res.status(401).json({
          success: false,
          message: 'Token no proporcionado'
        });
        return;
      }

      const user = await AuthService.getUserFromToken(token);

      if (user) {
        res.status(200).json({
          success: true,
          user,
          message: 'Token válido'
        });
      } else {
        res.status(401).json({
          success: false,
          message: 'Token inválido o expirado'
        });
      }

    } catch (error) {
      console.error('Error al verificar token:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  }

  // Método para logout (opcional, ya que JWT es stateless)
  static async logout(req: Request, res: Response): Promise<void> {
    try {
      // En una implementación más avanzada, podrías agregar el token a una blacklist
      res.status(200).json({
        success: true,
        message: 'Logout exitoso'
      });
    } catch (error) {
      console.error('Error en logout:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  }
} 