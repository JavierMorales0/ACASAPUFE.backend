import express from "express";
import * as dotenv from "dotenv";
import ProductController from "./controllers/product/product.controller";
import MovementController from "./controllers/movement/movement.controller";

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
    dotenv.config();
  }

  // Configuracion de las rutas de la app
  private routes(): void {
    this.app.use("/api/products", ProductController);
    this.app.use("/api/movements", MovementController)
  }

  // Correr el servidor
  public listen(): void {
    this.app.listen(process.env.PORT, () => {
      console.log(`App listening on the port ${process.env.PORT}`);
    });
  }
}

export default App;
