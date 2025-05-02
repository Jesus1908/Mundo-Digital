CREATE DATABASE mundodigital;
USE mundodigital;

CREATE TABLE IF NOT EXISTS marcas(
  idmarca   INT PRIMARY KEY AUTO_INCREMENT,
  marca     VARCHAR(50) NOT NULL		
) ENGINE = INNODB;

CREATE TABLE IF NOT EXISTS categorias( 
  idcategoria	 INT PRIMARY KEY AUTO_INCREMENT,
  categoria	 VARCHAR(50) NOT NULL
) ENGINE = INNODB;

CREATE TABLE IF NOT EXISTS consolas(
  idconsola				    INT PRIMARY KEY AUTO_INCREMENT,
  nombre				      VARCHAR(100) NOT NULL,
  descripcion     		VARCHAR(180) NOT NULL,
  precio          		DECIMAL(10,2) NOT NULL,
  modelo				      VARCHAR(100) NOT NULL,
  alanzamiento     		CHAR(4) NOT NULL,
  almacenamiento      VARCHAR(50) NOT NULL,
  sonido				      VARCHAR(50) NOT NULL,
  peso					      DECIMAL(4,2) NOT NULL,
  idmarca			      	INT,
  idcategoria     		INT,
  imagen              VARCHAR(200),
  FOREIGN KEY (idmarca) REFERENCES marcas(idmarca),
  FOREIGN KEY (idcategoria) REFERENCES categorias(idcategoria)
) ENGINE = INNODB;

INSERT INTO marcas (marca) VALUES
('Sony'),
('Microsoft'),
('Nintendo'),
('SEGA'),
('Atari');

INSERT INTO categorias (categoria) VALUES
('Portatil'),
('Sobremesa'),
('Híbrida'),
('Retro'),
('Mini');

INSERT INTO consolas (nombre, descripcion, precio, modelo, alanzamiento, almacenamiento, sonido, peso, idmarca, idcategoria, imagen) VALUES
('PlayStation 5', 'Consola de videojuegos de nueva generación de Sony.', 499.99, 'PS5', '2020', '825GB', 'DTS:X', 4.5, 1, 2, 'ps5.jpg'),
('Xbox Series X', 'Consola de videojuegos de Microsoft con gran rendimiento.', 499.99, 'XSX', '2023', '1TB', 'Dolby Atmos', 4.4, 2, 2, 'xsx.jpg'),
('Nintendo Switch', 'Consola híbrida de Nintendo, portátil y de sobremesa.', 299.99, 'NSW', '2017', '32GB', 'Stereo', 0.3, 3, 3, 'nsw.jpg');
SELECT * FROM consolas;
