import { Client as PGClient } from "pg";
import {
    createConnection as createMySQLConnection,
    Connection as MySQLConnection,
} from "mysql2/promise";
import { Database as SQLiteDatabase } from "sqlite3";

export interface IConfigDB {
    user?: string;
    host?: string;
    database?: string;
    password?: string;
    port?: number;
    fileName?: string;
    connectionURL?: string;
}
export type DatabaseConnection = PGClient | MySQLConnection | SQLiteDatabase;
type DatabaseType = "postgres" | "mysql" | "sqlite";
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
