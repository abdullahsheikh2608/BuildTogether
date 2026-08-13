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

// Postgres error codes / Node error codes that mean "the connection
// dropped mid-query" rather than "the query itself is wrong" — safe
// to transparently retry once. Anything else (bad SQL, constraint
// violation, etc.) is re-thrown immediately since retrying won't help.
const TRANSIENT_ERROR_CODES = new Set([
    "ECONNRESET",
    "ECONNREFUSED",
    "ETIMEDOUT",
    "57P01", // admin_shutdown
    "57P02", // crash_shutdown
    "57P03", // cannot_connect_now
    "08006", // connection_failure
    "08003", // connection_does_not_exist
]);

// Same signature as pool.query, but retries once (after a short delay)
// if the failure looks like a dropped/blipped connection rather than
// an actual query error. Use this for calls where a one-off network
// hiccup shouldn't surface as a 500 to the user (e.g. auth/me on
// page load).
export const queryWithRetry = async (text, params, retriesLeft = 1) => {
    try {
        return await pool.query(text, params);
    } catch (err) {
        if (retriesLeft > 0 && TRANSIENT_ERROR_CODES.has(err.code)) {
            await new Promise((resolve) => setTimeout(resolve, 300));
            return queryWithRetry(text, params, retriesLeft - 1);
        }
        throw err;
    }
};

export default pool;