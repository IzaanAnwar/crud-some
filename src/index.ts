import { Database } from "sqlite3";
import { connectDatabase } from "./db/connection";
import { createSome, getAll, getFirst, getWhere, updateSome } from "./db/query";

async function main() {
    const db = (await connectDatabase("sqlite", {
        fileName: "memory.db",
    })) as Database;
    const table = "user";
    const data = {
        name: "Lareb",
        age: 24,
    };
    // const createTableQuery = `
    //   CREATE TABLE IF NOT EXISTS user (
    //     id INTEGER PRIMARY KEY,
    //     name TEXT,
    //     age INTEGER
    //   )
    // `;
    // await db.run(createTableQuery, (error) => {
    //     if (error) {
    //         console.error("Error creating table:", error.message);
    //     } else {
    //         console.log("Table created successfully");
    //     }

    //     // Close the database connection
    //     db.close();
    // });
    // createSome(db, table, data);
    // createSome(db, table, { name: "Izaan", age: 25 });
    // createSome(db, table, { name: "Bhula", age: 25 });

    // const someData = await getWhere(db, {
    //     user: {
    //         age: 25,
    //     },
    // });

    // console.log(someData);

    // const firstD = await getFirst(db, { user: { age: 25 } });
    // console.log(firstD);

    const val = await updateSome(db, { user: { age: 25 } }, { age: 24 });
    console.log(val);
}
main();
