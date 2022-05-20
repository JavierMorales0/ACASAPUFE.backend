import { Router } from "express";
import productService from "./product.service";

class ProductController {
  public router: Router;

  constructor() {
    this.router = Router();
    this.routes();
  }

  public routes(): void {
    // GET /api/products/
    this.router.get("/", productService.getProducts);
    // GET /api/products/all
    this.router.get("/all", productService.getAllProducts);
    // POST /api/products/
    this.router.post("/", productService.createProduct);
  }
}

export default new ProductController().router;
