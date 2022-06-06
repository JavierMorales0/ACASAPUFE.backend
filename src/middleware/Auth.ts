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

  public async verifyCompanyInToken(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      // Verify if exists req.token
      if (!req.token) {
        return ServerResponse.error(
          "Error al verificar el token",
          401,
          "No se ha enviado el token",
          res
        );
      }
      // Get the data from req.token
      const company = req.token.company || null;
      // Verify if company is not null
      if (company === null) {
        return ServerResponse.error(
          "Error al verificar datos de empresa en token",
          401,
          "No existe una empresa relacionada a su sesión. Por favor cree una empresa" +
            " para acceder a esta sección o si ya posee una inicie sesión nuevamente",
          res
        );
      }
      next();
    } catch (error) {
      // Call the helper function to return the response
      return ServerResponse.error(
        "Error al verificar los datos de empresa en token",
        500,
        error,
        res
      );
    }
  }
}

export default new Auth();
