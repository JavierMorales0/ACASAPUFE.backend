import { Request, Response } from "express";
import { validationResult } from "express-validator";
import _DB from "../../db/PostgreSqlConnection";
import ServerResponse from "../../helpers/ServerResponse";
import ArrayToObject from "../../helpers/ArrayToObject";
import GraphicMovementsForYear from "../../helpers/GraphicMovementsForYear";

class DashboardService {
  public async getDashboardInfo(req: Request, res: Response) {
    try {
      const companiesArrayFromDb = await _DB.query(
        "SELECT id FROM companies WHERE id_user = $1",
        [req.token!.id]
      );
      if (companiesArrayFromDb.rowCount === 0) {
        return ServerResponse.error(
          "No se encontraron empresas asociadas a este usuario",
          404,
          null,
          res
        );
      }
      const company = ArrayToObject(companiesArrayFromDb.rows);
      // Set a master query sql string
      const queryMovements =
        "SELECT COUNT(CASE WHEN id_company = $1 THEN 1 ELSE null END) as total from movements WHERE movement_date <= now() AND movement_date > now() - interval '30 days' and movement_type =";
      // Make a query to count how many in movements the company has
      const queryTotalInMovements = await _DB.query(queryMovements + "'IN'", [
        company.id,
      ]);
      const totalInMovements = ArrayToObject(queryTotalInMovements.rows).total;

      // Make a query to count how many out movements the company has
      const queryTotalOutMovements = await _DB.query(queryMovements + "'OUT'", [
        company.id,
      ]);
      const totalOutMovements = ArrayToObject(
        queryTotalOutMovements.rows
      ).total;
      // Make a query to count how many products the company has
      const queryTotalProducts = await _DB.query(
        "select count(barcode) from products where id_company = $1;",
        [company.id]
      );
      // Format totalProducts to a number only
      const totalProducts = ArrayToObject(queryTotalProducts.rows).count;

      // SQL query for get total movements for year
      const _queryTotalMovementsInit =
        "SELECT extract(month from movement_date) AS  mes, COUNT(CASE WHEN id_company = $1 THEN 1 ELSE null END) AS count FROM movements where movement_type = ";
      const _queryTotalMovementsFinal =
        " AND movement_date >= now() - interval '12 months' GROUP BY extract(month from movement_date)";
      // Make a query to get the total in movements in one year
      const queryTotalInMovementsYear = await _DB.query(
        _queryTotalMovementsInit + "'IN'" + _queryTotalMovementsFinal,
        [company.id]
      );
      /**
       * getting the object formated
       */
      const graphicInMovements = GraphicMovementsForYear(
        queryTotalInMovementsYear.rows
      );
      // Make a query to get the total in movements in one year
      const queryTotalOutMovementsYear = await _DB.query(
        _queryTotalMovementsInit + "'OUT'" + _queryTotalMovementsFinal,
        [company.id]
      );
      /**
       * getting the object formated
       */
      const graphicOutMovements = GraphicMovementsForYear(
        queryTotalOutMovementsYear.rows
      );
      // Make a query to get the products with less stock than min
      const queryProductsWithLessStockThanMin = await _DB.query(
        "SELECT barcode, description, stock, min_stock, measure FROM products WHERE id_company = $1 AND min_stock >= stock",
        [company.id]
      );
      // Fomat the response
      const response = {
        totalProducts,
        totalInMovements,
        totalOutMovements,
        productsWithLowStock: queryProductsWithLessStockThanMin.rows,
        graphicInMovements,
        graphicOutMovements,
      };
      // Call the helper function to return the response
      return ServerResponse.success("Datos de dashboard", 200, response, res);
    } catch (error: any) {
      // Call the helper function to return the response
      return ServerResponse.error("Error al loguearse", 500, error, res);
    }
  }
}

export default new DashboardService();
