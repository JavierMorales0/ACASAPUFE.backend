import { Request, Response } from "express";

class ProductService {
  public async getProducts(req: Request, res: Response) {
    return res.status(200).json({
      message: "GET products!",
    });
  }

  public async getAllProducts(req: Request, res: Response) {
    return res.status(200).json({
      message: "GET all products!",
    });
  }

  public async createProduct(req: Request, res: Response) {
    return res.status(201).json({
      message: "POST product!",
    });
  }
}

export default new ProductService();
