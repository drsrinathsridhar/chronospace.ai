class InteractionController {
    constructor() {
        this.collapseTriggers = document.querySelectorAll('.collapse-trigger');
        this.init();
    }

    init() {
        this.bindCollapseEvents();
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