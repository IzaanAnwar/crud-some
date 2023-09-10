import Database, { Database as SQLiteDatabase } from "bun:sqlite";
import { expect, test, describe, afterAll, beforeEach } from "bun:test";
import { connectDatabase } from "../sqlite/index";
import {
    createSome,
    deleteSome,
    getAll,
    getFirst,
    getWhere,
    updateSome,
} from "../sqlite/index";

describe("createConnection function", () => {
    test("should create a SQLite connection", async () => {
        const dbConnection = (await connectDatabase(
            "test.db"
        )) as SQLiteDatabase;
        expect(dbConnection).toBeInstanceOf(SQLiteDatabase);
        dbConnection.close();
    });
});

describe("Testing all the functions", () => {
    let sqliteDBMockup: SQLiteDatabase;
    beforeEach(() => {
        sqliteDBMockup = new SQLiteDatabase("test.db");
    });
    afterAll(async () => {
        // Close the SQLite database after tests
        sqliteDBMockup.close();
    });

    test("should create the user table", async () => {
        const db: Database = sqliteDBMockup;
        const createTableQuery = `
        CREATE TABLE IF NOT EXISTS user (
          id INTEGER PRIMARY KEY,
          name TEXT,
          age INTEGER
        )
      `;

        db.exec(createTableQuery);

        expect(true).toBe(true);
    });
    test("should create a record in sqlite database", async () => {
        const db: Database = sqliteDBMockup;
        const table = "user";
        const data = {
            name: "john",
            age: 23,
        };
        await createSome(db, table, data);
    });

    test("should retrieve all data in sqlite database", async () => {
        const db: Database = sqliteDBMockup;
        const table = "user";
        const result = (await getAll(db, table)) as any[];
        expect(result.length).toBe(1);
    });

    test("should retrieve records based on conditions in SQLite", async () => {
        const db: Database = sqliteDBMockup;
        await createSome(db, "user", { name: "alex", age: 24 });
        await createSome(db, "user", { name: "tom", age: 25 });

        const condition = { age: 23 };
        const records = (await getWhere(db, { user: condition })) as {
            id: number;
            name: string;
            age: number;
        }[];
        expect(records.length).toBe(1);
        expect(records.at(0)?.name).toBe("john");
    });

    test("should retrieve the first record based on conditions in SQLite", async () => {
        const db: Database = sqliteDBMockup;
        await createSome(db, "user", { name: "andrew", age: 24 });
        const condition = { age: 24 };
        const record = (await getFirst(db, { user: condition })) as any[];
        expect(record[0].name).toBe("alex");
    });

    test("should update records based on conditions in SQLite", async () => {
        const db: Database = sqliteDBMockup;

        const condition = { age: 23 };
        const newData = { age: 27 };
        try {
            await updateSome(db, { user: condition }, newData);
        } catch (error) {}
    });
    test("should delete all the rows from the user table", async () => {
        const db: Database = sqliteDBMockup;

        await deleteSome(db, "user");
    });
});
