import { DatabaseConnection, connectDatabase } from "./connection";
import { Client as PGClient } from "pg";
import { Database, Database as SQLiteDatabase } from "sqlite3";

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
        } else if (db instanceof SQLiteDatabase) {
            await new Promise<void>((resolve, reject) => {
                db.run(query, (error) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve();
                    }
                });
            });
        } else {
            // we will assume that it is MySQLConnection Type ...:) will fix it later
            db.query(query);
        }
    } catch (error: any) {
        console.log("CREATE OPERATION FAILED", error);
        throw error;
    }
}

export async function getAll(db: DatabaseConnection, tableName: string) {
    const query = `SELECT * FROM ${tableName}`;
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
}

type Condition = { [column: string]: any };
type WhereClause = { [table: string]: Condition };
export async function getWhere(db: DatabaseConnection, where: WhereClause) {
    const tableName = Object.keys(where)[0];
    const condition = where[tableName];

    const columns = Object.keys(condition).join(" AND ");
    const values = Object.values(condition).join(" AND ");

    const query = `SELECT * FROM ${tableName} WHERE ${columns} = ${values}`;
    let result: any;

    if (db instanceof PGClient) {
        result = await db.query(query);
    } else if (db instanceof Database) {
        result = await new Promise<void>((resolve, reject) => {
            console.log("heer", query);

            db.run(query, (error) => {
                if (error) {
                    reject(error);
                } else {
                    resolve();
                }
            });
        });
    } else {
        result = await db.query(query);
    }
    console.log("r->", result);

    return result;
}
