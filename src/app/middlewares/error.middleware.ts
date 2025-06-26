import { Request, Response, NextFunction } from 'express';

// Interfaz para errores personalizados
export interface AppError extends Error {
  statusCode?: number;
  isOperational?: boolean;
  code?: string; // Para errores de MySQL
}

// Clase para errores personalizados
export class CustomError extends Error implements AppError {
  public statusCode: number;
  public isOperational: boolean;

  constructor(message: string, statusCode: number = 500) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

// Middleware para manejar errores
export const errorHandler = (
  error: AppError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  let { statusCode = 500, message } = error;

  // Si es un error de MySQL, personalizar el mensaje
  if (error.code === 'ER_DUP_ENTRY') {
    statusCode = 409;
    message = 'El registro ya existe';
  } else if (error.code === 'ER_NO_REFERENCED_ROW_2') {
    statusCode = 400;
    message = 'Referencia inválida en la base de datos';
  } else if (error.code === 'ER_ROW_IS_REFERENCED_2') {
    statusCode = 400;
    message = 'No se puede eliminar el registro porque está siendo referenciado';
  }

  // Log del error para debugging
  console.error('Error:', {
    message: error.message,
    stack: error.stack,
    url: req.url,
    method: req.method,
    body: req.body,
    params: req.params,
    query: req.query,
    user: req.user
  });

  // Respuesta de error
  res.status(statusCode).json({
    success: false,
    message: message || 'Error interno del servidor',
    ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
  });
};

// Middleware para manejar rutas no encontradas
export const notFoundHandler = (req: Request, res: Response): void => {
  res.status(404).json({
    success: false,
    message: `Ruta ${req.originalUrl} no encontrada`
  });
};

// Función para crear errores personalizados
export const createError = (message: string, statusCode: number = 500): CustomError => {
  return new CustomError(message, statusCode);
};

// Función para manejar errores de validación
export const validationError = (message: string): CustomError => {
  return new CustomError(message, 400);
};

// Función para manejar errores de autenticación
export const authError = (message: string = 'No autorizado'): CustomError => {
  return new CustomError(message, 401);
};

// Función para manejar errores de permisos
export const forbiddenError = (message: string = 'Acceso denegado'): CustomError => {
  return new CustomError(message, 403);
}; 