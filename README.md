# jam-some Database Interaction Library Documentation

jam-some is a database interaction library that provides functions to perform jam (Create, Read, Update, Delete) operations on different types of databases including PostgreSQL, MySQL, and SQLite.

## Table of Contents

- [Getting Started](#getting-started)
- [Supported Databases](#supported-databases)
- [Functions](#functions)

## Getting Started

To use **jam-some**, install the library using npm:

```bash
npm install jam-some
```

## Supported Databases

The `jam-some` package supports the following databases:

- PostgreSQL
- MySQL
- SQLite

## Functions

### `connectDatabase(databaseType, config)`

This function establishes a connection to the specified database.

- `databaseType` (string): The type of the database (`postgres`, `mysql`, or `sqlite`).
- `config` (object): Configuration options for connecting to the database.

```javascript
import { connectDatabase } from 'jam-some';

const databaseType = 'postgres'; // Replace with your desired database type
const config = {
    // use the IConfigDB Interface for help
};

const db = await connectDatabase(databaseType, config);
```

### `createSome(db, tableName, data)`

Use this function to insert a new record into the specified table with the provided data.

- `db` (DatabaseConnection): The database connection.
- `tableName` (string): The name of the table.
- `data` (object): The data to be inserted.

```javascript
import { createSome } from 'jam-some';

const newData = { name: 'John', age: 30 };
await createSome(db, 'users', newData);
```

### `getAll(db, tableName)`

Retrieve all records from the specified table.

- `db` (DatabaseConnection): The database connection.
- `tableName` (string): The name of the table.

```javascript
import { getAll } from 'jam-some';

const allRecords = await getAll(db, 'users');
```

### `getWhere(db, where)`

Retrieve records from the specified table based on the provided conditions.

- `db` (DatabaseConnection): The database connection.
- `where` (object): The conditions for filtering records.

```javascript
import { getWhere } from 'jam-some';

const whereConditions = { users: { age: 30 } };
const filteredRecords = await getWhere(db, whereConditions);
```

### `getFirst(db, where, orderBy)`

Retrieve the first record from the specified table based on the provided conditions.

- `db` (DatabaseConnection): The database connection.
- `where` (object): The conditions for filtering records.
- `orderBy` (string, optional): The order of the results (`ASC` or `DESC`).

```javascript
import { getFirst } from 'jam-some';

const whereConditions = { users: { name: 'John' } };
const firstRecord = await getFirst(db, whereConditions, 'ASC');
```

### `updateSome(db, where, data)`

Update records in the specified table based on the provided conditions with the new data.

- `db` (DatabaseConnection): The database connection.
- `where` (object): The conditions for filtering records to be updated.
- `data` (object): The new data to update the records with.

```javascript
import { updateSome } from 'jam-some';

const updateConditions = { users: { name: 'John' } };
const updatedData = { age: 31 };
await updateSome(db, updateConditions, updatedData);
```

### `deleteSome(db, tableName)`

Delete all records from the specified table.

- `db` (DatabaseConnection): The database connection.
- `tableName` (string): The name of the table.

```javascript
import { deleteSome } from 'jam-some';

await deleteSome(db, 'users');
```

For more information and examples, please visit the [GitHub repository](https://github.com/IzaanAnwar/jam-some).
