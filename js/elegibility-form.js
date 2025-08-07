document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('eligibility-form');
    const formSteps = document.querySelectorAll('.form-step');
    const progressSteps = document.querySelectorAll('.step');
    const progressBar = document.querySelector('.progress');
    const nextButtons = document.querySelectorAll('.btn-next');
    const prevButtons = document.querySelectorAll('.btn-prev');
    const submitButton = document.querySelector('.btn-submit');
    const closeButton = document.querySelector('.btn-close');
    const successMessage = document.querySelector('.form-success');
    
    let currentStep = 1;
    const totalSteps = formSteps.length - 1; // Exclude success message
    
    // Initialize form
    function initForm() {
        showStep(1);
        setupEventListeners();
    }
    
    // Show specific step
    function showStep(step) {
        // Hide all steps
        formSteps.forEach(step => {
            step.style.display = 'none';
        });
        
        // Show current step
        const currentStepElement = document.querySelector(`.form-step[data-step="${step}"]`);
        if (currentStepElement) {
            currentStepElement.style.display = 'block';
        }
        
        // Update progress bar
        updateProgress(step);
        
        // Update current step
        currentStep = step;
    }
    
    // Update progress bar and steps
    function updateProgress(step) {
        // Update progress steps
        progressSteps.forEach((progressStep, index) => {
            if (index < step) {
                progressStep.classList.add('active');
            } else {
                progressStep.classList.remove('active');
            }
        });
        
        // Update progress bar
        const progressPercent = ((step - 1) / (totalSteps - 1)) * 100;
        progressBar.style.width = `${progressPercent}%`;
    }
    
    // Validate current step
    function validateStep(step) {
        const currentStepElement = document.querySelector(`.form-step[data-step="${step}"]`);
        const inputs = currentStepElement.querySelectorAll('input[required], select[required]');
        let isValid = true;
        
        inputs.forEach(input => {
            if (!input.value.trim()) {
                isValid = false;
                input.classList.add('error');
            } else {
                input.classList.remove('error');
                
                // Additional validation for specific fields
                if (input.type === 'email' && !isValidEmail(input.value)) {
                    isValid = false;
                    input.classList.add('error');
                } else if (input.id === 'phone' && !isValidPhone(input.value)) {
                    isValid = false;
                    input.classList.add('error');
                } else if (input.id === 'postal-code' && !isValidPostalCode(input.value)) {
                    isValid = false;
                    input.classList.add('error');
                }
            }
        });
        
        return isValid;
    }
    
    // Email validation
    function isValidEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(String(email).toLowerCase());
    }
    
    // Phone validation (Spanish format)
    function isValidPhone(phone) {
        const re = /^(\+34|0034|34)?[6789]\d{8}$/;
        return re.test(phone.replace(/[\s-]/g, ''));
    }
    
    // Postal code validation (Spanish format)
    function isValidPostalCode(postalCode) {
        const re = /^(?:0[1-9]|[1-4]\d|5[0-2])\d{3}$/;
        return re.test(postalCode);
    }
    
    // Update summary in the last step
    function updateSummary() {
        document.getElementById('summary-name').textContent = document.getElementById('name').value || '-';
        document.getElementById('summary-phone').textContent = document.getElementById('phone').value || '-';
        document.getElementById('summary-email').textContent = document.getElementById('email').value || '-';
        document.getElementById('summary-postal').textContent = document.getElementById('postal-code').value || '-';
        
        const propertyTypeSelect = document.getElementById('property-type');
        document.getElementById('summary-type').textContent = propertyTypeSelect.options[propertyTypeSelect.selectedIndex]?.text || '-';
        
        const propertyAgeSelect = document.getElementById('property-age');
        document.getElementById('summary-age').textContent = propertyAgeSelect.options[propertyAgeSelect.selectedIndex]?.text || '-';
        
        // Generate random reference number
        const refNumber = 'EC-' + new Date().getFullYear() + '-' + Math.floor(100000 + Math.random() * 900000);
        document.getElementById('reference-number').textContent = refNumber;
    }
    
    // Handle form submission
    function handleSubmit(e) {
        e.preventDefault();
        
        if (validateStep(currentStep)) {
            // In a real application, you would send the form data to a server here
            // For this example, we'll just show the success message
            
            // Hide form and show success message
            document.querySelector(`.form-step[data-step="${currentStep}"]`).style.display = 'none';
            successMessage.style.display = 'block';
            
            // Scroll to top of form
            successMessage.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }
    
    // Setup event listeners
    function setupEventListeners() {
        // Next button click
        nextButtons.forEach(button => {
            button.addEventListener('click', function() {
                const nextStep = parseInt(this.getAttribute('data-next'));
                
                if (validateStep(currentStep)) {
                    // If moving to the last step, update the summary
                    if (nextStep === totalSteps) {
                        updateSummary();
                    }
                    showStep(nextStep);
                    
                    // Scroll to top of form
                    form.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            });
        });
        
        // Previous button click
        prevButtons.forEach(button => {
            button.addEventListener('click', function() {
                const prevStep = parseInt(this.getAttribute('data-prev'));
                showStep(prevStep);
                
                // Scroll to top of form
                form.scrollIntoView({ behavior: 'smooth', block: 'start' });
            });
        });
        
        // Form submit
        if (submitButton) {
            submitButton.addEventListener('click', handleSubmit);
        }
        
        // Close button in success message
        if (closeButton) {
            closeButton.addEventListener('click', function() {
                // Reset form and go back to first step
                form.reset();
                successMessage.style.display = 'none';
                showStep(1);
                
                // Scroll to top of form
                form.scrollIntoView({ behavior: 'smooth', block: 'start' });
            });
        }
        
        // Input validation on blur
        const inputs = form.querySelectorAll('input, select');
        inputs.forEach(input => {
            input.addEventListener('blur', function() {
                if (this.required && !this.value.trim()) {
                    this.classList.add('error');
                } else {
                    this.classList.remove('error');
                }
            });
        });
        
        // Format phone number
        const phoneInput = document.getElementById('phone');
        if (phoneInput) {
            phoneInput.addEventListener('input', function(e) {
                // Remove all non-digit characters
                let value = this.value.replace(/\D/g, '');
                
                // Format as Spanish phone number
                if (value.length > 0) {
                    value = value.match(/(\d{0,3})(\d{0,3})(\d{0,3})/);
                    value = value[1] + (value[2] ? ' ' + value[2] : '') + (value[3] ? ' ' + value[3] : '');
                }
                
                this.value = value.trim();
            });
        }
    }
    
    // Initialize the form
    if (form) {
        initForm();
    }
});
