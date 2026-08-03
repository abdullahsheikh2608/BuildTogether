import pg from "pg";
import "dotenv/config";

const { Pool } = pg;

const pool = new Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

// Without this listener, any network hiccup on an idle connection
// (Postgres restart, laptop sleep, VPN reconnect, etc.) throws an
// unhandled error and crashes the whole Node process. Logging it
// here instead lets the pool quietly recover/reconnect on the next
// query, the way it's designed to.
pool.on("error", (err) => {
    console.error("Unexpected error on idle database client:", err.message);
});

export default pool;