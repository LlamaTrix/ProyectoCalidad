# Proyecto Calidad - Backend

Sistema de gestión de empleados y nómina con autenticación JWT y arquitectura de 3 capas.

## Características

- ✅ **Autenticación JWT**: Login seguro con tokens
- ✅ **Control de acceso**: Middleware para proteger rutas
- ✅ **Arquitectura de 3 capas**: Modelos, Servicios, Controladores
- ✅ **MySQL**: Base de datos con pool de conexiones
- ✅ **Manejo de errores**: Centralizado y consistente
- ✅ **TypeScript**: Tipado estático para mayor seguridad

## Requisitos

- Node.js (v14 o superior)
- MySQL (v8.0 o superior)
- TypeScript

## Instalación

1. **Clonar el repositorio**
```bash
git clone <url-del-repositorio>
cd ProyectoCalidad
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar base de datos**
   - Crear la base de datos MySQL con el esquema proporcionado
   - Configurar variables de entorno (ver sección Configuración)

4. **Compilar TypeScript**
```bash
npm run build
```

5. **Ejecutar el servidor**
```bash
# Desarrollo
npm run dev

# Producción
npm start
```

## Configuración

Crear un archivo `.env` en la raíz del proyecto:

```env
# Base de datos
DB_HOST=localhost
DB_USER=tu_usuario
DB_PASS=tu_password
DB_NAME=proyecto_calidad

# JWT
JWT_SECRET=tu_secreto_jwt_super_seguro

# Servidor
PORT=3000
NODE_ENV=development
```

## Estructura del Proyecto

```
src/
├── config/
│   └── database.ts          # Configuración de MySQL
├── models/
│   ├── usuario.model.ts     # Modelo de usuario
│   └── empleado.model.ts    # Modelo de empleado
├── app/
│   ├── controllers/
│   │   ├── auth.controller.ts
│   │   └── empleado.controller.ts
│   ├── services/
│   │   └── auth.service.ts
│   ├── middlewares/
│   │   ├── auth.middleware.ts
│   │   └── error.middleware.ts
│   └── routes/
│       ├── auth.routes.ts
│       └── empleado.routes.ts
├── views/                   # Vistas EJS
└── app.ts                   # Aplicación principal
```

## API Endpoints

### Autenticación
- `POST /api/auth/login` - Login de usuario
- `GET /api/auth/verify` - Verificar token
- `POST /api/auth/logout` - Logout

### Empleados (Protegido)
- `GET /api/empleados` - Obtener todos los empleados
- `GET /api/empleados/:id` - Obtener empleado por ID
- `POST /api/empleados` - Crear empleado
- `PUT /api/empleados/:id` - Actualizar empleado
- `DELETE /api/empleados/:id` - Eliminar empleado

## Uso de la API

### Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "admin", "password": "password123"}'
```

### Acceso a rutas protegidas
```bash
curl -X GET http://localhost:3000/api/empleados \
  -H "Authorization: Bearer TU_TOKEN_JWT"
```

## Flujo de Autenticación

1. **Frontend** envía credenciales a `/api/auth/login`
2. **Backend** valida credenciales y devuelve JWT
3. **Frontend** guarda el token (localStorage/cookies)
4. **Frontend** envía token en header `Authorization: Bearer <token>`
5. **Backend** valida token en cada request protegida
6. Si token es válido → permite acceso, si no → responde 401

## Próximos Pasos

- [ ] Implementar modelos para Kardex
- [ ] Implementar modelos para Nómina
- [ ] Agregar sistema de roles y permisos
- [ ] Implementar cálculo automático de nómina
- [ ] Agregar validaciones más robustas
- [ ] Implementar logs de auditoría

## Scripts Disponibles

- `npm run dev` - Ejecutar en modo desarrollo
- `npm run build` - Compilar TypeScript
- `npm start` - Ejecutar en producción 