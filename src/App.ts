import express from "express";
import EnvironmentVariable from "./helpers/EnvironmentVariable";
import ProductController from "./controllers/product/product.controller";
import MovementController from "./controllers/movement/movement.controller";
import UserController from "./controllers/user/user.controller";
import LoginController from "./controllers/login/login.controller";
import CompanyController from "./controllers/company/company.controller";
import DashboardController from "./controllers/dashboard/dashboard.controller";
import cors from "cors";

class App {
  // app de express
  public app: express.Application;

  // Constructor de la clase de la app
  constructor() {
    this.app = express();
    this.middlewares();
    this.routes();
  }

  // Middlewares necesarios para el funcionamiento de la app
  private middlewares(): void {
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(cors({ origin: true }));
  }

  // Configuracion de las rutas de la app
  private routes(): void {
    this.app.use("/api/products", ProductController);
    this.app.use("/api/movements", MovementController);
    this.app.use("/api/users", UserController);
    this.app.use("/api/login", LoginController);
    this.app.use("/api/companies", CompanyController);
    this.app.use("/api/dashboard", DashboardController);
  }

  // Correr el servidor
  public listen(): void {
    this.app.listen(EnvironmentVariable.getPort(), () => {
      console.log(`App listening on the port ${EnvironmentVariable.getPort()}`);
    });
  }
}

export default App;
