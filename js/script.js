// js/script.js

document.addEventListener('DOMContentLoaded', () => {

    // --- Gestione Menu Hamburger per Mobile ---
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('mobile-active'); 
        });

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

    // --- Logica per la Modalità Scura ---
    const darkModeToggle = document.getElementById('dark-mode-toggle');
    const body = document.body;
    const applyTheme = (theme) => {
        body.classList.toggle('dark-mode', theme === 'dark');
    };
    const savedTheme = localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    applyTheme(savedTheme);
    if (darkModeToggle) {
        darkModeToggle.addEventListener('click', () => {
            const newTheme = body.classList.contains('dark-mode') ? 'light' : 'dark';
            applyTheme(newTheme);
            localStorage.setItem('theme', newTheme);
        });
    }

    // --- Pulsante "Torna Su" ---
    const backToTopButton = document.querySelector('.back-to-top');
    if (backToTopButton) {
        window.addEventListener('scroll', () => {
            backToTopButton.classList.toggle('is-visible', window.scrollY > 300);
        });
        backToTopButton.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
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

    // --- NUOVO: Logica per la fisarmonica FAQ ---
    const faqItems = document.querySelectorAll('.faq-accordion .faq-item');
    if (faqItems.length > 0) {
        faqItems.forEach(item => {
            item.addEventListener('toggle', event => {
                // Se un elemento <details> viene aperto, chiudi tutti gli altri
                if (event.target.open) {
                    faqItems.forEach(otherItem => {
                        if (otherItem !== event.target) {
                            otherItem.open = false;
                        }
                    });
                }
            });
        });
    }

});