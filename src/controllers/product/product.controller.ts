import { Router } from "express";
import ProviderService from "./product.service";
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
    this.router.get("/", ProviderService.getProducts);
    // GET /api/products/all
    this.router.get("/all", ProviderService.getAllProducts);
    // GET /api/products/:id
    this.router.get("/:id", ProviderService.getProductByBarCode);
    // POST /api/products/
    this.router.post(
      "/",
      body("name").notEmpty().withMessage("El nombre es requerido"),
      ProviderService.createProduct
    );
    // DELETE /api/products/:id
    this.router.delete("/:id", ProviderService.deleteProduct);
  }
}

export default new ProductController().router;
