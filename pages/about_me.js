// Funzione per popolare l'articolo con contenuto Markdown
async function populateArticle() {
    const contentDiv = document.getElementById('about-me-content');
    const filePath = contentDiv.getAttribute('data-file');

    try {
        // Fetch del file .md
        const response = await fetch(filePath);
        if (!response.ok) {
            throw new Error(`Error in loading the file: ${response.statusText}`);
        }
        
        // Parsing del contenuto e conversione con Marked
        const text = await response.text();
        contentDiv.innerHTML = marked.parse(text);
    } catch (error) {
        console.error("Error:", error);
    }
}
