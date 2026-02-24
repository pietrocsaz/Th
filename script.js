/**
 * TH DESIGN - Strategic Personal Brand Website
 * Main JavaScript File
 */

document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================================================
       1. Smooth Scroll (Lenis) Initialization
       ========================================================================== */
    const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // https://www.desmos.com/calculator/brs54l4xou
        direction: 'vertical',
        gestureDirection: 'vertical',
        smooth: true,
        mouseMultiplier: 1,
        smoothTouch: false,
        touchMultiplier: 2,
    });

    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // Integrate Lenis with GSAP ScrollTrigger
    gsap.registerPlugin(ScrollTrigger);

    // Update ScrollTrigger on Lenis scroll
    lenis.on('scroll', ScrollTrigger.update);

    // Set GSAP ticker to use Lenis RAF
    gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);

    /* ==========================================================================
       1.5 Smooth Scroll Links & Click Animation
       ========================================================================== */
    const scrollLinks = document.querySelectorAll('a[href^="#"]');
    scrollLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');

            // Add a little click animation on the button/link itself
            gsap.to(link, {
                scale: 0.9,
                duration: 0.1,
                yoyo: true,
                repeat: 1
            });

            if (targetId === '#') {
                lenis.scrollTo(0, { duration: 1.5, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
                return;
            }

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                // Scroll to element using Lenis
                lenis.scrollTo(targetElement, {
                    offset: -100, // accommodate for header
                    duration: 1.5,
                    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
                });
            }
        });
    });

    /* ==========================================================================
       2. Header Scroll Effect
       ========================================================================== */
    const header = document.querySelector('.site-header');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });


    /* ==========================================================================
       3. GSAP Animations
       ========================================================================== */

    // Initial Reveal (Hero Section)
    gsap.set('.reveal-up', { y: 30, autoAlpha: 0 });
    gsap.set('.reveal-opacity', { autoAlpha: 0 });

    const heroTimeline = gsap.timeline({ defaults: { ease: 'power3.out', duration: 1 } });

    heroTimeline
        .to('#hero .sub-badge', { y: 0, autoAlpha: 1 })
        .to('#hero .hero-title', { y: 0, autoAlpha: 1, duration: 1.2 }, "-=0.8")
        .to('#hero .hero-subtitle', { y: 0, autoAlpha: 1 }, "-=1")
        .to('#hero .hero-actions', { y: 0, autoAlpha: 1 }, "-=0.8")
        .to('#hero .hero-graphic', { autoAlpha: 1, duration: 1.5 }, "-=0.5");


    // ScrollReveal for other sections
    const revealElements = document.querySelectorAll('.reveal-up:not(#hero .reveal-up)');

    revealElements.forEach((el) => {
        gsap.to(el, {
            scrollTrigger: {
                trigger: el,
                start: 'top 85%', // Trigger when top of element hits 85% of viewport
                toggleActions: 'play none none none' // Play once
            },
            y: 0,
            autoAlpha: 1,
            duration: 0.8,
            ease: 'power3.out'
        });
    });

    // Parallax abstract shapes in Hero
    gsap.to('.shape-1', {
        y: -100,
        ease: 'none',
        scrollTrigger: {
            trigger: '#hero',
            start: 'top top',
            end: 'bottom top',
            scrub: true
        }
    });

    gsap.to('.shape-2', {
        y: -50,
        x: 30,
        ease: 'none',
        scrollTrigger: {
            trigger: '#hero',
            start: 'top top',
            end: 'bottom top',
            scrub: true
        }
    });


    /* ==========================================================================
       4. Strategic Form Logic (WhatsApp Redirect)
       ========================================================================== */
    const form = document.getElementById('strategic-form');

    if (form) {
        form.addEventListener('submit', function (e) {
            e.preventDefault();

            // Collect Data
            const nome = document.getElementById('nome').value.trim();
            const empresa = document.getElementById('empresa').value.trim();
            const instagram = document.getElementById('instagram').value.trim();
            const whatsapp = document.getElementById('whatsapp').value.trim();
            const paleta = document.getElementById('paleta').value.trim() || 'Nenhuma informada';
            const mensagem = document.getElementById('mensagem').value.trim();

            // Collect selected checkboxes
            const checkboxes = document.querySelectorAll('input[name="servicos"]:checked');
            let servicosDesejados = [];
            checkboxes.forEach((box) => {
                servicosDesejados.push(box.value);
            });

            const servicosStr = servicosDesejados.length > 0
                ? servicosDesejados.join(', ')
                : 'Nenhum serviço específico selecionado';

            // Format WhatsApp Message
            const textoMensagem = `
*NOVO PROJETO ESTRATÉGICO* 🚀
            
*Nome:* ${nome}
*Empresa:* ${empresa}
*Instagram:* ${instagram}
*WhatsApp:* ${whatsapp}

*Serviços de Interesse:*
${servicosStr}

*Direção Visual / Paleta:*
${paleta}

*Detalhes do Projeto:*
${mensagem}
            `.trim();

            // WhatsApp Number (Country code + Area code + Number)
            const numeroWhatsApp = '554999642327';

            // Encode Message
            const encodedMessage = encodeURIComponent(textoMensagem);

            // Create URL (use wa.me for universal compatibility)
            const whatsappURL = `https://wa.me/${numeroWhatsApp}?text=${encodedMessage}`;

            // Redirect user
            window.open(whatsappURL, '_blank');
        });
    }

    // Add CSS variable for dynamic header height (for offset scrolling)
    function setHeaderHeight() {
        if (header) {
            const height = header.offsetHeight;
            document.documentElement.style.setProperty('--header-height', `${height}px`);
        }
    }

    setHeaderHeight();
    window.addEventListener('resize', setHeaderHeight);
});
