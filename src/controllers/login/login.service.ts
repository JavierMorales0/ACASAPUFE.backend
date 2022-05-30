import { Request, Response } from "express";
import { validationResult } from "express-validator";
import _DB from "../../db/PostgreSqlConnection";
import ServerResponse from "../../helpers/ServerResponse";

class LoginService {
  /**
   * Valida el usuario y la contraseña para loguearse
   */
  public async login(req: Request, res: Response) {
    try {
      // Validate the request
      const errors = validationResult(req);
      // Verify if the request has errors
      if (!errors.isEmpty()) {
        // Call the helper function to return the response
        return ServerResponse.error(
          "Error de validación",
          422,
          errors.array(),
          res,
          "Revise los campos enviados"
        );
      }
      // Get the username and password from the request
      const { username, password } = req.body;
      // Make a query to the DB and get the user
      const data = await _DB.query("SELECT * FROM usuarios ");
      // If there is not a user with the username and password
      if (data.rowCount === 0) {
        // Call the helper function to return the response
        return ServerResponse.error(
          "Error al loguearse",
          401,
          "El usuario o la contraseña no son correctos",
          res
        );
      }
      // Call the helper function to return the response
      return ServerResponse.success(
        "Login con éxito",
        200,
        {
          token: "token",
        },
        res
      );
    } catch (error) {
      return ServerResponse.error("Error al loguearse", 500, error, res);
    }
  }
}

export default new LoginService();
