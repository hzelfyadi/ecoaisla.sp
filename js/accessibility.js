/**
 * Accessibility Enhancement Script
 * 
 * This script enhances the website's accessibility by:
 * 1. Adding keyboard navigation
 * 2. Managing focus for modals and dialogs
 * 3. Adding ARIA attributes dynamically
 * 4. Providing skip links
 * 5. Enhancing form accessibility
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all accessibility features
    initSkipLinks();
    initKeyboardNavigation();
    enhanceForms();
    enhanceImages();
    initFocusManagement();
    
    // Log accessibility status
    console.log('Accessibility features initialized');
});

/**
 * Initialize skip links for keyboard users
 */
function initSkipLinks() {
    // Create skip link container if it doesn't exist
    let skipLinkContainer = document.querySelector('.skip-links');
    
    if (!skipLinkContainer) {
        skipLinkContainer = document.createElement('div');
        skipLinkContainer.className = 'skip-links';
        skipLinkContainer.setAttribute('aria-label', 'Skip links');
        document.body.insertBefore(skipLinkContainer, document.body.firstChild);
    }
    
    // Add skip to main content link
    const mainContent = document.querySelector('main') || document.querySelector('.main-content') || document.querySelector('#main');
    if (mainContent) {
        if (!mainContent.id) {
            mainContent.id = 'main-content';
        }
        
        const skipLink = document.createElement('a');
        skipLink.href = `#${mainContent.id}`;
        skipLink.className = 'skip-link';
        skipLink.textContent = 'Skip to main content';
        skipLink.setAttribute('aria-label', 'Skip to main content');
        
        skipLinkContainer.appendChild(skipLink);
    }
    
    // Add skip to navigation link
    const nav = document.querySelector('nav') || document.querySelector('header nav');
    if (nav) {
        if (!nav.id) {
            nav.id = 'main-navigation';
        }
        
        const navSkipLink = document.createElement('a');
        navSkipLink.href = `#${nav.id}`;
        navSkipLink.className = 'skip-link';
        navSkipLink.textContent = 'Skip to navigation';
        navSkipLink.setAttribute('aria-label', 'Skip to navigation');
        
        skipLinkContainer.appendChild(navSkipLink);
    }
    
    // Add skip to footer link
    const footer = document.querySelector('footer');
    if (footer) {
        if (!footer.id) {
            footer.id = 'site-footer';
        }
        
        const footerSkipLink = document.createElement('a');
        footerSkipLink.href = `#${footer.id}`;
        footerSkipLink.className = 'skip-link';
        footerSkipLink.textContent = 'Skip to footer';
        footerSkipLink.setAttribute('aria-label', 'Skip to footer');
        
        skipLinkContainer.appendChild(footerSkipLink);
    }
}

/**
 * Initialize keyboard navigation
 */
function initKeyboardNavigation() {
    // Make all focusable elements keyboard accessible
    document.addEventListener('keydown', function(e) {
        // Skip if the event was already handled
        if (e.defaultPrevented) {
            return;
        }
        
        // Handle tab key for focus trapping
        if (e.key === 'Tab') {
            const focusableElements = getFocusableElements(document);
            const firstFocusable = focusableElements[0];
            const lastFocusable = focusableElements[focusableElements.length - 1];
            
            // If only one focusable element, prevent tabbing out
            if (focusableElements.length === 1) {
                e.preventDefault();
                firstFocusable.focus();
                return;
            }
            
            // Handle shift + tab
            if (e.shiftKey) {
                if (document.activeElement === firstFocusable) {
                    e.preventDefault();
                    lastFocusable.focus();
                }
            } 
            // Handle regular tab
            else {
                if (document.activeElement === lastFocusable) {
                    e.preventDefault();
                    firstFocusable.focus();
                }
            }
        }
        
        // Close modals with escape key
        if (e.key === 'Escape') {
            const openModal = document.querySelector('.modal.show, [role="dialog"][aria-hidden="false"]');
            if (openModal) {
                const closeButton = openModal.querySelector('[data-dismiss="modal"], [aria-label="Close"]');
                if (closeButton) {
                    closeButton.click();
                } else {
                    openModal.style.display = 'none';
                    openModal.setAttribute('aria-hidden', 'true');
                }
                
                // Return focus to the element that opened the modal
                const opener = document.activeElement;
                if (opener && opener.getAttribute('data-toggle') === 'modal') {
                    opener.focus();
                }
            }
        }
    });
    
    // Add focus styles for keyboard navigation
    document.body.addEventListener('mousedown', function() {
        document.body.classList.add('using-mouse');
    });
    
    document.body.addEventListener('keydown', function(e) {
        if (e.key === 'Tab') {
            document.body.classList.remove('using-mouse');
        }
    });
}

/**
 * Enhance form accessibility
 */
