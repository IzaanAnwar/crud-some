import { Database } from "sqlite3";
import { connectDatabase } from "./db/connection";
import { createSome, getAll, getWhere } from "./db/query";

async function main() {
    const db = await connectDatabase("sqlite", { fileName: "memory.db" });
    const table = "user";
    const data = {
        name: "iz",
        age: 24,
    };
    const createTableQuery = `
  CREATE TABLE IF NOT EXISTS user (
    id INTEGER PRIMARY KEY,
    name TEXT,
    age INTEGER
  )
`;
    const someData = await getWhere(db, {
        user: {
            age: 23,
        },
    });
    console.log(someData);
}

main();
