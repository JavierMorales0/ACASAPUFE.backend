import EnvironmentVariable from "../helpers/EnvironmentVariable";

export default {
  connectionString: EnvironmentVariable.getDbConnectionString(),
};
