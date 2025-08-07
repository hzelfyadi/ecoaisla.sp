/**
 * Main JavaScript for AISLA-ECO Website
 * Handles navigation, animations, dark mode, and interactivity
 */
document.addEventListener('DOMContentLoaded', function() {
    /**
     * Dark Mode Toggle
     */
    const darkModeToggle = document.getElementById('dark-mode-toggle');
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
    
    // Check for saved user preference, if any, on load
    const currentTheme = localStorage.getItem('theme');
    if (currentTheme === 'dark' || (!currentTheme && prefersDarkScheme.matches)) {
        document.body.classList.add('dark-mode');
        if (darkModeToggle) darkModeToggle.setAttribute('aria-pressed', 'true');
    }

    // Listen for toggle click
    if (darkModeToggle) {
        darkModeToggle.addEventListener('click', function() {
            const isPressed = this.getAttribute('aria-pressed') === 'true';
            this.setAttribute('aria-pressed', !isPressed);
            document.body.classList.toggle('dark-mode');
            
            // Save user preference
            localStorage.setItem('theme', isPressed ? 'light' : 'dark');
        });
    }

    // Watch for system theme changes
    prefersDarkScheme.addEventListener('change', e => {
        if (!localStorage.getItem('theme')) {
            document.body.classList.toggle('dark-mode', e.matches);
        }
    });

    /**
     * Mobile Navigation
     */
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const navItems = document.querySelectorAll('.nav-links a');
    const body = document.body;
    
    // Add click event to mobile menu button
    if (hamburger) {
        hamburger.setAttribute('aria-expanded', 'false');
        hamburger.setAttribute('aria-controls', 'main-navigation');
        
        const toggleMenu = () => {
            const isExpanded = hamburger.getAttribute('aria-expanded') === 'true' || false;
            hamburger.setAttribute('aria-expanded', !isExpanded);
            navLinks.classList.toggle('active');
            body.classList.toggle('nav-open');
            
            // Toggle menu items' tabindex for keyboard navigation
            navItems.forEach(item => {
                item.setAttribute('tabindex', isExpanded ? '-1' : '0');
            });
            
            // Focus management
            if (!isExpanded) {
                // When opening the menu, focus first item
                setTimeout(() => {
                    const firstNavItem = navLinks.querySelector('a');
                    if (firstNavItem) firstNavItem.focus();
                }, 100);
            }
        };
        
        hamburger.addEventListener('click', toggleMenu);
        
        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (navLinks.classList.contains('active') && 
                !e.target.closest('.nav-links') && 
                !e.target.closest('.hamburger')) {
                toggleMenu();
            }
        });
        
        // Keyboard navigation for menu items
        navItems.forEach((item, index) => {
            // Close menu when clicking a link (for single page navigation)
            item.addEventListener('click', () => {
                if (window.innerWidth < 992) { // Adjust breakpoint as needed
                    toggleMenu();
                }
            });
            
            // Handle keyboard navigation within menu
            item.addEventListener('keydown', function(e) {
                // Close menu on Escape
                if (e.key === 'Escape') {
                    toggleMenu();
                    hamburger.focus();
                    return;
                }
                
                // Handle arrow key navigation
                if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
                    e.preventDefault();
                    const nextItem = navItems[index + 1] || navItems[0];
                    nextItem.focus();
                } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
                    e.preventDefault();
                    const prevItem = navItems[index - 1] || navItems[navItems.length - 1];
                    prevItem.focus();
                } else if (e.key === 'Home') {
                    e.preventDefault();
                    navItems[0].focus();
                } else if (e.key === 'End') {
                    e.preventDefault();
                    navItems[navItems.length - 1].focus();
                }
            });
        });
        
        // Close on Escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && navLinks.classList.contains('active')) {
                toggleMenu();
                hamburger.focus();
            }
        });
        
        // Close menu when window is resized to desktop
        let resizeTimer;
        window.addEventListener('resize', function() {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(function() {
                if (window.innerWidth >= 992) { // Adjust breakpoint as needed
                    if (navLinks.classList.contains('active')) {
                        toggleMenu();
                    }
                }
            }, 250);
        });
    }
    
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
    
    /**
     * Form handling with enhanced validation and submission
     */
    const contactForm = document.getElementById('eligibility-form');
    if (contactForm) {
        const formFields = contactForm.querySelectorAll('input, select, textarea');
        
        // Add real-time validation
        formFields.forEach(field => {
            // Skip hidden fields and buttons
            if (field.type === 'hidden' || field.type === 'submit' || field.type === 'button') return;
            
            // Add ARIA attributes
            if (field.hasAttribute('required')) {
                field.setAttribute('aria-required', 'true');
                const label = document.querySelector(`label[for="${field.id}"]`);
                if (label) {
                    const requiredText = document.createElement('span');
                    requiredText.className = 'required-indicator';
                    requiredText.textContent = ' *';
                    requiredText.setAttribute('aria-hidden', 'true');
                    label.appendChild(requiredText);
                }
            }
            
            // Add validation on blur
            field.addEventListener('blur', function() {
                validateField(this);
            });
            
            // Clear error on focus
            field.addEventListener('focus', function() {
                clearFieldError(this);
            });
        });
        
        // Form submission
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // Validate all fields
            let isFormValid = true;
            formFields.forEach(field => {
                if (!validateField(field)) {
                    isFormValid = false;
                }
            });
            
            if (!isFormValid) {
                // Focus on first error
                const firstError = this.querySelector('.error');
                if (firstError) {
                    firstError.focus();
                }
                showToast('Por favor, completa todos los campos obligatorios correctamente.', 'error');
                return;
            }
            
            // Disable submit button
            const submitButton = this.querySelector('button[type="submit"]');
            const originalButtonText = submitButton.innerHTML;
            submitButton.disabled = true;
            submitButton.innerHTML = 'Enviando...';
            
            try {
                // Here you would typically send the form data to a server
                // For demonstration, we'll simulate an API call
                const formData = new FormData(this);
                const formDataObj = Object.fromEntries(formData.entries());
                
                // Simulate API call with timeout
                await new Promise(resolve => setTimeout(resolve, 1500));
                
                // Show success message
                showToast('¡Gracias por tu solicitud! Nos pondremos en contacto contigo pronto.', 'success');
                
                // Reset form
                this.reset();
                
                // Track form submission in analytics (if available)
                if (window.gtag) {
                    gtag('event', 'form_submit', {
                        'event_category': 'Contact',
                        'event_label': 'Eligibility Form Submitted'
                    });
                }
                
            } catch (error) {
                console.error('Form submission error:', error);
                showToast('Hubo un error al enviar el formulario. Por favor, inténtalo de nuevo más tarde.', 'error');
            } finally {
                // Re-enable submit button
                submitButton.disabled = false;
                submitButton.innerHTML = originalButtonText;
            }
        });
        
        /**
         * Validate a form field
         */
        function validateField(field) {
            // Skip hidden fields and buttons
            if (field.type === 'hidden' || field.type === 'submit' || field.type === 'button') return true;
            
            let isValid = true;
            const value = field.value.trim();
            const fieldContainer = field.closest('.form-group') || field.parentNode;
            
            // Clear previous errors
            clearFieldError(field);
            
            // Check required fields
            if (field.hasAttribute('required') && !value) {
                setFieldError(field, 'Este campo es obligatorio');
                isValid = false;
            }
            
            // Check email format
            if (field.type === 'email' && value && !isValidEmail(value)) {
                setFieldError(field, 'Por favor, introduce un correo electrónico válido');
                isValid = false;
            }
            
            // Check phone number format (basic check)
            if (field.type === 'tel' && value && !isValidPhone(value)) {
                setFieldError(field, 'Por favor, introduce un número de teléfono válido');
                isValid = false;
            }
            
            // Check min/max length
            if (field.hasAttribute('minlength') && value.length < parseInt(field.getAttribute('minlength'))) {
                setFieldError(field, `Este campo debe tener al menos ${field.getAttribute('minlength')} caracteres`);
                isValid = false;
            }
            
            if (field.hasAttribute('maxlength') && value.length > parseInt(field.getAttribute('maxlength'))) {
                setFieldError(field, `Este campo no debe exceder los ${field.getAttribute('maxlength')} caracteres`);
                isValid = false;
            }
            
            return isValid;
        }
        
        /**
         * Set error state on a form field
         */
        function setFieldError(field, message) {
            const fieldContainer = field.closest('.form-group') || field.parentNode;
            
            // Add error class
            field.classList.add('error');
            field.setAttribute('aria-invalid', 'true');
            
            // Create or update error message
            let errorMessage = fieldContainer.querySelector('.error-message');
            if (!errorMessage) {
                errorMessage = document.createElement('div');
                errorMessage.className = 'error-message';
                errorMessage.setAttribute('role', 'alert');
                fieldContainer.appendChild(errorMessage);
            }
            
            errorMessage.textContent = message;
        }
        
        /**
         * Clear error state from a form field
         */
        function clearFieldError(field) {
            const fieldContainer = field.closest('.form-group') || field.parentNode;
            
            // Remove error class
            field.classList.remove('error');
            field.removeAttribute('aria-invalid');
            
            // Remove error message if it exists
            const errorMessage = fieldContainer.querySelector('.error-message');
            if (errorMessage) {
                errorMessage.remove();
            }
        }
        
        /**
         * Validate email format
         */
        function isValidEmail(email) {
            const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return re.test(String(email).toLowerCase());
        }
        
        /**
         * Validate phone number format (basic check)
         */
        function isValidPhone(phone) {
            const re = /^[+]?[(]?[0-9]{1,4}[)]?[-\s\./0-9]*$/;
            return re.test(phone);
        }
    }
    
    /**
     * Show toast notification
     */
    function showToast(message, type = 'info') {
        // Create toast container if it doesn't exist
        let toastContainer = document.querySelector('.toast-container');
        if (!toastContainer) {
            toastContainer = document.createElement('div');
            toastContainer.className = 'toast-container';
            document.body.appendChild(toastContainer);
        }
        
        // Create toast element
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.setAttribute('role', 'status');
        toast.setAttribute('aria-live', 'polite');
        toast.textContent = message;
        
        // Add to container
        toastContainer.appendChild(toast);
        
        // Show with animation
        setTimeout(() => {
            toast.classList.add('show');
        }, 10);
        
        // Auto-remove after delay
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                toast.remove();
                // Remove container if empty
                if (toastContainer && toastContainer.children.length === 0) {
                    toastContainer.remove();
                }
            }, 300);
        }, 5000);
        
        // Allow manual dismiss on click
        toast.addEventListener('click', () => {
            toast.classList.remove('show');
            setTimeout(() => {
                toast.remove();
                if (toastContainer && toastContainer.children.length === 0) {
                    toastContainer.remove();
                }
            }, 300);
        });
        
        return toast;
    }

    /**
     * Intersection Observer for scroll animations and lazy loading
     */
    const initIntersectionObserver = () => {
        // Check if IntersectionObserver is supported
        if (!('IntersectionObserver' in window)) {
            // Fallback for browsers that don't support IntersectionObserver
            const animateOnScroll = () => {
                const elements = document.querySelectorAll('.animate-on-scroll:not(.animated)');
                
                elements.forEach(element => {
                    const elementPosition = element.getBoundingClientRect().top;
                    const screenPosition = window.innerHeight * 0.85;
                    
                    if (elementPosition < screenPosition) {
                        element.classList.add('animated');
                        
                        // Add delay based on data attributes
                        const delay = element.dataset.delay || 0;
                        const animation = element.dataset.animation || 'fadeInUp';
                        
                        setTimeout(() => {
                            element.style.animation = `${animation} 0.6s ease-out forwards`;
                        }, parseInt(delay));
                    }
                });
            };
            
            // Initial check
            animateOnScroll();
            
            // Check on scroll with debounce
            let isScrolling;
            window.addEventListener('scroll', () => {
                window.cancelAnimationFrame(isScrolling);
                isScrolling = window.requestAnimationFrame(animateOnScroll);
            });
            
            return;
        }
        
        // Configuration for the Intersection Observer
        const config = {
            root: null,
            rootMargin: '0px',
            threshold: 0.15
        };
        
        // Create the observer
        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const element = entry.target;
                    
                    // Add animation classes
                    element.classList.add('animated');
                    
                    // Get animation properties from data attributes
                    const delay = element.dataset.delay || 0;
                    const animation = element.dataset.animation || 'fadeInUp';
                    
                    // Apply animation with delay
                    setTimeout(() => {
                        element.style.animation = `${animation} 0.6s ease-out forwards`;
                    }, parseInt(delay));
                    
                    // Stop observing the element after animation starts
                    observer.unobserve(element);
                }
            });
        }, config);
        
        // Observe all elements with the animate-on-scroll class
        const animateElements = document.querySelectorAll('.animate-on-scroll');
        animateElements.forEach(element => {
            observer.observe(element);
        });
    };
    
    /**
     * Lazy load images and iframes
     */
    const initLazyLoading = () => {
        // Check if IntersectionObserver is supported
        if (!('IntersectionObserver' in window)) {
            // Fallback for browsers that don't support IntersectionObserver
            const lazyLoad = () => {
                const lazyElements = document.querySelectorAll('img[data-src], iframe[data-src]');
                
                lazyElements.forEach(element => {
                    if (element.getBoundingClientRect().top <= window.innerHeight + 100) {
                        // Load the element
                        if (element.tagName === 'IMG') {
                            element.src = element.dataset.src;
                            if (element.dataset.srcset) {
                                element.srcset = element.dataset.srcset;
                            }
                        } else if (element.tagName === 'IFRAME') {
                            element.src = element.dataset.src;
                        }
                        
                        // Remove the data-src attribute to prevent reloading
                        element.removeAttribute('data-src');
                        
                        // Handle loading state
                        element.addEventListener('load', () => {
                            element.classList.add('loaded');
                        });
                    }
                });
            };
            
            // Initial load
            lazyLoad();
            
            // Load on scroll
            window.addEventListener('scroll', lazyLoad);
            window.addEventListener('resize', lazyLoad);
            window.addEventListener('orientationchange', lazyLoad);
            
            return;
        }
        
        // Configuration for the lazy loading observer
        const lazyLoadConfig = {
            root: null,
            rootMargin: '200px 0px',
            threshold: 0.01
        };
        
        // Create the lazy loading observer
        const lazyLoadObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const element = entry.target;
                    
                    // Load the element
                    if (element.tagName === 'IMG') {
                        element.src = element.dataset.src;
                        if (element.dataset.srcset) {
                            element.srcset = element.dataset.srcset;
                        }
                    } else if (element.tagName === 'IFRAME') {
                        element.src = element.dataset.src;
                    }
                    
                    // Handle loading state
                    element.addEventListener('load', () => {
                        element.classList.add('loaded');
                    });
                    
                    // Stop observing the element after loading
                    observer.unobserve(element);
                }
            });
        }, lazyLoadConfig);
        
        // Observe all lazy load elements
        const lazyElements = document.querySelectorAll('img[data-src], iframe[data-src]');
        lazyElements.forEach(element => {
            lazyLoadObserver.observe(element);
        });
    }
    
    // Configuration for the lazy loading observer
    const lazyLoadConfig = {
        root: null,
        rootMargin: '200px 0px',
        threshold: 0.01
    };
    
    // Create the lazy loading observer
    const lazyLoadObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                
                // Load the element
                if (element.tagName === 'IMG') {
                    element.src = element.dataset.src;
                    if (element.dataset.srcset) {
                        element.srcset = element.dataset.srcset;
                    }
                } else if (element.tagName === 'IFRAME') {
                    element.src = element.dataset.src;
                }
                
                // Handle loading state
                element.addEventListener('load', () => {
                    element.classList.add('loaded');
                });
                
                // Stop observing the element after loading
                observer.unobserve(element);
            }
        });
    }, lazyLoadConfig);
    
    // Observe all lazy load elements
    const lazyElements = document.querySelectorAll('img[data-src], iframe[data-src]');
    lazyElements.forEach(element => {
        lazyLoadObserver.observe(element);
    });
}

