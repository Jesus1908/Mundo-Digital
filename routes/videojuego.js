const express = require('express');
const router = express.Router();
const db = require('../config/database');
const upload = require('../config/multer');
const fs = require('fs'); 
const path = require('path'); // Agrega esto al inicio del archivo

//ruta para obtener el total de registros en home
router.get('/', async (req, res) => {
  try {
    const [vjuegosResult] = await db.query('SELECT COUNT(*) AS total FROM videojuegos');
    const totalJuegos = vjuegosResult[0].total;

    const [marcasResult] = await db.query('SELECT COUNT(*) AS total FROM marcas');
    const totalMarcas = marcasResult[0].total;

    const [categoriasResult] = await db.query('SELECT COUNT(*) AS total FROM categorias');
    const totalCategorias = categoriasResult[0].total;
    res.render('home', { 
      total: totalJuegos, 
      totalmarcas: totalMarcas, 
      totalcategorias : totalCategorias
    });

  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('Error al cargar los datos');
  }
});

// Ruta para el litado de registros 
router.get('/index', async (req, res) => {
  try {
    const query = `
      SELECT 
        C.idvideojuego,
        C.titulo,
        C.descripcion,
        C.precio,
        C.flanzamiento,
        C.peso,
        C.edadrec,
        C.imagen,
        M.marca,
        CA.categoria
      FROM videojuegos C
      INNER JOIN marcas M ON C.idmarca = M.idmarca
      INNER JOIN categorias CA ON C.idcategoria = CA.idcategoria
    `;
    const [videojuegos] = await db.query(query);
    res.render('index', { videojuegos });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al obtener los videojuegos');
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

// Guardar nuevo videojuego
router.post('/create', upload.single('imagen'), async (req, res) => {
  try {
    const { titulo, descripcion, precio, flanzamiento, peso, edadrec, idmarca, idcategoria } = req.body;
    const imagen = req.file ? req.file.filename : null;

    await db.query(
      `INSERT INTO videojuegos 
      (titulo, descripcion, precio, flanzamiento, peso, edadrec, idmarca, idcategoria, imagen) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [titulo, descripcion, parseFloat(precio), flanzamiento, peso, parseInt(edadrec), idmarca, idcategoria, imagen]
    );

    res.redirect('/index');
  } catch (error) {
    console.error('Error al registrar videojuego:', error);
    
    // Manejo específico para errores de duplicados
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).render('videojuegos/create', {
        error: 'Este videojuego ya existe',
        marcas: await getMarcas(),
        categorias: await getCategorias(),
        oldInput: req.body
      });
    }

    res.status(500).render('videojuegos/create', {
      error: 'Error interno al registrar el videojuego',
      marcas: await getMarcas(),
      categorias: await getCategorias()
    });
  }
});


//Eliminar registro
router.get('/delete/:id', async (req, res) => {
  try {
    await db.query("DELETE FROM videojuegos WHERE idvideojuego = ?", [req.params.id]);
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
    const [registro] = await db.query("SELECT * FROM videojuegos WHERE idvideojuego = ?", [req.params.id]);
    if (registro.length > 0) {
      res.render('edit', {
        marcas,
        categorias,
        videojuego: registro[0]
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

router.post('/update/:id', upload.single('imagen'), async (req, res) => {
  try {
    const { 
      idmarca, 
      idcategoria, 
      titulo, 
      descripcion, 
      precio, 
      flanzamiento, 
      edadrec, 
      peso 
    } = req.body;
    
    let imagen = req.file ? req.file.filename : req.body.imagenActual;

    // Manejo de la imagen anterior si se sube una nueva
    if (req.file) {
      const [oldVideojuego] = await db.query('SELECT imagen FROM videojuegos WHERE idvideojuego = ?', [req.params.id]);
      if (oldVideojuego[0].imagen) {
        const oldImagePath = path.join(uploadPath, oldVideojuego[0].imagen);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
    }

    // Realizar la actualización
    await db.query(`
      UPDATE videojuegos 
      SET 
        idmarca = ?, 
        idcategoria = ?, 
        titulo = ?, 
        descripcion = ?, 
        precio = ?, 
        flanzamiento = ?, 
        edadrec = ?, 
        peso = ?, 
        imagen = ?
      WHERE idvideojuego = ?`,
      [
        idmarca,
        idcategoria,
        titulo,
        descripcion,
        precio,
        flanzamiento,
        edadrec,
        peso,
        imagen,
        req.params.id
      ]
    );
    
    res.redirect('/videojuegos'); // Redirige al listado de videojuegos
  } catch (error) {
    console.error('Error al editar videojuego:', error);
    res.status(500).send('Error del servidor');
  }
});


module.exports = router;
