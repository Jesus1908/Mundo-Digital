CREATE TABLE marcas(
  idmarca   INT PRIMARY KEY AUTO_INCREMENT,
  marca     VARCHAR(50) NOT NULL		
) ENGINE = INNODB;

CREATE TABLE categorias( 
  idcategoria	 INT PRIMARY KEY AUTO_INCREMENT,
  categoria	 VARCHAR(50) NOT NULL
) ENGINE = INNODB;

CREATE TABLE consolas(
  idconsola			INT PRIMARY KEY AUTO_INCREMENT,
  nombre				VARCHAR(100) NOT NULL,
  descripcion     	VARCHAR(180) NOT NULL,
  precio          	DECIMAL(10,2) NOT NULL,
  modelo				VARCHAR(100) NOT NULL,
  fechalanzamiento	DATE NOT NULL,
  almacenamiento      VARCHAR(50),
  sonido				VARCHAR(50),
  peso				DECIMAL(4,2),
  idmarca				INT,
  idcategoria     	INT,
  FOREIGN KEY (idmarca) REFERENCES marcas(idmarca),
  FOREIGN KEY (idcategoria) REFERENCES categorias(idcategoria)
) ENGINE = INNODB;

INSERT INTO marcas (marca) VALUES
('Sony'),
('Microsoft'),
('Nintendo'),
('SEGA'),
('Atari');
select * from marcas;

INSERT INTO categorias (categoria) VALUES
('Portatil'),
('Sobremesa'),
('Híbrida'),
('Retro'),
('Mini');
select * from categorias;

INSERT INTO consolas (nombre, descripcion, precio, modelo, fechalanzamiento, almacenamiento, sonido, peso, idmarca, idcategoria) VALUES
('PlayStation 5', 'Consola de videojuegos de nueva generación de Sony.', 499.99, 'PS5', '2020-11-12', '825GB', 'DTS:X', 4.5, 1, 2),
('Xbox Series X', 'Consola de videojuegos de Microsoft con gran rendimiento.', 499.99, 'XSX', '2020-11-10', '1TB', 'Dolby Atmos', 4.4, 2, 2),
('Nintendo Switch', 'Consola híbrida de Nintendo, portátil y de sobremesa.', 299.99, 'NSW', '2017-03-03', '32GB', 'Stereo', 0.3, 3, 3),
('Xbox Series S', 'Versión más económica de la Xbox Series X.', 299.99, 'XSS', '2020-11-10', '512GB', 'Dolby Atmos', 2.3, 2, 2),
('Nintendo Switch Lite', 'Versión más económica y compacta de la Nintendo Switch.', 199.99, 'NSWL', '2019-09-20', '32GB', 'Stereo', 0.3, 3, 1);
select * from consolas;