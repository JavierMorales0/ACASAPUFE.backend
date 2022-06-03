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
        body("email").notEmpty().withMessage("El email es requerido"),
        body("password").notEmpty().withMessage("La contraseña es requerida"),
        body("password")
          .isLength({ min: 6 })
          .withMessage("La contraseña debe tener al menos 6 caracteres"),
      ],
      LoginService.login
    );
  }
}

export default new LoginController().router;
