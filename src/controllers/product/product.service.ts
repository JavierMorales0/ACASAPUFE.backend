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
}

export default new ProductService();
