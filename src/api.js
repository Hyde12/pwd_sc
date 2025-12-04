import express from 'express';
import sqlite3 from 'sqlite3';
import cors from 'cors';

function generateRandomId() {
    const year = new Date().getFullYear();

    const maxNumber = 1000000;
    const randomNumber = Math.floor(Math.random() * maxNumber);

    const paddedNumber = String(randomNumber).padStart(6, '0');

    return `${year}SHA${paddedNumber}`;
}

const getDB = (sql, params = []) => {
    return new Promise((resolve, reject) => {
        db.get(sql, params, (err, row) => {
            if (err) {
                reject(err);
            } else {
                resolve(row);
            }
        });
    });
};

const runDB = (sql, params = []) => {
    return new Promise((resolve, reject) => {
        db.run(sql, params, function(err) {
            if (err) {
                reject(err);
            } else {
                // Return lastID property of the statement
                resolve({ lastID: this.lastID });
            }
        });
    });
};

function capitalizeFirstLetter(val) {
    return String(val).charAt(0).toUpperCase() + String(val).slice(1);
}

const app = express();
const db = new sqlite3.Database("src/holders.db", sqlite3.OPEN_READWRITE);

app.use(cors());
app.use(express.json());

app.get('/api/verifiedholders/:id', (req, res) => {
  const id = req.params.id;
  db.get('SELECT * FROM holdersNew WHERE id = ?', [id], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(row || {});
  });
});

app.get('/api/verifiedholders', (req, res) => {
    db.all('SELECT * FROM holdersNew', [], (err, rows) => {
        if (err) {
            console.error("Error fetching all holders:", err.message);
            
            // 3. Handle server-side errors
            return res.status(500).json({ 
                message: "Internal Server Error: Could not retrieve holders list.",
                error: err.message
            });
        }
        res.status(200).json(rows);
    });
});

app.get('/api/unverifiedholders/:id/', (req, res) => {
    const id = req.params.id;

    db.get('SELECT * FROM unverifiedHolders WHERE id = ?', [id], (err, row) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(row || {});
    });
});

app.get('/api/unverifiedholders', (req, res) => {
    db.all('SELECT * FROM unverifiedHolders', [], (err, rows) => {
        if (err) {
            console.error("Error fetching all holders:", err.message);
            
            return res.status(500).json({ 
                message: "Internal Server Error: Could not retrieve holders list.",
                error: err.message
            });
        }
        res.status(200).json(rows);
    });
});


app.post('/api/verification/:id', async (req, res) => {
    const id = req.params.id;

    const sql = 'DELETE FROM unverifiedHolders WHERE id = ?';

    try {
        const result = await runDB(sql, [id]);
        res.status(201).json({ 
            message: 'Holder removed successfully'
        });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
});


app.post('/api/unverifiedholders/', async (req, res) => {
    var { first_name, last_name, birth_date, picture, disability, senior_citizen } = req.body;
    first_name = capitalizeFirstLetter(first_name);
    last_name = capitalizeFirstLetter(last_name);
    const registration_date = String(new Date()); 

    const sql = 'INSERT INTO unverifiedHolders(firstName, lastName, birthDate, registrationDate, picture, disability, seniorCitizen) VALUES (?, ?, ?, ?, ?, ?, ?)';
    
    try {
        const result = await runDB(sql, [first_name, last_name, birth_date, registration_date, picture, disability, senior_citizen]);
        res.status(201).json({ 
            message: 'Holder registered successfully'
        });
    } catch (err) {
        // Handle insertion errors (e.g., schema validation)
        return res.status(500).json({ error: err.message });
    }
});

app.post('/api/holders/', async (req, res) => {
    var { firstName, lastName, birthDate, picture, disability, seniorCitizen } = req.body;

    let uniqueId = null;
    let max_attempts = 10;
    let attempts = 0;

    // 1. Loop to find a unique ID
    while (!uniqueId && attempts < max_attempts) {
        const potentialId = generateRandomId();
        
        try {
            // Check if the potential ID already exists in the database
            const existingRow = await getDB('SELECT id FROM holdersNew WHERE id = ?', [potentialId]);
            
            if (!existingRow) {
                uniqueId = potentialId; // ID is unique, break the loop
            }
        } catch (error) {
            console.error('Database check error:', error);
            // Treat DB error as fatal for this request
            return res.status(500).json({ error: 'Database check failed during ID generation.' });
        }
        attempts++;
    }

    if (!uniqueId) {
        return res.status(500).json({ error: 'Failed to generate a unique ID after several attempts. Try again.' });
    }

    const sql = 'INSERT INTO holdersNew(id, firstName, lastName, birthDate, picture, disability, seniorCitizen) VALUES (?, ?, ?, ?, ?, ?, ?)';
    
    try {
        const result = await runDB(sql, [uniqueId, firstName, lastName, birthDate, picture, disability, seniorCitizen]);
        res.status(201).json({ 
            message: 'Holder created successfully', 
            id: uniqueId 
        });
    } catch (err) {
        // Handle insertion errors (e.g., schema validation)
        return res.status(500).json({ error: err.message });
    }
});

app.listen(3000);