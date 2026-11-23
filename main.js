/* ============================================================
   D-TECH — MAIN JAVASCRIPT
   Table of Contents:
   1. Mobile Navigation Toggle
   2. Scroll-based Fade-in Animations
   3. Navbar Background on Scroll
   4. Progress Bar Animation
   5. Smooth Scroll for Anchor Links
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

    /* ========================================================
       1. MOBILE NAVIGATION & DROPDOWN TOGGLE
       ======================================================== */
    const navToggle = document.querySelector('.navbar__toggle');
    const navbar = document.querySelector('.navbar');
    const dropdownToggle = document.querySelector('.navbar__dropdown-toggle');
    const dropdown = document.querySelector('.navbar__dropdown');

    if (navToggle) {
        navToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            navbar.classList.toggle('nav-open');
        });
    }

    if (dropdownToggle && dropdown) {
        dropdownToggle.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            dropdown.classList.toggle('is-open');
            const isOpen = dropdown.classList.contains('is-open');
            dropdownToggle.setAttribute('aria-expanded', isOpen);
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!dropdown.contains(e.target)) {
                dropdown.classList.remove('is-open');
                dropdownToggle.setAttribute('aria-expanded', 'false');
            }
        });
    }

    // Close mobile drawer when clicking outside the navbar
    document.addEventListener('click', (e) => {
        if (navbar && navbar.classList.contains('nav-open')) {
            if (!navbar.contains(e.target)) {
                navbar.classList.remove('nav-open');
            }
        }
    });

    // Close mobile drawer when any link (excluding dropdown toggle) is clicked
    const navLinks = document.querySelectorAll('.navbar__links a:not(.navbar__dropdown-toggle)');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navbar) {
                navbar.classList.remove('nav-open');
            }
        });
    });


    /* ========================================================
       2. SCROLL-BASED FADE-IN ANIMATIONS
       ======================================================== */
    // Add fade-in class to animatable elements
    const animatableSelectors = [
        '.mission__header',
        '.mission__card',
        '.purpose__header',
        '.purpose__card',
        '.systems__eyebrow',
        '.systems__title',
        '.systems__illustration',
        '.systems__feature',
        '.journey__header',
        '.journey__step',
        '.cta-section__eyebrow',
        '.cta-section__left',
        '.cta-section__right',
        '.hero__content',
        '.hero__image',
        '.stat',
        // About page
        '.about-hero__header',
        '.about-media-frame',
        '.about-split-row',
        '.about-header-stacked',
        '.principle-card',
        '.about-split-header',
        '.process-card',
        '.about-cta-row',
        // Robots page
        '.robots-hero__top',
        '.robots-hero__meta',
        '.robots-overview-card',
        '.robots-banner__inner',
        '.robots-section-header',
        '.robots-block-card',
        '.robots-path-row',
        // Contact page
        '.contact-hero__header',
        '.contact-split-grid',
        '.contact-faq-header',
        '.faq-row',
        // Smart Manhole page
        '.manhole-hero__top',
        '.manhole-stats-strip',
        '.manhole-overview-card',
        '.manhole-data-card',
        '.manhole-usecases-grid',
        '.telemetry-table-wrapper'
    ];

    const animatableElements = document.querySelectorAll(animatableSelectors.join(', '));
    animatableElements.forEach((el, index) => {
        el.classList.add('fade-in');
        // Stagger children of the same parent
        const siblings = el.parentElement.querySelectorAll('.fade-in');
        const siblingIndex = Array.from(siblings).indexOf(el);
        if (siblingIndex > 0 && siblingIndex <= 4) {
            el.classList.add(`fade-in-delay-${siblingIndex}`);
        }
    });

    // Intersection Observer for fade-in
    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -60px 0px',
        threshold: 0.1
    };

    const fadeObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                fadeObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.fade-in').forEach(el => {
        fadeObserver.observe(el);
    });


    /* ========================================================
       3. NAVBAR BACKGROUND ON SCROLL
       ======================================================== */
    const handleNavScroll = () => {
        if (window.scrollY > 50) {
            navbar.style.background = 'rgba(10, 10, 10, 0.95)';
        } else {
            navbar.style.background = 'rgba(10, 10, 10, 0.85)';
        }
    };

    window.addEventListener('scroll', handleNavScroll, { passive: true });


    /* ========================================================
       4. PROGRESS BAR ANIMATION
       ======================================================== */
    const progressBars = document.querySelectorAll('.journey__progress-bar');

    // Store original widths and reset to 0
    progressBars.forEach(bar => {
        bar.dataset.width = bar.style.width;
        bar.style.width = '0%';
    });

    const progressObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const bar = entry.target.querySelector('.journey__progress-bar');
                if (bar) {
                    setTimeout(() => {
                        bar.style.width = bar.dataset.width;
                    }, 300);
                }
                progressObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });

    document.querySelectorAll('.journey__step').forEach(step => {
        progressObserver.observe(step);
    });


    /* ========================================================
       5. SMOOTH SCROLL FOR ANCHOR LINKS
       ======================================================== */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            const href = anchor.getAttribute('href');
            if (href !== '#' && href !== '#smart-manhole') {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }
        });
    });


    /* ========================================================
       6. TELEMETRY TABS FILTER (SMART MANHOLE)
       ======================================================== */
    const telemetryTabs = document.querySelectorAll('.telemetry-tab');
    const telemetryRows = document.querySelectorAll('.telemetry-table tbody tr');

    if (telemetryTabs.length > 0) {
        telemetryTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                telemetryTabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');

                const filter = tab.dataset.filter;
                telemetryRows.forEach(row => {
                    if (filter === 'all' || row.dataset.type === filter) {
                        row.style.display = '';
                    } else {
                        row.style.display = 'none';
                    }
                });
            });
        });
    }

});
