// Scripts of the index page

// A function to expand sections on demand
// A id indexed dictionary to store initial heights of sections
const initialHeights = {};
document.querySelectorAll('.collapsible').forEach(section => {
    initialHeights[section.id] = section.scrollHeight + "px";
    section.addEventListener('click', async () => {
        const contentDiv = section.querySelector('.content');

        // Account for the already expanded height of the section (preview of the content)
        const initialHeight = initialHeights[section.id];
  
        if (!section.classList.contains('expanded')) {
            section.classList.add('expanded');
  
            const filePath = contentDiv.getAttribute('data-file');
            const response = await fetch(filePath);
            if (!response.ok) {
                console.error("Errore nel caricamento del file:", response.statusText);
                return;
            }
            const text = await response.text();
  
            // Se il file è .md, usiamo Marked.js per il parsing; altrimenti, mostriamo testo semplice
            if (filePath.endsWith('.md')) {
            contentDiv.innerHTML = marked.parse(text);
            } else {
            contentDiv.innerText = text;
            }

            // Calcola l'altezza e applica l'animazione
            //section.style.height = 'auto'; // Permette di calcolare l'altezza completa
            const expandedHeight = section.scrollHeight + 3 + "px";
            section.style.height = initialHeight; // Altezza chiusa temporanea

            // Forza il ricalcolo dello stile per attivare la transizione
            section.offsetHeight; // Hack per innescare il rendering
            section.style.transition = "height 0.5s ease"; // Applica la transizione
            section.style.height = expandedHeight; // Espande gradualmente fino all'altezza totale

        } else {
            // Collapsing
            const expandedHeight = section.scrollHeight + 3 + "px"; // Record current expanded height
            section.style.height = expandedHeight; // Start collapse from this height
            section.offsetHeight; // Trigger reflow

            section.style.height = initialHeight; // Collapse to initial height

            section.addEventListener('transitionend', () => {
                section.classList.remove('expanded');
                contentDiv.innerHTML = ""; // Clear content only after transition ends
                section.style.transition = ""; // Reset transition for consistency
            }, { once: true });
        }
    });
  });