function enhanceForms() {
    // Add proper labels to form controls
    const formControls = document.querySelectorAll('input:not([type="hidden"]), select, textarea');
    
    formControls.forEach(control => {
        // Skip if already has a label or aria-label
        if (control.labels.length > 0 || control.hasAttribute('aria-label') || control.hasAttribute('aria-labelledby')) {
            return;
        }
        
        // Add aria-label from placeholder if available
        if (control.hasAttribute('placeholder') && !control.hasAttribute('aria-label')) {
            control.setAttribute('aria-label', control.getAttribute('placeholder'));
        }
        
        // Add required attribute if the field is marked as required
        if (control.classList.contains('required') || control.getAttribute('aria-required') === 'true') {
            control.setAttribute('required', '');
        }
    });
    
    // Add error handling for forms
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        form.setAttribute('novalidate', '');
        
        form.addEventListener('submit', function(e) {
            if (!form.checkValidity()) {
                e.preventDefault();
                e.stopPropagation();
                
                // Focus on first invalid field
                const firstInvalid = form.querySelector(':invalid');
                if (firstInvalid) {
                    firstInvalid.focus();
                    
                    // Add error message if it doesn't exist
                    if (!firstInvalid.nextElementSibling || !firstInvalid.nextElementSibling.classList.contains('error-message')) {
                        const error = document.createElement('div');
                        error.className = 'error-message';
                        error.id = `${firstInvalid.id}-error`;
                        error.textContent = firstInvalid.validationMessage || 'This field is required';
                        error.setAttribute('role', 'alert');
                        
                        firstInvalid.insertAdjacentElement('afterend', error);
                        firstInvalid.setAttribute('aria-describedby', error.id);
                    }
                }
            }
            
            form.classList.add('was-validated');
        }, false);
    });
}

/**
 * Enhance image accessibility
 */
function enhanceImages() {
    // Add alt text to images that don't have it
    const images = document.querySelectorAll('img:not([alt])');
    
    images.forEach(img => {
        // Skip decorative images
        if (img.getAttribute('role') === 'presentation' || img.getAttribute('aria-hidden') === 'true') {
            img.setAttribute('alt', '');
            return;
        }
        
        // Try to get meaningful alt text
        let altText = '';
        
        // Check for title attribute
        if (img.hasAttribute('title')) {
            altText = img.getAttribute('title');
        }
        // Check for data-alt attribute
        else if (img.hasAttribute('data-alt')) {
            altText = img.getAttribute('data-alt');
        }
        // Check for aria-label
        else if (img.hasAttribute('aria-label')) {
            altText = img.getAttribute('aria-label');
        }
        // Generate from filename as last resort
        else {
            const src = img.getAttribute('src') || '';
            const filename = src.split('/').pop().split('.')[0];
            altText = filename.replace(/[-_]/g, ' ');
        }
        
        img.setAttribute('alt', altText);
    });
    
    // Add role="img" to SVG elements
    const svgs = document.querySelectorAll('svg:not([role])');
    svgs.forEach(svg => {
        if (!svg.hasAttribute('aria-label') && !svg.hasAttribute('aria-labelledby')) {
            svg.setAttribute('role', 'img');
            svg.setAttribute('aria-label', 'Decorative image');
        }
    });
}

/**
 * Initialize focus management for modals and dialogs
 */
function initFocusManagement() {
    // Handle focus when modals are opened
    document.addEventListener('show.bs.modal', function(e) {
        const modal = e.target;
        const focusable = getFocusableElements(modal);
        
        // If there are focusable elements, focus the first one
        if (focusable.length > 0) {
            focusable[0].focus();
        }
        
        // Store the element that had focus before the modal was opened
        modal.setAttribute('data-previous-focus', document.activeElement.id || '');
    });
    
    // Handle focus when modals are closed
    document.addEventListener('hidden.bs.modal', function(e) {
        const modal = e.target;
        const previousFocusId = modal.getAttribute('data-previous-focus');
        
        // Return focus to the element that had focus before the modal was opened
        if (previousFocusId) {
            const previousFocus = document.getElementById(previousFocusId);
            if (previousFocus) {
                previousFocus.focus();
            }
        }
    });
    
    // Handle focus for custom dialogs
    const dialogs = document.querySelectorAll('[role="dialog"]');
    dialogs.forEach(dialog => {
        dialog.addEventListener('keydown', function(e) {
            // Close dialog on escape key
            if (e.key === 'Escape') {
                dialog.style.display = 'none';
                dialog.setAttribute('aria-hidden', 'true');
                
                // Return focus to the element that opened the dialog
                const opener = document.activeElement;
                if (opener && opener.getAttribute('aria-haspopup') === 'dialog') {
                    opener.focus();
                }
            }
        });
    });
}

/**
 * Get all focusable elements within a container
 */
function getFocusableElements(container = document) {
    const focusableSelectors = [
        'a[href]',
        'button:not([disabled])',
        'input:not([disabled]):not([type="hidden"])',
        'select:not([disabled])',
        'textarea:not([disabled])',
        '[tabindex]:not([tabindex="-1"])',
        '[contenteditable]',
        'iframe',
        'audio[controls]',
        'video[controls]',
        '[role="button"]',
        '[role="checkbox"]',
        '[role="radio"]',
        '[role="slider"]',
        '[role="spinbutton"]',
        '[role="textbox"]',
        'summary'
    ];
    
    return Array.from(container.querySelectorAll(focusableSelectors.join(',')))
        .filter(el => {
            // Filter out hidden elements
            return !el.hasAttribute('disabled') && 
                   !el.hasAttribute('hidden') && 
                   el.offsetParent !== null &&
                   getComputedStyle(el).visibility !== 'hidden';
        });
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initSkipLinks,
        initKeyboardNavigation,
        enhanceForms,
        enhanceImages,
        initFocusManagement,
        getFocusableElements
    };
}
