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
        
        const showStatus = (message, type) => {
            formStatus.innerHTML = message;
            formStatus.className = `${type} is-visible`;
            formStatus.style.display = 'block';
            
            statusTimer = setTimeout(() => {
                formStatus.classList.remove('is-visible');
                formStatus.classList.add('is-hiding');
                
                setTimeout(() => {
                    formStatus.style.display = 'none';
                    formStatus.className = '';
                    formStatus.innerHTML = '';
                }, 400); 

            }, 7000);
        };

        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            clearTimeout(statusTimer);
            formStatus.className = '';
            formStatus.style.display = 'none';
            formStatus.innerHTML = '';

            const form = e.target;
            const data = new FormData(form);

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
                        let errorMessage = "Oops! C'è stato un problema nell'invio del modulo."; // Messaggio di default

                        if (data.errors) {
                            errorMessage = data.errors.map(error => error.message).join(", ");

                            // --- TRADUZIONE DEGLI ERRORI SPECIFICI ---
                            if (errorMessage.includes("should be an email")) {
                                errorMessage = "L'indirizzo email non sembra valido. Controlla e riprova.";
                            }
                            // Aggiungi altre traduzioni qui se necessario
                        }
                        
                        showStatus(errorMessage, "error");
                    });
                }
            }).catch(error => {
                showStatus("Oops! C'è stato un problema di rete. Riprova più tardi.", "error");
            });
        });
    }
});