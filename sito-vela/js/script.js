// js/script.js

document.addEventListener('DOMContentLoaded', () => {

    // --- Gestione Menu Hamburger per Mobile ---
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        document.querySelectorAll('.nav-link').forEach(n => n.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        }));
    }

    // --- Evidenzia il link attivo nella navbar ---
    const currentPage = window.location.pathname.split("/").pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-menu a');

    navLinks.forEach(link => {
        if (link.getAttribute('href') === currentPage) {
            link.classList.add('active');
        }
    });

    // --- Gestione del form di contatto con AJAX per Formspree e animazioni ---
    const contactForm = document.getElementById('contact-form');
    const formStatus = document.getElementById('form-status');
    let statusTimer; // Variabile per tenere traccia del timer

    if (contactForm && formStatus) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Pulisce messaggi e timer precedenti se l'utente invia di nuovo
            clearTimeout(statusTimer);
            formStatus.className = '';
            formStatus.style.display = 'none'; // Assicura che sia nascosto
            formStatus.innerHTML = '';

            const form = e.target;
            const data = new FormData(form);
            const showStatus = (message, type) => {
                formStatus.innerHTML = message;
                formStatus.className = `${type} is-visible`; // Attiva l'animazione di entrata
                formStatus.style.display = 'block'; // Rende visibile
                
                // Avvia il timer per nascondere il messaggio
                statusTimer = setTimeout(() => {
                    formStatus.classList.remove('is-visible');
                    formStatus.classList.add('is-hiding');
                    
                    // Imposta un altro timer per pulire dopo la fine dell'animazione di uscita
                    setTimeout(() => {
                        formStatus.style.display = 'none';
                        formStatus.className = '';
                        formStatus.innerHTML = '';
                    }, 400); // 400ms, uguale alla durata dell'animazione CSS

                }, 7000); // 7 secondi
            };

            fetch(form.action, {
                method: form.method,
                body: data,
                headers: {
                    'Accept': 'application/json'
                }
            }).then(response => {
                if (response.ok) {
                    showStatus("Grazie! Il tuo messaggio è stato inviato.", "success");
                    form.reset();
                } else {
                    response.json().then(data => {
                        const errorMessage = data.errors?.map(e => e.message).join(', ') || "Oops! C'è stato un problema.";
                        showStatus(errorMessage, "error");
                    });
                }
            }).catch(error => {
                showStatus("Oops! C'è stato un problema di rete. Riprova più tardi.", "error");
            });
        });
    }
});