import { Router } from "express";
import DashboardService from "./dashboard.service";
import IController from "../IController";
import Controller from "../Controller";
import Auth from "../../middleware/Auth";
class DashboardController extends Controller implements IController {
  public router: Router;

  constructor() {
    super();
    this.router = Router();
    this.routes();
  }

  public routes(): void {
    // GET /api/dashboard
    this.router.get("/", Auth.verifyToken, DashboardService.getDashboardInfo);
  }
}


export default new DashboardController().router;
