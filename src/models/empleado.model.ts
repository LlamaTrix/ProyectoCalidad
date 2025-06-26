import { query } from '../config/database';

// Interfaz para el modelo Empleado
export interface Empleado {
  idempleado?: number;
  nombre: string;
  fechaingreso: Date;
  cargo: string;
  departamento: string;
  usuario_id?: number;
}

// Interfaz para crear empleado
export interface CreateEmpleado {
  nombre: string;
  fechaingreso: Date;
  cargo: string;
  departamento: string;
  usuario_id?: number;
}

// Clase para manejar operaciones de empleado
export class EmpleadoModel {
  // Obtener todos los empleados
  static async findAll(): Promise<Empleado[]> {
    try {
      const sql = `
        SELECT e.*, u.username 
        FROM empleado e 
        LEFT JOIN usuario u ON e.usuario_id = u.idusuario
        ORDER BY e.nombre
      `;
      const results = await query(sql);
      return results;
    } catch (error) {
      throw new Error(`Error al obtener empleados: ${error}`);
    }
  }

  // Buscar empleado por ID
  static async findById(idempleado: number): Promise<Empleado | null> {
    try {
      const sql = `
        SELECT e.*, u.username 
        FROM empleado e 
        LEFT JOIN usuario u ON e.usuario_id = u.idusuario
        WHERE e.idempleado = ?
      `;
      const results = await query(sql, [idempleado]);
      return results.length > 0 ? results[0] : null;
    } catch (error) {
      throw new Error(`Error al buscar empleado: ${error}`);
    }
  }

  // Buscar empleado por usuario_id
  static async findByUsuarioId(usuario_id: number): Promise<Empleado | null> {
    try {
      const sql = 'SELECT * FROM empleado WHERE usuario_id = ?';
      const results = await query(sql, [usuario_id]);
      return results.length > 0 ? results[0] : null;
    } catch (error) {
      throw new Error(`Error al buscar empleado por usuario: ${error}`);
    }
  }

  // Crear nuevo empleado
  static async create(empleado: CreateEmpleado): Promise<number> {
    try {
      const sql = 'INSERT INTO empleado (nombre, fechaingreso, cargo, departamento, usuario_id) VALUES (?, ?, ?, ?, ?)';
      const result = await query(sql, [
        empleado.nombre,
        empleado.fechaingreso,
        empleado.cargo,
        empleado.departamento,
        empleado.usuario_id
      ]);
      return result.insertId;
    } catch (error) {
      throw new Error(`Error al crear empleado: ${error}`);
    }
  }

  // Actualizar empleado
  static async update(idempleado: number, empleado: Partial<CreateEmpleado>): Promise<void> {
    try {
      const fields = [];
      const values = [];
      
      if (empleado.nombre) {
        fields.push('nombre = ?');
        values.push(empleado.nombre);
      }
      if (empleado.fechaingreso) {
        fields.push('fechaingreso = ?');
        values.push(empleado.fechaingreso);
      }
      if (empleado.cargo) {
        fields.push('cargo = ?');
        values.push(empleado.cargo);
      }
      if (empleado.departamento) {
        fields.push('departamento = ?');
        values.push(empleado.departamento);
      }
      if (empleado.usuario_id !== undefined) {
        fields.push('usuario_id = ?');
        values.push(empleado.usuario_id);
      }

      if (fields.length === 0) {
        throw new Error('No hay campos para actualizar');
      }

      values.push(idempleado);
      const sql = `UPDATE empleado SET ${fields.join(', ')} WHERE idempleado = ?`;
      await query(sql, values);
    } catch (error) {
      throw new Error(`Error al actualizar empleado: ${error}`);
    }
  }

  // Eliminar empleado
  static async delete(idempleado: number): Promise<void> {
    try {
      const sql = 'DELETE FROM empleado WHERE idempleado = ?';
      await query(sql, [idempleado]);
    } catch (error) {
      throw new Error(`Error al eliminar empleado: ${error}`);
    }
  }
} 