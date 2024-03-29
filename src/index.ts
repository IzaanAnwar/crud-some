import { Client as PGClient } from "pg";
import {
    createConnection as createMySQLConnection,
    Connection as MySQLConnection,
} from "mysql2/promise";
import { Database as SQLiteDatabase, SQLQueryBindings } from "bun:sqlite";

/** Supported database types. */
type DatabaseType = "postgres" | "mysql" | "sqlite";

/**
 * Configuration options for connecting to a database.
 */
export interface IConfigDB {
    databaseType: DatabaseType;
    user?: string;
    host?: string;
    database?: string;
    password?: string;
    port?: number;
    fileName?: string;
    connectionURL?: string;
}
/** Represents a connection to a database. */
export type DatabaseConnection = any;

/**
 * Establishes a connection to the specified database based on the provided configuration.
 * @param databaseType - The type of the database to connect to (postgres, mysql, or sqlite).
 * @param config - The configuration options for connecting to the database.
 * @returns A Promise that resolves with a database connection.
 * @throws {Error} If an unsupported database type is provided or if the configuration is invalid.
 */
export async function connectDatabase(
    config: IConfigDB
): Promise<DatabaseConnection> {
    const { databaseType } = config;
    if (config && config.databaseType) {
        let databaseDriver;
        switch (databaseType) {
            case "postgres":
                databaseDriver = await import("pg");
                const client = new databaseDriver.Client(config);
                await client.connect();
                console.log("[Connection established]");
                return client;
            case "mysql":
                databaseDriver = await import("mysql2/promise");
                const connection = databaseDriver.createConnection(config);
                console.log("[Connection established]");
                return connection;
            case "sqlite":
                databaseDriver = await import("bun:sqlite");
                const db = new databaseDriver.Database(config.fileName);
                console.log("[Connection established]");
                return db;
            default:
                throw new Error(`Unsupported Database Type: ${databaseType}`);
        }
    }
}

/**
 * Inserts a new record into the specified table with the provided data.
 * @param db - The database connection.
 * @param tableName - The name of the table.
 * @param data - The data to be inserted.
 * @returns A Promise that resolves when the operation is complete.
 */
export async function createSome(
    db: DatabaseConnection,
    tableName: string,
    data: Record<string, any>
): Promise<void> {
    try {
        const columns = Object.keys(data).join(", ");
        const values = Object.values(data)
            .map((value) => (typeof value === "string" ? `"${value}"` : value))
            .join(", ");
        const query = `INSERT INTO ${tableName} (${columns}) VALUES (${values})`;
        if (db instanceof PGClient) {
            await db.query(query);
            console.log(query);
        } else if (db instanceof SQLiteDatabase) {
            db.exec(query);
            query;
        } else {
            // we will assume that it is MySQLConnection Type ...:) will fix it later
            await db.query(query);
            console.log(query);
        }
    } catch (error: any) {
        console.log("CREATE OPERATION FAILED", error);
        throw error;
    }
}

/**
 * Retrieves all records from the specified table.
 * @param db - The database connection.
 * @param tableName - The name of the table.
 * @returns A Promise that resolves with an array of records.
 */
export async function getAll(db: DatabaseConnection, tableName: string) {
    const query = `SELECT * FROM ${tableName}`;
    try {
        if (db instanceof PGClient) {
            return await db.query(query);
        } else if (db instanceof SQLiteDatabase) {
            return await db.query(query).get();
        } else {
            return await db.query(query);
        }
    } catch (error) {
        console.log(error, `\nfor query [${query}]`);
        throw error;
    }
}

type Condition = { [column: string]: any };
type WhereClause = { [table: string]: Condition };

/**
 * Retrieves records from the specified table based on the provided conditions.
 * @param db - The database connection.
 * @param where - The conditions for filtering records eg. {table: {condtion: condition}}.
 * @returns A Promise that resolves with an array of records.
 */
