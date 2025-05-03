const express = require('express');
const router = express.Router();
const db = require('../config/database');

router.get('/', async (req, res) => {
    try {
      const query = `
        SELECT * FROM categorias
      `;
      const [categorias] = await db.query(query);
      res.render('categorias/index', { categorias });
    } catch (error) {
      console.error(error);
      res.status(500).send('Error al obtener las categorias');
    }
  });

router.get('/create', (req, res) => {
    res.render('categorias/create');
  });
  
router.post('/create', async (req, res) => {
    try {
      const { categoria } = req.body;
      await db.query("INSERT INTO categorias (categoria) VALUES (?)", [categoria]);
      res.redirect('/categorias'); 
    } catch (error) {
      console.error(error);
      res.status(500).send('Error al guardar');
    }
  });

router.get('/delete/:id', async (req, res) => {
    try {
      await db.query("DELETE FROM categorias WHERE idcategoria = ?", [req.params.id]);
      res.redirect('/categorias');
    } catch (error) {
      console.error(error);// Redirige 
    }
  });

// Ruta para dirigir al formulario edit
router.get('/edit/:id', async(req, res) => {
  try {
    const [categorias] = await db.query("SELECT * FROM categorias");
    const [registro] = await db.query("SELECT * FROM categorias WHERE idcategoria = ?", [req.params.id]);
    
    if(registro.length > 0) {
      res.render('categorias/edit', { 
        categorias: categorias, 
        categoria: registro[0] 
      });
    } else {
      res.redirect('/categorias');
    }
  } catch(error) {
    console.error(error);
    res.redirect('/categorias');
  }
});

// Proceso de actualización
router.post('/edit/:id', async(req, res) => {
  try {
    const { categoria } = req.body;
    await db.query(
      "UPDATE categorias SET categoria = ? WHERE idcategoria = ?",
      [categoria, req.params.id]
    );
    
    res.redirect('/categorias');
  } catch(error) {
    console.error(error);
    res.redirect(`/categorias/edit/${req.params.id}`);
  }
});
module.exports = router;
