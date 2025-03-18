import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [books, setBooks] = useState([]); // Lista lektur
  const [themes, setThemes] = useState([]); // Lista motywów
  const [selectedBook, setSelectedBook] = useState(""); // Wybrana lektura
  const [selectedTheme, setSelectedTheme] = useState(""); // Wybrany motyw
  const [category, setCategory] = useState("Lektury"); // Kategoria: "Lektury" lub "Motywy"

  useEffect(() => {
    // Pobieranie danych o książkach
    axios.get("http://localhost:5910/api/books")
      .then(response => {
        setBooks(response.data); // Ustawiamy dane książek
        console.log(books);
      })
      .catch(error => console.error('Błąd pobierania książek:', error));
  }, []);

  useEffect(() => {
    axios.get("http://localhost:5910/api/themes")
      .then(response => {
        console.log("Motywy zwrócone z API:", response.data);
        setThemes(response.data); 
      })
      .catch(error => console.error('Błąd pobierania motywów:', error));
  }, []);

  return (
    <div className="App d-flex justify-content-center align-items-center vh-100">
      <div className="form-box p-4 bg-white rounded shadow">
        <h4 className="mb-3">Wybierz kategorię</h4>
        
        {/* Wybór kategorii */}
        <select className="form-select mb-3" onChange={(e) => setCategory(e.target.value)}>
          <option value="Lektury">Lektury</option>
          <option value="Motywy">Motywy</option>
        </select>

        {/* Wybór konkretnej pozycji (lektura lub motyw) */}
        <select
          className="form-select"
          value={category === "Lektury" ? selectedBook : selectedTheme}
          onChange={(e) => {
            if (category === "Lektury") {
              setSelectedBook(e.target.value);
            } else {
              setSelectedTheme(e.target.value);
            }
          }}
        >
          <option value="">Wybierz {category.toLowerCase()}</option>
          {category === "Lektury"
            ? books.map((book, index) => (
                <option key={book.id || index} value={book.nazwa}>
                  {book.nazwa}
                </option>
              ))
            : themes.map((theme, index) => (
                <option key={theme.id || index} value={theme.nazwa_motywu}>
                  {theme.nazwa_motywu}
                </option>
              ))}
        </select>

        <br />
        <button type="submit" className="btn btn-primary w-100">Pokaż</button>
      </div>
    </div>
  );
}

export default App;
