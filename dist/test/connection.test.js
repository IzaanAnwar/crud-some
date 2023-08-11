"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const connection_1 = require("../db/connection");
// import { Client as PGClient } from "pg";
// import {
//     createConnection as createMySQLConnection,
//     Connection as MySQLConnection,
// } from "mysql2/promise";
const sqlite3_1 = require("sqlite3");
describe("createConnection function", () => {
    it("should create a SQLite connection", async () => {
        const config = {
            fileName: "memory.db",
        };
        const dbConnection = (await (0, connection_1.connectDatabase)("sqlite", config));
        expect(dbConnection).toBeInstanceOf(sqlite3_1.Database);
        dbConnection.close();
    });
});
