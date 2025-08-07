/**
 * Enhanced Animations and Interactions
 * Handles scroll animations, hover effects, and other interactive elements
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize scroll reveal animations
    initScrollReveal();
    
    // Add ripple effect to buttons
    initRippleEffect();
    
    // Add hover effects to cards
    initCardHoverEffects();
    
    // Initialize lazy loading for images
    initLazyLoading();
    
    // Add smooth scrolling for anchor links
    initSmoothScrolling();
    
    // Add animation on scroll for elements
    window.addEventListener('scroll', handleScrollAnimations);
    
    // Trigger animations on page load
    setTimeout(triggerInitialAnimations, 500);
});

/**
 * Initialize scroll reveal animations
 */
function initScrollReveal() {
    // Add reveal class to all elements with data-animate attribute
    const animateElements = document.querySelectorAll('[data-animate]');
    animateElements.forEach(el => {
        el.classList.add('reveal');
    });
    
    // Handle scroll events for reveal animations
    handleScrollAnimations();
}

/**
 * Handle scroll animations
 */
function handleScrollAnimations() {
    const revealElements = document.querySelectorAll('.reveal');
    const windowHeight = window.innerHeight;
    const revealPoint = 150;
    
    revealElements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        
        if (elementTop < windowHeight - revealPoint) {
            element.classList.add('visible');
            
            // Handle staggered animations
            if (element.dataset.stagger) {
                const delay = element.dataset.staggerDelay || 100;
                element.style.transitionDelay = `${delay}ms`;
            }
        }
    });
    
    // Handle staggered animations for lists
    const staggeredLists = document.querySelectorAll('[data-stagger-list]');
    staggeredLists.forEach(list => {
        const items = list.querySelectorAll('li, .staggered-item');
        items.forEach((item, index) => {
            item.classList.add('staggered-item');
            item.style.transitionDelay = `${index * 100}ms`;
            
            // Check if item is in viewport
            const itemTop = item.getBoundingClientRect().top;
            if (itemTop < windowHeight - revealPoint) {
                item.classList.add('visible');
            }
        });
    });
}

/**
 * Initialize ripple effect for buttons
 */
function initRippleEffect() {
    const buttons = document.querySelectorAll('.btn-ripple, button, [role="button"]');
    
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            // Remove any existing ripple
            const existingRipple = this.querySelector('.ripple');
            if (existingRipple) {
                existingRipple.remove();
            }
            
            // Create ripple element
            const ripple = document.createElement('span');
            ripple.classList.add('ripple');
            
            // Set ripple size
            const diameter = Math.max(this.clientWidth, this.clientHeight);
            const radius = diameter / 2;
            
            // Set ripple position
            const rect = this.getBoundingClientRect();
            ripple.style.width = ripple.style.height = `${diameter}px`;
            ripple.style.left = `${e.clientX - rect.left - radius}px`;
            ripple.style.top = `${e.clientY - rect.top - radius}px`;
            
            // Add ripple to button
            this.appendChild(ripple);
            
            // Remove ripple after animation
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
}

/**
 * Initialize card hover effects
 */
function initCardHoverEffects() {
    const cards = document.querySelectorAll('.card-hover, .benefit-card, .service-card');
    
    cards.forEach(card => {
        // Add hover class if not already present
        if (!card.classList.contains('card-hover')) {
            card.classList.add('card-hover');
        }
        
        // Add tilt effect on mousemove
        card.addEventListener('mousemove', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const angleX = (y - centerY) / 20;
            const angleY = (centerX - x) / 20;
            
            this.style.transform = `perspective(1000px) rotateX(${angleX}deg) rotateY(${angleY}deg) scale(1.02)`;
            
            // Add shine effect
            const shine = this.querySelector('.card-shine') || document.createElement('div');
            if (!shine.classList.contains('card-shine')) {
                shine.className = 'card-shine';
                this.appendChild(shine);
            }
            
            const posX = (x / rect.width) * 100;
            const posY = (y / rect.height) * 100;
            
            shine.style.background = `radial-gradient(circle at ${posX}% ${posY}%, rgba(255, 255, 255, 0.8) 0%, rgba(255, 255, 255, 0) 70%)`;
        });
        
        // Reset transform on mouseleave
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
            
            // Reset shine effect
            const shine = this.querySelector('.card-shine');
            if (shine) {
                shine.style.background = 'none';
            }
        });
    });
}

/**
 * Initialize lazy loading for images
 */
function initLazyLoading() {
    // Use native lazy loading if supported
    if ('loading' in HTMLImageElement.prototype) {
        const lazyImages = document.querySelectorAll('img[loading="lazy"]');
        lazyImages.forEach(img => {
            img.src = img.dataset.src || img.src;
        });
    } else {
        // Fallback for browsers that don't support lazy loading
        const lazyImages = document.querySelectorAll('img[data-src]');
        
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    img.classList.add('loaded');
                    observer.unobserve(img);
                }
            });
        });
        
        lazyImages.forEach(img => {
            imageObserver.observe(img);
        });
    }
}

/**
 * Initialize smooth scrolling for anchor links
 */
function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            
            // Skip if it's a different kind of anchor
            if (targetId === '#' || targetId === '') return;
            
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                e.preventDefault();
                
                // Close mobile menu if open
                const mobileMenu = document.querySelector('.mobile-menu');
                if (mobileMenu && mobileMenu.classList.contains('active')) {
                    mobileMenu.classList.remove('active');
                    document.body.style.overflow = '';
                }
                
                // Scroll to the target
                window.scrollTo({
                    top: targetElement.offsetTop - 100, // Adjust for fixed header
                    behavior: 'smooth'
                });
                
                // Update URL without page jump
                if (history.pushState) {
                    history.pushState(null, null, targetId);
                } else {
                    window.location.hash = targetId;
                }
            }
        });
    });
}

/**
 * Trigger initial animations on page load
 */
function triggerInitialAnimations() {
    // Add loaded class to body to trigger initial animations
    document.body.classList.add('page-loaded');
    
    // Animate hero section
    const hero = document.querySelector('.hero');
    if (hero) {
        hero.classList.add('animate-in');
    }
    
    // Add animation delay to navigation items
    const navItems = document.querySelectorAll('.nav-link');
    navItems.forEach((item, index) => {
        item.style.animationDelay = `${0.3 + (index * 0.1)}s`;
    });
    
    // Trigger scroll animations in case elements are already in viewport
    handleScrollAnimations();
}

// Export functions for use in other modules
window.animations = {
    initScrollReveal,
    handleScrollAnimations,
    initRippleEffect,
    initCardHoverEffects,
    initLazyLoading,
    initSmoothScrolling,
    triggerInitialAnimations
};
