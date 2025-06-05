document.addEventListener('DOMContentLoaded', function() {

    // --- 1. NUOVA ANIMAZIONE DI INGRESSO CON LOGO ---
    function runEntryAnimation() {
        gsap.set('.loader-text-reveal span', { y: '110%' });
        gsap.set('.loader-logo', { autoAlpha: 0, scale: 0.8 });
        gsap.set(['.main-header', '.hero-content'], { autoAlpha: 0 });
        gsap.set(['.hero-title', '.hero-description', ], { y: 30, autoAlpha: 0 });

        const tl = gsap.timeline();

        tl.to('.loader-text-reveal span', {
            y: '0%',
            duration: 1.2,
            stagger: 0.15,
            ease: 'power4.out',
            delay: 0.2
        })
        .to('.loader-logo', {
            autoAlpha: 1,
            scale: 1,
            duration: 0.8,
            ease: 'back.out(1.7)'
        }, "-=0.8")
        .to(['.loader-text-reveal span', '.loader-logo'], {
            y: (i, target) => target.classList.contains('loader-logo') ? -50 : '-110%',
            autoAlpha: 0,
            duration: 1,
            stagger: 0.1,
            ease: 'power4.in',
            delay: 0.7
        })
        .to('.loader-overlay', {
            height: 0,
            duration: 1.2,
            ease: 'expo.inOut'
        }, "-=1.2")
        .to(['.main-header', '.hero-content'], {
            autoAlpha: 1,
            duration: 0.5,
            ease: 'power2.out'
        }, "-=0.5")
        .to(['.hero-title', '.hero-description', '.cta-button'], {
            autoAlpha: 1,
            y: 0,
            duration: 1,
            stagger: 0.2,
            ease: 'power3.out'
        }, "-=0.2")
        .add(() => {
            document.body.removeChild(document.querySelector('.loader-overlay'));
        });
    }
    
    runEntryAnimation();

    // --- 2. EFFETTO PARALLASSE HERO ---
    gsap.to('.hero-background', {
        scrollTrigger: {
            trigger: '#hero',
            start: 'top top',
            end: 'bottom top',
            scrub: true
        },
        y: '30%',
        ease: 'none'
    });

    // --- 3. ANIMAZIONE ELEMENTI IN ENTRATA ALLO SCROLL ---
    gsap.utils.toArray('section:not(#hero)').forEach(section => {
        const elements = section.querySelectorAll('.section-title, .section-subtitle, .swiper, .form-grid, #contact-form .cta-button');
        gsap.from(elements, {
            y: 50,
            autoAlpha: 0,
            duration: 0.8,
            stagger: 0.15,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: section,
                start: 'top 85%',
                toggleActions: 'play none none none'
            }
        });
    });

    // --- 4. INIZIALIZZAZIONE CAROSELLO COACH ---
    const coachSlider = new Swiper('.coach-slider', {
        loop: true,
        grabCursor: true,
        spaceBetween: 30,
        autoHeight: false, 
        pagination: { el: '.swiper-pagination', clickable: true },
        navigation: { nextEl: '.swiper-button-next', prevEl: '.swiper-button-prev' },
        breakpoints: {
            320: { slidesPerView: 1, spaceBetween: 20 },
            768: { slidesPerView: 2, spaceBetween: 30 },
            1200: { slidesPerView: 3, spaceBetween: 30 }
        }
    });

    // --- 5. GESTIONE FORM DI CONTATTO ---
    const form = document.getElementById('contact-form');
    const formStatus = document.getElementById('form-status');
    form.addEventListener("submit", async function(event) {
        event.preventDefault();
        const data = new FormData(event.target);
        formStatus.textContent = 'Invio in corso...';
        formStatus.style.color = "var(--secondary-text-color)";
        try {
            const response = await fetch(event.target.action, {
                method: form.method,
                body: data,
                headers: { 'Accept': 'application/json' }
            });
            if (response.ok) {
                formStatus.textContent = "Grazie! Richiesta inviata con successo.";
                formStatus.style.color = "var(--accent-color)";
                form.reset();
            } else {
                const data = await response.json();
                formStatus.textContent = data.errors ? data.errors.map(e => e.message).join(', ') : "Oops! C'è stato un problema.";
                formStatus.style.color = "#ff6b6b";
            }
        } catch (error) {
            formStatus.textContent = "Oops! Errore di rete, riprova.";
            formStatus.style.color = "#ff6b6b";
        }
    });

    // --- 6. AGGIORNAMENTO ANNO NEL FOOTER ---
    document.getElementById('year').textContent = new Date().getFullYear();
});