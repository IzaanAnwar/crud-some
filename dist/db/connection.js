"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDatabase = void 0;
const pg_1 = require("pg");
const promise_1 = require("mysql2/promise");
const sqlite3_1 = require("sqlite3");
/**
 * Establishes a connection to the specified database based on the provided configuration.
 * @param databaseType - The type of the database to connect to (postgres, mysql, or sqlite).
 * @param config - The configuration options for connecting to the database.
 * @returns A Promise that resolves with a database connection.
 * @throws {Error} If an unsupported database type is provided or if the configuration is invalid.
 */
async function connectDatabase(databaseType, config) {
    if (databaseType === "postgres" && config) {
        const client = new pg_1.Client(config);
        await client.connect();
        console.log("[Connection established]");
        return client;
    }
    else if (databaseType === "mysql" && config) {
        const connection = (0, promise_1.createConnection)(config);
        console.log("[Connection established]");
        return connection;
    }
    else if (databaseType === "sqlite" && config.fileName) {
        const db = new sqlite3_1.Database(config.fileName);
        console.log("[Connection established]");
        return db;
    }
    else {
        throw new Error(`Unsupported Database ${databaseType} [Musql, postgresql or sqlite]`);
    }
}
exports.connectDatabase = connectDatabase;
