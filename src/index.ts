import { Database } from "sqlite3";
import { connectDatabase } from "./db/connection";

async function main() {
    const db = await connectDatabase("sqlite", { fileName: "memory.db" });
    const table = "user";
    const data = {
        name: "iz",
        age: 24,
    };
}

main();
