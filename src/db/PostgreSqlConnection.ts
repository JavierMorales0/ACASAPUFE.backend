import { Client } from "pg";
import config from "./config";

// Clase de la conexion a POSTGRESQL con TypeScript
class PostgreSqlConnection {
  // Objeto de conexion a la base de datos
  public conn: Client;
  // Constructor de la clase donde se inicializa la conexion a la base de datos
  constructor() {
    this.conn = new Client({
      connectionString: config.connectionString,
      ssl: {
        rejectUnauthorized: false,
      },
    });
    this.conn.connect();
  }

  // Destructor de la clase
  public async destroy(): Promise<void> {
    await this.conn.end();
  }

  // Metodo para hacer cualquier consulta a la base de datos por medio de un string
  public async query(query: string, params?: Array<any> ): Promise<any> {
      console.log(params)
    return this.conn.query(query, params);
  }

}

export default new PostgreSqlConnection();
