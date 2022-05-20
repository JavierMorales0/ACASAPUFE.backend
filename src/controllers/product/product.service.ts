import { Request, Response } from "express";
import { validationResult } from "express-validator";
class ProductService {
  /**
   *  Obtiene todos los productos que esten marcados como disponibles
   */
  public async getProducts(req: Request, res: Response) {
    return res.status(200).json({
      message: "GET products!",
    });
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
