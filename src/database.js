import sqlite3 from 'sqlite3';
let sql;
const db = new sqlite3.Database("src/holders.db", sqlite3.OPEN_READWRITE)

// sql = `
//     CREATE TABLE holders(
//         id STRING PRIMARY KEY, 
//         firstName STRING NOT NULL,
//         lastName STRING NOT NULL,
//         birthYear INTEGER NOT NULL,
//         picture STRING NOT NULL,
//         privilege STRING NOT NULL
//         )`

// sql = `INSERT INTO holders(id, firstName, lastName, birthYear, picture, privilege) VALUES (?, ?, ?, ?, ?, ?)`

// sql = 'SELECT * FROM holders WHERE id = "2025SHA01084"'
// db.all(sql, [], (err, rows) => {
//   if (err) {
//     console.error(err.message)
//     return
//   }
//   console.log(rows[0])
// })

export function returnIdHolder(id) {
    sql = 'SELECT * FROM holders WHERE id = ?'
    db.get(sql, [id], (err, row) => {
        if (err) {
            console.error(err.message);
        }
        console.log(row);
    })
}