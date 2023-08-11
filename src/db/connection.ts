import { Client as PGClient } from "pg";
import {
    createConnection as createMySQLConnection,
    Connection as MySQLConnection,
} from "mysql2/promise";
import { Database as SQLiteDatabase } from "sqlite3";

/**
 * Configuration options for connecting to a database.
 */
export interface IConfigDB {
    user?: string;
    host?: string;
    database?: string;
    password?: string;
    port?: number;
    fileName?: string;
    connectionURL?: string;
}
/** Represents a connection to a database. */
export type DatabaseConnection = PGClient | MySQLConnection | SQLiteDatabase;

/** Supported database types. */
type DatabaseType = "postgres" | "mysql" | "sqlite";

/**
 * Establishes a connection to the specified database based on the provided configuration.
 * @param databaseType - The type of the database to connect to (postgres, mysql, or sqlite).
 * @param config - The configuration options for connecting to the database.
 * @returns A Promise that resolves with a database connection.
 * @throws {Error} If an unsupported database type is provided or if the configuration is invalid.
 */
export async function connectDatabase(
    databaseType: DatabaseType,
    config: IConfigDB
): Promise<DatabaseConnection> {
    if (databaseType === "postgres" && config) {
        const client = new PGClient(config);
        await client.connect();
        console.log("[Connection established]");

        return client;
    } else if (databaseType === "mysql" && config) {
        const connection = createMySQLConnection(config);
        console.log("[Connection established]");

        return connection;
    } else if (databaseType === "sqlite" && config.fileName) {
        const db = new SQLiteDatabase(config.fileName);
        console.log("[Connection established]");

        return db;
    } else {
        throw new Error(
            `Unsupported Database ${databaseType} [Musql, postgresql or sqlite]`
        );
    }
}
