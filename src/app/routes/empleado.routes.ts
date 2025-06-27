import { Router } from 'express';
import { EmpleadoController } from '../controllers/empleado.controller';
import { AuthMiddleware } from '../middlewares/auth.middleware';

const router = Router();

// Todas las rutas de empleados requieren autenticación
router.use(AuthMiddleware.authenticate);

// Obtener todos los empleados
router.get('/', EmpleadoController.getAll);

// Obtener empleado por ID
router.get('/:id', EmpleadoController.getById);

// Crear nuevo empleado
router.post('/', EmpleadoController.create);

// Actualizar empleado
router.put('/:id', EmpleadoController.update);

// Eliminar empleado
router.delete('/:id', EmpleadoController.delete);

// Obtener sueldo simulado del empleado logeado
router.get('/sueldoempleado', EmpleadoController.getSueldoEmpleado);

export default router; 