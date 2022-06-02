-- CREAR BASE DE DATOS CON ENDODING UTF8 EN POSTGRESQL
CREATE DATABASE db_acasapufe WITH ENCODING 'UTF8';

-- USE db_acasapufe;
USE db_acasapufe;

-- CREAR TABLA DE PRODUCTOS O INSUMOS
CREATE TABLE products (
  id serial NOT NULL,
  barcode varchar(50) DEFAULT '',
  description varchar(100) NOT NULL,
  stock numeric(10, 2) NOT NULL,
  category character varying(100) NOT NULL,
  min_stock numeric(10, 2) NOT NULL DEFAULT 0.00,
  is_available boolean NOT NULL DEFAULT TRUE,
  PRIMARY KEY (id),
  UNIQUE (barcode)
);


-- CREAR TABLA DE MOVIMIENTOS
CREATE TABLE movements (
  id serial NOT NULL,
  movement_date date NOT NULL DEFAULT current_date,
  movement_type character varying(100) NOT NULL,
  id_product integer NOT NULL,
  quantity numeric(10, 2) NOT NULL,
  description varchar(100) NOT NULL,
  PRIMARY KEY (id),
  CONSTRAINT fk_product FOREIGN KEY (id_product) REFERENCES products (id) ON DELETE CASCADE
);

-- CREAR TABLA DE MOVIMIENTOS ELIMINADOS
CREATE TABLE deleted_movements (
  id serial NOT NULL,
  movement_date date NOT NULL,
  movement_type character varying(100) NOT NULL,
  id_product integer NOT NULL,
  quantity numeric(10, 2) NOT NULL,
  description varchar(100) NOT NULL,
  deleted_date timestamp NOT NULL DEFAULT now(),
  PRIMARY KEY (id),
  CONSTRAINT fk_product FOREIGN KEY (id_product) REFERENCES products (id) ON DELETE CASCADE
);

-- CREAR TRIGGER PARA LA ELIMINACION DE UN MOVIMIENTO
CREATE FUNCTION delete_movement() RETURNS trigger LANGUAGE plpgsql AS 
$$
  BEGIN
    INSERT INTO deleted_movements (id, movement_date, movement_type,id_product, description, quantity, deleted_date) 
      VALUES (OLD.id, OLD.movement_date, OLD.movement_type, OLD.id_product, OLD.description, OLD.quantity, now());
    RETURN OLD;
  END
$$;

CREATE TRIGGER delete_movement
  AFTER DELETE ON movements
  FOR EACH ROW
  EXECUTE PROCEDURE delete_movement();


-- CREAR TABLA DE USUARIOS
CREATE TABLE users (
  first_name varchar(100) NOT NULL,
  last_name varchar(100) NOT NULL,
  username varchar(100) NOT NULL,
  pass varchar(255) NOT NULL,
  PRIMARY KEY (username),
  UNIQUE (username)
);


