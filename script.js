// Scripts of the index page

// A function to expand sections on demand
// An id indexed dictionary to store initial heights of sections
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
          const email = command.slice(13);
          if (validateEmail(email)) {
              terminalState.from = email;
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
          response = "Commands:\n" +
                     "  sendmail from [email] - Set the sender's email address.\n" +
                     "  addtext [message] - Add your message.\n" +
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
  