export async function getWhere(
    db: DatabaseConnection,
    where: WhereClause
): Promise<any[]> {
    const tableName = Object.keys(where)[0];
    if (!tableName || tableName === "") {
        throw new Error("Table Name Not Provided");
    }
    const condition = where[tableName];
    if (!condition) {
        throw new Error("Condition Not Provided or is Inncorrect");
    }

    const columns = Object.keys(condition).join(" AND ");
    const values = Object.values(condition).join(" AND ");

    const query = `SELECT * FROM ${tableName} WHERE ${columns} = ${values}`;
    let result: any;
    try {
        if (db instanceof PGClient) {
            result = await db.query(query);
        } else if (db instanceof SQLiteDatabase) {
            result = await db.query(query).get();
        } else {
            result = await db.query(query);
        }
        return result;
    } catch (error) {
        console.log(error, `\nfor query [${query}]`);
        throw error;
    }
}

/**
 * Retrieves the first record from the specified table based on the provided conditions.
 * @param db - The database connection.
 * @param where - The conditions for filtering records eg. {table: {condtion: condition}}.
 * @param orderBy - The order of the results (ASC or DESC).
 * @returns A Promise that resolves with the first record that meets the conditions.
 */
export async function getFirst(
    db: DatabaseConnection,
    where: WhereClause,
    orderBy: "ASC" | "DESC" = "ASC"
) {
    const tableName = Object.keys(where)[0];
    if (!tableName || tableName === "") {
        throw new Error("Table Name Not Provided");
    }
    const condition = where[tableName];
    if (!condition) {
        throw new Error("Condition Not Provided or is Inncorrect");
    }

    const columns = Object.keys(condition).join(" AND ");
    const values = Object.values(condition)
        .map((value) => (typeof value === "string" ? `'${value}'` : value))
        .join(" AND ");

    const query = `SELECT * FROM ${tableName} WHERE ${columns} = ${values} ORDER BY ROWID ${orderBy} LIMIT 1`;
    let result: any;
    try {
        if (db instanceof PGClient) {
            result = await db.query(query);
            console.log(query);
        } else if (db instanceof SQLiteDatabase) {
            result = await db.query(query).get();
        } else {
            result = await db.query(query);
            console.log(query);
        }
        return result;
    } catch (error) {
        console.log(error, `\nfor query [${query}]`);
        throw error;
    }
}

/**
 * Updates records in the specified table based on the provided conditions with the new data.
 * @param db - The database connection.
 * @param where - The conditions for filtering records to be updated {user: {age:23}}.
 * @param data - The new data to update the records with {age:23}.
 * @returns A Promise that resolves when the operation is complete.
 */
export async function updateSome(
    db: DatabaseConnection,
    where: WhereClause,
    data: Record<string, any>
): Promise<void> {
    const tableName = Object.keys(where)[0];
    if (!tableName || tableName === "") {
        throw new Error("Table Name Not Provided");
    }

    const condition = where[tableName];
    if (!condition) {
        throw new Error("Condition Not Provided or is Inncorrect");
    }

    const ConditionCol = Object.keys(condition).join(" AND ");
    const ConditionVal = Object.values(condition)
        .map((value) => (typeof value === "string" ? `'${value}'` : value))
        .join(" AND ");

    const columns = Object.keys(data).join(", ");
    const values = Object.values(data);

    const query = `UPDATE ${tableName} SET ${columns} = ${values} WHERE ${ConditionCol} = ${ConditionVal}`;

    try {
        if (db instanceof PGClient) {
            await db.query(query);
            console.log(query);
        } else if (db instanceof SQLiteDatabase) {
            db.exec(query);
        } else {
            await db.query(query);
            console.log(query);
        }
    } catch (error) {
        console.log(error, `\nfor query [${query}]`);
        throw error;
    }
}

export async function deleteSome(db: DatabaseConnection, tableName: string) {
    const query = `DELETE FROM ${tableName}`;
    try {
        if (db instanceof PGClient) {
            await db.query(query);
            console.log(query);
        } else if (db instanceof SQLiteDatabase) {
            db.exec(query);
        } else {
            await db.query(query);
            console.log(query);
        }
    } catch (error) {
        console.log(error, `\nfor query [${query}]`);
        throw error;
    }
}
