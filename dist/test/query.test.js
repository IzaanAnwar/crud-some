"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sqlite3_1 = require("sqlite3");
const query_1 = require("../db/query");
describe("createSome function", () => {
    let sqliteDBMockup;
    beforeEach(() => {
        sqliteDBMockup = new sqlite3_1.Database("memory.db");
    });
    afterAll(async () => {
        // Close the SQLite database after tests
        sqliteDBMockup.close();
    });
    it("should create the user table", async () => {
        const db = sqliteDBMockup;
        const createTableQuery = `
        CREATE TABLE IF NOT EXISTS user (
          id INTEGER PRIMARY KEY,
          name TEXT,
          age INTEGER
        )
      `;
        try {
            await new Promise((resolve, reject) => {
                db.run(createTableQuery, (error) => {
                    if (error) {
                        reject(error);
                    }
                    else {
                        resolve();
                    }
                    db.close();
                });
            });
        }
        catch (error) {
            fail(error);
        }
        expect(true).toBe(true);
    });
    it("should create a record in sqlite database", async () => {
        const db = sqliteDBMockup;
        const table = "user";
        const data = {
            name: "john",
            age: 23,
        };
        await (0, query_1.createSome)(db, table, data);
    });
    it("should retrieve all data in sqlite database", async () => {
        const db = sqliteDBMockup;
        const table = "user";
        const result = (await (0, query_1.getAll)(db, table));
        expect(result.length).toBe(1);
    });
    it("should retrieve records based on conditions in SQLite", async () => {
        const db = sqliteDBMockup;
        await (0, query_1.createSome)(db, "user", { name: "alex", age: 24 });
        await (0, query_1.createSome)(db, "user", { name: "tom", age: 25 });
        const condition = { age: 23 };
        const records = await (0, query_1.getWhere)(db, { user: condition });
        expect(records.length).toBe(1);
        expect(records[0].name).toBe("john");
    });
    it("should retrieve the first record based on conditions in SQLite", async () => {
        const db = sqliteDBMockup;
        await (0, query_1.createSome)(db, "user", { name: "andrew", age: 24 });
        const condition = { age: 24 };
        const record = (await (0, query_1.getFirst)(db, { user: condition }));
        expect(record[0].name).toBe("alex");
    });
    it("should update records based on conditions in SQLite", async () => {
        const db = sqliteDBMockup;
        const condition = { age: 23 };
        const newData = { age: 27 };
        try {
            await (0, query_1.updateSome)(db, { user: condition }, newData);
        }
        catch (error) {
            fail(error);
        }
    });
    it("should delete all the rows from the user table", async () => {
        const db = sqliteDBMockup;
        try {
            await (0, query_1.deleteSome)(db, "user");
        }
        catch (error) {
            fail(error);
        }
    });
});
