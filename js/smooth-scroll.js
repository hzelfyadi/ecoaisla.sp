document.addEventListener('DOMContentLoaded', function() {
    // Function to handle smooth scrolling
    function scrollToEligibility(event) {
        event.preventDefault();
        const targetId = 'elegibilidad';
        const targetElement = document.getElementById(targetId);
        
        if (targetElement) {
            // Calculate the position to scroll to (slightly above the target to account for fixed header)
            const headerOffset = 100;
            const elementPosition = targetElement.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            // Smooth scroll to the target element
            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });

            // Focus on the first form element for better accessibility
            setTimeout(() => {
                const firstInput = targetElement.querySelector('input');
                if (firstInput) {
                    firstInput.focus({ preventScroll: true });
                }
            }, 1000); // Small delay to allow scroll to complete
        }
    }

    // Select all the buttons that should trigger the scroll
    const buttons = [
        // Hero button
        document.querySelector('#por-que-aislar > div > div.benefits-cta.aos-init.aos-animate > a'),
        // Why 1€ button
        document.querySelector('#por-que-1euro > div > div.info-footer > a.btn.btn-primary.btn-pulse'),
        // FAQ CTA button
        document.querySelector('#faq > div > div > div.faq-cta > a'),
        // Navigation CTA button
        document.querySelector('body > header > nav > ul > li.nav-cti > a')
    ];

    // Add click event listeners to each button
    buttons.forEach(button => {
        if (button) {
            button.addEventListener('click', scrollToEligibility);
        }
    });
});
