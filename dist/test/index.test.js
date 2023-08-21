var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Database as SQLiteDatabase } from "sqlite3";
import { connectDatabase } from "../index";
import { createSome, deleteSome, getAll, getFirst, getWhere, updateSome, } from "..";
describe("createConnection function", () => {
    it("should create a SQLite connection", () => __awaiter(void 0, void 0, void 0, function* () {
        const config = {
            fileName: "memory.db",
        };
        const dbConnection = (yield connectDatabase("sqlite", config));
        expect(dbConnection).toBeInstanceOf(SQLiteDatabase);
        dbConnection.close();
    }));
});
describe("createSome function", () => {
    let sqliteDBMockup;
    beforeEach(() => {
        sqliteDBMockup = new SQLiteDatabase("test.db");
    });
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        // Close the SQLite database after tests
        sqliteDBMockup.close();
    }));
    it("should create the user table", () => __awaiter(void 0, void 0, void 0, function* () {
        const db = sqliteDBMockup;
        const createTableQuery = `
        CREATE TABLE IF NOT EXISTS user (
          id INTEGER PRIMARY KEY,
          name TEXT,
          age INTEGER
        )
      `;
        try {
            yield new Promise((resolve, reject) => {
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
    }));
    it("should create a record in sqlite database", () => __awaiter(void 0, void 0, void 0, function* () {
        const db = sqliteDBMockup;
        const table = "user";
        const data = {
            name: "john",
            age: 23,
        };
        yield createSome(db, table, data);
    }));
    it("should retrieve all data in sqlite database", () => __awaiter(void 0, void 0, void 0, function* () {
        const db = sqliteDBMockup;
        const table = "user";
        const result = (yield getAll(db, table));
        expect(result.length).toBe(1);
    }));
    it("should retrieve records based on conditions in SQLite", () => __awaiter(void 0, void 0, void 0, function* () {
        const db = sqliteDBMockup;
        yield createSome(db, "user", { name: "alex", age: 24 });
        yield createSome(db, "user", { name: "tom", age: 25 });
        const condition = { age: 23 };
        const records = yield getWhere(db, { user: condition });
        expect(records.length).toBe(1);
        expect(records[0].name).toBe("john");
    }));
    it("should retrieve the first record based on conditions in SQLite", () => __awaiter(void 0, void 0, void 0, function* () {
        const db = sqliteDBMockup;
        yield createSome(db, "user", { name: "andrew", age: 24 });
        const condition = { age: 24 };
        const record = (yield getFirst(db, { user: condition }));
        expect(record[0].name).toBe("alex");
    }));
    it("should update records based on conditions in SQLite", () => __awaiter(void 0, void 0, void 0, function* () {
        const db = sqliteDBMockup;
        const condition = { age: 23 };
        const newData = { age: 27 };
        try {
            yield updateSome(db, { user: condition }, newData);
        }
        catch (error) {
            fail(error);
        }
    }));
    it("should delete all the rows from the user table", () => __awaiter(void 0, void 0, void 0, function* () {
        const db = sqliteDBMockup;
        try {
            yield deleteSome(db, "user");
        }
        catch (error) {
            fail(error);
        }
    }));
});
