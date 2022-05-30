import "dotenv/config";

class EnvironmentVariable {
  // Get the environment variable JWT_SECRET
  public getJwtSecret() {
    return process.env.JWT_SECRET || "";
  }
}

export default new EnvironmentVariable();
