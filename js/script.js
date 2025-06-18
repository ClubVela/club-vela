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

    // --- Lightbox per le immagini delle barche ---
    if (typeof SimpleLightbox !== 'undefined') {
        const boatImageLink = document.querySelector('.boat-image-container a');
        if (boatImageLink) {
            new SimpleLightbox('.boat-image-container a', {
                // opzioni di personalizzazione se vuoi
            });
        }
    }

    // --- Logica per la Dark Mode ---
    const darkModeToggle = document.querySelector('.dark-mode-toggle');
    const body = document.body;
    if (darkModeToggle) {
        if (localStorage.getItem('theme') === 'dark') {
            body.classList.add('dark-mode');
        }
        darkModeToggle.addEventListener('click', () => {
            body.classList.toggle('dark-mode');
            if (body.classList.contains('dark-mode')) {
                localStorage.setItem('theme', 'dark');
            } else {
                localStorage.removeItem('theme');
            }
        });
    }

});