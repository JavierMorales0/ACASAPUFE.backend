import "dotenv/config";

export default {
  connectionString: process.env.DB_CONNECTION_STRING || "",
};
