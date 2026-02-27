import { getPool } from "./db.js";

getPool()
    .then(() => console.log("✅ DB Connected"))
    .catch(e => console.error("❌ DB FAILED", e));
