const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

// Acceso a rutas
const rutaConsola = require('./routes/consola');

// Iniciar la App
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Motor de plantillas
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Configuración rutas
app.use('/', rutaConsola); // Ruta principal que muestra consolas

// Servidor Web
app.listen(PORT, () => {
  console.log(`Servidor iniciado en http://localhost:${PORT}`);
});
