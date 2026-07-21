/**
 * NexGen Solutions - Main JavaScript
 * ===================================
 * Handles navigation, animations, gallery, lightbox, and form validation
 */

document.addEventListener('DOMContentLoaded', function () {

    // ==================== NAVBAR SCROLL EFFECT ====================
    const navbar = document.getElementById('mainNav');
    const backToTop = document.getElementById('backToTop');

    function handleScroll() {
        const scrollY = window.scrollY;

        // Navbar background on scroll
        if (scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Back to top button visibility
        if (backToTop) {
            if (scrollY > 300) {
                backToTop.classList.add('visible');
            } else {
                backToTop.classList.remove('visible');
            }
        }
    }

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Run on page load

    // ==================== CLOSE MOBILE NAV ON LINK CLICK ====================
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
    const navCollapse = document.getElementById('navbarNav');

    navLinks.forEach(function (link) {
        link.addEventListener('click', function () {
            if (navCollapse.classList.contains('show')) {
                const bsCollapse = bootstrap.Collapse.getInstance(navCollapse);
                if (bsCollapse) {
                    bsCollapse.hide();
                }
            }
        });
    });

    // ==================== SMOOTH SCROLL FOR ANCHOR LINKS ====================
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
        anchor.addEventListener('click', function (e) {
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                e.preventDefault();
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // ==================== SCROLL REVEAL ANIMATIONS ====================
    function revealOnScroll() {
        const elements = document.querySelectorAll('[data-aos]');
        const windowHeight = window.innerHeight;

        elements.forEach(function (el) {
            const elementTop = el.getBoundingClientRect().top;
            const delay = el.getAttribute('data-aos-delay') || 0;

            if (elementTop < windowHeight - 100) {
                setTimeout(function () {
                    el.style.opacity = '1';
                    el.style.transform = 'translateY(0)';
                }, parseInt(delay));
            }
        });
    }

    // Initial setup for AOS elements
    document.querySelectorAll('[data-aos]').forEach(function (el) {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
    });

    window.addEventListener('scroll', revealOnScroll);
    revealOnScroll(); // Run on page load

    // ==================== COUNTER ANIMATION ====================
    function animateCounters() {
        const counters = document.querySelectorAll('.stat-item h3');
        const windowHeight = window.innerHeight;

        counters.forEach(function (counter) {
            const elementTop = counter.getBoundingClientRect().top;

            if (elementTop < windowHeight - 50 && !counter.classList.contains('counted')) {
                counter.classList.add('counted');
                const target = parseInt(counter.textContent);
                const duration = 2000;
                const step = target / (duration / 16);
                let current = 0;

                const timer = setInterval(function () {
                    current += step;
                    if (current >= target) {
                        counter.textContent = target + '+';
                        clearInterval(timer);
                    } else {
                        counter.textContent = Math.floor(current) + '+';
                    }
                }, 16);
            }
        });
    }

    window.addEventListener('scroll', animateCounters);

    // ==================== GALLERY FILTER ====================
    const filterBtns = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');

    if (filterBtns.length > 0) {
        filterBtns.forEach(function (btn) {
            btn.addEventListener('click', function () {
                // Update active button
                filterBtns.forEach(function (b) { b.classList.remove('active'); });
                btn.classList.add('active');

                const filter = btn.getAttribute('data-filter');

                galleryItems.forEach(function (item) {
                    if (filter === 'all' || item.getAttribute('data-category') === filter) {
                        item.classList.remove('hidden');
                        item.style.animation = 'fadeInUp 0.5s ease forwards';
                    } else {
                        item.classList.add('hidden');
                    }
                });
            });
        });
    }

    // ==================== LIGHTBOX ====================
    const lightboxModal = document.getElementById('lightboxModal');
    const lightboxImage = document.getElementById('lightboxImage');
    const lightboxClose = document.getElementById('lightboxClose');
    const lightboxPrev = document.getElementById('lightboxPrev');
    const lightboxNext = document.getElementById('lightboxNext');
    const lightboxCounter = document.getElementById('lightboxCounter');

    let currentLightboxIndex = 0;
    let lightboxImages = [];

    if (lightboxModal) {
        // Collect all lightbox images
        document.querySelectorAll('.gallery-zoom').forEach(function (link, index) {
            lightboxImages.push({
                src: link.getAttribute('href'),
                alt: link.closest('.gallery-card').querySelector('img').getAttribute('alt')
            });

            link.addEventListener('click', function (e) {
                e.preventDefault();
                currentLightboxIndex = index;
                openLightbox();
            });
        });

        function openLightbox() {
            lightboxImage.src = lightboxImages[currentLightboxIndex].src;
            lightboxImage.alt = lightboxImages[currentLightboxIndex].alt;
            lightboxCounter.textContent = (currentLightboxIndex + 1) + ' / ' + lightboxImages.length;
            lightboxModal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }

        function closeLightbox() {
            lightboxModal.classList.remove('active');
            document.body.style.overflow = '';
        }

        function nextImage() {
            currentLightboxIndex = (currentLightboxIndex + 1) % lightboxImages.length;
            openLightbox();
        }

        function prevImage() {
            currentLightboxIndex = (currentLightboxIndex - 1 + lightboxImages.length) % lightboxImages.length;
            openLightbox();
        }

        lightboxClose.addEventListener('click', closeLightbox);
        lightboxNext.addEventListener('click', nextImage);
        lightboxPrev.addEventListener('click', prevImage);

        // Close on background click
        lightboxModal.addEventListener('click', function (e) {
            if (e.target === lightboxModal) {
                closeLightbox();
            }
        });

        // Keyboard navigation
        document.addEventListener('keydown', function (e) {
            if (!lightboxModal.classList.contains('active')) return;

            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowRight') nextImage();
            if (e.key === 'ArrowLeft') prevImage();
        });
    }

    // ==================== CONTACT FORM VALIDATION ====================
    const contactForm = document.getElementById('contactForm');

    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();

            let isValid = true;

            // Name validation
            const name = document.getElementById('name');
            if (name.value.trim().length < 2) {
                setInvalid(name, 'Please enter your name (at least 2 characters).');
                isValid = false;
            } else {
                setValid(name);
            }

            // Email validation
            const email = document.getElementById('email');
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email.value.trim())) {
                setInvalid(email, 'Please enter a valid email address.');
                isValid = false;
            } else {
                setValid(email);
            }

            // Phone validation
            const phone = document.getElementById('phone');
            const phoneRegex = /^[\+]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{1,4}[-\s\.]?[0-9]{1,9}$/;
            if (!phoneRegex.test(phone.value.trim())) {
                setInvalid(phone, 'Please enter a valid phone number.');
                isValid = false;
            } else {
                setValid(phone);
            }

            // Subject validation
            const subject = document.getElementById('subject');
            if (!subject.value) {
                setInvalid(subject, 'Please select a subject.');
                isValid = false;
            } else {
                setValid(subject);
            }

            // Message validation
            const message = document.getElementById('message');
            if (message.value.trim().length < 10) {
                setInvalid(message, 'Please enter your message (at least 10 characters).');
                isValid = false;
            } else {
                setValid(message);
            }

            // If valid, show success message
            if (isValid) {
                const submitBtn = document.getElementById('submitBtn');
                const successMsg = document.getElementById('formSuccess');

                // Simulate form submission
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Sending...';
                submitBtn.disabled = true;

                setTimeout(function () {
                    submitBtn.innerHTML = '<i class="fas fa-check me-2"></i>Sent!';
                    successMsg.classList.remove('d-none');
                    successMsg.classList.add('show');
                    contactForm.reset();

                    setTimeout(function () {
                        submitBtn.innerHTML = '<i class="fas fa-paper-plane me-2"></i>Send Message';
                        submitBtn.disabled = false;
                    }, 3000);
                }, 1500);
            }
        });

        // Real-time validation on input
        const formInputs = contactForm.querySelectorAll('.form-control, .form-select');
        formInputs.forEach(function (input) {
            input.addEventListener('input', function () {
                if (this.classList.contains('is-invalid')) {
                    if (this.id === 'email') {
                        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                        if (emailRegex.test(this.value.trim())) setValid(this);
                    } else if (this.id === 'phone') {
                        const phoneRegex = /^[\+]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{1,4}[-\s\.]?[0-9]{1,9}$/;
                        if (phoneRegex.test(this.value.trim())) setValid(this);
                    } else if (this.id === 'message') {
                        if (this.value.trim().length >= 10) setValid(this);
                    } else if (this.id === 'name') {
                        if (this.value.trim().length >= 2) setValid(this);
                    } else if (this.tagName === 'SELECT') {
                        if (this.value) setValid(this);
                    }
                }
            });
        });
    }

    function setInvalid(element, message) {
        element.classList.add('is-invalid');
        element.classList.remove('is-valid');
        const feedback = element.parentElement.querySelector('.invalid-feedback');
        if (feedback) feedback.textContent = message;
    }

    function setValid(element) {
        element.classList.remove('is-invalid');
        element.classList.add('is-valid');
    }

    // ==================== TYPING EFFECT (Hero Section) ====================
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
        // Add subtle floating animation to hero elements
        const heroContent = document.querySelector('.hero-section .col-lg-8');
        if (heroContent) {
            heroContent.style.animation = 'fadeInUp 1s ease forwards';
        }
    }

    // ==================== PARALLAX EFFECT ON HERO ====================
    const heroSection = document.querySelector('.hero-section');
    if (heroSection) {
        window.addEventListener('scroll', function () {
            const scrollY = window.scrollY;
            if (scrollY < heroSection.offsetHeight) {
                heroSection.style.backgroundPositionY = (scrollY * 0.5) + 'px';
            }
        });
    }

    // ==================== ACTIVE NAV LINK HIGHLIGHT ====================
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    navLinks.forEach(function (link) {
        link.classList.remove('active');
        const href = link.getAttribute('href');
        if (href === currentPage) {
            link.classList.add('active');
        }
    });

    // ==================== TOOLTIP INITIALIZATION ====================
    const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
    tooltipTriggerList.forEach(function (el) {
        new bootstrap.Tooltip(el);
    });

});
