// Scripts of the index page

// Dizionario per salvare le altezze iniziali delle sezioni
const initialHeights = {};

document.querySelectorAll('.collapsible').forEach(section => {
    initialHeights[section.id] = section.scrollHeight + "px";
    section.addEventListener('click', async () => {
        const contentDiv = section.querySelector('.content');

        const initialHeight = initialHeights[section.id];
  
        if (!section.classList.contains('expanded')) {
            // Espansione della section
            section.classList.add('expanded');
            section.style.height = initialHeight; // Altezza chiusa temporanea
            
            // Nascondi il contenuto prima dell'espansione
            contentDiv.style.opacity = 0;
            contentDiv.style.display = "none"; 

            // Carica il file
            const filePath = contentDiv.getAttribute('data-file');
            const response = await fetch(filePath);
            if (!response.ok) {
                console.error("Errore nel caricamento del file:", response.statusText);
                return;
            }
            const text = await response.text();

            // Se è un file Markdown, usa Marked.js, altrimenti mostra testo normale
            if (filePath.endsWith('.md')) {
                contentDiv.innerHTML = marked.parse(text);
            } else {
                contentDiv.innerText = text;
            }

            // Calcola l'altezza espansa
            contentDiv.style.display = ""; // Mostra temporaneamente per calcolare l'altezza
            const expandedHeight = section.scrollHeight + 15 + "px";
            section.style.height = initialHeight; // Altezza iniziale temporanea

            section.offsetHeight; // Forza il rendering
            section.style.transition = "height 0.5s ease"; // Applica la transizione
            section.style.height = expandedHeight; // Espande

            // Mostra il contenuto alla fine della transizione
            section.addEventListener('transitionend', () => {
                contentDiv.style.display = "";
                contentDiv.style.opacity = 1;
                contentDiv.style.transition = "opacity 0.5s ease"; // Transizione per opacità
            }, { once: true });

        } else {
            // Chiusura della section
            section.addEventListener('transitionend', () => {
                section.classList.remove('expanded');
                contentDiv.innerHTML = ""; // Cancella il contenuto
                section.style.transition = ""; // Reset transizione
            }, { once: true });

            const expandedHeight = section.scrollHeight + 15 + "px";
            section.style.height = expandedHeight; // Altezza da cui partire per collassare
            section.offsetHeight; // Trigger reflow

            // Chiude gradualmente fino all’altezza iniziale
            section.style.height = initialHeight;
            contentDiv.style.opacity = 0; // Dissolvenza del contenuto durante il collasso
        }
    });
});


  // Handle contact me form submission in Easy Mode and Nerd Mode

    // Riferimento al terminale e all'input
    const terminal = document.querySelector('.terminal');
    const terminalInput = document.getElementById('terminal-input');

    // Evento di click per dare focus all'input
    terminal.addEventListener('click', () => {
        terminalInput.focus();
});

  document.getElementById("mode-toggle").addEventListener("click", toggleMode);

  let mode = "easy";
  let terminalState = {
      from: "",
      message: ""
  };
  
  function toggleMode() {
      const easyMode = document.getElementById("easy-mode");
      const nerdMode = document.getElementById("nerd-mode");
  
      if (mode === "easy") {
          easyMode.style.display = "none";
          nerdMode.style.display = "block";
          document.getElementById("mode-toggle").textContent = "Switch to Easy Mode";
          mode = "nerd";
      } else {
          easyMode.style.display = "block";
          nerdMode.style.display = "none";
          document.getElementById("mode-toggle").textContent = "Switch to Nerd Mode";
          mode = "easy";
      }
  }
  
  // Command handling in Nerd Mode
  document.getElementById("terminal-input").addEventListener("keydown", function(event) {
      if (event.key === "Enter") {
          const input = event.target.value.trim();
          processCommand(input);
          event.target.value = "";
      }
  });
  
  function processCommand(command) {
      const output = document.getElementById("output");
      let response = "";
  
      if (command.startsWith("sendmail from ")) {
          const email = command.split(" ")[2];
          if (validateEmail(email)) {
              terminalState.from = email; // for some reason, slice(15) doesn't work and cuts off the first character
              console.log(terminalState);
              response = "Email address set.";
          } else {
              response = "Invalid email format. Try again.";
          }
      } else if (command.startsWith("addtext ")) {
          terminalState.message = command.slice(8);
          response = "Message text added.";
      } else if (command === "send") {
          if (terminalState.from && terminalState.message) {
              sendFormspreeEmail(terminalState.from, terminalState.message);
              response = "Message sent!";
              terminalState = { from: "", message: "" };
          } else {
              response = "Incomplete message. Use 'sendmail from [email]' and 'addtext [message]'.";
          }
      } else if (command === "help") {
          response = "Commands:<br>" +
                     "  sendmail from [email] - Set the sender's email address.<br>" +
                     "  addtext [message] - Add your message.<br>" +
                     "  send - Send the message.";
      } else {
          response = `Unknown command: ${command}. Type "help" for available commands.`;
      }
  
      output.innerHTML += `<p>${response}</p>`;
      output.scrollTop = output.scrollHeight;
  }
  
  function validateEmail(email) {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }
  
  // Simulates submission via Formspree in Nerd Mode
  function sendFormspreeEmail(from, message) {
      const easyForm = document.getElementById("easy-mode");
      easyForm.querySelector("#name").value = "Nerd Mode User";
      easyForm.querySelector("#email").value = from;
      easyForm.querySelector("#message").value = message;
      easyForm.submit();
  }
  