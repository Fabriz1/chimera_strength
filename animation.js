// Aspetta che il DOM sia completamente caricato e GSAP sia disponibile
document.addEventListener("DOMContentLoaded", () => {

    // Registra i plugin GSAP
    gsap.registerPlugin(ScrollTrigger);

    // --- Animazione Header ---
    const header = document.querySelector('.main-header');
    ScrollTrigger.create({
        start: 'top -80', // Quando lo scroll supera 80px dall'inizio
        end: 99999,
        toggleClass: { className: 'scrolled', target: header }
    });

    // --- Animazione Nav Links Attivi su Scroll ---
    gsap.utils.toArray('.nav-link').forEach(link => {
        const targetId = link.getAttribute('href');
        // Evita l'errore se href non è un ID valido (es. link esterno)
        if (targetId && targetId.startsWith('#') && targetId.length > 1) {
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                ScrollTrigger.create({
                    trigger: targetElement,
                    start: "top center", // Quando la sezione arriva al centro
                    end: "bottom center", // Quando la sezione lascia il centro
                    toggleClass: { className: 'active', target: link },
                    // markers: true // Utile per debug
                });
            }
        }
    });

    // --- Mobile Menu Toggle ---
    const menuToggle = document.querySelector('.menu-toggle');
    const mainNav = document.querySelector('.main-nav');
    const iconOpen = menuToggle.querySelector('.icon-open');
    const iconClose = menuToggle.querySelector('.icon-close');

    if (menuToggle && mainNav) {
        menuToggle.addEventListener('click', () => {
            mainNav.classList.toggle('active');
            // Cambia icona hamburger/chiusura
            iconOpen.style.display = mainNav.classList.contains('active') ? 'none' : 'block';
            iconClose.style.display = mainNav.classList.contains('active') ? 'block' : 'none';
        });

        // Chiudi il menu quando si clicca su un link (su mobile)
        mainNav.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                if (mainNav.classList.contains('active')) {
                    mainNav.classList.remove('active');
                    iconOpen.style.display = 'block';
                    iconClose.style.display = 'none';
                }
            });
        });
    }


    // --- Animazioni HERO ---

    // 1. Titolo parola per parola (effetto slide-in dall'alto)
    gsap.from(".hero-title .word", {
        y: -50,       // Parte da sopra
        opacity: 0,
        duration: 0.8,
        stagger: 0.15, // Ritardo tra ogni parola
        ease: "power3.out",
        delay: 0.5 // Ritardo iniziale generale
    });

    // 2. Sottotitolo (slide-up semplice) - Usa classe per coerenza
    gsap.from(".hero-subtitle.anim-slide-up", {
        y: 50,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        delay: 1 // Dopo il titolo
    });

    // 3. Bottone CTA (scale-up con bounce) - Usa classe per coerenza
    gsap.from(".hero-cta.anim-scale-up", {
        scale: 0.5,
        opacity: 0,
        duration: 1.2,
        ease: "elastic.out(1, 0.5)", // Effetto elastico più pronunciato
        delay: 1.3
    });

    // 4. Indicatore di Scroll (pulsazione)
    gsap.to(".scroll-indicator i", {
        y: 10, // Sposta su e giù
        opacity: 0.5,
        duration: 1,
        repeat: -1, // Infinito
        yoyo: true, // Torna indietro
        ease: "power1.inOut",
        delay: 2 // Inizia dopo le altre animazioni hero
    });


    // --- Animazioni ON-SCROLL Generali ---

    const defaultStart = "top 85%"; // Quando l'85% superiore dell'elemento entra nel viewport

    // Animazione Slide-Up
    gsap.utils.toArray('.anim-slide-up').forEach(elem => {
        // Evita di ri-animare gli elementi già animati nell'hero
        if (!elem.classList.contains('hero-subtitle')) {
            gsap.from(elem, {
                scrollTrigger: { trigger: elem, start: defaultStart, toggleActions: "play none none reverse" },
                y: 60,
                opacity: 0,
                duration: 1,
                ease: "power3.out"
            });
        }
    });

    // Animazione Slide-Left
    gsap.utils.toArray('.anim-slide-left').forEach(elem => {
        gsap.from(elem, {
            scrollTrigger: { trigger: elem, start: defaultStart, toggleActions: "play none none reverse" },
            x: -80, // Da sinistra
            opacity: 0,
            duration: 1,
            ease: "power3.out"
        });
    });

     // Animazione Slide-Right
    gsap.utils.toArray('.anim-slide-right').forEach(elem => {
        gsap.from(elem, {
            scrollTrigger: { trigger: elem, start: defaultStart, toggleActions: "play none none reverse" },
            x: 80, // Da destra
            opacity: 0,
            duration: 1,
            ease: "power3.out"
        });
    });

    // Animazione Pop-In (scale + opacity) con Stagger per le griglie
    gsap.utils.toArray('.anim-pop-in').forEach(elem => {
        gsap.from(elem, {
            scrollTrigger: {
                trigger: elem,
                start: defaultStart,
                toggleActions: "play none none reverse",
                // Applica stagger se l'elemento è dentro una griglia conosciuta
                 stagger: (elem.closest('.features-grid') || elem.closest('.contact-info-boxes')) ? 0.15 : 0
            },
            scale: 0.8,
            opacity: 0,
            duration: 0.8,
            ease: "back.out(1.4)" // Effetto rimbalzo carino
        });
    });

     // Animazione Rotate-In con Stagger
    gsap.utils.toArray('.anim-rotate-in').forEach(elem => {
        gsap.from(elem, {
            scrollTrigger: {
                trigger: elem,
                start: defaultStart,
                toggleActions: "play none none reverse",
                stagger: elem.closest('.programs-layout') ? 0.2 : 0
            },
            rotate: -45, // Ruota da -45 gradi
            scale: 0.7,
            opacity: 0,
            duration: 1,
            ease: "power3.out"
        });
    });

     // Animazione Footer (slide-up con stagger)
     gsap.from(".anim-footer", {
        scrollTrigger: {
            trigger: ".main-footer", // Trigger basato sul footer intero
            start: "top 90%", // Un po' più in basso
            toggleActions: "play none none reverse",
        },
        y: 50,
        opacity: 0,
        duration: 0.8,
        ease: "power2.out",
        stagger: 0.15 // Applica ritardo tra le colonne
     });


    // --- Esempio Animazione HOVER con GSAP (Alternativa a CSS) ---
    // Puoi usare GSAP per hover più complessi se necessario,
    // ma per quelli attuali, il CSS è sufficiente e più performante.
    /*
    const featureCards = gsap.utils.toArray('.feature-card');
    featureCards.forEach(card => {
        const icon = card.querySelector('.feature-icon');
        const tl = gsap.timeline({ paused: true }); // Timeline in pausa

        tl.to(icon, { rotateY: 360, scale: 1.1, duration: 0.5, ease: "back.out(1.7)" })
          .to(card, { y: -10, boxShadow: "0 15px 30px rgba(0, 0, 0, 0.4)", duration: 0.3 }, 0); // 0 = start at the same time

        card.addEventListener('mouseenter', () => tl.play());
        card.addEventListener('mouseleave', () => tl.reverse());
    });
    */

    console.log("Chimera Strength Animations Initialized!");

}); // Fine DOMContentLoaded