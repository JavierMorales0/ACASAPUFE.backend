import { Router } from "express";
import LoginService from "./login.service";
import { body } from "express-validator";
import IController from "../IController";
import Controller from "../Controller";

class LoginController extends Controller implements IController {
  public router: Router;

  constructor() {
    super();
    this.router = Router();
    this.routes();
  }

  // Rutas de la API endpoint /api/login
  public routes(): void {
    // POST /api/login/
    this.router.post(
      "/",
      [
        body("username").notEmpty(),
        body("password").notEmpty(),
        body("password").isLength({ min: 6 }),
      ],
      LoginService.login
    );
  }
}

export default new LoginController().router;
