import EnvironmentVariable from "./EnvironmentVariable";
import * as jwt from "jsonwebtoken";
class Token {
  // Configure the JWT token
  private config: any;
  // The private key for the JWT token
  private privateKey: any;
  constructor() {
    // set the private key for the JWT token secret
    this.privateKey = EnvironmentVariable.getJwtSecret();
    // Set the JWT token configuration
    this.config = {
      expiresIn: EnvironmentVariable.getTokenExpirationTime(),
      algorithm: "HS256",
    };
  }
  // Generate a JWT token with the user data
  public generateToken(payload: any) {
    return jwt.sign(payload, this.privateKey, this.config);
  }

  // Verify the JWT token
  public verifyToken(token: any) {
    return jwt.verify(token, this.privateKey, this.config);
  }
}

export default new Token();
