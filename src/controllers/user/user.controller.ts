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
    // GET /api/users/companies
    this.router.get("/companies", UserService.getUserCompanies);
    // GET /api/users/:email
    this.router.get("/:email", UserService.getUser);
    // POST /api/users/
    this.router.post(
      "/",
      [
        body("firstName").notEmpty().withMessage("El nombre es requerido"),
        body("lastName").notEmpty().withMessage("El apellido es requerido"),
        body("email").isEmail().withMessage("El email es requerido"),
        body("password").notEmpty().withMessage("La contraseña es requerida"),
        body("password")
          .isLength({ min: 6 })
          .withMessage("La contraseña debe tener al menos 6 caracteres"),
      ],
      UserService.createUser
    );
    // PUT /api/users/:email
    this.router.put(
      "/:email",
      [
        body("firstName").notEmpty().withMessage("El nombre es requerido"),
        body("lastName").notEmpty().withMessage("El apellido es requerido"),
        body("password").notEmpty().withMessage("La contraseña es requerida"),
      ],
      UserService.updateUser
    );
    // DELETE /api/users/:email
    this.router.delete("/:email", UserService.deleteUser);
  }
}

export default new UserController().router;
