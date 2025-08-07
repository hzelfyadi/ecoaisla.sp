/**
 * Enhanced Form Validation
 * Provides real-time validation and improved user feedback
 */

document.addEventListener('DOMContentLoaded', function() {
    // Get all forms with validation
    const forms = document.querySelectorAll('form.needs-validation');
    
    // Add validation to each form
    Array.from(forms).forEach(form => {
        // Get all form inputs that need validation
        const inputs = form.querySelectorAll('input, select, textarea');
        
        // Add input event listeners for real-time validation
        inputs.forEach(input => {
            // Skip file inputs and buttons
            if (input.type === 'file' || input.type === 'submit' || input.type === 'button' || input.type === 'reset') {
                return;
            }
            
            // Add input event for real-time validation
            input.addEventListener('input', function() {
                validateField(this);
            });
            
            // Add blur event for when user leaves the field
            input.addEventListener('blur', function() {
                validateField(this);
            });
        });
        
        // Add submit event listener
        form.addEventListener('submit', function(event) {
            if (!form.checkValidity()) {
                event.preventDefault();
                event.stopPropagation();
                
                // Validate all fields on submit
                inputs.forEach(input => {
                    validateField(input);
                });
                
                // Scroll to first error
                const firstError = form.querySelector('.is-invalid');
                if (firstError) {
                    firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    firstError.focus();
                }
            } else {
                // Form is valid, show loading state
                const submitButton = form.querySelector('button[type="submit"]');
                if (submitButton) {
                    submitButton.disabled = true;
                    submitButton.classList.add('loading');
                    submitButton.innerHTML = '<span class="sr-only">Enviando...</span>';
                }
                
                // Here you would typically submit the form via AJAX
                // For now, we'll simulate a successful submission
                setTimeout(() => {
                    showFormSuccess(form);
                }, 1500);
                
                event.preventDefault();
            }
            
            form.classList.add('was-validated');
        }, false);
    });
    
    // Custom validation for specific field types
    document.addEventListener('input', function(e) {
        // Phone number formatting
        if (e.target.type === 'tel') {
            formatPhoneNumber(e.target);
        }
        
        // Email validation
        if (e.target.type === 'email' && e.target.required) {
            validateEmail(e.target);
        }
    });
});

/**
 * Validate a form field
 * @param {HTMLElement} field - The form field to validate
 */
function validateField(field) {
    const formGroup = field.closest('.form-group');
    if (!formGroup) return;
    
    // Reset field state
    formGroup.classList.remove('success', 'error');
    
    // Skip validation if field is disabled or not required and empty
    if (field.disabled || (!field.required && !field.value.trim())) {
        return;
    }
    
    // Check validity
    if (field.checkValidity()) {
        // Field is valid
        formGroup.classList.add('success');
        
        // Special validation for specific field types
        if (field.type === 'email') {
            if (!validateEmail(field)) {
                setFieldError(field, 'Por favor, introduce un correo electrónico válido');
                return;
            }
        }
        
        // Show success message if there was a previous error
        const errorMessage = formGroup.querySelector('.error-message');
        if (errorMessage) {
            errorMessage.style.display = 'none';
        }
        
        const successMessage = formGroup.querySelector('.success-message') || createSuccessMessage();
        if (!formGroup.contains(successMessage)) {
            formGroup.appendChild(successMessage);
        }
        successMessage.style.display = 'block';
        
    } else {
        // Field is invalid
        setFieldError(field, getErrorMessage(field));
    }
}

/**
 * Set error state for a field
 * @param {HTMLElement} field - The form field
 * @param {string} message - The error message
 */
