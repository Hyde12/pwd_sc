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

// db.run(sql)
// console.log("made")

// const sampleHolder = {
//         id: "2025SHA01084", 
//         firstName: 'Alexus',
//         lastName: 'Jimena',
//         birthDate: '2008-12-29',
//         picture: '../images/jerome_an',
//         disability: 'Visual Disability',
//         seniorCitizen: false,
//     };

// sql = `INSERT INTO holdersNew(id, firstName, lastName, birthDate, picture, seniorCitizen) VALUES (?, ?, ?, ?, ?, ?)`
// db.run(
//             sql,
//             sampleHolder.id,
//             sampleHolder.firstName,
//             sampleHolder.lastName,
//             sampleHolder.birthDate,
//             sampleHolder.picture,
//             sampleHolder.seniorCitizen
//         );

// sql = `UPDATE holdersNew SET disability = 'Visual Disability' WHERE id = "2025SHA01084"`
// db.run(sql)


sql = 'SELECT * FROM holdersNew WHERE id="2025SHA450274"'
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