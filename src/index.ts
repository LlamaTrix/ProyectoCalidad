import express, { Request, Response } from 'express';

const app = express();
const PORT = 3000;

// Middleware para parsear JSON
app.use(express.json());

// Ruta principal
app.get('/', (req: Request, res: Response) => {
  res.send('¡Hola mundo desde Express con TypeScript!');
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
