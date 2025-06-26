import { query } from '../config/database';
import bcrypt from 'bcryptjs';

// Interfaz para el modelo Usuario
export interface Usuario {
  idusuario?: number;
  username: string;
  passwordhash: string;
  lastlogin?: Date;
  estado: string;
}

// Interfaz para login (sin passwordhash)
export interface UsuarioLogin {
  idusuario: number;
  username: string;
  lastlogin?: Date;
  estado: string;
}

// Clase para manejar operaciones de usuario
export class UsuarioModel {
  // Buscar usuario por username
  static async findByUsername(username: string): Promise<Usuario | null> {
    try {
      const sql = 'SELECT * FROM usuario WHERE username = ? AND estado = "activo"';
      const results = await query(sql, [username]);
      return results.length > 0 ? results[0] : null;
    } catch (error) {
      throw new Error(`Error al buscar usuario: ${error}`);
    }
  }

  // Buscar usuario por ID
  static async findById(idusuario: number): Promise<UsuarioLogin | null> {
    try {
      const sql = 'SELECT idusuario, username, lastlogin, estado FROM usuario WHERE idusuario = ? AND estado = "activo"';
      const results = await query(sql, [idusuario]);
      return results.length > 0 ? results[0] : null;
    } catch (error) {
      throw new Error(`Error al buscar usuario por ID: ${error}`);
    }
  }

  // Crear nuevo usuario
  static async create(usuario: Omit<Usuario, 'idusuario'>): Promise<number> {
    try {
      const sql = 'INSERT INTO usuario (username, passwordhash, estado) VALUES (?, ?, ?)';
      const result = await query(sql, [usuario.username, usuario.passwordhash, usuario.estado]);
      return result.insertId;
    } catch (error) {
      throw new Error(`Error al crear usuario: ${error}`);
    }
  }

  // Actualizar último login
  static async updateLastLogin(idusuario: number): Promise<void> {
    try {
      const sql = 'UPDATE usuario SET lastlogin = NOW() WHERE idusuario = ?';
      await query(sql, [idusuario]);
    } catch (error) {
      throw new Error(`Error al actualizar último login: ${error}`);
    }
  }

  // Verificar contraseña
  static async verifyPassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(plainPassword, hashedPassword);
  }

  // Hash de contraseña
  static async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }
} 