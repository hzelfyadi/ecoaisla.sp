/**
 * Performance Optimization Utilities
 * This file contains performance-related functions and optimizations
 */

document.addEventListener('DOMContentLoaded', function() {
    // Request Idle Callback for non-critical tasks
    if ('requestIdleCallback' in window) {
        requestIdleCallback(initNonCriticalComponents, { timeout: 2000 });
    } else {
        // Fallback for browsers that don't support requestIdleCallback
        setTimeout(initNonCriticalComponents, 2000);
    }

    // Initialize performance monitoring in development
    if (process.env.NODE_ENV === 'development') {
        initPerformanceMonitoring();
    }
});

/**
 * Initialize non-critical components
 * These components are not essential for the initial page load
 */
function initNonCriticalComponents() {
    // Load web fonts with font-display: swap
    loadWebFonts();
    
    // Initialize any non-critical components here
    // Example: initializeAnalytics(), initializeChatWidget(), etc.
}

/**
 * Load web fonts with performance in mind
 */
function loadWebFonts() {
    // Use the Web Font Loader for better performance
    if (typeof WebFont === 'object' && WebFont.load) {
        WebFont.load({
            google: {
                families: ['Inter:300,400,500,600,700', 'Poppins:400,500,600,700']
            },
            active: function() {
                // Fonts have loaded
                document.documentElement.classList.add('fonts-loaded');
            }
        });
    }
}

/**
 * Initialize performance monitoring
 */
function initPerformanceMonitoring() {
    // Check if the Performance API is available
    if ('performance' in window) {
        // Log the time it took to reach various milestones
        window.addEventListener('load', function() {
            // Wait a bit to ensure all resources are loaded
            setTimeout(function() {
                const timing = performance.timing;
                const metrics = {
                    dns: timing.domainLookupEnd - timing.domainLookupStart,
                    tcp: timing.connectEnd - timing.connectStart,
                    ttfb: timing.responseStart - timing.requestStart,
                    pageLoad: timing.loadEventEnd - timing.navigationStart,
                    domReady: timing.domComplete - timing.domLoading,
                    contentLoad: timing.domContentLoadedEventEnd - timing.navigationStart
                };
                
                console.log('Performance Metrics:', metrics);
                
                // Send metrics to analytics if available
                if (window.gtag) {
                    gtag('event', 'performance_metrics', metrics);
                }
            }, 0);
        });
    }
}

/**
 * Debounce function to limit the rate at which a function can fire
 * @param {Function} func - The function to debounce
 * @param {number} wait - The time to wait in milliseconds
 * @returns {Function} - The debounced function
 */
function debounce(func, wait = 100) {
    let timeout;
    return function(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}

/**
 * Throttle function to limit the rate at which a function can fire
 * @param {Function} func - The function to throttle
 * @param {number} limit - The time limit in milliseconds
 * @returns {Function} - The throttled function
 */
function throttle(func, limit = 100) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

/**
 * Check if the current device is a mobile device
 * @returns {boolean} - True if the device is mobile, false otherwise
 */
function isMobileDevice() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

/**
 * Load a script dynamically
 * @param {string} src - The source URL of the script
 * @param {Function} callback - Callback function when the script is loaded
 * @param {boolean} async - Whether to load the script asynchronously
 * @param {boolean} defer - Whether to defer the script execution
 */
function loadScript(src, callback = null, async = true, defer = true) {
    const script = document.createElement('script');
    script.src = src;
    script.async = async;
    script.defer = defer;
    
    if (callback) {
        script.onload = callback;
    }
    
    document.head.appendChild(script);
}

/**
 * Load a stylesheet dynamically
 * @param {string} href - The URL of the stylesheet
 * @param {Function} callback - Callback function when the stylesheet is loaded
 */
function loadStylesheet(href, callback = null) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;
    
    if (callback) {
        link.onload = callback;
    }
    
    document.head.appendChild(link);
}

/**
 * Preload a resource
 * @param {string} url - The URL of the resource to preload
 * @param {string} as - The type of resource ('script', 'style', 'font', 'image', etc.)
 */
function preloadResource(url, as) {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = url;
    link.as = as;
    
    if (as === 'font') {
        link.crossOrigin = 'anonymous';
    }
    
    document.head.appendChild(link);
}

// Export functions for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        debounce,
        throttle,
        isMobileDevice,
        loadScript,
        loadStylesheet,
        preloadResource
    };
}
