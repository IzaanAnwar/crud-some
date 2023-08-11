"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteSome = exports.updateSome = exports.getFirst = exports.getWhere = exports.getAll = exports.createSome = void 0;
const pg_1 = require("pg");
const sqlite3_1 = require("sqlite3");
/**
 * Inserts a new record into the specified table with the provided data.
 * @param db - The database connection.
 * @param tableName - The name of the table.
 * @param data - The data to be inserted.
 * @returns A Promise that resolves when the operation is complete.
 */
async function createSome(db, tableName, data) {
    try {
        const columns = Object.keys(data).join(", ");
        const values = Object.values(data)
            .map((value) => (typeof value === "string" ? `"${value}"` : value))
            .join(", ");
        const query = `INSERT INTO ${tableName} (${columns}) VALUES (${values})`;
        if (db instanceof pg_1.Client) {
            await db.query(query);
            console.log(query);
        }
        else if (db instanceof sqlite3_1.Database) {
            await new Promise((resolve, reject) => {
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
            await db.query(query);
            console.log(query);
        }
    }
    catch (error) {
        console.log("CREATE OPERATION FAILED", error);
        throw error;
    }
}
exports.createSome = createSome;
/**
 * Retrieves all records from the specified table.
 * @param db - The database connection.
 * @param tableName - The name of the table.
 * @returns A Promise that resolves with an array of records.
 */
async function getAll(db, tableName) {
    const query = `SELECT * FROM ${tableName}`;
    try {
        if (db instanceof pg_1.Client) {
            return await db.query(query);
        }
        else if (db instanceof sqlite3_1.Database) {
            return await new Promise((resolve, reject) => {
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
            return await db.query(query);
        }
    }
    catch (error) {
        console.log(error, `\nfor query [${query}]`);
        throw error;
    }
}
exports.getAll = getAll;
/**
 * Retrieves records from the specified table based on the provided conditions.
 * @param db - The database connection.
 * @param where - The conditions for filtering records eg. {table: {condtion: condition}}.
 * @returns A Promise that resolves with an array of records.
 */
async function getWhere(db, where) {
    const tableName = Object.keys(where)[0];
    const condition = where[tableName];
    const columns = Object.keys(condition).join(" AND ");
    const values = Object.values(condition).join(" AND ");
    const query = `SELECT * FROM ${tableName} WHERE ${columns} = ${values}`;
    let result;
    try {
        if (db instanceof pg_1.Client) {
            result = await db.query(query);
        }
        else if (db instanceof sqlite3_1.Database) {
            result = await new Promise((resolve, reject) => {
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
            result = await db.query(query);
        }
        return result;
    }
    catch (error) {
        console.log(error, `\nfor query [${query}]`);
        throw error;
    }
}
exports.getWhere = getWhere;
/**
 * Retrieves the first record from the specified table based on the provided conditions.
 * @param db - The database connection.
 * @param where - The conditions for filtering records eg. {table: {condtion: condition}}.
 * @param orderBy - The order of the results (ASC or DESC).
 * @returns A Promise that resolves with the first record that meets the conditions.
 */
async function getFirst(db, where, orderBy = "ASC") {
    const tableName = Object.keys(where)[0];
    const condition = where[tableName];
    const columns = Object.keys(condition).join(" AND ");
    const values = Object.values(condition)
        .map((value) => (typeof value === "string" ? `'${value}'` : value))
        .join(" AND ");
    const query = `SELECT * FROM ${tableName} WHERE ${columns} = ${values} ORDER BY ROWID ${orderBy} LIMIT 1`;
    let result;
    try {
        if (db instanceof pg_1.Client) {
            result = await db.query(query);
            console.log(query);
        }
        else if (db instanceof sqlite3_1.Database) {
            result = await new Promise((resolve, reject) => {
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
            result = await db.query(query);
            console.log(query);
        }
        return result;
    }
    catch (error) {
        console.log(error, `\nfor query [${query}]`);
        throw error;
    }
}
exports.getFirst = getFirst;
/**
 * Updates records in the specified table based on the provided conditions with the new data.
 * @param db - The database connection.
 * @param where - The conditions for filtering records to be updated {user: {age:23}}.
 * @param data - The new data to update the records with {age:23}.
 * @returns A Promise that resolves when the operation is complete.
 */
async function updateSome(db, where, data) {
    const tableName = Object.keys(where)[0];
    const condition = where[tableName];
    const ConditionCol = Object.keys(condition).join(" AND ");
    const ConditionVal = Object.values(condition)
        .map((value) => (typeof value === "string" ? `'${value}'` : value))
        .join(" AND ");
    const columns = Object.keys(data).join(", ");
    const values = Object.values(data);
    const query = `UPDATE ${tableName} SET ${columns} = ${values} WHERE ${ConditionCol} = ${ConditionVal}`;
    try {
        if (db instanceof pg_1.Client) {
            await db.query(query);
            console.log(query);
        }
        else if (db instanceof sqlite3_1.Database) {
            await new Promise((resolve, reject) => {
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
            await db.query(query);
            console.log(query);
        }
    }
    catch (error) {
        console.log(error, `\nfor query [${query}]`);
        throw error;
    }
}
exports.updateSome = updateSome;
async function deleteSome(db, tableName) {
    const query = `DELETE FROM ${tableName}`;
    try {
        if (db instanceof pg_1.Client) {
            await db.query(query);
            console.log(query);
        }
        else if (db instanceof sqlite3_1.Database) {
            await new Promise((resolve, reject) => {
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
            await db.query(query);
            console.log(query);
        }
    }
    catch (error) {
        console.log(error, `\nfor query [${query}]`);
        throw error;
    }
}
exports.deleteSome = deleteSome;
