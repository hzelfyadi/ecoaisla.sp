/**
 * Image Optimizer
 * Handles lazy loading, responsive images, and image optimization
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize image optimization
    initImageOptimization();
    
    // Initialize Intersection Observer for lazy loading
    initLazyLoading();
});

/**
 * Initialize image optimization for all images with data-src or data-srcset
 */
function initImageOptimization() {
    // Process all images with data-src or data-srcset
    const lazyImages = document.querySelectorAll('img[data-src], img[data-srcset]');
    
    // Process each image
    lazyImages.forEach(img => {
        // Add loading="lazy" for native lazy loading
        if ('loading' in HTMLImageElement.prototype) {
            img.loading = 'lazy';
        }
        
        // Add a class for styling purposes
        img.classList.add('lazyload');
        
        // Add a placeholder if there isn't one
        if (!img.getAttribute('src')) {
            img.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9IiNlZWVlZWUiLz48L3N2Zz4=';
        }
    });
}

/**
 * Initialize Intersection Observer for lazy loading
 */
function initLazyLoading() {
    // If IntersectionObserver is not supported, load all images immediately
    if (!('IntersectionObserver' in window)) {
        loadAllImages();
        return;
    }
    
    // Configure the intersection observer
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                loadImage(img);
                observer.unobserve(img);
            }
        });
    }, {
        rootMargin: '200px 0px', // Start loading images 200px before they come into view
        threshold: 0.01
    });
    
    // Observe all lazy images
    const lazyImages = document.querySelectorAll('.lazyload');
    lazyImages.forEach(img => {
        imageObserver.observe(img);
    });
}

/**
 * Load a single image
 * @param {HTMLElement} img - The image element to load
 */
function loadImage(img) {
    // If the image is already loaded, do nothing
    if (img.classList.contains('lazyloaded')) {
        return;
    }
    
    // Create a new image to handle the loading
    const tempImg = new Image();
    
    // When the image loads, update the original image
    tempImg.onload = function() {
        // Update the src or srcset
        if (img.dataset.src) {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
        }
        
        if (img.dataset.srcset) {
            img.srcset = img.dataset.srcset;
            img.removeAttribute('data-srcset');
        }
        
        // Add a class to indicate the image has loaded
        img.classList.remove('lazyload');
        img.classList.add('lazyloaded');
        
        // Dispatch a custom event
        img.dispatchEvent(new Event('lazyloaded'));
    };
    
    // Handle errors
    tempImg.onerror = function() {
        img.classList.add('lazyload-error');
        console.error('Error loading image:', img.dataset.src || img.dataset.srcset);
    };
    
    // Start loading the image
    if (img.dataset.src) {
        tempImg.src = img.dataset.src;
    } else if (img.dataset.srcset) {
        const srcset = img.dataset.srcset.split(',');
        if (srcset.length > 0) {
            tempImg.src = srcset[0].split(' ')[0];
        }
    }
}

/**
 * Load all images immediately (fallback for browsers without IntersectionObserver)
 */
function loadAllImages() {
    const lazyImages = document.querySelectorAll('.lazyload');
    lazyImages.forEach(img => {
        loadImage(img);
    });
}

/**
 * Create a responsive image element
 * @param {Object} options - The options for the image
 * @param {string} options.src - The default image source
 * @param {string} options.alt - The alt text for the image
 * @param {string} options.className - Additional CSS classes
 * @param {Object} options.sources - Responsive image sources
 * @returns {HTMLElement} - The created image element
 */
function createResponsiveImage(options) {
    const img = document.createElement('img');
    
    // Set attributes
    img.alt = options.alt || '';
    img.className = options.className || '';
    
    // Add lazy loading class
    img.classList.add('lazyload');
    
    // Set data-src instead of src for lazy loading
    if (options.src) {
        img.dataset.src = options.src;
        // Set a small placeholder
        img.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9IiNlZWVlZWUiLz48L3N2Zz4=';
    }
    
    // Set data-srcset if provided
    if (options.sources) {
        const srcset = [];
        
        for (const [width, src] of Object.entries(options.sources)) {
            srcset.push(`${src} ${width}w`);
        }
        
        img.dataset.srcset = srcset.join(',');
        
        // Set sizes attribute for better performance
        if (!img.sizes) {
            img.sizes = '(max-width: 768px) 100vw, 50vw';
        }
    }
    
    // Add loading animation class
    img.classList.add('img-loading');
    
    // When the image loads, remove the loading class
    img.addEventListener('load', function() {
        this.classList.remove('img-loading');
        this.classList.add('img-loaded');
    });
    
    // Handle errors
    img.addEventListener('error', function() {
        this.classList.remove('img-loading');
        this.classList.add('img-error');
    });
    
    return img;
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initImageOptimization,
        initLazyLoading,
        createResponsiveImage
    };
}
