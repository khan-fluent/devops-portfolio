import pg from "pg";

const poolConfig = process.env.DATABASE_URL
  ? { connectionString: process.env.DATABASE_URL }
  : {
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT || "5432", 10),
      database: process.env.DB_NAME,
      user: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      ssl: process.env.DB_SSL === "false" ? false : { rejectUnauthorized: false },
    };

const pool = new pg.Pool(poolConfig);

pool.on("error", (err) => {
  console.error("Unexpected error on idle client", err);
});

export async function query(text, params) {
  const result = await pool.query(text, params);
  return result;
}

export default pool;
