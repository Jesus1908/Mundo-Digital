const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

// Importar rutas
const rutaVideojuego = require('./routes/videojuego');
const rutaMarca = require('./routes/marca');
const rutaCategoria = require('./routes/categoria');

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Configuración de vistas
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use('/marcas', rutaMarca);   
app.use('/categorias', rutaCategoria);   
app.use('/', rutaVideojuego);       


app.listen(PORT, () => {
  console.log(`Servidor iniciado en http://localhost:${PORT}`);
});