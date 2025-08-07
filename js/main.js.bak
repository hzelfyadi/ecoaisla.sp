document.addEventListener('DOMContentLoaded', function() {
    /**
     * Main JavaScript for AISLA-ECO Website
     * Handles navigation, animations, and interactivity
     */

    // Mobile menu toggle
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const navItems = document.querySelectorAll('.nav-links a');
    const body = document.body;
    
    // Toggle mobile menu
    if (hamburger) {
        hamburger.addEventListener('click', function() {
            this.classList.toggle('active');
            navLinks.classList.toggle('active');
            body.classList.toggle('no-scroll');
        });
    }
    
    // Close mobile menu when clicking on a nav link
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            if (navLinks.classList.contains('active')) {
                hamburger.classList.remove('active');
                navLinks.classList.remove('active');
                body.classList.remove('no-scroll');
            }
        });
    });
    
    // Smooth scrolling for anchor links with offset for fixed header
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#' || targetId === '') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerHeight = document.querySelector('header').offsetHeight;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - (headerHeight + 20);
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Update URL without page jump
                history.pushState(null, null, targetId);
            }
        });
    });
    
    // Enhanced FAQ accordion functionality with smooth animations
    const faqItems = document.querySelectorAll('.faq-item');
    
    // Function to close all FAQ items except the one passed as parameter
    function closeOtherFaqs(currentFaq) {
        document.querySelectorAll('.faq-item').forEach(faq => {
            if (faq !== currentFaq) {
                const answer = faq.querySelector('.faq-answer');
                const icon = faq.querySelector('h3 i');
                
                faq.classList.remove('active');
                answer.style.maxHeight = '0';
                answer.style.paddingTop = '0';
                answer.style.paddingBottom = '0';
                answer.style.opacity = '0';
                
                // Reset icon rotation
                if (icon) {
                    icon.style.transform = 'rotate(0deg)';
                }
            }
        });
    }
    
    // Initialize FAQ items
    faqItems.forEach(item => {
        const question = item.querySelector('h3');
        const answer = item.querySelector('.faq-answer');
        const icon = item.querySelector('h3 i');
        
        // Set initial state
        answer.style.transition = 'max-height 0.4s ease, padding 0.4s ease, opacity 0.3s ease';
        
        // Add click event
        question.addEventListener('click', function() {
            const isActive = item.classList.contains('active');
            
            // Close all other FAQs when opening a new one
            if (!isActive) {
                closeOtherFaqs(item);
            }
            
            // Toggle current FAQ
            item.classList.toggle('active');
            
            if (item.classList.contains('active')) {
                // Open FAQ
                answer.style.maxHeight = answer.scrollHeight + 'px';
                answer.style.paddingTop = '1.5rem';
                answer.style.paddingBottom = '1.5rem';
                answer.style.opacity = '1';
                
                // Rotate icon
                if (icon) {
                    icon.style.transform = 'rotate(180deg)';
                }
                
                // Add a slight delay before focusing for better UX
                setTimeout(() => {
                    question.setAttribute('aria-expanded', 'true');
                    // Smooth scroll to keep the question in view if it's near the bottom
                    if (isElementInBottomHalf(item)) {
                        item.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }
                }, 10);
            } else {
                // Close FAQ
                answer.style.maxHeight = '0';
                answer.style.paddingTop = '0';
                answer.style.paddingBottom = '0';
                answer.style.opacity = '0';
                
                // Reset icon rotation
                if (icon) {
                    icon.style.transform = 'rotate(0deg)';
                }
                
                question.setAttribute('aria-expanded', 'false');
            }
        });
        
        // Keyboard navigation
        question.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
    });
    
    // Helper function to check if element is in bottom half of viewport
    function isElementInBottomHalf(el) {
        const rect = el.getBoundingClientRect();
        const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
        return rect.bottom > viewportHeight / 2;
    }
    
    // Open FAQ from URL hash if present
    function openFaqFromHash() {
        const hash = window.location.hash;
        if (hash) {
            const targetFaq = document.querySelector(`${hash}.faq-item`);
            if (targetFaq) {
                // Close all FAQs first
                closeOtherFaqs(null);
                
                // Then open the target FAQ
                const answer = targetFaq.querySelector('.faq-answer');
                const icon = targetFaq.querySelector('h3 i');
                
                targetFaq.classList.add('active');
                answer.style.maxHeight = answer.scrollHeight + 'px';
                answer.style.paddingTop = '1.5rem';
                answer.style.paddingBottom = '1.5rem';
                answer.style.opacity = '1';
                
                if (icon) {
                    icon.style.transform = 'rotate(180deg)';
                }
                
                // Smooth scroll to the FAQ
                setTimeout(() => {
                    targetFaq.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }, 100);
            }
        }
    }
    
    // Run on page load and hash change
    window.addEventListener('load', openFaqFromHash);
    window.addEventListener('hashchange', openFaqFromHash);
    
    // Form submission with validation
    const contactForm = document.getElementById('eligibility-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Basic form validation
            const requiredFields = this.querySelectorAll('[required]');
            
            let isValid = true;
            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    isValid = false;
                    field.classList.add('error');
                } else {
                    field.classList.remove('error');
                }
            });
            
            if (isValid) {
                // Here you would typically send the form data to a server
                alert('¡Gracias por tu solicitud! Nos pondremos en contacto contigo pronto.');
                this.reset();
            } else {
                alert('Por favor, completa todos los campos obligatorios.');
            }
        });
    }

    // Add animation on scroll
    const animateOnScroll = () => {
        const elements = document.querySelectorAll('.card, .step, .faq-item');
        
        elements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            const screenPosition = window.innerHeight / 1.3;
            
            if (elementPosition < screenPosition) {
                element.classList.add('fade-in');
            }
        });
    };
    
    // Run once on page load
    animateOnScroll();
    
    // Run on scroll
    window.addEventListener('scroll', animateOnScroll);
});
