const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const db = require('../config/database');


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../public/images/consolas')); //ruta donde se van a guardar las imagenes enviadas en el formulario
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname).toLowerCase());
  }
});
const upload = multer({ storage: storage });

//ruta para obtener el total de registros en home
router.get('/', async (req, res) => {
  try {
    const [result] = await db.query('SELECT COUNT(*) AS total FROM consolas');
    res.render('home', { total: result[0].total });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error');
  }
});

// Ruta para el litado de registros 
router.get('/index', async (req, res) => {
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
        CA.categoria,
        C.imagen
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

// Ruta para mostrar el formulario de registros
router.get('/create', async (req, res) => {
  try {
    const [marcas] = await db.query("SELECT * FROM marcas");
    const [categorias] = await db.query("SELECT * FROM categorias");
    res.render('create', { marcas, categorias });
  } catch (error) {
    console.error('Error al cargar el formulario de creación:', error);
    res.status(500).send('Error al cargar formulario');
  }
});

// Guardar nuevo registro
router.post('/create', upload.single('imagen'), async (req, res) => {
  try {
    const { nombre, descripcion, precio, modelo, alanzamiento, almacenamiento, sonido, peso, idmarca, idcategoria } = req.body;
    const imagen = req.file ? req.file.filename : null;
    await db.query(
      `INSERT INTO consolas 
        (nombre, descripcion, precio, modelo, alanzamiento, almacenamiento, sonido, peso, idmarca, idcategoria, imagen) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [nombre, descripcion, precio, modelo, alanzamiento, almacenamiento, sonido, peso, idmarca, idcategoria, imagen]
    );
    res.redirect('/index');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al registrar la consola');
  }
});

//Eliminar registro
router.get('/delete/:id', async (req, res) => {
  try {
    await db.query("DELETE FROM consolas WHERE idconsola = ?", [req.params.id]);
    res.redirect('/index');
  } catch (error) {
    console.error(error);
  }
});

// Ruta para mostrar el formulario y editar
router.get('/edit/:id', async (req, res) => {
  try {
    const [marcas] = await db.query("SELECT * FROM marcas");
    const [categorias] = await db.query("SELECT * FROM categorias");
    const [registro] = await db.query("SELECT * FROM consolas WHERE idconsola = ?", [req.params.id]);
    if (registro.length > 0) {
      res.render('edit', {
        marcas,
        categorias,
        consola: registro[0]
      });
    } else {
      res.redirect('/index');
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Error al cargar el formulario de edición");
  }
});


// Ruta para guardar las imágenes subidas
const uploadPath = path.join(__dirname, 'public', 'images'); 

router.post('/edit/:id', upload.single('imagen'), async (req, res) => {
  try {
    const { idmarca, idcategoria, nombre, modelo, descripcion, precio, alanzamiento, almacenamiento, sonido, peso, imagen } = req.body;
    if (!imagen) {
      const [oldConsola] = await db.query('SELECT imagen FROM consolas WHERE idconsola = ?', [req.params.id]);
      imagen = oldConsola[0].imagen;
    } else {
      const [oldConsola] = await db.query('SELECT imagen FROM consolas WHERE idconsola = ?', [req.params.id]);
      const oldImagePath = path.join(uploadPath, oldConsola[0].imagen);
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath); 
      }
    }

    // Realizar la actualización
    await db.query(`
      UPDATE consolas 
      SET idmarca = ?, idcategoria = ?, nombre = ?, modelo = ?, descripcion = ?, 
          precio = ?, alanzamiento = ?, almacenamiento = ?, sonido = ?, peso = ?, imagen = ?
      WHERE idconsola = ?`,
      [
        idmarca,
        idcategoria,
        nombre,
        modelo,
        descripcion,
        precio,
        alanzamiento,
        almacenamiento,
        sonido,
        peso,
        imagen,
        req.params.id
      ]
    );
    res.redirect('/index');
  } catch (error) {
    console.error('Error al editar consola:', error);
    res.status(500).send('Error del servidor');
  }
});


// Ruta para mostrar el catálogo
router.get('/catalogo', async (req, res) => {
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
        CA.categoria,
        C.imagen
      FROM consolas C
      INNER JOIN marcas M ON C.idmarca = M.idmarca
      INNER JOIN categorias CA ON C.idcategoria = CA.idcategoria
    `;
    
    const [consolas] = await db.query(query);
    res.render('catalogo', { consolas });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al obtener el catálogo');
  }
});

module.exports = router;
