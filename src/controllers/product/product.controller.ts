import { Router } from "express";
import productService from "./product.service";
import { body } from "express-validator";
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
    this.router.post(
      "/",
      body("name").notEmpty().withMessage("El nombre es requerido"),
      productService.createProduct
    );
    // DELETE /api/products/:id
    this.router.delete("/:id", productService.deleteProduct);
  }
}

export default new ProductController().router;
