import { Request, Response } from "express";
import { validationResult } from "express-validator";
import _DB from "../../db/PostgreSqlConnection";
import ServerResponse from "../../helpers/ServerResponse";
class ProductService {
  /**
   *  Obtiene todos los productos que esten marcados como disponibles
   */
  public async getProducts(req: Request, res: Response) {
    try {
      // Make a query to the DB and get the products
      const response = await _DB.query(
        "SELECT * FROM products WHERE is_available = true"
      );
      // Call the helper function to return the response
      return ServerResponse.success(
        "Listado de productos",
        200,
        response.rows,
        res
      );
    } catch (error: any) {
      // Call the helper function to return the response
      return ServerResponse.error(
        "Error al obtener los productos",
        500,
        error,
        res
      );
    }
  }
  /**
   *  Obtiene todos los productos sin importar su disponibilidad
   */
  public async getAllProducts(req: Request, res: Response) {
    try {
      // Make a query to the DB and get the products
      const response = await _DB.query("SELECT * FROM products");
      // Call the helper function to return the response
      return ServerResponse.success(
        "Listado de productos",
        200,
        response.rows,
        res
      );
    } catch (error) {
      // Call the helper function to return the response
      return ServerResponse.error(
        "Error al obtener los productos",
        500,
        error,
        res
      );
    }
  }

  /**
   * Obtiene los productos de una sola empresa
   */
  public async getProductsByCompany(req: Request, res: Response) {
    try {
      // Get the request params data
      const { id } = req.params;
      // Make a query to the DB and get the products
      const response = await _DB.query(
        "SELECT * FROM products WHERE company_id = $1 WHERE is_available = true",
        [id]
      );
      // If there is not a product with this id
      if (response.rowCount === 0) {
        return ServerResponse.error(
          "No se encontro ningun producto con este id de compañia",
          404,
          null,
          res
        );
      }
      // Call the helper function to return the response
      return ServerResponse.success(
        "Listado de productos",
        200,
        response.rows,
        res
      );
    } catch (error) {
      // Call the helper function to return the response
      return ServerResponse.error(
        "Error al obtener los productos",
        500,
        error,
        res
      );
    }
  }

  /**
   * Obtiene todos los productos de una empresa
   */
  public async getAllProductsByCompany(req: Request, res: Response) {
    try {
      // Get the request params data
      const { id } = req.params;
      // Make a query to the DB and get the products
      const response = await _DB.query(
        "SELECT * FROM products WHERE company_id = $1",
        [id]
      );
      // If there is not a product with this id
      if (response.rowCount === 0) {
        return ServerResponse.error(
          "No se encontro ningun producto con este id de compañia",
          404,
          null,
          res
        );
      }
      // Call the helper function to return the response
      return ServerResponse.success(
        "Listado de productos",
        200,
        response.rows,
        res
      );
    } catch (error) {
      // Call the helper function to return the response
      return ServerResponse.error(
        "Error al obtener los productos",
        500,
        error,
        res
      );
    }
  }

  /**
   * Obtiene un producto en especifico por su cod_barra
   * */
  public async getProductByBarCode(req: Request, res: Response) {
    try {
      // Get the request body data
      const { barcode } = req.body;
      // Make a query to the DB and get the product with this barcode
      const response = await _DB.query(
        "SELECT * FROM products WHERE barcode = $1",
        [barcode]
      );
      // If there is not a product with this barcode
      if (response.rowCount === 0) {
        return ServerResponse.error(
          "No se encontro ningun producto con este codigo de barras",
          404,
          null,
          res
        );
      }
      // Call the helper function to return the response
      return ServerResponse.success(
        "Producto encontrado con el codigo de barras",
        200,
        response.rows,
        res
      );
    } catch (error: any) {
      // Call the helper function to return the response
      return ServerResponse.error(
        "Error al obtener el producto",
        500,
        error,
        res
      );
    }
  }

  /**
   *  Crea un producto
   */
  public async createProduct(req: Request, res: Response) {
    try {
      // Verify if there are errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
      }
      // Get the data from the request
      const {
        barcode,
        description,
        stock,
        category,
        min_stock,
        is_available,
        id_company,
      } = req.body;
      // Make a query to the DB and get the user
      const response = await _DB.query(
        "INSERT INTO products (barcode, description, stock, category, min_stock, is_available, id_company) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *",
        [
          barcode,
          description,
          stock,
          category,
          min_stock ?? 0.0,
          is_available ?? true,
          id_company,
        ]
      );
      // Call the helper function to return the response
      return ServerResponse.success("Producto creado", 201, response.rows, res);
    } catch (error) {
      // Call the helper function to return the response
      return ServerResponse.error(
        "Error al crear el producto",
        500,
        error,
        res
      );
    }
  }
  /**
   *  Elimina un producto
   */
  public async deleteProduct(req: Request, res: Response) {
    try {
      // Get the request params data
      const { id } = req.params;
      // Make a query to the DB and delete the product
      const response = await _DB.query(
        "DELETE FROM products WHERE id = $1 RETURNING *",
        [id]
      );
      // If there is not a product with this id
      if (response.rowCount === 0) {
        return ServerResponse.error(
          "No se encontro ningun producto con este id",
          404,
          null,
          res
        );
      }
      // Call the helper function to return the response
      return ServerResponse.success(
        "Producto eliminado",
        200,
        response.rows,
        res
      );
    } catch (error) {
      // Call the helper function to return the response
      return ServerResponse.error(
        "Error al eliminar el producto",
        500,
        error,
        res
      );
    }
  }
}

export default new ProductService();
