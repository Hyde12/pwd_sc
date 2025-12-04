import sqlite3 from 'sqlite3';
let sql;
const db = new sqlite3.Database("src/holders.db", sqlite3.OPEN_READWRITE)

// sql = `
//     CREATE TABLE holdersNew(
//         id STRING PRIMARY KEY,
//         firstName STRING NOT NULL,
//         lastName STRING NOT NULL,
//         birthDate STRING NOT NULL,
//         picture STRING NOT NULL,
//         disability STRING,
//         seniorCitizen BOOL NOT NULL
//         )`

// sql = `
//     CREATE TABLE unverifiedHolders(
//         id INTEGER PRIMARY KEY AUTOINCREMENT,
//         firstName STRING NOT NULL,
//         lastName STRING NOT NULL,
//         birthDate STRING NOT NULL,
//         registrationDate STRING NOT NULL,
//         picture STRING NOT NULL,
//         disability STRING,
//         seniorCitizen BOOL NOT NULL
//         )`

// db.run(sql)
// console.log("made")

const sampleHolder = {
        // id: "2025SHA01084", 
        firstName: 'Luka',
        lastName: 'Doncic',
        birthDate: '2023-1-12',
        registrationDate: '2025-12-04',
        picture: 'x',
        disability: 'Visual Disability',
        seniorCitizen: false,
    };

// sql = `INSERT INTO unverifiedHolders(firstName, lastName, birthDate, registrationDate, picture, seniorCitizen) VALUES (?, ?, ?, ?, ?, ?)`
// db.run(
//             sql,
//             // sampleHolder.id,
//             sampleHolder.firstName,
//             sampleHolder.lastName,
//             sampleHolder.birthDate,
//             sampleHolder.registrationDate,
//             sampleHolder.picture,
//             sampleHolder.seniorCitizen
//         );

sql = `UPDATE unverifiedHolders SET disability = 'Visual Disability' WHERE id = "1"`
db.run(sql)


sql = 'DELETE FROM holdersNew WHERE id = "2025SHA351104"'
db.all(sql, [], (err, rows) => {
  if (err) {
    console.error(err.message)
    return
  }
  console.log(rows[0])
})

// export function returnIdHolder(id) {
//     sql = 'SELECT * FROM holders WHERE id = ?'
//     db.get(sql, [id], (err, row) => {
//         if (err) {
//             console.error(err.message);
//         }
//         console.log(row);
//     })
// }