import IController from "../IController";
import Controller from "../Controller";
import MovementService from "./movement.service";
import { Router } from "express";

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
    // DELETE /api/movements/:id
    this.router.delete("/:id", MovementService.deleteMovement);
  }
}

export default new MovementController().router;
