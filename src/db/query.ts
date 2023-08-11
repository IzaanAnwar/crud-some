import { DatabaseConnection, connectDatabase } from "./connection";
import { Client as PGClient } from "pg";
import { Database, Database as SQLiteDatabase } from "sqlite3";

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
            await new Promise<void>((resolve, reject) => {
                db.run(query, (error) => {
                    if (error) {
                        reject(error);
                    } else {
                        console.log(query);
                        resolve();
                    }
                });
            });
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
            return await new Promise<any[]>((resolve, reject) => {
                db.all(query, (error, rows) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(rows);
                    }
                });
            });
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
    const condition = where[tableName];

    const columns = Object.keys(condition).join(" AND ");
    const values = Object.values(condition).join(" AND ");

    const query = `SELECT * FROM ${tableName} WHERE ${columns} = ${values}`;
    let result: any;
    try {
        if (db instanceof PGClient) {
            result = await db.query(query);
        } else if (db instanceof Database) {
            result = await new Promise<any[]>((resolve, reject) => {
                console.log("heer", query);

                db.all(query, (error, rows) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(rows);
                    }
                });
            });
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
    const condition = where[tableName];

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
        } else if (db instanceof Database) {
            result = await new Promise<any[]>((resolve, reject) => {
                db.all(query, (error, rows) => {
                    if (error) {
                        reject(error);
                    } else {
                        console.log(query);
                        resolve(rows);
                    }
                });
            });
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
    const condition = where[tableName];

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
        } else if (db instanceof Database) {
            await new Promise<any[]>((resolve, reject) => {
                db.all(query, (error, rows) => {
                    if (error) {
                        reject(error);
                    } else {
                        console.log(query);
                        resolve(rows);
                    }
                });
            });
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
        } else if (db instanceof Database) {
            await new Promise<void>((resolve, reject) => {
                db.run(query, (error) => {
                    if (error) {
                        reject(error);
                    } else {
                        console.log(query);
                        resolve();
                    }
                });
            });
        } else {
            await db.query(query);
            console.log(query);
        }
    } catch (error) {
        console.log(error, `\nfor query [${query}]`);
        throw error;
    }
}