function setFieldError(field, message) {
    const formGroup = field.closest('.form-group');
    if (!formGroup) return;
    
    formGroup.classList.add('error');
    formGroup.classList.remove('success');
    
    // Remove any existing error messages
    const existingError = formGroup.querySelector('.error-message');
    if (existingError) {
        existingError.textContent = message;
        existingMessage = existingError;
    } else {
        const errorMessage = document.createElement('div');
        errorMessage.className = 'error-message';
        errorMessage.textContent = message;
        formGroup.appendChild(errorMessage);
    }
    
    // Hide success message if present
    const successMessage = formGroup.querySelector('.success-message');
    if (successMessage) {
        successMessage.style.display = 'none';
    }
}

/**
 * Get appropriate error message for a field
 * @param {HTMLElement} field - The form field
 * @returns {string} - The error message
 */
function getErrorMessage(field) {
    if (field.validity.valueMissing) {
        return 'Este campo es obligatorio';
    }
    
    if (field.validity.typeMismatch) {
        if (field.type === 'email') {
            return 'Por favor, introduce un correo electrónico válido';
        }
        if (field.type === 'url') {
            return 'Por favor, introduce una URL válida';
        }
    }
    
    if (field.validity.tooShort) {
        return `El texto debe tener al menos ${field.minLength} caracteres`;
    }
    
    if (field.validity.tooLong) {
        return `El texto no debe superar los ${field.maxLength} caracteres`;
    }
    
    if (field.validity.rangeUnderflow) {
        return `El valor debe ser como mínimo ${field.min}`;
    }
    
    if (field.validity.rangeOverflow) {
        return `El valor no debe superar ${field.max}`;
    }
    
    if (field.validity.patternMismatch) {
        // Check for common patterns
        if (field.pattern === '[0-9]*') {
            return 'Solo se permiten números';
        }
        if (field.pattern === '[A-Za-z ]*') {
            return 'Solo se permiten letras y espacios';
        }
        return 'El formato no es válido';
    }
    
    // Default error message
    return 'Por favor, completa este campo correctamente';
}

/**
 * Validate email format
 * @param {HTMLElement} field - The email input field
 * @returns {boolean} - Whether the email is valid
 */
function validateEmail(field) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(field.value.trim())) {
        setFieldError(field, 'Por favor, introduce un correo electrónico válido');
        return false;
    }
    return true;
}

/**
 * Format phone number as user types
 * @param {HTMLElement} field - The phone number input field
 */
function formatPhoneNumber(field) {
    // Remove all non-numeric characters
    let numbers = field.value.replace(/\D/g, '');
    
    // Format based on length
    if (numbers.length > 0) {
        // Format as (XXX) XXX-XXXX for US numbers
        if (numbers.length <= 3) {
            field.value = `(${numbers}`;
        } else if (numbers.length <= 6) {
            field.value = `(${numbers.slice(0, 3)}) ${numbers.slice(3)}`;
        } else {
            field.value = `(${numbers.slice(0, 3)}) ${numbers.slice(3, 6)}-${numbers.slice(6, 10)}`;
        }
    }
}

/**
 * Show success message after form submission
 * @param {HTMLElement} form - The form element
 */
function showFormSuccess(form) {
    // Create success message element if it doesn't exist
    let successMessage = form.querySelector('.form-success-message');
    
    if (!successMessage) {
        successMessage = document.createElement('div');
        successMessage.className = 'form-success-message';
        successMessage.innerHTML = `
            <div class="success-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#2ecc71" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
            </div>
            <h3>¡Mensaje enviado con éxito!</h3>
            <p>Gracias por contactarnos. Te responderemos lo antes posible.</p>
        `;
        form.parentNode.insertBefore(successMessage, form);
    }
    
    // Hide the form and show success message
    form.style.display = 'none';
    successMessage.style.display = 'block';
    
    // Scroll to success message
    successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

/**
 * Create a success message element
 * @returns {HTMLElement} - The success message element
 */
function createSuccessMessage() {
    const successMessage = document.createElement('div');
    successMessage.className = 'success-message';
    successMessage.textContent = '¡Perfecto!';
    return successMessage;
}
