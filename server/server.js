require('dotenv').config();
const express = require('express');
const mysql = require('mysql2/promise'); // Wersja promise
const cors = require('cors');
const path = require('path');

const PORT = process.env.PORT || 5910; // Ustawienie portu

const app = express();
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST'],
}));
app.use(express.json());

// Połączenie z bazą danych
const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

// 🔹 Pobieranie listy książek
app.get('/api/books', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT nazwa FROM lektura');
        res.json(rows);
    } catch (err) {
        console.error("Błąd zapytania:", err.message);
        res.status(500).json({ error: err.message });
    }
});

// 🔹 Pobieranie listy motywów
app.get('/api/themes', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT nazwa_motywu FROM motyw');
        res.json(rows);
    } catch (err) {
        console.error("Błąd zapytania:", err.message);
        res.status(500).json({ error: err.message });
    }
});

// 🔹 Pobieranie szczegółów lektury (motywy powiązane)
app.get('/api/book/:name', async (req, res) => {
    const { name } = req.params;
    const decodedName = decodeURIComponent(name);

    try {
        const [rows] = await db.query(
            'SELECT Nazwa_motywu FROM motyw INNER JOIN powiazania ON motyw.ID_motywu=powiazania.ID_motywu INNER JOIN lektura ON powiazania.ID_lektury=lektura.ID_lektury WHERE lektura.Nazwa = ?', 
            [decodedName]
        );
        res.json(rows);
    } catch (err) {
        console.error("Błąd zapytania:", err.message);
        res.status(500).json({ error: err.message });
    }
});

// 🔹 Pobieranie szczegółów motywu (lektury powiązane)
app.get('/api/theme/:name', async (req, res) => {
    const { name } = req.params;
    const decodedName = decodeURIComponent(name);

    try {
        const [rows] = await db.query(
            'SELECT Nazwa, lektura.Autor FROM lektura INNER JOIN powiazania ON lektura.ID_lektury=powiazania.ID_Lektury INNER JOIN motyw ON powiazania.ID_motywu=motyw.ID_motywu WHERE motyw.Nazwa_motywu = ?',
            [decodedName]
        );
        res.json(rows);
    } catch (err) {
        console.error("Błąd zapytania:", err.message);
        res.status(500).json({ error: err.message });
    }
});

// 🔹 Dodawanie nowej lektury
app.post('/api/book', async (req, res) => {
    const { name, author } = req.body;

    if (!name || !author) {
        return res.status(400).json({ error: "Brak wymaganych danych" });
    }

    try {
        await db.query('INSERT INTO lektura (Nazwa, Autor) VALUES (?, ?)', [name, author]);
        res.status(201).json({ message: "Lektura dodana pomyślnie" });
    } catch (err) {
        console.error("Błąd dodawania lektury:", err.message);
        res.status(500).json({ error: err.message });
    }
});

// 🔹 Dodawanie nowego motywu
app.post('/api/theme', async (req, res) => {
    const { name, description } = req.body;

    if (!name || !description) {
        return res.status(400).json({ error: "Brak wymaganych danych" });
    }

    try {
        await db.query('INSERT INTO motyw (nazwa_motywu, opis) VALUES (?, ?)', [name, description]);
        res.status(201).json({ message: "Motyw dodany pomyślnie" });
    } catch (err) {
        console.error("Błąd dodawania motywu:", err.message);
        res.status(500).json({ error: err.message });
    }
});

// 🔹 Obsługa aplikacji React w produkcji
if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, 'client/build')));

    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
    });
}

// 🔹 Uruchomienie serwera
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
});
