-- CREAR BASE DE DATOS CON ENDODING UTF8 EN POSTGRESQL
CREATE DATABASE db_acasapufe WITH ENCODING 'UTF8';



-- CREAR TABLA DE USUARIOS
CREATE TABLE users (
  id serial NOT NULL,
  first_name varchar(100) NOT NULL,
  last_name varchar(100) NOT NULL,
  username varchar(100) NOT NULL,
  pass varchar(255) NOT NULL,
  is_active boolean DEFAULT TRUE,
  PRIMARY KEY (id),
  UNIQUE (username)
);

-- CREAR TABLA DE EMPRESAS
CREATE TABLE companies (
  id serial NOT NULL,
  name varchar(100) NOT NULL,
  ruc varchar(100) NOT NULL,
  address varchar(100) NOT NULL,
  phone varchar(100) NOT NULL,
  email varchar(100) NOT NULL,
  id_user integer NOT NULL,
  PRIMARY KEY (id),
  CONSTRAINT fk_user FOREIGN KEY (id_user) REFERENCES users (id) ON UPDATE CASCADE ON DELETE CASCADE 
);

-- CREAR TABLA DE PRODUCTOS O INSUMOS
CREATE TABLE products (
  id serial NOT NULL,
  barcode varchar(50) DEFAULT '',
  description varchar(100) NOT NULL,
  stock numeric(10, 2) NOT NULL,
  category character varying(100) NOT NULL,
  min_stock numeric(10, 2) NOT NULL DEFAULT 0.00,
  is_available boolean NOT NULL DEFAULT TRUE,
  id_company integer NOT NULL,
  PRIMARY KEY (id),
  CONSTRAINT fk_company FOREIGN KEY (id_company) REFERENCES companies (id) ON UPDATE CASCADE ON DELETE CASCADE
);

-- CREAR TABLA DE ETIQUETAS DE MOVIMIENTOS (Normal, Inventario faltante, Inventario sobrante)
CREATE TABLE tags (
  id serial NOT NULL,
  name varchar(100) NOT NULL,
  PRIMARY KEY (id)
);

-- CREAR TABLA DE MOVIMIENTOS
CREATE TABLE movements (
  id serial NOT NULL,
  movement_date date NOT NULL DEFAULT current_date,
  movement_type character varying(3) NOT NULL,
  id_product integer NOT NULL,
  quantity numeric(10, 2) NOT NULL,
  description varchar(100) NOT NULL,
  id_tag integer NOT NULL,
  id_company integer NOT NULL,
  PRIMARY KEY (id),
  CONSTRAINT fk_product FOREIGN KEY (id_product) REFERENCES products (id) ON UPDATE CASCADE ON DELETE CASCADE,
  CONSTRAINT fk_company FOREIGN KEY (id_company) REFERENCES companies (id) ON UPDATE CASCADE ON DELETE CASCADE,
  CONSTRAINT fk_tag FOREIGN KEY (id_tag) REFERENCES tags (id) ON UPDATE CASCADE ON DELETE CASCADE
  );


-- CREAR TABLA DE MOVIMIENTOS ELIMINADOS
CREATE TABLE deleted_movements (
  id serial NOT NULL,
  movement_date date NOT NULL,
  movement_type character varying(100) NOT NULL,
  id_product integer NOT NULL,
  quantity numeric(10, 2) NOT NULL,
  description varchar(100) NOT NULL,
  id_tag integer NOT NULL,
  id_company integer NOT NULL,
  deleted_date timestamp NOT NULL DEFAULT now(),
  PRIMARY KEY (id),
  CONSTRAINT fk_product FOREIGN KEY (id_product) REFERENCES products (id) ON UPDATE CASCADE ON DELETE CASCADE,
  CONSTRAINT fk_company FOREIGN KEY (id_company) REFERENCES companies (id) ON UPDATE CASCADE ON DELETE CASCADE,
  CONSTRAINT fk_tag FOREIGN KEY (id_tag) REFERENCES tags (id) ON UPDATE CASCADE ON DELETE CASCADE
);

-- CREAR TRIGGER PARA LA ELIMINACION DE UN MOVIMIENTO
CREATE FUNCTION delete_movement() RETURNS trigger LANGUAGE plpgsql AS 
$$
  BEGIN
    INSERT INTO deleted_movements (id, movement_date, movement_type,id_product, description, quantity,id_tag, id_company, deleted_date) 
      VALUES (OLD.id, OLD.movement_date, OLD.movement_type, OLD.id_product, OLD.description, OLD.quantity, OLD.id_tag, OLD.id_company, now());
    RETURN OLD;
  END
$$;

CREATE TRIGGER delete_movement
  AFTER DELETE ON movements
  FOR EACH ROW
  EXECUTE PROCEDURE delete_movement();

-- CREATE TRIGGER PARA QUE AL INSERTAR EN MOVIMIENTOS ELIMINADOS SE REVISE LOS MOVIMIENTOS QUE TIENEN MAS DE 
-- 3 AÑOS DE VENCIMIENTO Y SE ELIMINEN
CREATE FUNCTION delete_old_movements() RETURNS trigger LANGUAGE plpgsql AS
$$
  BEGIN
    DELETE FROM deleted_movements WHERE deleted_date < now() - interval '3 years';
    RETURN NEW;
  END
$$;

CREATE TRIGGER delete_old_movements
  AFTER INSERT ON deleted_movements
  FOR EACH ROW
  EXECUTE PROCEDURE delete_old_movements();


