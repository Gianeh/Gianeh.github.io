// Funzione per gestire l'espansione delle sezioni e il caricamento del contenuto
document.querySelectorAll('.collapsible').forEach(section => {
    section.addEventListener('click', async () => {
        const contentDiv = section.querySelector('.content');

        // Account for the already expanded height of the section
        const initialHeight = section.scrollHeight - contentDiv.scrollHeight + "px";
  
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
            const expandedHeight = section.scrollHeight + "px";
            section.style.height = initialHeight; // Altezza chiusa temporanea

            // Forza il ricalcolo dello stile per attivare la transizione
            section.offsetHeight; // Hack per innescare il rendering
            section.style.transition = "height 0.5s ease"; // Applica la transizione
            section.style.height = expandedHeight; // Espande gradualmente fino all'altezza totale

        } else {
            // Chiudi l'animazione
            section.style.height = initialHeight;
            section.addEventListener('transitionend', () => {
                section.classList.remove('expanded');
                section.style.height = ""; // Resetta la proprietà
            }, { once: true });
          }
    });
  });