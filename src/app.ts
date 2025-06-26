// src/server.ts
import express from "express";
import path from "path";

const app = express();
const PORT = process.env.PORT || 3000;

// 1. Motor de vistas
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// 2. Servir estáticos desde /public
app.use(express.static(path.join(__dirname, "../public")));

// 3. Ruta principal
app.get("/", (_req, res) => {
  res.render("index", { titulo: "Home" });
});

app.listen(PORT, () => console.log(`Servidor en http://localhost:${PORT}`));
