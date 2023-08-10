import { connectDatabase, IConfigDB } from "../db/connection";
// import { Client as PGClient } from "pg";
// import {
//     createConnection as createMySQLConnection,
//     Connection as MySQLConnection,
// } from "mysql2/promise";
import { Database as SQLiteDatabase } from "sqlite3";

describe("createConnection function", () => {
    it("should create a SQLite connection", async () => {
        const config: IConfigDB = {
            fileName: ":memory:", // You can provide a path to a file if needed
        };

        const dbConnection = (await connectDatabase(
            "sqlite",
            config
        )) as SQLiteDatabase;
        expect(dbConnection).toBeInstanceOf(SQLiteDatabase);
        dbConnection.close();
    });
});
