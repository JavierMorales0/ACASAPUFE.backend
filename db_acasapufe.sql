-- CREAR BASE DE DATOS CON ENDODING UTF8 EN POSTGRESQL
CREATE DATABASE db_acasapufe WITH ENCODING 'UTF8';



-- CREAR TABLA DE USUARIOS
CREATE TABLE users (
  id serial NOT NULL,
  first_name varchar(50) NOT NULL,
  last_name varchar(50) NOT NULL,
  email varchar(50) NOT NULL,
  pass varchar(255) NOT NULL,
  is_active boolean DEFAULT TRUE,
  PRIMARY KEY (id),
  UNIQUE (email)
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
  barcode varchar(50) NOT NULL,
  id_company integer NOT NULL,
  description varchar(100) NOT NULL,
  stock numeric(10, 2) NOT NULL,
  category character varying(25) DEFAULT '',
  min_stock numeric(10, 2) NOT NULL DEFAULT 0.00,
  measure character varying(20) DEFAULT 'UNIDAD',
  is_available boolean DEFAULT TRUE,
  PRIMARY KEY(barcode , id_company),
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
  movement_date date DEFAULT now(),
  movement_type character varying(3) NOT NULL,
  barcode_product varchar(50) NOT NULL,
  id_company integer NOT NULL,
  quantity numeric(10, 2) NOT NULL,
  description varchar(255) DEFAULT '',
  id_tag integer NOT NULL,
  PRIMARY KEY (id , movement_date),
  CONSTRAINT fk_product FOREIGN KEY (barcode_product , id_company) REFERENCES products (barcode , id_company) ON UPDATE CASCADE ON DELETE CASCADE,
  CONSTRAINT fk_company FOREIGN KEY (id_company) REFERENCES companies (id) ON UPDATE CASCADE ON DELETE CASCADE,
  CONSTRAINT fk_tag FOREIGN KEY (id_tag) REFERENCES tags (id) ON UPDATE CASCADE ON DELETE CASCADE
  );
-- change default on table movements on column movement_date to now()
  alter table movements alter column movement_date set default now();


/* CREAR TRIGGER PARA QUE DESPUES DE INSERTAR UN MOVIMIENTO, EVALUE EL RESTO DE MOVIMIENTOS
    Y SI LA FECHA DEL MOVIMIENTO ES MAYOR A 3 AÑOS, SE ELIMINA EL MOVIMIENTO */
CREATE OR REPLACE FUNCTION delete_old_movements() RETURNS trigger LANGUAGE plpgsql AS
$$
  DECLARE
    rw record;
  BEGIN
    FOR rw IN SELECT * FROM movements WHERE movement_date < (current_date - interval '3 years') LOOP
      DELETE FROM movements WHERE id = rw.id;
    END LOOP;
    RETURN NULL;
  END;
$$;

CREATE TRIGGER delete_old_movements_trigger AFTER INSERT ON movements
    FOR EACH ROW EXECUTE FUNCTION delete_old_movements();

/* CREAR TRIGGER PARA QUE DESPUES DE INSERTAR UN MOVIMIENTO, ACTUALICE EL
    STOCK DEL PRODUCTO */
CREATE OR REPLACE FUNCTION update_stock() RETURNS trigger LANGUAGE plpgsql AS
$$
  BEGIN
      IF NEW.movement_type = 'IN'
    THEN
      UPDATE products SET stock = stock + NEW.quantity WHERE barcode = NEW.barcode_product AND id_company = NEW.id_company;
    ELSIF NEW.movement_type = 'OUT'
    THEN
      UPDATE products SET stock = stock - NEW.quantity WHERE barcode = NEW.barcode_product AND id_company = NEW.id_company;
    END IF;
    RETURN NULL;
  END;
$$;

CREATE TRIGGER update_stock AFTER INSERT ON movements
    FOR EACH ROW EXECUTE FUNCTION update_stock();

-- CREATE VIEW PARA MOSTRAR LAS EMPRESAS DE UN USUARIO
CREATE OR REPLACE VIEW user_companies_view AS
  SELECT c.id, c.name, c.ruc, c.address, c.phone, c.id_user, u.first_name, u.last_name
  FROM companies c
  INNER JOIN users u ON c.id_user = u.id;