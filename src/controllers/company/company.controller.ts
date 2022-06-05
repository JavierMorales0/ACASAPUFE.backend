import { Router } from "express";
import CompanyService from "./company.service";
import { body } from "express-validator";
import IController from "../IController";
import Controller from "../Controller";
import Auth from "../../middleware/Auth";

class CompanyController extends Controller implements IController {
  public router: Router;

  constructor() {
    super();
    this.router = Router();
    this.routes();
  }

  public routes(): void {
    // GET /api/companies/
    this.router.get("/", Auth.verifyToken, CompanyService.getCompanies);
    // GET /api/companies/:id
    this.router.get("/:id", Auth.verifyToken, CompanyService.getCompany);
    // POST /api/companies/
    this.router.post(
      "/",
      Auth.verifyToken,
      body("name").notEmpty().withMessage("El nombre es requerido"),
      body("ruc").notEmpty().withMessage("El ruc es requerido"),
      body("address").notEmpty().withMessage("La dirección es requerida"),
      body("phone").notEmpty().withMessage("El teléfono es requerido"),
      body("email").notEmpty().withMessage("El email es requerido"),
      body("email").isEmail().withMessage("El email no es válido"),
      CompanyService.createCompany
    );
    // PUT /api/companies/:id
    this.router.put(
      "/:id",
      Auth.verifyToken,
      body("name").notEmpty().withMessage("El nombre es requerido"),
      body("ruc").notEmpty().withMessage("El ruc es requerido"),
      body("address").notEmpty().withMessage("La dirección es requerida"),
      body("phone").notEmpty().withMessage("El teléfono es requerido"),
      body("email").notEmpty().withMessage("El email es requerido"),
      body("email").isEmail().withMessage("El email no es válido"),
      CompanyService.updateCompany
    );
    // DELETE /api/companies/:id
    this.router.delete("/:id", Auth.verifyToken, CompanyService.deleteCompany);
  }
}

export default new CompanyController().router;
