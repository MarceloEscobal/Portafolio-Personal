document.addEventListener('DOMContentLoaded', () => {

    // 1. Native cursor restored for maximum performance

    // 2. Mobile Navigation Drawer Toggle
    const navToggle = document.getElementById('nav-toggle');
    const body = document.body;
    const navLinks = document.querySelectorAll('.nav-link');
    const navOverlay = document.getElementById('nav-overlay');
    const navIcon = document.getElementById('nav-icon');

    const toggleNav = () => {
        body.classList.toggle('nav-open');
        // change icon
        if (body.classList.contains('nav-open')) {
            navIcon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>';
        } else {
            navIcon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7"></path>';
        }
    };

    if (navToggle) navToggle.addEventListener('click', toggleNav);
    if (navOverlay) navOverlay.addEventListener('click', toggleNav);

    // Close nav when clicking a link on mobile
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth < 640 && body.classList.contains('nav-open')) {
                toggleNav();
            }
        });
    });

    // 3. Intersection Observer for Scroll Reveal
    const revealElements = document.querySelectorAll('.reveal');
    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -10% 0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    revealElements.forEach(el => observer.observe(el));
});
