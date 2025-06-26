// src/app.ts
import express from "express";
import path from "path";
import { errorHandler, notFoundHandler } from "./app/middlewares/error.middleware";

// Importar rutas
import authRoutes from "./app/routes/auth.routes";
import empleadoRoutes from "./app/routes/empleado.routes";

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware para parsear JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 1. Motor de vistas
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// 2. Servir estáticos desde /public
app.use(express.static(path.join(__dirname, "../public")));

// 3. Rutas de la API
app.use("/api/auth", authRoutes);
app.use("/api/empleados", empleadoRoutes);

// 4. Ruta principal (frontend)
app.get("/", (_req, res) => {
  res.render("index", { titulo: "Home" });
});

// 5. Middleware para manejar rutas no encontradas
app.use(notFoundHandler);

// 6. Middleware para manejar errores (debe ir al final)
app.use(errorHandler);

app.listen(PORT, () => console.log(`Servidor en http://localhost:${PORT}`));

export default app;
