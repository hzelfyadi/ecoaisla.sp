document.addEventListener('DOMContentLoaded', function() {
    // Background Slider
    const slides = document.querySelectorAll('.hero-bg-slider .slide');
    let currentSlide = 0;
    const slideInterval = 5000; // Change slide every 5 seconds
    
    function showSlide(index) {
        // Hide all slides
        slides.forEach(slide => {
            slide.classList.remove('active');
        });
        
        // Show current slide
        slides[index].classList.add('active');
    }
    
    function nextSlide() {
        currentSlide = (currentSlide + 1) % slides.length;
        showSlide(currentSlide);
    }
    
    // Start the slider
    let slideTimer = setInterval(nextSlide, slideInterval);
    
    // Pause on hover
    const heroSection = document.querySelector('.hero-section');
    heroSection.addEventListener('mouseenter', () => {
        clearInterval(slideTimer);
    });
    
    heroSection.addEventListener('mouseleave', () => {
        slideTimer = setInterval(nextSlide, slideInterval);
    });
    
    // Initialize first slide
    showSlide(0);
    
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 100,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Add animation to service cards on scroll
    const animateOnScroll = () => {
        const cards = document.querySelectorAll('.service-card');
        const windowHeight = window.innerHeight;
        
        cards.forEach((card, index) => {
            const cardPosition = card.getBoundingClientRect().top;
            const cardVisible = 150;
            
            if (cardPosition < windowHeight - cardVisible) {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0) rotate(0)';
            }
        });
    };
    
    // Initial check for cards in viewport
    window.addEventListener('load', animateOnScroll);
    window.addEventListener('scroll', animateOnScroll);
    
    // Add loading animation to service cards
    const serviceCards = document.querySelectorAll('.service-card');
    serviceCards.forEach((card, index) => {
        // Set initial styles for animation
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px) rotate(' + (index % 2 === 0 ? '-5deg' : '5deg') + ')';
        card.style.transition = 'opacity 0.6s ease-out, transform 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275) ' + (index * 0.1) + 's';
    });
});
