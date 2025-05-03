const express = require('express');
const router = express.Router();
const db = require('../config/database');

router.get('/', async (req, res) => {
    try {
      const query = `
        SELECT * FROM marcas
      `;
      const [marcas] = await db.query(query);
      res.render('marcas/index', { marcas });
    } catch (error) {
      console.error(error);
      res.status(500).send('Error al obtener las marcas');
    }
  });

router.get('/create', (req, res) => {
    res.render('marcas/create');
  });
  
  // Guardar marca 
router.post('/create', async (req, res) => {
    try {
      const { marca } = req.body;
      await db.query("INSERT INTO marcas (marca) VALUES (?)", [marca]);
      res.redirect('/marcas'); 
    } catch (error) {
      console.error(error);
      res.status(500).send('Error al guardar');
    }
  });

// Eliminar marca 
router.get('/delete/:id', async (req, res) => {
    try {
      await db.query("DELETE FROM marcas WHERE idmarca = ?", [req.params.id]);
      res.redirect('/marcas');
    } catch (error) {
      console.error(error);
    }
  });

router.get('/edit/:id', async(req, res) => {
  try {
    const [marcas] = await db.query("SELECT * FROM marcas");
    const [registro] = await db.query("SELECT * FROM marcas WHERE idmarca = ?", [req.params.id]);
    
    if(registro.length > 0) {
      res.render('marcas/edit', { 
        marcas: marcas, 
        marca: registro[0] 
      });
    } else {
      res.redirect('/marcas');
    }
  } catch(error) {
    console.error(error);
    res.redirect('/marcas');
  }
});

// Proceso de actualización
router.post('/edit/:id', async(req, res) => {
  try {
    const { marca } = req.body;
    
    await db.query(
      "UPDATE marcas SET marca = ? WHERE idmarca = ?",
      [marca, req.params.id]
    );
    
    res.redirect('/marcas');
  } catch(error) {
    console.error(error);
    res.redirect(`/marcas/edit/${req.params.id}`);
  }
});
module.exports = router;
