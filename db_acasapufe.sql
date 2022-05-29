-- CREAR BASE DE DATOS CON ENDODING UTF8 EN POSTGRESQL
CREATE DATABASE db_acasapufe WITH ENCODING 'UTF8';

-- USE db_acasapufe;
USE db_acasapufe;

-- CREAR TABLA DE PRODUCTOS O INSUMOS
CREATE TABLE productos (
  id serial NOT NULL,
  cod_barra varchar(50) DEFAULT '',
  descripcion varchar(100) NOT NULL,
  existencia numeric(10, 2) NOT NULL,
  categoria character varying(100) NOT NULL,
  min_existencia numeric(10, 2) NOT NULL,
  esta_activo boolean NOT NULL,
  PRIMARY KEY (id),
  UNIQUE (cod_barra)
);

-- CREAR TABLA DE TIPO MOVIMIENTO 
CREATE TABLE tipo_movimiento (
  descripcion varchar(100) NOT NULL,
  PRIMARY KEY (descripcion),
  UNIQUE (descripcion)
);

-- CREAR TABLA DE MOVIMIENTOS
CREATE TABLE movimientos (
  id serial NOT NULL,
  fecha_movimiento date NOT NULL,
  tipo_movimiento character varying(100) NOT NULL,
  id_producto integer NOT NULL,
  descripcion varchar(100) NOT NULL,
  cantidad numeric(10, 2) NOT NULL,
  PRIMARY KEY (id),
  CONSTRAINT fk_tipo_movimiento FOREIGN KEY (tipo_movimiento) REFERENCES tipo_movimiento (descripcion) ON DELETE CASCADE,
  CONSTRAINT fk_producto FOREIGN KEY (id_producto) REFERENCES productos (id) ON DELETE CASCADE
);

-- CREAR TABLA DE MOVIMIENTOS ELIMINADOS
CREATE TABLE movimientos_eliminados (
  id serial NOT NULL,
  fecha_movimiento date NOT NULL,
  tipo_movimiento character varying(100) NOT NULL,
  id_producto integer NOT NULL,
  descripcion varchar(100) NOT NULL,
  cantidad numeric(10, 2) NOT NULL,
  fecha_eliminado timestamp NOT NULL DEFAULT now(),
  PRIMARY KEY (id),
  CONSTRAINT fk_tipo_movimiento FOREIGN KEY (tipo_movimiento) REFERENCES tipo_movimiento (descripcion) ON DELETE CASCADE,
  CONSTRAINT fk_producto FOREIGN KEY (id_producto) REFERENCES productos (id) ON DELETE CASCADE
);

-- CREAR TRIGGER PARA LA ELIMINACION DE UN MOVIMIENTO
CREATE FUNCTION eliminar_movimiento() RETURNS trigger LANGUAGE plpgsql AS 
$$
  BEGIN
    INSERT INTO movimientos_eliminados (id, fecha_movimiento, tipo_movimiento,id_producto, descripcion, cantidad, fecha_eliminado) 
      VALUES (OLD.id, OLD.fecha_movimiento, OLD.tipo_movimiento, OLD.id_producto, OLD.descripcion, OLD.cantidad, now());
    RETURN OLD;
  END
$$

CREATE TRIGGER eliminar_movimiento
  AFTER DELETE ON movimientos
  FOR EACH ROW
  EXECUTE PROCEDURE eliminar_movimiento();


-- CREAR TABLA DE USUARIOS
CREATE TABLE usuarios (
  nombre varchar(100) NOT NULL,
  apellido varchar(100) NOT NULL,
  usuario varchar(100) NOT NULL,
  clave varchar(100) NOT NULL,
  PRIMARY KEY (usuario),
  UNIQUE (usuario)
);

-- CREAR TABLA DE SESIONES
CREATE TABLE sesiones (
  token_id varchar(255) NOT NULL,
  usuario varchar(100) NOT NULL,
  fecha_inicio timestamp NOT NULL DEFAULT now(),
  fecha_fin timestamp,
  PRIMARY KEY (token_id, usuario),
  CONSTRAINT fk_usuario FOREIGN KEY (usuario) REFERENCES usuarios (usuario) ON DELETE CASCADE
);

