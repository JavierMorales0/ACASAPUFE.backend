import { Router } from "express";
import ProductService from "./product.service";
import { body } from "express-validator";
import IController from "../IController";
import Controller from "../Controller";
import Auth from "../../middleware/Auth";
class ProductController extends Controller implements IController {
  public router: Router;

  constructor() {
    super();
    this.router = Router();
    this.routes();
  }

  public routes(): void {
    // GET /api/products/
    this.router.get("/", Auth.verifyToken, ProductService.getProducts);
    // GET /api/products/all
    this.router.get("/all", Auth.verifyToken, ProductService.getAllProducts);
    // GET /api/products/:id
    this.router.get(
      "/:barcode",
      Auth.verifyToken,
      ProductService.getProductByBarCode
    );
    // POST /api/products/
    this.router.post(
      "/",
      Auth.verifyToken,
      body("barcode").notEmpty().withMessage("Código de barras es requerido"),
      body("description").notEmpty().withMessage("Descripción es requerida"),
      body("category").notEmpty().withMessage("Categoría es requerida"),
      ProductService.createProduct
    );
    // UPDATE /api/products/:id
    this.router.put(
      "/:id",
      Auth.verifyToken,
      body("description").notEmpty().withMessage("Descripción es requerida"),
      body("category").notEmpty().withMessage("Categoría es requerida"),
      ProductService.updateProduct
    );
    // DELETE /api/products/:id
    this.router.delete("/:id", Auth.verifyToken, ProductService.deleteProduct);
  }
}

export default new ProductController().router;
