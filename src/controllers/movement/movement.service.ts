import { Request, Response } from "express";
import { validationResult } from "express-validator";

class MovementService {
  /**
   *  Obtiene todos los movimientos de carga y descarga de inventario
   */
  public async getAllInventoryMovements(req: Request, res: Response) {
    return res.status(200).json({
      message: "GET all inventory movements!",
    });
  }

  /**
   * Obtiene todos los movimientos de carga de inventario
   */
  public async getAllInventoryLoadMovements(req: Request, res: Response) {
    return res.status(200).json({
      message: "GET all inventory load movements!",
    });
  }

  /**
   * Obtiene todos los movimientos de descarga de inventario
   */
  public async getAllInventoryUnloadMovements(req: Request, res: Response) {
    return res.status(200).json({
      message: "GET all inventory unload movements!",
    });
  }
}

export default new MovementService();
