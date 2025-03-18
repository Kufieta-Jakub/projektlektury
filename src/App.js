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
  const [details, setDetails] = useState(null); // Dane, które będą wyświetlane po kliknięciu

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

  const handleShowSelection = () => {
    if (category === "Lektury" && selectedBook) {
      // Kodowanie parametru przed wysłaniem zapytania
      const encodedBook = encodeURIComponent(selectedBook);
      axios.get(`http://localhost:5910/api/book/${encodedBook}`)
        .then(response => {
          setDetails(response.data); // Zaktualizuj stan z danymi książki
        })
        .catch(error => console.error('Błąd pobierania książki:', error));
    } else if (category === "Motywy" && selectedTheme) {
      // Kodowanie parametru przed wysłaniem zapytania
      const encodedTheme = encodeURIComponent(selectedTheme);
      axios.get(`http://localhost:5910/api/theme/${encodedTheme}`)
        .then(response => {
          setDetails(response.data); // Zaktualizuj stan z danymi motywu
        })
        .catch(error => console.error('Błąd pobierania motywu:', error));
    }
  };
  
  
  

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
        <button type="submit" className="btn btn-primary w-100" onClick={handleShowSelection}>Pokaż</button>
  
        
      </div>
      {/* Sekcja wyświetlania szczegółów */}
      {category === "Lektury" 
      ? details && (
          <div className="form-select">
            <h5>Motywy powiązane z lekturą</h5>
            <ul>
              {details.map((detail, index) => (
                <li key={index}>{detail.Nazwa_motywu}</li>
              ))}
            </ul>
          </div> )
          :details && (
            <div className="form-select">
              <h5>Lektury powiązane z motywem</h5>
              <ul>
                {details.map((detail, index) => (
                  <li key={index}>"{detail.Nazwa}" ({detail.Autor})</li>
                ))}
              </ul>
            </div> )

        }
    </div>
    
  );
}  

export default App;
