import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [books, setBooks] = useState([]);
  const [themes, setThemes] = useState([]);
  const [selectedBook, setSelectedBook] = useState("");
  const [selectedTheme, setSelectedTheme] = useState("");
  const [category, setCategory] = useState("Lektury");
  const [details, setDetails] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newBook, setNewBook] = useState({ name: "", author: "" });
  const [newTheme, setNewTheme] = useState({ name: "", description: "" });
  const [message, setMessage] = useState(""); // Powiadomienie
  const [messageType, setMessageType] = useState(""); // "success" lub "error"

  useEffect(() => {
    axios.get("http://localhost:5910/api/books")
      .then(response => setBooks(response.data))
      .catch(error => console.error('Błąd pobierania książek:', error));
  }, []);

  useEffect(() => {
    axios.get("http://localhost:5910/api/themes")
      .then(response => setThemes(response.data))
      .catch(error => console.error('Błąd pobierania motywów:', error));
  }, []);

  const handleShowSelection = () => {
    if (category === "Lektury" && selectedBook) {
      const encodedBook = encodeURIComponent(selectedBook);
      axios.get(`http://localhost:5910/api/book/${encodedBook}`)
        .then(response => setDetails(response.data))
        .catch(error => console.error('Błąd pobierania książki:', error));
    } else if (category === "Motywy" && selectedTheme) {
      const encodedTheme = encodeURIComponent(selectedTheme);
      axios.get(`http://localhost:5910/api/theme/${encodedTheme}`)
        .then(response => setDetails(response.data))
        .catch(error => console.error('Błąd pobierania motywu:', error));
    }
  };

  const handleAddSubmit = () => {
    const data = category === "Lektury" ? newBook : newTheme;
    const url = `http://localhost:5910/api/${category === "Lektury" ? "book" : "theme"}`;

    axios.post(url, data)
      .then(() => {
        setMessage("Dodano pomyślnie!");
        setMessageType("success");

        // Ukrycie formularza i reset pól
        setShowAddForm(false);
        setNewBook({ name: "", author: "" });
        setNewTheme({ name: "", description: "" });

        // Ukrycie komunikatu po 3 sekundach
        setTimeout(() => setMessage(""), 3000);
      })
      .catch(() => {
        setMessage("Błąd dodawania!");
        setMessageType("error");
        setTimeout(() => setMessage(""), 3000);
      });
  };

  return (
    <div className="App d-flex flex-column align-items-center vh-100 p-4">
      <div className="form-box p-4 bg-white rounded shadow">
        <h4 className="mb-3">Wybierz kategorię</h4>

        <select className="form-select mb-3" onChange={(e) => setCategory(e.target.value)}>
          <option value="Lektury">Lektury</option>
          <option value="Motywy">Motywy</option>
        </select>

        <select
          className="form-select"
          value={category === "Lektury" ? selectedBook : selectedTheme}
          onChange={(e) => category === "Lektury" ? setSelectedBook(e.target.value) : setSelectedTheme(e.target.value)}
        >
          <option value="">Wybierz {category.toLowerCase()}</option>
          {category === "Lektury"
            ? books.map((book, index) => <option key={book.id || index} value={book.nazwa}>{book.nazwa}</option>)
            : themes.map((theme, index) => <option key={theme.id || index} value={theme.nazwa_motywu}>{theme.nazwa_motywu}</option>)}
        </select>

        <br />
        <button className="btn btn-primary w-100 mb-2" onClick={handleShowSelection}>Pokaż</button>
        <button className="btn btn-success w-100" onClick={() => setShowAddForm(true)}>Dodaj</button>
      </div>

      {/* Komunikat o dodaniu */}
      {message && (
        <div className={`alert ${messageType === "success" ? "alert-success" : "alert-danger"} mt-3`}>
          {message}
        </div>
      )}

      {/* Formularz dodawania */}
      {showAddForm && (
        <div className="form-box p-4 mt-3 bg-light rounded shadow">
          <h5>Dodaj {category === "Lektury" ? "lekturę" : "motyw"}</h5>

          {category === "Lektury" ? (
            <>
              <input type="text" className="form-control mb-2" placeholder="Nazwa lektury" value={newBook.name} onChange={(e) => setNewBook({ ...newBook, name: e.target.value })} />
              <input type="text" className="form-control mb-2" placeholder="Autor" value={newBook.author} onChange={(e) => setNewBook({ ...newBook, author: e.target.value })} />
            </>
          ) : (
            <>
              <input type="text" className="form-control mb-2" placeholder="Nazwa motywu" value={newTheme.name} onChange={(e) => setNewTheme({ ...newTheme, name: e.target.value })} />
              <input type="text" className="form-control mb-2" placeholder="Opis" value={newTheme.description} onChange={(e) => setNewTheme({ ...newTheme, description: e.target.value })} />
            </>
          )}

          <button className="btn btn-primary w-100 mb-2" onClick={handleAddSubmit}>Dodaj</button>
          <button className="btn btn-secondary w-100" onClick={() => setShowAddForm(false)}>Anuluj</button>
        </div>
      )}

      {/* Sekcja szczegółów */}
      {details && (
        <div className="form-box p-4 mt-3 bg-white rounded shadow">
          <h5>{category === "Lektury" ? "Motywy powiązane z lekturą" : "Lektury powiązane z motywem"}</h5>
          <ul>
            {details.map((detail, index) => (
              <li key={index}>{category === "Lektury" ? detail.Nazwa_motywu : `"${detail.Nazwa}" (${detail.Autor})`}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default App;
