// Load the library and return books
async function loadLibrary() {
  const response = await fetch('library.json');
  const books = await response.json();
  console.log(books);

  populateGenreCombobox(books);
  displayBooks(books); // Display all books initially
  return books; // Return books for further usage
}

function toggleGenreSelector() {
  const genreSelector = document.getElementById('genre_selector');
  genreSelector.style.display = genreSelector.style.display === 'none' ? 'block' : 'none';
}

function populateGenreCombobox(books) {
  const allGenres = new Set();
  books.forEach(book => {
    book.genre.split(',').forEach(genre => allGenres.add(genre.trim()));
  });

  const genreCombobox = document.getElementById('genre-combobox');
  genreCombobox.innerHTML = '<option value="">--Select a genre--</option>'; // Clear existing options and add placeholder

  allGenres.forEach(genre => {
    const option = document.createElement('option');
    option.value = genre;
    option.textContent = genre;
    genreCombobox.appendChild(option);
  });
}

function addGenre() {
  const genreCombobox = document.getElementById('genre-combobox');
  const selectedGenre = genreCombobox.value.trim();
  const selectedGenresField = document.getElementById('selected-genres');

  if (selectedGenre && !selectedGenresField.value.includes(selectedGenre)) {
    // Append genre to the text field, separated by commas
    selectedGenresField.value += selectedGenresField.value ? `, ${selectedGenre}` : selectedGenre;
  }

  // Reset the combobox selection
  genreCombobox.value = '';

  filterByGenre(); // Filter books based on selected genres
}

function clearGenres() {
  const selectedGenresField = document.getElementById('selected-genres');
  selectedGenresField.value = ''; // Clear the selected genres text field
  filterByGenre(); // Display all books
}


function filterByGenre() {
  const selectedGenresField = document.getElementById('selected-genres');
  const selectedGenres = selectedGenresField.value.split(',').map(genre => genre.trim()).filter(Boolean);

  loadLibrary().then(books => {
    // Filter books based on selected genres
    const filteredBooks = books.filter(book => {
      const bookGenres = book.genre.split(',').map(g => g.trim().toLowerCase());
      return selectedGenres.every(genre => bookGenres.includes(genre.toLowerCase()));
    });
    displayBooks(filteredBooks); // Display only the filtered books
  }).catch(error => console.error('Error filtering library:', error));
}

// Sort and display the books based on the selected field
function sortLibrary() {
  const sortBy = document.getElementById('sort').value;

  loadLibrary().then(books => {
    const selectedGenresField = document.getElementById('selected-genres');
    const selectedGenres = selectedGenresField.value.split(',').map(genre => genre.trim()).filter(Boolean);

    // Apply genre filter if any genres are selected
    if (selectedGenres.length > 0) {
      books = books.filter(book => {
        const bookGenres = book.genre.split(',').map(g => g.trim().toLowerCase());
        return selectedGenres.every(genre => bookGenres.includes(genre.toLowerCase()));
      });
    }

    // Sort by selected field (excluding genre)
    books.sort((a, b) => {
      const valA = (a[sortBy] || '').toString().toLowerCase();
      const valB = (b[sortBy] || '').toString().toLowerCase();
      if (valA < valB) return -1;
      if (valA > valB) return 1;
      return 0;
    });
    displayBooks(books); // Display sorted and filtered books
  }).catch(error => console.error('Error loading library:', error));
}

// Display the books in the library section
function displayBooks(books) {
  const librarySection = document.getElementById('library');
  librarySection.innerHTML = ''; // Clear the section to avoid duplicates

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

// Load and display the books when the page loads
window.onload = () => {
  loadLibrary().then(displayBooks).catch(error => console.error('Error loading library:', error));
};
