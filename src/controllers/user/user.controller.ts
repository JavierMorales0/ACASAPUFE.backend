import { Router } from "express";
import UserService from "./user.service";
import { body } from "express-validator";
import IController from "../IController";
import Controller from "../Controller";
import Auth from "../../middleware/Auth";

class UserController extends Controller implements IController {
  public router: Router;

  constructor() {
    super();
    this.router = Router();
    this.routes();
  }

  public routes(): void {
    // GET /api/users/
    this.router.get("/", Auth.verifyToken, UserService.getUsers);
    // GET /api/users/companies
    this.router.get(
      "/companies",
      Auth.verifyToken,
      UserService.getUserCompanies
    );
    // GET /api/users/:email
    this.router.get("/:email", Auth.verifyToken, UserService.getUser);
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
      Auth.verifyToken,
      [
        body("firstName").notEmpty().withMessage("El nombre es requerido"),
        body("lastName").notEmpty().withMessage("El apellido es requerido"),
        body("password").notEmpty().withMessage("La contraseña es requerida"),
      ],
      UserService.updateUser
    );
    // DELETE /api/users/:email
    this.router.delete("/:email",Auth.verifyToken, UserService.deleteUser);
  }
}

export default new UserController().router;
