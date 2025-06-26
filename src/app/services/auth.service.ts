import jwt from 'jsonwebtoken';
import { UsuarioModel, UsuarioLogin } from '../../models/usuario.model';

// Interfaz para la respuesta de login
export interface LoginResponse {
  success: boolean;
  token?: string;
  user?: UsuarioLogin;
  message?: string;
}

// Interfaz para el payload del JWT
export interface JWTPayload {
  idusuario: number;
  username: string;
}

export class AuthService {
  private static readonly JWT_SECRET = process.env.JWT_SECRET || 'tu_secreto_jwt_super_seguro';
  private static readonly JWT_EXPIRES_IN = '24h';

  // Método para autenticar usuario
  static async login(username: string, password: string): Promise<LoginResponse> {
    try {
      // Buscar usuario por username
      const usuario = await UsuarioModel.findByUsername(username);
      
      if (!usuario) {
        return {
          success: false,
          message: 'Usuario no encontrado'
        };
      }

      // Verificar contraseña
      const isPasswordValid = await UsuarioModel.verifyPassword(password, usuario.passwordhash);
      
      if (!isPasswordValid) {
        return {
          success: false,
          message: 'Contraseña incorrecta'
        };
      }

      // Verificar que el usuario esté activo
      if (usuario.estado !== 'activo') {
        return {
          success: false,
          message: 'Usuario inactivo'
        };
      }

      // Actualizar último login
      await UsuarioModel.updateLastLogin(usuario.idusuario!);

      // Generar token JWT
      const payload: JWTPayload = {
        idusuario: usuario.idusuario!,
        username: usuario.username
      };

      const token = jwt.sign(payload, this.JWT_SECRET, {
        expiresIn: this.JWT_EXPIRES_IN
      });

      // Retornar respuesta exitosa
      return {
        success: true,
        token,
        user: {
          idusuario: usuario.idusuario!,
          username: usuario.username,
          lastlogin: usuario.lastlogin,
          estado: usuario.estado
        }
      };

    } catch (error) {
      console.error('Error en login:', error);
      return {
        success: false,
        message: 'Error interno del servidor'
      };
    }
  }

  // Método para verificar token JWT
  static async verifyToken(token: string): Promise<JWTPayload | null> {
    try {
      const decoded = jwt.verify(token, this.JWT_SECRET) as JWTPayload;
      
      // Verificar que el usuario aún existe y está activo
      const usuario = await UsuarioModel.findById(decoded.idusuario);
      if (!usuario || usuario.estado !== 'activo') {
        return null;
      }

      return decoded;
    } catch (error) {
      return null;
    }
  }

  // Método para obtener información del usuario desde el token
  static async getUserFromToken(token: string): Promise<UsuarioLogin | null> {
    try {
      const payload = await this.verifyToken(token);
      if (!payload) {
        return null;
      }

      return await UsuarioModel.findById(payload.idusuario);
    } catch (error) {
      return null;
    }
  }
} 