/**
 * Back to Top Button
 */
function initBackToTop() {
    const backToTopBtn = document.createElement('button');
    backToTopBtn.className = 'back-to-top';
    backToTopBtn.setAttribute('aria-label', 'Volver arriba');
    backToTopBtn.setAttribute('title', 'Volver arriba');
    backToTopBtn.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
            <path d="M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6z"/>
        </svg>
    `;
    
    // Add to DOM
    document.body.appendChild(backToTopBtn);
    
    // Show/hide button based on scroll position
    const toggleBackToTop = () => {
        if (window.pageYOffset > 300) {
            backToTopBtn.classList.add('show');
        } else {
            backToTopBtn.classList.remove('show');
        }
    };
    
    // Smooth scroll to top
    backToTopBtn.addEventListener('click', (e) => {
        e.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
        backToTopBtn.blur();
    });
    
    // Toggle button visibility on scroll
    window.addEventListener('scroll', toggleBackToTop);
    
    // Initial check
    toggleBackToTop();
};

// Import accessibility features
import { 
    initSkipLinks, 
    initKeyboardNavigation, 
    enhanceForms, 
    enhanceImages, 
    initFocusManagement 
} from './accessibility.js';

// Initialize all components
function init() {
    // Initialize accessibility features
    initSkipLinks();
    initKeyboardNavigation();
    enhanceForms();
    enhanceImages();
    initFocusManagement();
    
    // Initialize other components
    initLazyLoading();
    initIntersectionObserver();
    initBackToTop();
    
    // Initialize form validation for all forms
    const forms = document.querySelectorAll('form');
    forms.forEach(form => initFormValidation(form));
    
    // Initialize any other components here
    console.log('Website initialized with accessibility features');
}

// Run initialization when DOM is fully loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
