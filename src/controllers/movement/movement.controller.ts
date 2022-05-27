import IController from "../IController";
import Controller from "../Controller";
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
    this.router.get("/", (req, res) => {
      return res.send("Movement");
    });
  }
}

export default new MovementController().router;
