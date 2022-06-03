import { Request, Response } from "express";
import { validationResult } from "express-validator";
import _DB from "../../db/PostgreSqlConnection";
import ServerResponse from "../../helpers/ServerResponse";
import Password from "../../helpers/Password";
import Token from "../../helpers/Token";
import ArrayToObject from "../../helpers/ArrayToObject";
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
      // Get the email and password from the request
      const { email, password } = req.body;
      // Make a query to the DB and get the user
      const data = await _DB.query("SELECT * FROM users WHERE email = $1", [
        email,
      ]);

      // If there is not a user with the email and password
      if (data.rowCount === 0) {
        // Call the helper function to return the response
        return ServerResponse.error(
          "Error al loguearse",
          401,
          "El usuario o la contraseña no son correctos",
          res
        );
      }
      // Get only the user object
      const user = ArrayToObject(data.rows);
      // Verify if the user is active
      if (!user.is_active) {
        // Call the helper function to return the response
        return ServerResponse.error(
          "Error al loguearse",
          401,
          "El usuario no está activo",
          res
        );
      }
      // Verify the password
      const isValid = await Password.compare(password, user.pass);
      // If the password is not valid
      if (!isValid) {
        // Call the helper function to return the response
        return ServerResponse.error(
          "Error al loguearse",
          401,
          "El usuario o la contraseña no son correctos",
          res
        );
      }
      //Generate the token with the user data
      const token = Token.generateToken(user);
      // Call the helper function to return the response
      return ServerResponse.success(
        "Login con éxito",
        200,
        {
          token: token,
          email: user.email,
          firstName: user.first_name,
          lastName: user.last_name,
        },
        res
      );
    } catch (error: any) {
      // Call the helper function to return the response
      return ServerResponse.error("Error al loguearse", 500, error, res);
    }
  }
}

export default new LoginService();
