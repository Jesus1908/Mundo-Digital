// routes/consola.js
const express = require('express');
const router = express.Router();
const db = require('../config/database'); 

router.get('/', async (req, res) => {
  try {
    const query = `
      SELECT 
        C.idconsola,
        C.nombre,
        C.descripcion,
        C.precio,
        C.modelo,
        C.alanzamiento,
        C.almacenamiento,
        C.sonido,
        C.peso,
        M.marca,
        CA.categoria
      FROM consolas C
      INNER JOIN marcas M ON C.idmarca = M.idmarca
      INNER JOIN categorias CA ON C.idcategoria = CA.idcategoria
    `;
    const [consolas] = await db.query(query);
    res.render('index', { consolas });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al obtener las consolas');
  }
});

//ruta para mostrar el formulario
router.get('/create', async (req, res) => {
  try {
    const [marcas] = await db.query("SELECT * FROM marcas");
    const [categorias] = await db.query("SELECT * FROM categorias");
    res.render('create', { marcas, categorias });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al cargar formulario de creación');
  }
});

//Guardar nuevo registro
router.post('/create', async (req, res) => {
  try {
    const { nombre, descripcion, precio, modelo, alanzamiento, almacenamiento, sonido, peso, idmarca, idcategoria } = req.body;
    
    await db.query(
      `INSERT INTO consolas 
        (nombre, descripcion, precio, modelo, alanzamiento, almacenamiento, sonido, peso, idmarca, idcategoria) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [nombre, descripcion, precio, modelo, alanzamiento, almacenamiento, sonido, peso, idmarca, idcategoria]
    );

    res.redirect('/');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al registrar la consola');
  }
});


module.exports = router;
