import { Database } from "bun:sqlite";

/**
 * Establishes a connection to the specified database based on the provided configuration.
 * @param dbName - The File Name of your Sqlite Database.
 * @returns A Promise that resolves with a database connection.
 * @throws {Error} Throws error if something went wrong!.
 */
export async function connectDatabase(dbName: string) {
    if (!dbName) {
        throw new Error("File Name Missing");
    }

    try {
        const db = new Database(dbName, { create: true });
        return db;
    } catch (error: any) {
        throw new Error(error);
    }
}

/**
 * Inserts a new record into the specified table with the provided data.
 * @param db - The database connection.
 * @param tableName - The name of the table.
 * @param data - The data to be inserted.
 * @returns A Promise that resolves when the operation is complete.
 */
export async function createSome(
    db: Database,
    tableName: string,
    data: Record<string, any>
) {
    try {
        const columns = Object.keys(data).join(", ");
        const values = Object.values(data)
            .map((value) => (typeof value === "string" ? `"${value}"` : value))
            .join(", ");
        const query = `INSERT INTO ${tableName} (${columns}) VALUES (${values})`;
        if (db && tableName && data && db instanceof Database) {
            db.run(query);
        }
    } catch (error: any) {
        console.log("CREATE OPERATION FAILED", error);
        throw error;
    }
}

/**
 * Retrieves all records from the specified table.
 * @param db - The database connection.
 * @param tableName - The name of the table.
 * @returns A Promise that resolves with an array of records.
 */
export async function getAll(db: Database, tableName: string) {
    const query = `SELECT * FROM ${tableName}`;
    try {
        return db.query(query).all();
    } catch (error) {
        console.log(error, `\nfor query [${query}]`);
        throw error;
    }
}

type Condition = { [column: string]: any };
type WhereClause = { [table: string]: Condition };

/**
 * Retrieves records from the specified table based on the provided conditions.
 * @param db - The database connection.
 * @param where - The conditions for filtering records eg. {table: {condtion: condition}}.
 * @returns A Promise that resolves with an array of records.
 */
export async function getWhere(db: Database, where: WhereClause) {
    const tableName = Object.keys(where)[0];
    if (!tableName || tableName === "") {
        throw new Error("Table Name Not Provided");
    }
    const condition = where[tableName];
    if (!condition) {
        throw new Error("Condition Not Provided or is Inncorrect");
    }

    const columns = Object.keys(condition).join(" AND ");
    const values = Object.values(condition).join(" AND ");

    const query = `SELECT * FROM ${tableName} WHERE ${columns} = ${values}`;
    try {
        return db.query(query).all();
    } catch (error) {
        console.log(error, `\nfor query [${query}]`);
        throw error;
    }
}

/**
 * Retrieves the first record from the specified table based on the provided conditions.
 * @param db - The database connection.
 * @param where - The conditions for filtering records eg. {table: {condtion: condition}}.
 * @param orderBy - The order of the results (ASC or DESC).
 * @returns A Promise that resolves with the first record that meets the conditions.
 */
export async function getFirst(
    db: Database,
    where: WhereClause,
    orderBy: "ASC" | "DESC" = "ASC"
) {
    const tableName = Object.keys(where)[0];
    if (!tableName || tableName === "") {
        throw new Error("Table Name Not Provided");
    }
    const condition = where[tableName];
    if (!condition) {
        throw new Error("Condition Not Provided or is Inncorrect");
    }

    const columns = Object.keys(condition).join(" AND ");
    const values = Object.values(condition)
        .map((value) => (typeof value === "string" ? `'${value}'` : value))
        .join(" AND ");

    const query = `SELECT * FROM ${tableName} WHERE ${columns} = ${values} ORDER BY ROWID ${orderBy} LIMIT 1`;

    try {
        return db.query(query).all();
    } catch (error) {
        console.log(error, `\nfor query [${query}]`);
        throw error;
    }
}

/**
 * Updates records in the specified table based on the provided conditions with the new data.
 * @param db - The database connection.
 * @param where - The conditions for filtering records to be updated {user: {age:23}}.
 * @param data - The new data to update the records with {age:23}.
 * @returns A Promise that resolves when the operation is complete.
 */
export async function updateSome(
    db: Database,
    where: WhereClause,
    data: Record<string, any>
): Promise<void> {
    const tableName = Object.keys(where)[0];
    if (!tableName || tableName === "") {
        throw new Error("Table Name Not Provided");
    }

    const condition = where[tableName];
    if (!condition) {
        throw new Error("Condition Not Provided or is Inncorrect");
    }

    const ConditionCol = Object.keys(condition).join(" AND ");
    const ConditionVal = Object.values(condition)
        .map((value) => (typeof value === "string" ? `'${value}'` : value))
        .join(" AND ");

    const columns = Object.keys(data).join(", ");
    const values = Object.values(data);

    const query = `UPDATE ${tableName} SET ${columns} = ${values} WHERE ${ConditionCol} = ${ConditionVal}`;

    try {
        db.run(query);
    } catch (error) {
        console.log(error, `\nfor query [${query}]`);
        throw error;
    }
}

export async function deleteSome(db: Database, tableName: string) {
    const query = `DELETE FROM ${tableName}`;
    try {
        db.run(query);
    } catch (error) {
        console.log(error, `\nfor query [${query}]`);
        throw error;
    }
}
