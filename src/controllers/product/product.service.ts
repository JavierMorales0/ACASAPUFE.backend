import { Request, Response } from "express";
import { validationResult } from "express-validator";
import _DB from "../../db/PostgreSqlConnection";
class ProductService {
  /**
   *  Obtiene todos los productos que esten marcados como disponibles
   */
  public async getProducts(req: Request, res: Response) {
    try {
      const response = await _DB.query("SELECT * FROM productos");
      return res.status(200).json({
        message: "GET products!",
        status: "success",
        data: response.rows,
      });
    } catch (error: any) {
      return res.status(500).json({
        message: "Error al obtener los productos",
        error: error.message,
      });
    }
  }
  /**
   *  Obtiene todos los productos sin importar su disponibilidad
   */
  public async getAllProducts(req: Request, res: Response) {
    return res.status(200).json({
      message: "GET all products!",
    });
  }

  /**
   * Obtiene un producto en especifico por su cod_barra
   * */
  public async getProductByBarCode(req: Request, res: Response) {
    try {
      const response = await _DB.query(
        "SELECT * FROM productos WHERE cod_barra = $1",
        [req.params.id]
      );
      if (response.rowCount === 0) {
        return res.status(404).json({
          message: "El producto no existe",
          status: "error",
          data: null,
        });
      }
      return res.status(200).json({
        message: "GET product!",
        status: "success",
        data: response.rows,
      });
    } catch (error: any) {
      return res.status(500).json({
        message: "Error al obtener el producto",
        error: error.message,
      });
    }
  }

  /**
   *  Crea un producto
   */
  public async createProduct(req: Request, res: Response) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
      }

      return res.status(201).json({
        message: "POST product!",
        product: req.body,
      });
    } catch (error) {
      return res.status(500).json({
        message: "Error al crear el producto",
        error,
      });
    }
  }
  /**
   *  Elimina un producto
   */
  public async deleteProduct(req: Request, res: Response) {
    return res.status(200).json({
      message: "DELETE product!",
      productId: req.params.id,
    });
  }
}

export default new ProductService();
