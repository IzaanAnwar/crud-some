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
