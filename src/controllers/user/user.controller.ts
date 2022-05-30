import { Router } from "express";
import UserService from "./user.service";
import { body } from "express-validator";
import IController from "../IController";
import Controller from "../Controller";

class UserController extends Controller implements IController {
  public router: Router;

  constructor() {
    super();
    this.router = Router();
    this.routes();
  }

  public routes(): void {
    // GET /api/users/
    this.router.get("/", UserService.getUsers);
    // GET /api/users/:username
    this.router.get("/:username", UserService.getUser);
    // POST /api/users/
    this.router.post(
      "/",
      [
        body("firstName").notEmpty().withMessage("El nombre es requerido"),
        body("lastName").notEmpty().withMessage("El apellido es requerido"),
        body("username")
          .notEmpty()
          .withMessage("El nombre de usuario es requerido"),
        body("password").notEmpty().withMessage("La contraseña es requerida"),
        body("password")
          .isLength({ min: 6 })
          .withMessage("La contraseña debe tener al menos 6 caracteres"),
      ],
      UserService.createUser
    );
    // PUT /api/users/:username
    this.router.put(
      "/:username",
      [
        body("firstName").notEmpty().withMessage("El nombre es requerido"),
        body("lastName").notEmpty().withMessage("El apellido es requerido"),
        body("password").notEmpty().withMessage("La contraseña es requerida"),
      ],
      UserService.updateUser
    );
    // DELETE /api/users/:username
    this.router.delete("/:username", UserService.deleteUser);
  }
}

export default new UserController().router;
