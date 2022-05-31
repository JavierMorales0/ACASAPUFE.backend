import { Router } from "express";
import ProductService from "./product.service";
import { body } from "express-validator";
import IController from "../IController";
import Controller from "../Controller";
class ProductController extends Controller implements IController {
  public router: Router;

  constructor() {
    super();
    this.router = Router();
    this.routes();
  }

  public routes(): void {
    // GET /api/products/
    this.router.get("/", ProductService.getProducts);
    // GET /api/products/all
    this.router.get("/all", ProductService.getAllProducts);
    // GET /api/products/:id
    this.router.get("/:id", ProductService.getProductByBarCode);
    // POST /api/products/
    this.router.post(
      "/",
      body("barcode").notEmpty().withMessage("Código de barras es requerido"),
      body("description").notEmpty().withMessage("Descripción es requerida"),
      body("stock").notEmpty().withMessage("Stock es requerido"),
      body("stock").isNumeric().withMessage("Stock debe ser numérico"),
      body("category").notEmpty().withMessage("Categoría es requerida"),
      ProductService.createProduct
    );
    // DELETE /api/products/:id
    this.router.delete("/:id", ProductService.deleteProduct);
  }
}

export default new ProductController().router;
