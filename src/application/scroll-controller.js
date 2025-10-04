class ScrollController {
    constructor() {
        this.scrollIndicator = document.querySelector('.scroll-indicator');
        this.sections = document.querySelectorAll('section');
        this.hero = document.querySelector('.hero');
        this.scrollArrow = document.querySelector('.scroll-indicator-arrow');
        this.heroCtaBtn = document.querySelector('#hero-connect-btn');

        this.init();
    }

    init() {
        this.bindEvents();
        this.setupIntersectionObserver();
    }

    bindEvents() {
        // Use passive event listeners for better scroll performance on mobile
        window.addEventListener('scroll', this.handleScroll.bind(this), { passive: true });
        window.addEventListener('scroll', this.updateScrollIndicator.bind(this), { passive: true });

        // Add click handler for scroll arrow
        if (this.scrollArrow) {
            this.scrollArrow.addEventListener('click', () => {
                window.scrollTo({
                    top: window.innerHeight,
                    behavior: 'smooth'
                });
            });
        }

        // Add click handler for hero CTA button - scroll to final CTA
        if (this.heroCtaBtn) {
            this.heroCtaBtn.addEventListener('click', () => {
                const finalSection = document.querySelector('.shape-future-section');
                if (finalSection) {
                    finalSection.scrollIntoView({ behavior: 'smooth' });
                }
            });
        }
    }

    handleScroll() {
        const scrollY = window.scrollY;
        const windowHeight = window.innerHeight;
        const isMobile = window.innerWidth <= 768;

        // Fade out scroll arrow quickly (before hero content)
        if (this.scrollArrow) {
            const arrowOpacity = Math.max(0, 1 - (scrollY / 200)); // Fades out in first 200px
            this.scrollArrow.style.opacity = arrowOpacity;
        }

        // Fade out hero CTA button as user scrolls (disappears after hero section)
        if (this.heroCtaBtn) {
            const ctaOpacity = Math.max(0, 1 - (scrollY / (windowHeight * 0.5))); // Fades out halfway through hero
            this.heroCtaBtn.style.opacity = ctaOpacity;
            if (ctaOpacity === 0) {
                this.heroCtaBtn.style.pointerEvents = 'none';
            } else {
                this.heroCtaBtn.style.pointerEvents = 'auto';
            }
        }

        // Hero parallax effect - disable on mobile to prevent jittery scrolling
        if (this.hero) {
            const heroContent = this.hero.querySelector('.hero-content');
            const opacity = Math.max(0, 1 - (scrollY / windowHeight));

            if (!isMobile) {
                // Desktop: parallax + fade
                const translateY = scrollY * 0.5;
                heroContent.style.transform = `translateY(${translateY}px)`;
                heroContent.style.opacity = opacity;
            } else {
                // Mobile: just fade out without parallax transform
                heroContent.style.transform = 'none';
                heroContent.style.opacity = opacity;
            }
        }
    }

    updateScrollIndicator() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / scrollHeight) * 100;
        
        if (this.scrollIndicator) {
            this.scrollIndicator.style.width = scrollPercent + '%';
        }
    }

    setupIntersectionObserver() {
        const options = {
            threshold: 0.1,
            rootMargin: '0px 0px -100px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, options);

        this.sections.forEach(section => {
            observer.observe(section);
        });

        // Setup fade effect for final CTA
        this.setupFinalCtaFade();
    }

    setupFinalCtaFade() {
        const finalSection = document.querySelector('.shape-future-section');
        if (!finalSection) return;

        const fadeSections = [
            document.querySelector('.manifesto-section'),
            document.querySelector('.applications-section'),
            document.querySelector('.leadership-section'),
            document.querySelector('.learn-more-section')
        ].filter(Boolean);

        window.addEventListener('scroll', () => {
            const finalSectionTop = finalSection.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            const triggerPoint = windowHeight * 0.7; // Start fading when final section is 70% visible

            if (finalSectionTop < triggerPoint) {
                // Calculate fade intensity based on scroll position
                const fadeProgress = Math.max(0, Math.min(1, (triggerPoint - finalSectionTop) / 300));

                fadeSections.forEach(section => {
                    if (fadeProgress > 0.3) {
                        section.classList.add('fade-out');
                    } else {
                        section.classList.remove('fade-out');
                    }
                });
            } else {
                fadeSections.forEach(section => {
                    section.classList.remove('fade-out');
                });
            }
        });
    }

    // Smooth scroll to element
    scrollToElement(elementId) {
        const element = document.getElementById(elementId);
        if (element) {
            const offsetTop = element.offsetTop;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    }
}