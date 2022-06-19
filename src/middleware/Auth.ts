import Token from "../helpers/Token";
import ServerResponse from "../helpers/ServerResponse";
import { NextFunction, Response, Request } from "express";

class Auth {
  public async verifyToken(req: Request, res: Response, next: NextFunction) {
    try {
      // Verify if the headers authorization is valid
      if (!req.headers.authorization) {
        return ServerResponse.error(
          "Error al verificar el token",
          401,
          "No se ha enviado el token",
          res
        );
      }
      // Get the token from the request
      const token = req.headers.authorization.split(" ")[1];
      // Verify if the token is valid
      const data = await Token.verifyToken(token);
      // Save the user id in the request
      req.token = data;
      // Call the next function
      next();
    } catch (error) {
      // Call the helper function to return the response
      return ServerResponse.error(
        "Error al verificar el token",
        500,
        error,
        res
      );
    }
  }
}

export default new Auth();
