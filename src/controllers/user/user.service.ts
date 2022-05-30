import { Request, Response } from "express";
import { validationResult } from "express-validator";
import _DB from "../../db/PostgreSqlConnection";
import ServerResponse from "../../helpers/ServerResponse";

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

  // Get a user by username
  public async getUser(req: Request, res: Response) {
    try {
      // Get the username from the params
      const { username } = req.params;
      // Make a query to the DB and get the user
      const data = await _DB.query("SELECT * FROM users WHERE username = $1", [
        username,
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
      const { firstName, lastName, username, password } = req.body;
      // Make a query to the DB and create the user
      const data = await _DB.query(
        "INSERT INTO users (first_name, last_name, username, pass) VALUES ($1, $2, $3, $4) RETURNING *",
        [firstName, lastName, username, password]
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
      const { username } = req.params;
      // Make a query to the DB and update the user
      const data = await _DB.query(
        "UPDATE users SET first_name = $1, last_name = $2, pass = $3 WHERE username = $4 RETURNING *",
        [firstName, lastName, password, username]
      );
      // Verify if the user exists
      if (data.rowCount === 0) {
        // Call the helper function to return the response
        return ServerResponse.error(
          "Error al actualizar usuario",
          404,
          "El usuario no existe en la base de datos",
          res
        );
      }
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
      // Get the username from the params
      const { username } = req.params;
      // Make a query to the DB and delete the user
      const data = await _DB.query(
        "DELETE FROM users WHERE username = $1 RETURNING *",
        [username]
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
}

export default new UserService();
