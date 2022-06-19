import { Request, Response } from "express";
import { validationResult } from "express-validator";
import _DB from "../../db/PostgreSqlConnection";
import ServerResponse from "../../helpers/ServerResponse";
import Password from "../../helpers/Password";

class CompanyService {
  // Get all the companies
  public async getCompanies(req: Request, res: Response) {
    try {
      // Make a query to the DB and get all the companies
      const data = await _DB.query(
        "SELECT * FROM companies WHERE id_user = $1",
        [req.token!.id]
      );
      // Call the helper function to return the response
      return ServerResponse.success("Obtener empresas", 200, data.rows, res);
    } catch (error: any) {
      // Call the helper function to return the response
      return ServerResponse.error("Error al obtener empresas", 500, error, res);
    }
  }

  // Get a company by id
  public async getCompany(req: Request, res: Response) {
    try {
      // Get the id from the params
      const { id } = req.params;
      // Make a query to the DB and get the company
      const data = await _DB.query(
        "SELECT * FROM companies WHERE id = $1 AND id_user = $2",
        [id, req.token!.id]
      );
      // Verify if the company exists
      if (data.rowCount === 0) {
        // Call the helper function to return the response
        return ServerResponse.error(
          "Error al obtener empresa",
          404,
          "La empresa no existe en la base de datos",
          res
        );
      }
      // Call the helper function to return the response
      return ServerResponse.success("Obtener empresa", 200, data.rows, res);
    } catch (error: any) {
      return ServerResponse.error("Error al obtener empresa", 500, error, res);
    }
  }

  // Create a new company
  public async createCompany(req: Request, res: Response) {
    try {
      // Get the body from the request
      const { name, ruc, address, phone, email } = req.body;
      // Verify if the body is valid
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        // Call the helper function to return the response
        return ServerResponse.error(
          "Error al crear empresa",
          422,
          errors.array(),
          res
        );
      }
      // Make a query to the DB and create the company
      const data = await _DB.query(
        "INSERT INTO companies (name, ruc, address, phone, email, id_user) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
        [name, ruc, address, phone, email, req.token!.id]
      );
      // Call the helper function to return the response
      return ServerResponse.success("Crear empresa", 201, data.rows, res);
    } catch (error: any) {
      // Call the helper function to return the response
      return ServerResponse.error("Error al crear empresa", 500, error, res);
    }
  }

  // Update a company
  public async updateCompany(req: Request, res: Response) {
    try {
      // Get the id from the params
      const { id } = req.params;
      // Get the body from the request
      const { name, ruc, address, phone, email } = req.body;
      // Verify if the body is valid
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        // Call the helper function to return the response
        return ServerResponse.error(
          "Error al actualizar empresa",
          422,
          errors.array(),
          res
        );
      }
      // Make a query to the DB and update the company
      const data = await _DB.query(
        "UPDATE companies SET name = $1, ruc = $2, address = $3, phone = $4, email = $5 WHERE id = $6 RETURNING *",
        [name, ruc, address, phone, email, id]
      );
      // Verify if the company exists
      if (data.rowCount === 0) {
        // Call the helper function to return the response
        return ServerResponse.error(
          "Error al actualizar empresa",
          404,
          "La empresa no existe en la base de datos",
          res
        );
      }
      // Call the helper function to return the response
      return ServerResponse.success(
        "Actualizar empresa",
        200,
        data.rows[0],
        res
      );
    } catch (error: any) {
      return ServerResponse.error(
        "Error al actualizar empresa",
        500,
        error,
        res
      );
    }
  }

  // Delete a company
  public async deleteCompany(req: Request, res: Response) {
    try {
      // Get the id from the params
      const { id } = req.params;
      // Make a query to the DB and delete the company
      const data = await _DB.query(
        "DELETE FROM companies WHERE id = $1 AND id_user = $2 RETURNING *",
        [id, req.token!.id]
      );
      // Verify if the company exists
      if (data.rowCount === 0) {
        // Call the helper function to return the response
        return ServerResponse.error(
          "Error al eliminar empresa",
          404,
          "La empresa no existe en la base de datos",
          res
        );
      }
      // Call the helper function to return the response
      return ServerResponse.success("Eliminar empresa", 200, data.rows, res);
    } catch (error: any) {
      return ServerResponse.error("Error al eliminar empresa", 500, error, res);
    }
  }
}

export default new CompanyService();
