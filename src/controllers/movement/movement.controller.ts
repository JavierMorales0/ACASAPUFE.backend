import IController from "../IController";
import Controller from "../Controller";
import MovementService from "./movement.service";
import { Router } from "express";
import { body } from "express-validator";
import Auth from "../../middleware/Auth";

class MovementController extends Controller implements IController {
  router: Router;

  constructor() {
    super();
    this.router = Router();
    this.routes();
  }

  public routes(): void {
    // GET /api/movements/
    this.router.get("/", Auth.verifyToken, MovementService.getMovements);
    // GET /api/movements/in
    this.router.get("/in", Auth.verifyToken, MovementService.getInMovements);
    // GET /api/movements/out
    this.router.get("/out", Auth.verifyToken, MovementService.getOutMovements);
    // POST /api/movements/
    this.router.post(
      "/",
      Auth.verifyToken,
      body("movement_type")
        .notEmpty()
        .withMessage("El tipo de movimiento es requerido"),
      body("movement_type")
        .matches(/^(IN|OUT)$/)
        .withMessage("El tipo de movimiento debe ser IN o OUT"),
      body("barcode_product")
        .notEmpty()
        .withMessage("El código de barras es requerido"),
      body("quantity").notEmpty().withMessage("La cantidad es requerida"),
      body("quantity")
        .isDecimal()
        .withMessage("La cantidad debe ser un número decimal"),
      body("id_tag").isInt().withMessage("El tag es requerido"),
      MovementService.createMovement
    );
    // DELETE /api/movements/:id
    this.router.delete(
      "/:id",
      Auth.verifyToken,
      MovementService.deleteMovement
    );
  }
}

export default new MovementController().router;
