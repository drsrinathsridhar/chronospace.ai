class InteractionController {
    constructor() {
        this.collapseTriggers = document.querySelectorAll('.collapse-trigger');
        this.carousel = document.getElementById('article-carousel');
        this.prevBtn = document.getElementById('carousel-prev');
        this.nextBtn = document.getElementById('carousel-next');
        this.paginationDots = document.querySelectorAll('.pagination-dot');
        this.init();
    }

    init() {
        this.bindCollapseEvents();
        this.bindCarouselEvents();
        this.bindPaginationEvents();
    }

    bindCollapseEvents() {
        this.collapseTriggers.forEach(trigger => {
            trigger.addEventListener('click', this.handleCollapseToggle.bind(this));
        });
    }

    handleCollapseToggle(event) {
        const trigger = event.currentTarget;
        const targetId = trigger.getAttribute('data-target');
        const content = document.getElementById(targetId);

        if (!content) return;

        const isOpen = content.classList.contains('open');
        const icon = trigger.querySelector('.collapse-icon');

        if (isOpen) {
            // Collapse
            content.classList.remove('open');
            trigger.classList.add('collapsed');
            if (icon) icon.textContent = '+';
        } else {
            // Expand
            content.classList.add('open');
            trigger.classList.remove('collapsed');
            if (icon) icon.textContent = '−';
        }
    }

    bindCarouselEvents() {
        if (!this.carousel || !this.prevBtn || !this.nextBtn) return;

        this.nextBtn.addEventListener('click', () => this.scrollCarousel('next'));
        this.prevBtn.addEventListener('click', () => this.scrollCarousel('prev'));
        this.carousel.addEventListener('scroll', () => this.updateArrowVisibility());

        // Initial arrow state
        this.updateArrowVisibility();
    }

    scrollCarousel(direction) {
        const scrollAmount = this.carousel.offsetWidth;
        const newScrollLeft = direction === 'next'
            ? this.carousel.scrollLeft + scrollAmount
            : this.carousel.scrollLeft - scrollAmount;

        this.carousel.scrollTo({
            left: newScrollLeft,
            behavior: 'smooth'
        });
    }

    updateArrowVisibility() {
        const scrollLeft = this.carousel.scrollLeft;
        const maxScroll = this.carousel.scrollWidth - this.carousel.clientWidth;

        // Show/hide left arrow
        if (scrollLeft > 10) {
            this.prevBtn.classList.add('visible');
        } else {
            this.prevBtn.classList.remove('visible');
        }

        // Show/hide right arrow
        if (scrollLeft < maxScroll - 10) {
            this.nextBtn.classList.remove('hidden');
        } else {
            this.nextBtn.classList.add('hidden');
        }

        // Update pagination dots
        this.updatePaginationDots();
    }

    bindPaginationEvents() {
        if (!this.paginationDots.length) return;

        this.paginationDots.forEach(dot => {
            dot.addEventListener('click', (e) => {
                const index = parseInt(e.currentTarget.getAttribute('data-index'));
                this.scrollToArticle(index);
            });
        });
    }

    scrollToArticle(index) {
        const cards = this.carousel.querySelectorAll('.article-card');
        if (cards[index]) {
            cards[index].scrollIntoView({
                behavior: 'smooth',
                block: 'nearest',
                inline: 'start'
            });
        }
    }

    updatePaginationDots() {
        const scrollLeft = this.carousel.scrollLeft;
        const cards = this.carousel.querySelectorAll('.article-card');

        if (!cards.length) return;

        // Find which card is most visible
        let currentIndex = 0;
        let minDistance = Infinity;

        cards.forEach((card, index) => {
            const cardLeft = card.offsetLeft;
            const distance = Math.abs(scrollLeft - cardLeft);

            if (distance < minDistance) {
                minDistance = distance;
                currentIndex = index;
            }
        });

        this.paginationDots.forEach((dot, index) => {
            if (index === currentIndex) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
    }
}

// Contact functionality
function openEmail() {
    const email = 'contact@chronospace.ai';
    const subject = 'Partnership Inquiry - ChronoSpace AI';
    const body = 'Hi ChronoSpace team,\n\nI\'m interested in learning more about your Geometric Foundation Model for Reality.\n\nBest regards,';
    
    window.location.href = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

function learnMore() {
    // Scroll to the manifesto section
    const manifestoSection = document.querySelector('.manifesto-section');
    if (manifestoSection) {
        const offsetTop = manifestoSection.offsetTop - 100;
        window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
        });
    }
}