import pg from "pg";

const Pool = pg.Pool;

const pool = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.HOST,
  port: Number(process.env.DB_PORT) || 5432,
  database: "knowledge"
});

export default pool;
