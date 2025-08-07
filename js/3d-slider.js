document.addEventListener('DOMContentLoaded', function() {
    // 3D Background Slider
    const slides = document.querySelectorAll('.hero-bg-slider .slide');
    let currentSlide = 0;
    const slideInterval = 3000; // Change slide every 3 seconds
    let slideTimer;
    
    // Initialize slider
    function initSlider() {
        if (slides.length === 0) return;
        
        // Set initial classes
        updateSlideClasses();
        
        // Start the slider
        startSlider();
        
        // Pause on hover
        const heroSection = document.querySelector('.hero-section');
        heroSection.addEventListener('mouseenter', pauseSlider);
        heroSection.addEventListener('mouseleave', startSlider);
    }
    
    // Update slide classes for 3D effect
    function updateSlideClasses() {
        // Remove all classes first
        slides.forEach(slide => {
            slide.classList.remove('active', 'prev', 'next');
        });
        
        // Calculate previous and next slide indices
        const prevIndex = (currentSlide - 1 + slides.length) % slides.length;
        const nextIndex = (currentSlide + 1) % slides.length;
        
        // Apply classes
        slides[prevIndex].classList.add('prev');
        slides[currentSlide].classList.add('active');
        slides[nextIndex].classList.add('next');
    }
    
    // Go to next slide
    function nextSlide() {
        currentSlide = (currentSlide + 1) % slides.length;
        updateSlideClasses();
    }
    
    // Start the slider
    function startSlider() {
        if (slideTimer) clearInterval(slideTimer);
        slideTimer = setInterval(nextSlide, slideInterval);
    }
    
    // Pause the slider
    function pauseSlider() {
        clearInterval(slideTimer);
    }
    
    // Initialize the slider
    initSlider();
    
    // Add keyboard navigation (optional)
    document.addEventListener('keydown', function(e) {
        if (e.key === 'ArrowLeft') {
            currentSlide = (currentSlide - 1 + slides.length) % slides.length;
            updateSlideClasses();
            pauseSlider();
            startSlider();
        } else if (e.key === 'ArrowRight') {
            nextSlide();
            pauseSlider();
            startSlider();
        }
    });
});
