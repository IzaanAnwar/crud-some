import { Database } from "sqlite3";
import { DatabaseConnection, connectDatabase } from "../db/connection";
import {
    createSome,
    deleteSome,
    getAll,
    getFirst,
    getWhere,
    updateSome,
} from "../db/query";

describe("createSome function", () => {
    let sqliteDBMockup: Database;
    beforeEach(() => {
        sqliteDBMockup = new Database("memory.db");
    });
    afterAll(async () => {
        // Close the SQLite database after tests
        sqliteDBMockup.close();
    });

    it("should create the user table", async () => {
        const db: DatabaseConnection = sqliteDBMockup;
        const createTableQuery = `
        CREATE TABLE IF NOT EXISTS user (
          id INTEGER PRIMARY KEY,
          name TEXT,
          age INTEGER
        )
      `;

        try {
            await new Promise<void>((resolve, reject) => {
                db.run(createTableQuery, (error) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve();
                    }
                    db.close();
                });
            });
        } catch (error) {
            fail(error);
        }
        expect(true).toBe(true);
    });
    it("should create a record in sqlite database", async () => {
        const db: DatabaseConnection = sqliteDBMockup;
        const table = "user";
        const data = {
            name: "john",
            age: 23,
        };
        await createSome(db, table, data);
    });

    it("should retrieve all data in sqlite database", async () => {
        const db: DatabaseConnection = sqliteDBMockup;
        const table = "user";
        const result = (await getAll(db, table)) as any[];
        expect(result.length).toBe(1);
    });

    it("should retrieve records based on conditions in SQLite", async () => {
        const db: DatabaseConnection = sqliteDBMockup;
        await createSome(db, "user", { name: "alex", age: 24 });
        await createSome(db, "user", { name: "tom", age: 25 });

        const condition = { age: 23 };
        const records = await getWhere(db, { user: condition });
        expect(records.length).toBe(1);
        expect(records[0].name).toBe("john");
    });

    it("should retrieve the first record based on conditions in SQLite", async () => {
        const db: DatabaseConnection = sqliteDBMockup;
        await createSome(db, "user", { name: "andrew", age: 24 });
        const condition = { age: 24 };
        const record = (await getFirst(db, { user: condition })) as any[];
        expect(record[0].name).toBe("alex");
    });

    it("should update records based on conditions in SQLite", async () => {
        const db: DatabaseConnection = sqliteDBMockup;

        const condition = { age: 23 };
        const newData = { age: 27 };
        try {
            await updateSome(db, { user: condition }, newData);
        } catch (error) {
            fail(error);
        }
    });
    it("should delete all the rows from the user table", async () => {
        const db: DatabaseConnection = sqliteDBMockup;
        try {
            await deleteSome(db, "user");
        } catch (error) {
            fail(error);
        }
    });
});
