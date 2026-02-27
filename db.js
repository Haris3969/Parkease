import sql from "mssql";
import dotenv from "dotenv";

dotenv.config();

const config = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_SERVER,
    database: process.env.DB_DATABASE,
    port: Number(process.env.DB_PORT) || 1433,
    options: {
        encrypt: false,               // true if using Azure
        trustServerCertificate: true  // ok for local dev
    }
};

let poolPromise = null;

export async function getPool() {
    if (!poolPromise) {
        poolPromise = sql.connect(config);
    }
    return poolPromise;
}

export { sql };
