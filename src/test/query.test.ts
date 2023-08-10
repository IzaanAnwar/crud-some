import { Database } from "sqlite3";
import { DatabaseConnection, connectDatabase } from "../db/connection";
import { createSome } from "../db/query";

describe("createSome function", () => {
    let sqliteDBMockup: Database;
    beforeEach(() => {
        sqliteDBMockup = {} as Database;
        sqliteDBMockup.run = jest.fn();
    });

    it("should create a record in sqlite database", async () => {
        const db: DatabaseConnection = sqliteDBMockup;
        const table = "test_table";
        const data = {
            name: "john",
            age: 23,
            address: "Delhi",
        };
        await createSome(db, table, data);
    });
});
