import { Request, Response } from "express";
import { validationResult } from "express-validator";
import _DB from "../../db/PostgreSqlConnection";
import ServerResponse from "../../helpers/ServerResponse";

class MovementService {
  /**
   *  Obtiene todos los movimientos de carga y descarga de inventario
   */
  public async getMovements(req: Request, res: Response) {
    try {
      const movements = await _DB.query(
        "SELECT * FROM movements ORDER BY id DESC"
      );
      return ServerResponse.success(
        "Listado de movimientos",
        200,
        movements.rows,
        res
      );
    } catch (error) {
      return ServerResponse.error(
        "Error al obtener los movimientos",
        500,
        error,
        res
      );
    }
  }

  /**
   * Obtiene todos los movimientos de carga de inventario
   */
  public async getInMovements(req: Request, res: Response) {
    try {
      const movements = await _DB.query(
        "SELECT * FROM movements WHERE movement_type = 'IN' ORDER BY id DESC"
      );
      return ServerResponse.success(
        "Listado de movimientos de carga",
        200,
        movements.rows,
        res
      );
    } catch (error) {
      return ServerResponse.error(
        "Error al obtener los movimientos de carga",
        500,
        error,
        res
      );
    }
  }

  /**
   * Obtiene todos los movimientos de descarga de inventario
   */
  public async getOutMovements(req: Request, res: Response) {
    try {
      const movements = await _DB.query(
        "SELECT * FROM movements WHERE movement_type = 'OUT' ORDER BY id DESC"
      );
      return ServerResponse.success(
        "Listado de movimientos de descarga",
        200,
        movements.rows,
        res
      );
    } catch (error) {
      return ServerResponse.error(
        "Error al obtener los movimientos de descarga",
        500,
        error,
        res
      );
    }
  }

  /**
   * Eliminar un movimiento de inventario
   */
  public async deleteMovement(req: Request, res: Response) {
    try {
      // Get the params from the url
      const { id } = req.params;
      // Make a query to the database and delete the movement
      const movement = await _DB.query("DELETE FROM movements WHERE id = $1", [
        id,
      ]);
      // If the movement was not deleted
      if (movement.rowCount === 0) {
        return ServerResponse.error(
          "No se encontró el movimiento",
          404,
          null,
          res
        );
      }
      return ServerResponse.success(
        "Movimiento eliminado correctamente",
        200,
        movement.rows,
        res
      );
    } catch (error) {
      return ServerResponse.error(
        "Error al eliminar el movimiento",
        500,
        error,
        res
      );
    }
  }
}

export default new MovementService();
