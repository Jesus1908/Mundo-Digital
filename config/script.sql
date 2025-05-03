CREATE DATABASE mundodigital;
USE mundodigital;

CREATE TABLE marcas(
  idmarca   INT PRIMARY KEY AUTO_INCREMENT,
  marca     VARCHAR(50) NOT NULL		
) ENGINE = INNODB;

CREATE TABLE categorias( 
  idcategoria	 INT PRIMARY KEY AUTO_INCREMENT,
  categoria		 VARCHAR(50) NOT NULL
) ENGINE = INNODB;

CREATE TABLE videojuegos(
  idvideojuego          INT PRIMARY KEY AUTO_INCREMENT,
  titulo                VARCHAR(100) NOT NULL,
  descripcion           VARCHAR(180) NOT NULL,
  precio                DECIMAL(10,2) NOT NULL,
  flanzamiento          CHAR(4) NOT NULL,
  peso                  VARCHAR(50) NOT NULL,
  edadrec				INT NOT NULL,		
  idmarca				INT,
  idcategoria         	INT,
  imagen              	VARCHAR(280), 
  FOREIGN KEY (idmarca) REFERENCES marcas(idmarca),
  FOREIGN KEY (idcategoria) REFERENCES categorias(idcategoria)
) ENGINE = INNODB;

INSERT INTO marcas (marca) VALUES
('PS'),
('Nintendo Switch'),
('Xbox');

INSERT INTO categorias (categoria) VALUES
('Acción'),
('Deportes'),
('RPG');


INSERT INTO videojuegos (titulo, descripcion, precio, flanzamiento, peso, edadrec, idmarca, idcategoria, imagen) VALUES
('God of War Ragnarök', 'Kratos y Atreus en un viaje épico por los Nuevos Reinos', 69.99, '2022', '106 GB', 18, 1, 1, 'gow.jpg'),
('The Legend of Zelda: Tears of the Kingdom', 'Link explora los cielos y descubre misterios en Hyrule', 59.99, '2023', '16.3 GB', 12, 2, 1, 'zelda.jpg'),
('Forza Horizon 5', 'Experiencia de carreras en mundo abierto en México', 59.99, '2021', '110 GB', 3, 3, 2, 'forzah.jpg');

SELECT * FROM videojuegos;
