async function loadLibrary() {
    const response = await fetch('library.json');
    const books = await response.json();
    displayBooks(books);
  }
  
  // Ordina e visualizza i libri in base al campo selezionato
  function sortLibrary() {
    const sortBy = document.getElementById('sort').value;
    loadLibrary().then(books => {
      books.sort((a, b) => {
        if (a[sortBy] < b[sortBy]) return -1;
        if (a[sortBy] > b[sortBy]) return 1;
        return 0;
      });
      displayBooks(books);
    });
  }
  
  // Visualizza i libri nella sezione library
  function displayBooks(books) {
    const librarySection = document.getElementById('library');
    librarySection.innerHTML = ''; // Pulisce la sezione per evitare duplicati
  
    books.forEach(book => {
      const bookDiv = document.createElement('div');
      bookDiv.classList.add('book');
  
      bookDiv.innerHTML = `
        <img src="${book.img}" alt="${book.title}" class="book-image">
        <h2>${book.title}</h2>
        <p><strong>Author:</strong> ${book.author}</p>
        <p><strong>Genre:</strong> ${book.genre}</p>
        <p><strong>Notes:</strong> ${book.notes}</p>
        <p><strong>Read:</strong> ${book.read ? 'Yes' : 'No'}</p>
      `;
  
      librarySection.appendChild(bookDiv);
    });
  }
  
  // Carica i libri al caricamento della pagina
  window.onload = loadLibrary;
  