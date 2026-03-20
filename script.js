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
 
    // 4. Particle System for Dynamic Background
    const canvas = document.getElementById('particle-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let particles = [];
        const particleCount = 40;

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        window.addEventListener('resize', resize);
        resize();

        class Particle {
            constructor() {
                this.init();
            }

            init() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.velX = (Math.random() - 0.5) * 0.5;
                this.velY = (Math.random() - 0.5) * 0.5;
                this.size = Math.random() * 2;
            }

            update() {
                this.x += this.velX;
                this.y += this.velY;

                if (this.x < 0 || this.x > canvas.width) this.velX *= -1;
                if (this.y < 0 || this.y > canvas.height) this.velY *= -1;
            }

            draw() {
                ctx.fillStyle = 'rgba(6, 182, 212, 0.2)'; // accent-cyan
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }

        let mouse = { x: null, y: null };
        window.addEventListener('mousemove', (e) => {
            mouse.x = e.x;
            mouse.y = e.y;
        });

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            particles.forEach((p, i) => {
                p.update();
                
                // Mouse interaction: Repulsion
                if (mouse.x && mouse.y) {
                    const dx = p.x - mouse.x;
                    const dy = p.y - mouse.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < 100) {
                        const force = (100 - dist) / 100;
                        p.x += (dx / dist) * force * 5;
                        p.y += (dy / dist) * force * 5;
                    }
                }

                p.draw();

                // Draw lines between nearby particles
                for (let j = i + 1; j < particles.length; j++) {
                    const p2 = particles[j];
                    const dx = p.x - p2.x;
                    const dy = p.y - p2.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < 150) {
                        ctx.strokeStyle = `rgba(6, 182, 212, ${0.1 * (1 - dist / 150)})`;
                        ctx.lineWidth = 0.5;
                        ctx.beginPath();
                        ctx.moveTo(p.x, p.y);
                        ctx.lineTo(p2.x, p2.y);
                        ctx.stroke();
                    }
                }
            });
            requestAnimationFrame(animate);
        };

        animate();
    }

    // 5. Contact Form AJAX Submission
    const contactForm = document.getElementById('contact-form');
    const formStatus = document.getElementById('form-status');
    const submitBtn = document.getElementById('submit-btn');

    if (contactForm && submitBtn) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            // Change button state
            const originalBtnText = submitBtn.innerHTML;
            submitBtn.disabled = true;
            submitBtn.innerHTML = `
                <svg class="animate-spin h-5 w-5 text-dark-900 inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span class="ml-2">Enviando...</span>
            `;

            const formData = new FormData(contactForm);
            
            try {
                const response = await fetch(contactForm.action, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Accept': 'application/json'
                    }
                });

                if (response.ok) {
                    // Success
                    formStatus.textContent = "¡Mensaje enviado con éxito! Te contactaré pronto.";
                    formStatus.className = "p-4 rounded-xl text-center text-sm font-medium animate-fade-in bg-green-500/10 text-green-400 border border-green-500/20 mb-4";
                    formStatus.classList.remove('hidden');
                    contactForm.reset();
                    
                    // Hide message after 5 seconds
                    setTimeout(() => {
                        formStatus.classList.add('hidden');
                    }, 5000);
                } else {
                    const data = await response.json();
                    throw new Error(data.errors ? data.errors.map(err => err.message).join(", ") : "Error en el servidor");
                }
            } catch (error) {
                console.error("Error submitting form:", error);
                formStatus.textContent = "Hubo un problema al enviar el mensaje. Por favor intenta de nuevo.";
                formStatus.className = "p-4 rounded-xl text-center text-sm font-medium animate-fade-in bg-red-500/10 text-red-400 border border-red-500/20 mb-4";
                formStatus.classList.remove('hidden');
            } finally {
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalBtnText;
            }
        });
    }

    // 6. Interactive Project Scroll Indicator
    const projectsViewport = document.getElementById('projects-viewport');
    const scrollIndicator = document.getElementById('scroll-indicator');
    const scrollTrack = document.getElementById('scroll-track');

    if (projectsViewport && scrollIndicator && scrollTrack) {
        let isDragging = false;
        let startX;
        let startScrollLeft;

        // Function to update indicator based on viewport scroll
        const updateIndicator = () => {
            if (isDragging) return;
            const scrollWidth = projectsViewport.scrollWidth - projectsViewport.clientWidth;
            const scrollLeft = projectsViewport.scrollLeft;
            const progress = (scrollLeft / scrollWidth); // 0 to 1
            const leftRange = (scrollTrack.clientWidth - scrollIndicator.clientWidth) / scrollTrack.clientWidth * 100;
            scrollIndicator.style.left = `${progress * leftRange}%`;
        };


        projectsViewport.addEventListener('scroll', updateIndicator);

        // Click on track to jump
        scrollTrack.addEventListener('click', (e) => {
            if (e.target === scrollIndicator) return;
            const rect = scrollTrack.getBoundingClientRect();
            const clickPos = (e.clientX - rect.left) / rect.width;
            const scrollWidth = projectsViewport.scrollWidth - projectsViewport.clientWidth;
            projectsViewport.scrollLeft = clickPos * scrollWidth;
        });

        // Dragging logic
        const startDragging = (e) => {
            isDragging = true;
            startX = e.pageX || e.touches[0].pageX;
            startScrollLeft = projectsViewport.scrollLeft;
            scrollIndicator.style.transition = 'none';
            scrollIndicator.classList.add('cursor-grabbing');
            document.body.classList.add('select-none');
        };

        const stopDragging = () => {
            if (!isDragging) return;
            isDragging = false;
            scrollIndicator.style.transition = '';
            scrollIndicator.classList.remove('cursor-grabbing');
            document.body.classList.remove('select-none');
        };

        const moveDragging = (e) => {
            if (!isDragging) return;
            e.preventDefault();
            const x = e.pageX || e.touches[0].pageX;
            const walk = (x - startX) * (projectsViewport.scrollWidth / scrollTrack.clientWidth);
            projectsViewport.scrollLeft = startScrollLeft + walk;

            // Manual indicator update during drag
            const scrollWidth = projectsViewport.scrollWidth - projectsViewport.clientWidth;
            const progress = (projectsViewport.scrollLeft / scrollWidth);
            const leftRange = (scrollTrack.clientWidth - scrollIndicator.clientWidth) / scrollTrack.clientWidth * 100;
            scrollIndicator.style.left = `${Math.min(leftRange, Math.max(0, progress * leftRange))}%`;
        };

        scrollIndicator.addEventListener('mousedown', startDragging);
        scrollIndicator.addEventListener('touchstart', startDragging);

        window.addEventListener('mousemove', moveDragging);
        window.addEventListener('touchmove', moveDragging);

        window.addEventListener('mouseup', stopDragging);
        window.addEventListener('touchend', stopDragging);

        // Arrow Button Navigation
        const btnLeft = document.getElementById('scroll-left');
        const btnRight = document.getElementById('scroll-right');

        if (btnLeft && btnRight) {
            btnLeft.addEventListener('click', () => {
                projectsViewport.scrollBy({ left: -400, behavior: 'smooth' });
            });
            btnRight.addEventListener('click', () => {
                projectsViewport.scrollBy({ left: 400, behavior: 'smooth' });
            });
        }
    }
});




