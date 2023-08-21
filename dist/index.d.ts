import { Client as PGClient } from "pg";
import { Connection as MySQLConnection } from "mysql2/promise";
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
export declare function connectDatabase(databaseType: DatabaseType, config: IConfigDB): Promise<DatabaseConnection>;
/**
 * Inserts a new record into the specified table with the provided data.
 * @param db - The database connection.
 * @param tableName - The name of the table.
 * @param data - The data to be inserted.
 * @returns A Promise that resolves when the operation is complete.
 */
export declare function createSome(db: DatabaseConnection, tableName: string, data: Record<string, any>): Promise<void>;
/**
 * Retrieves all records from the specified table.
 * @param db - The database connection.
 * @param tableName - The name of the table.
 * @returns A Promise that resolves with an array of records.
 */
export declare function getAll(db: DatabaseConnection, tableName: string): Promise<any[] | import("pg").QueryResult<any>>;
type Condition = {
    [column: string]: any;
};
type WhereClause = {
    [table: string]: Condition;
};
/**
 * Retrieves records from the specified table based on the provided conditions.
 * @param db - The database connection.
 * @param where - The conditions for filtering records eg. {table: {condtion: condition}}.
 * @returns A Promise that resolves with an array of records.
 */
export declare function getWhere(db: DatabaseConnection, where: WhereClause): Promise<any[]>;
/**
 * Retrieves the first record from the specified table based on the provided conditions.
 * @param db - The database connection.
 * @param where - The conditions for filtering records eg. {table: {condtion: condition}}.
 * @param orderBy - The order of the results (ASC or DESC).
 * @returns A Promise that resolves with the first record that meets the conditions.
 */
export declare function getFirst(db: DatabaseConnection, where: WhereClause, orderBy?: "ASC" | "DESC"): Promise<any>;
/**
 * Updates records in the specified table based on the provided conditions with the new data.
 * @param db - The database connection.
 * @param where - The conditions for filtering records to be updated {user: {age:23}}.
 * @param data - The new data to update the records with {age:23}.
 * @returns A Promise that resolves when the operation is complete.
 */
export declare function updateSome(db: DatabaseConnection, where: WhereClause, data: Record<string, any>): Promise<void>;
export declare function deleteSome(db: DatabaseConnection, tableName: string): Promise<void>;
export {};
