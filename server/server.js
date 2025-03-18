const express = require('express');
const mysql = require('mysql2/promise'); // Wersja promise
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors({
    origin: '*',  // Zezwól na wszystkie źródła
    methods: ['GET', 'POST'], // Możesz dodać inne metody, jeśli chcesz
  }));
app.use(express.json());

const PORT = process.env.PORT || 5910;

const db = mysql.createPool({
    host: 'mysql2.small.pl',
    user: 'm2532_admin',
    password: 'Admin200521',
    database: 'm2532_lektury',
});

// Endpoint, który zwraca listę książek
app.get('/api/books', async (req, res) => {
    console.log("siema");
    try {
        const [rows] = await db.query('SELECT nazwa FROM lektura');
        res.json(rows); // Zwróć dane książek

    } catch (err) {
        console.error("Błąd zapytania:", err.message);
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/themes', async (req, res) => {
    console.log("siema1");
    try {
        const [rows] = await db.query('SELECT nazwa_motywu FROM motyw');
        res.json(rows); // Zwróć dane książek

    } catch (err) {
        console.error("Błąd zapytania:", err.message);
        res.status(500).json({ error: err.message });
    }
});

// Serwowanie aplikacji React w produkcji
if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, 'client/build')));

    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
    });
}

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
});
