// routes/consola.js
const express = require('express');
const router = express.Router();
const db = require('../config/database'); // Asegúrate de tener un archivo db.js que maneje la conexión

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

module.exports = router;
