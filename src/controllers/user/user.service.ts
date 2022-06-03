import { Request, Response } from "express";
import { validationResult } from "express-validator";
import _DB from "../../db/PostgreSqlConnection";
import ServerResponse from "../../helpers/ServerResponse";
import Password from "../../helpers/Password";

class UserService {
  // Get all the users
  public async getUsers(req: Request, res: Response) {
    try {
      // Make a query to the DB and get all the users
      const data = await _DB.query("SELECT * FROM users");
      // Call the helper function to return the response
      return ServerResponse.success("Obtener usuarios", 200, data.rows, res);
    } catch (error: any) {
      // Call the helper function to return the response
      return ServerResponse.error("Error al obtener usuarios", 500, error, res);
    }
  }

  // Get a user by email
  public async getUser(req: Request, res: Response) {
    try {
      // Get the email from the params
      const { email } = req.params;
      // Make a query to the DB and get the user
      const data = await _DB.query("SELECT * FROM users WHERE email = $1", [
        email,
      ]);
      // Verify if the user exists
      if (data.rowCount === 0) {
        // Call the helper function to return the response
        return ServerResponse.error(
          "Error al obtener usuario",
          404,
          "El usuario no existe en la base de datos",
          res
        );
      }
      // Call the helper function to return the response
      return ServerResponse.success("Obtener usuario", 200, data.rows, res);
    } catch (error: any) {
      return ServerResponse.error("Error al obtener usuario", 500, error, res);
    }
  }

  // Get companies from a specific user
  public async getUserCompanies(req: Request, res: Response) {
    try {
      // TODO: Use the token payload yo get the user id
      const id = 1;
      // Make a query to the DB and get the companies
      const data = await _DB.query(
        "SELECT * FROM user_companies_view WHERE id_user = $1",
        [id]
      );
      // Call the helper function to return the response
      return ServerResponse.success(
        "Obtener empresas del usuario",
        200,
        data.rows,
        res
      );
    } catch (error: any) {
      // Call the helper function to return the response
      return ServerResponse.error(
        "Error al obtener empresas del usuario",
        500,
        error,
        res
      );
    }
  }

  // Create a new user
  public async createUser(req: Request, res: Response) {
    try {
      // Verify if the request has errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        // Call the helper function to return the response
        return ServerResponse.error(
          "Error al crear usuario",
          422,
          errors.array(),
          res,
          "Revise los campos enviados"
        );
      }
      // Get the body from the request
      const { firstName, lastName, email, password } = req.body;
      // Verify if the user exists
      if (await UserService.verifyExistUser(email)) {
        // Call the helper function to return the response
        return ServerResponse.error(
          "Error al crear usuario",
          409,
          "El usuario ya existe en la base de datos",
          res
        );
      }
      // Create the hash for the password
      const pass_hash = await Password.createHash(password);
      // Make a query to the DB and create the user
      const data = await _DB.query(
        "INSERT INTO users (first_name, last_name, email, pass) VALUES ($1, $2, $3, $4) RETURNING *",
        [firstName, lastName, email, pass_hash]
      );
      // Call the helper function to return the response
      return ServerResponse.success(
        "Crear usuario",
        201,
        data.rows,
        res,
        "El usuario ha sido creado con éxito"
      );
    } catch (error: any) {
      // Call the helper function to return the response
      return ServerResponse.error("Error al crear usuario", 500, error, res);
    }
  }

  // Update a user
  public async updateUser(req: Request, res: Response) {
    try {
      // Verify if the request has errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        // Call the helper function to return the response
        return ServerResponse.error(
          "Error al actualizar usuario",
          422,
          errors.array(),
          res
        );
      }
      // Get the body from the request
      const { firstName, lastName, password } = req.body;
      // Get the usurname from the params
      const { email } = req.params;
      // Verify if the user existss
      if (!(await UserService.verifyExistUser(email))) {
        // Call the helper function to return the response
        return ServerResponse.error(
          "Error al actualizar usuario",
          404,
          "El usuario no existe en la base de datos",
          res
        );
      }
      // Hash the password
      const pass_hash = await Password.createHash(password);
      // Make a query to the DB and update the user
      const data = await _DB.query(
        "UPDATE users SET first_name = $1, last_name = $2, pass = $3 WHERE email = $4 RETURNING *",
        [firstName, lastName, pass_hash, email]
      );
      // Call the helper function to return the response
      return ServerResponse.success("Actualizar usuario", 200, data.rows, res);
    } catch (error: any) {
      // Call the helper function to return the response
      return ServerResponse.error(
        "Error al actualizar usuario",
        500,
        error,
        res
      );
    }
  }

  // Delete a user
  public async deleteUser(req: Request, res: Response) {
    try {
      // Get the email from the params
      const { email } = req.params;
      // Make a query to the DB and delete the user
      const data = await _DB.query(
        "DELETE FROM users WHERE email = $1 RETURNING *",
        [email]
      );
      // Verify if the user exists
      if (data.rowCount === 0) {
        // Call the helper function to return the response
        return ServerResponse.error(
          "Error al eliminar usuario",
          404,
          "El usuario no existe en la base de datos",
          res
        );
      }
      // Call the helper function to return the response
      return ServerResponse.success("Eliminar usuario", 200, data.rows, res);
    } catch (error: any) {
      // Call the helper function to return the response
      return ServerResponse.error("Error al eliminar usuario", 500, error, res);
    }
  }

  // Get true or false if the user exists
  private static async verifyExistUser(email: string) {
    try {
      // Make a query to the DB and get the user
      const data = await _DB.query("SELECT * FROM users WHERE email = $1", [
        email,
      ]);
      // Verify if the user exists
      if (data.rowCount === 0) {
        return false;
      }
      return true;
    } catch (error: any) {
      return false;
    }
  }
}

export default new UserService();
