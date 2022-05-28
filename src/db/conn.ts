import { Client } from "pg";
import config from "./config";

const conn = new Client({
  connectionString: config.connectionString,
  ssl: {
    rejectUnauthorized: false,
  },
});
conn.connect();

export default conn;
