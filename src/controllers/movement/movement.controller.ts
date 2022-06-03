import IController from "../IController";
import Controller from "../Controller";
import MovementService from "./movement.service";
import { Router } from "express";
import { body } from "express-validator";

class MovementController extends Controller implements IController {
  router: Router;

  constructor() {
    super();
    this.router = Router();
    this.routes();
  }

  public routes(): void {
    // GET /api/movements/
    this.router.get("/", MovementService.getMovements);
    // GET /api/movements/in
    this.router.get("/in", MovementService.getInMovements);
    // GET /api/movements/out
    this.router.get("/out", MovementService.getOutMovements);
    // POST /api/movements/
    this.router.post(
      "/",
      body("movement_type")
        .notEmpty()
        .withMessage("El tipo de movimiento es requerido"),
      body("movement_type")
        .matches(/^(IN|OUT)$/)
        .withMessage("El tipo de movimiento debe ser IN o OUT"),
      body("barcode_product")
        .notEmpty()
        .withMessage("El código de barras es requerido"),
      body("id_company").isInt().withMessage("La empresa es requerida"),
      body("quantity").notEmpty().withMessage("La cantidad es requerida"),
      body("quantity")
        .isDecimal()
        .withMessage("La cantidad debe ser un número decimal"),
      body("id_tag").isInt().withMessage("El tag es requerido"),
      MovementService.createMovement
    );
    // DELETE /api/movements/:id
    this.router.delete("/:id", MovementService.deleteMovement);
  }
}

export default new MovementController().router;
