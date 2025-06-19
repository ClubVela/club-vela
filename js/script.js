// js/script.js

document.addEventListener('DOMContentLoaded', () => {

    // --- Gestione Menu Hamburger per Mobile ---
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            // CORREZIONE: Usa una classe specifica per lo stato attivo su mobile
            // per non entrare in conflitto con le regole CSS per tablet.
            navMenu.classList.toggle('mobile-active'); 
        });

        // Chiudi il menu quando si clicca un link
        document.querySelectorAll('.nav-link').forEach(n => n.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('mobile-active');
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

    // --- Gestione del form di contatto ---
    const contactForm = document.getElementById('contact-form');
    const formStatus = document.getElementById('form-status');
    let statusTimer;
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
                headers: { 'Accept': 'application/json' }
            }).then(response => {
                if (response.ok) {
                    showStatus("Grazie! Il tuo messaggio è stato inviato.", "success");
                    form.reset();
                } else {
                    response.json().then(data => {
                        let errorMessage = "Oops! C'è stato un problema.";
                        if (data.errors) {
                            errorMessage = data.errors.map(error => error.message).join(", ");
                            if (errorMessage.includes("should be an email")) {
                                errorMessage = "L'indirizzo email non sembra valido. Controlla e riprova.";
                            }
                        }
                        showStatus(errorMessage, "error");
                    });
                }
            }).catch(error => {
                showStatus("Oops! C'è stato un problema di rete.", "error");
            });
        });
    }

    // --- Animazioni allo Scroll ---
    const scrollObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    document.querySelectorAll('.animate-on-scroll').forEach(element => {
        scrollObserver.observe(element);
    });

    // --- Pulsante "Torna Su" ---
    const backToTopButton = document.querySelector('.back-to-top');
    if (backToTopButton) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                backToTopButton.classList.add('is-visible');
            } else {
                backToTopButton.classList.remove('is-visible');
            }
        });
        backToTopButton.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // --- Logica per la Dark Mode ---
    const darkModeToggle = document.getElementById('dark-mode-toggle');
    const body = document.body;

    // Funzione per applicare un tema
    const applyTheme = (theme) => {
        if (theme === 'dark') {
            body.classList.add('dark-mode');
        } else {
            body.classList.remove('dark-mode');
        }
    };

    // Al caricamento della pagina, controlla se c'è un tema salvato
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        applyTheme(savedTheme);
    }

    // Gestisce il click sul pulsante per cambiare tema
    if (darkModeToggle) {
        darkModeToggle.addEventListener('click', () => {
            // Controlla qual è il tema attuale e imposta quello nuovo
            const isDarkMode = body.classList.contains('dark-mode');
            const newTheme = isDarkMode ? 'light' : 'dark';
            
            applyTheme(newTheme);
            
            // Salva la preferenza dell'utente nel localStorage
            localStorage.setItem('theme', newTheme);
        });
    }

});