import { Request, Response } from 'express';
import { EmpleadoModel, Empleado, CreateEmpleado } from '../../models/empleado.model';
import { createError, validationError } from '../middlewares/error.middleware';

export class EmpleadoController {
  // Obtener todos los empleados
  static async getAll(req: Request, res: Response): Promise<void> {
    try {
      const empleados = await EmpleadoModel.findAll();
      
      res.status(200).json({
        success: true,
        data: empleados,
        message: 'Empleados obtenidos exitosamente'
      });
    } catch (error) {
      console.error('Error al obtener empleados:', error);
      res.status(500).json({
        success: false,
        message: 'Error al obtener empleados'
      });
    }
  }

  // Obtener empleado por ID
  static async getById(req: Request, res: Response): Promise<void> {
    try {
      const idempleado = parseInt(req.params.id);
      
      if (isNaN(idempleado)) {
        res.status(400).json({
          success: false,
          message: 'ID de empleado inválido'
        });
        return;
      }

      const empleado = await EmpleadoModel.findById(idempleado);
      
      if (!empleado) {
        res.status(404).json({
          success: false,
          message: 'Empleado no encontrado'
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: empleado,
        message: 'Empleado obtenido exitosamente'
      });
    } catch (error) {
      console.error('Error al obtener empleado:', error);
      res.status(500).json({
        success: false,
        message: 'Error al obtener empleado'
      });
    }
  }

  // Crear nuevo empleado
  static async create(req: Request, res: Response): Promise<void> {
    try {
      const { nombre, fechaingreso, cargo, departamento, usuario_id } = req.body;

      // Validaciones básicas
      if (!nombre || !fechaingreso || !cargo || !departamento) {
        res.status(400).json({
          success: false,
          message: 'Nombre, fecha de ingreso, cargo y departamento son requeridos'
        });
        return;
      }

      // Validar formato de fecha
      const fecha = new Date(fechaingreso);
      if (isNaN(fecha.getTime())) {
        res.status(400).json({
          success: false,
          message: 'Formato de fecha inválido'
        });
        return;
      }

      const empleadoData: CreateEmpleado = {
        nombre,
        fechaingreso: fecha,
        cargo,
        departamento,
        usuario_id: usuario_id ? parseInt(usuario_id) : undefined
      };

      const idempleado = await EmpleadoModel.create(empleadoData);
      
      // Obtener el empleado creado
      const empleado = await EmpleadoModel.findById(idempleado);

      res.status(201).json({
        success: true,
        data: empleado,
        message: 'Empleado creado exitosamente'
      });
    } catch (error) {
      console.error('Error al crear empleado:', error);
      res.status(500).json({
        success: false,
        message: 'Error al crear empleado'
      });
    }
  }

  // Actualizar empleado
  static async update(req: Request, res: Response): Promise<void> {
    try {
      const idempleado = parseInt(req.params.id);
      
      if (isNaN(idempleado)) {
        res.status(400).json({
          success: false,
          message: 'ID de empleado inválido'
        });
        return;
      }

      const { nombre, fechaingreso, cargo, departamento, usuario_id } = req.body;

      // Verificar que el empleado existe
      const empleadoExistente = await EmpleadoModel.findById(idempleado);
      if (!empleadoExistente) {
        res.status(404).json({
          success: false,
          message: 'Empleado no encontrado'
        });
        return;
      }

      // Preparar datos para actualización
      const updateData: Partial<CreateEmpleado> = {};
      
      if (nombre) updateData.nombre = nombre;
      if (fechaingreso) {
        const fecha = new Date(fechaingreso);
        if (isNaN(fecha.getTime())) {
          res.status(400).json({
            success: false,
            message: 'Formato de fecha inválido'
          });
          return;
        }
        updateData.fechaingreso = fecha;
      }
      if (cargo) updateData.cargo = cargo;
      if (departamento) updateData.departamento = departamento;
      if (usuario_id !== undefined) updateData.usuario_id = parseInt(usuario_id);

      await EmpleadoModel.update(idempleado, updateData);
      
      // Obtener el empleado actualizado
      const empleado = await EmpleadoModel.findById(idempleado);

      res.status(200).json({
        success: true,
        data: empleado,
        message: 'Empleado actualizado exitosamente'
      });
    } catch (error) {
      console.error('Error al actualizar empleado:', error);
      res.status(500).json({
        success: false,
        message: 'Error al actualizar empleado'
      });
    }
  }

  // Eliminar empleado
  static async delete(req: Request, res: Response): Promise<void> {
    try {
      const idempleado = parseInt(req.params.id);
      
      if (isNaN(idempleado)) {
        res.status(400).json({
          success: false,
          message: 'ID de empleado inválido'
        });
        return;
      }

      // Verificar que el empleado existe
      const empleado = await EmpleadoModel.findById(idempleado);
      if (!empleado) {
        res.status(404).json({
          success: false,
          message: 'Empleado no encontrado'
        });
        return;
      }

      await EmpleadoModel.delete(idempleado);

      res.status(200).json({
        success: true,
        message: 'Empleado eliminado exitosamente'
      });
    } catch (error) {
      console.error('Error al eliminar empleado:', error);
      res.status(500).json({
        success: false,
        message: 'Error al eliminar empleado'
      });
    }
  }

  // Obtener sueldo simulado del empleado logeado
  static async getSueldoEmpleado(req: Request, res: Response): Promise<void> {
    try {
      // Obtener usuario logeado del JWT
      const user = req.user;
      if (!user) {
        res.status(401).json({ success: false, message: 'No autenticado' });
        return;
      }
      // Buscar empleado por usuario_id
      const empleado = await EmpleadoModel.findByUsuarioId(user.idusuario);
      if (!empleado) {
        res.status(404).json({ success: false, message: 'Empleado no encontrado para este usuario' });
        return;
      }
      // Leer filtros
      const { desde, hasta, mes, parametro } = req.query;
      // Simular datos
      const horasEstimadas = 160; // Simulado
      const horasTrabajadas = 150; // Simulado
      const sueldoBruto = 1000; // Simulado
      const sueldoLiquido = 900; // Simulado
      // Responder con el formato solicitado
      res.json([
        {
          id: empleado.idempleado,
          nombre: empleado.nombre,
          cargo: empleado.cargo,
          horasEstimadas,
          horasTrabajadas,
          sueldoBruto,
          sueldoLiquido
        }
      ]);
    } catch (error) {
      console.error('Error al obtener sueldo simulado:', error);
      res.status(500).json({ success: false, message: 'Error al obtener sueldo simulado' });
    }
  }
} 