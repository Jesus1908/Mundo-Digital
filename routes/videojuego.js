const express = require('express');
const router = express.Router();
const db = require('../config/database');
const upload = require('../config/multer');
const fs = require('fs'); 
const path = require('path'); 

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
    
    // Manejo para errores de duplicados
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

// Ruta para mostrar el formulario d edit
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
router.post('/update/:id', upload.single('imagenNueva'), async (req, res) => {
  try {
    const { titulo, descripcion, precio, flanzamiento, peso, edadrec, idmarca, idcategoria, imagenActual } = req.body;
    let nuevaImagen = imagenActual; 
    
    if (req.file) {
      nuevaImagen = req.file.filename;

      const rutaImagenAnterior = path.join(__dirname, '../public/images/videojuegos', imagenActual);
      if (fs.existsSync(rutaImagenAnterior)) {
        fs.unlinkSync(rutaImagenAnterior);
      }
    }

    await db.query(
      `UPDATE videojuegos 
      SET idmarca = ?, idcategoria = ?, titulo = ?, descripcion = ?, precio = ?, flanzamiento = ?, edadrec = ?, peso = ?, imagen = ?
      WHERE idvideojuego = ?`,
      [idmarca, idcategoria, titulo, descripcion, parseFloat(precio), flanzamiento, edadrec, peso, nuevaImagen, req.params.id]
    );

    res.redirect('/');
  } catch (error) {
    res.redirect('/'); 
  }
});

router.get('/catalogo', async (req, res) => {
  try {
    const { titulo, marca, categoria } = req.query;

    let query = `
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
      WHERE 1=1
    `;

    const params = [];

    if (titulo) {
      query += ` AND C.titulo LIKE ?`;
      params.push(`%${titulo}%`);
    }

    if (marca) {
      query += ` AND M.marca = ?`;
      params.push(marca);
    }

    if (categoria) {
      query += ` AND CA.categoria = ?`;
      params.push(categoria);
    }

    const [videojuegos] = await db.query(query, params);

    const [marcas] = await db.query(`SELECT DISTINCT marca FROM marcas`);
    const [categorias] = await db.query(`SELECT DISTINCT categoria FROM categorias`);

    res.render('catalogo', { videojuegos, marcas, categorias });
  } catch (error) {
    console.error('Error al filtrar videojuegos:', error);
    res.status(500).send('Error al filtrar videojuegos');
  }
});

module.exports = router;
