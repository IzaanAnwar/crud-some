var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Client as PGClient } from "pg";
import { createConnection as createMySQLConnection, } from "mysql2/promise";
import { Database as SQLiteDatabase } from "sqlite3";
/**
 * Establishes a connection to the specified database based on the provided configuration.
 * @param databaseType - The type of the database to connect to (postgres, mysql, or sqlite).
 * @param config - The configuration options for connecting to the database.
 * @returns A Promise that resolves with a database connection.
 * @throws {Error} If an unsupported database type is provided or if the configuration is invalid.
 */
export function connectDatabase(databaseType, config) {
    return __awaiter(this, void 0, void 0, function* () {
        if (databaseType === "postgres" && config) {
            const client = new PGClient(config);
            yield client.connect();
            console.log("[Connection established]");
            return client;
        }
        else if (databaseType === "mysql" && config) {
            const connection = createMySQLConnection(config);
            console.log("[Connection established]");
            return connection;
        }
        else if (databaseType === "sqlite" && config.fileName) {
            const db = new SQLiteDatabase(config.fileName);
            console.log("[Connection established]");
            return db;
        }
        else {
            throw new Error(`Unsupported Database ${databaseType} USE ONLY [Mysql, postgresql or sqlite]`);
        }
    });
}
/**
 * Inserts a new record into the specified table with the provided data.
 * @param db - The database connection.
 * @param tableName - The name of the table.
 * @param data - The data to be inserted.
 * @returns A Promise that resolves when the operation is complete.
 */
export function createSome(db, tableName, data) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const columns = Object.keys(data).join(", ");
            const values = Object.values(data)
                .map((value) => (typeof value === "string" ? `"${value}"` : value))
                .join(", ");
            const query = `INSERT INTO ${tableName} (${columns}) VALUES (${values})`;
            if (db instanceof PGClient) {
                yield db.query(query);
                console.log(query);
            }
            else if (db instanceof SQLiteDatabase) {
                yield new Promise((resolve, reject) => {
                    db.run(query, (error) => {
                        if (error) {
                            reject(error);
                        }
                        else {
                            console.log(query);
                            resolve();
                        }
                    });
                });
            }
            else {
                // we will assume that it is MySQLConnection Type ...:) will fix it later
                yield db.query(query);
                console.log(query);
            }
        }
        catch (error) {
            console.log("CREATE OPERATION FAILED", error);
            throw error;
        }
    });
}
/**
 * Retrieves all records from the specified table.
 * @param db - The database connection.
 * @param tableName - The name of the table.
 * @returns A Promise that resolves with an array of records.
 */
export function getAll(db, tableName) {
    return __awaiter(this, void 0, void 0, function* () {
        const query = `SELECT * FROM ${tableName}`;
        try {
            if (db instanceof PGClient) {
                return yield db.query(query);
            }
            else if (db instanceof SQLiteDatabase) {
                return yield new Promise((resolve, reject) => {
                    db.all(query, (error, rows) => {
                        if (error) {
                            reject(error);
                        }
                        else {
                            resolve(rows);
                        }
                    });
                });
            }
            else {
                return yield db.query(query);
            }
        }
        catch (error) {
            console.log(error, `\nfor query [${query}]`);
            throw error;
        }
    });
}
/**
 * Retrieves records from the specified table based on the provided conditions.
 * @param db - The database connection.
 * @param where - The conditions for filtering records eg. {table: {condtion: condition}}.
 * @returns A Promise that resolves with an array of records.
 */
export function getWhere(db, where) {
    return __awaiter(this, void 0, void 0, function* () {
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
        let result;
        try {
            if (db instanceof PGClient) {
                result = yield db.query(query);
            }
            else if (db instanceof SQLiteDatabase) {
                result = yield new Promise((resolve, reject) => {
                    console.log("heer", query);
                    db.all(query, (error, rows) => {
                        if (error) {
                            reject(error);
                        }
                        else {
                            resolve(rows);
                        }
                    });
                });
            }
            else {
                result = yield db.query(query);
            }
            return result;
        }
        catch (error) {
            console.log(error, `\nfor query [${query}]`);
            throw error;
        }
    });
}
/**
 * Retrieves the first record from the specified table based on the provided conditions.
 * @param db - The database connection.
 * @param where - The conditions for filtering records eg. {table: {condtion: condition}}.
 * @param orderBy - The order of the results (ASC or DESC).
 * @returns A Promise that resolves with the first record that meets the conditions.
 */
export function getFirst(db, where, orderBy = "ASC") {
    return __awaiter(this, void 0, void 0, function* () {
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
        let result;
        try {
            if (db instanceof PGClient) {
                result = yield db.query(query);
                console.log(query);
            }
            else if (db instanceof SQLiteDatabase) {
                result = yield new Promise((resolve, reject) => {
                    db.all(query, (error, rows) => {
                        if (error) {
                            reject(error);
                        }
                        else {
                            console.log(query);
                            resolve(rows);
                        }
                    });
                });
            }
            else {
                result = yield db.query(query);
                console.log(query);
            }
            return result;
        }
        catch (error) {
            console.log(error, `\nfor query [${query}]`);
            throw error;
        }
    });
}
/**
 * Updates records in the specified table based on the provided conditions with the new data.
 * @param db - The database connection.
 * @param where - The conditions for filtering records to be updated {user: {age:23}}.
 * @param data - The new data to update the records with {age:23}.
 * @returns A Promise that resolves when the operation is complete.
 */
export function updateSome(db, where, data) {
    return __awaiter(this, void 0, void 0, function* () {
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
                yield db.query(query);
                console.log(query);
            }
            else if (db instanceof SQLiteDatabase) {
                yield new Promise((resolve, reject) => {
                    db.all(query, (error, rows) => {
                        if (error) {
                            reject(error);
                        }
                        else {
                            console.log(query);
                            resolve(rows);
                        }
                    });
                });
            }
            else {
                yield db.query(query);
                console.log(query);
            }
        }
        catch (error) {
            console.log(error, `\nfor query [${query}]`);
            throw error;
        }
    });
}
export function deleteSome(db, tableName) {
    return __awaiter(this, void 0, void 0, function* () {
        const query = `DELETE FROM ${tableName}`;
        try {
            if (db instanceof PGClient) {
                yield db.query(query);
                console.log(query);
            }
            else if (db instanceof SQLiteDatabase) {
                yield new Promise((resolve, reject) => {
                    db.run(query, (error) => {
                        if (error) {
                            reject(error);
                        }
                        else {
                            console.log(query);
                            resolve();
                        }
                    });
                });
            }
            else {
                yield db.query(query);
                console.log(query);
            }
        }
        catch (error) {
            console.log(error, `\nfor query [${query}]`);
            throw error;
        }
    });
}
