import "dotenv/config";

class EnvironmentVariable {
  // Get the environment variable JWT_SECRET
  public getJwtSecret() {
    return process.env.JWT_SECRET || "";
  }

  // Get the token expiration time
  public getTokenExpirationTime() {
    return process.env.TOKEN_EXPIRATION_TIME || "";
  }

  // Get the connection string for the database
  public getDbConnectionString() {
    return process.env.DB_CONNECTION_STRING || "";
  }

  // Get the environment variable PORT
  public getPort() {
    return process.env.PORT || "";
  }
}

export default new EnvironmentVariable();
