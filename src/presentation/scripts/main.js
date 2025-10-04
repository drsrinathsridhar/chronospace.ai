// Main application initialization
document.addEventListener('DOMContentLoaded', function() {
    // Initialize controllers
    const scrollController = new ScrollController();
    const interactionController = new InteractionController();
    
    // Smooth scrolling for any anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            scrollController.scrollToElement(targetId);
        });
    });
    
    // Add loading animation complete
    setTimeout(() => {
        document.body.classList.add('loaded');
    }, 100);
    
    // Performance optimization: Reduce scroll event frequency
    let ticking = false;
    
    function updateOnScroll() {
        if (!ticking) {
            requestAnimationFrame(() => {
                // Additional scroll-based animations can be added here
                ticking = false;
            });
            ticking = true;
        }
    }
    
    window.addEventListener('scroll', updateOnScroll);
    
    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        switch(e.key) {
            case 'Home':
                e.preventDefault();
                scrollController.scrollToElement('hero');
                break;
            case 'End':
                e.preventDefault();
                window.scrollTo({
                    top: document.body.scrollHeight,
                    behavior: 'smooth'
                });
                break;
        }
    });
    
    // Handle reduced motion preference
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        document.documentElement.style.scrollBehavior = 'auto';
        
        // Disable animations for users who prefer reduced motion
        const style = document.createElement('style');
        style.textContent = `
            *, *::before, *::after {
                animation-duration: 0.01ms !important;
                animation-iteration-count: 1 !important;
                transition-duration: 0.01ms !important;
            }
        `;
        document.head.appendChild(style);
    }
    
    console.log('ChronoSpace AI site initialized');
});