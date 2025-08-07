/**
 * PWA (Progressive Web App) Functionality
 * Handles service worker registration and installation prompts
 */

// Check if the browser supports service workers
if ('serviceWorker' in navigator) {
  // Register the service worker
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(registration => {
        console.log('ServiceWorker registration successful with scope: ', registration.scope);
        
        // Check for updates
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          
          newWorker.addEventListener('statechange', () => {
            // When the new service worker is installed, show update notification
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              showUpdateNotification();
            }
          });
        });
      })
      .catch(error => {
        console.error('ServiceWorker registration failed: ', error);
      });
  });
}

// Handle the app installation prompt
let deferredPrompt;
const installButton = document.getElementById('install-button');

window.addEventListener('beforeinstallprompt', (e) => {
  // Prevent Chrome 67 and earlier from automatically showing the prompt
  e.preventDefault();
  
  // Stash the event so it can be triggered later
  deferredPrompt = e;
  
  // Show the install button if it exists
  if (installButton) {
    installButton.style.display = 'block';
    
    installButton.addEventListener('click', () => {
      // Hide the install button
      installButton.style.display = 'none';
      
      // Show the install prompt
      deferredPrompt.prompt();
      
      // Wait for the user to respond to the prompt
      deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('User accepted the install prompt');
        } else {
          console.log('User dismissed the install prompt');
        }
        
        // Clear the saved prompt since it can't be used again
        deferredPrompt = null;
      });
    });
  }
});

// Track how the PWA was launched
window.addEventListener('DOMContentLoaded', () => {
  let displayMode = 'browser tab';
  
  if (navigator.standalone) {
    displayMode = 'standalone-ios';
  } else if (window.matchMedia('(display-mode: standalone)').matches) {
    displayMode = 'standalone';
  }
  
  // Log the display mode
  console.log('Display mode is: ', displayMode);
  
  // Send analytics about the display mode
  if (window.gtag) {
    gtag('event', 'display_mode', {
      'event_category': 'PWA',
      'event_label': displayMode
    });
  }
});

// Check for updates when the page regains focus
window.addEventListener('focus', () => {
  if (navigator.serviceWorker && navigator.serviceWorker.controller) {
    navigator.serviceWorker.controller.postMessage({
      type: 'CHECK_FOR_UPDATES'
    });
  }
});

// Show a notification when an update is available
function showUpdateNotification() {
  const notification = document.createElement('div');
  notification.className = 'update-notification';
  notification.innerHTML = `
    <div class="update-notification-content">
      <p>¡Nueva actualización disponible!</p>
      <button id="update-button" class="btn btn-sm">Actualizar</button>
    </div>
  `;
  
  document.body.appendChild(notification);
  
  const updateButton = document.getElementById('update-button');
  if (updateButton) {
    updateButton.addEventListener('click', () => {
      // Tell the service worker to skip waiting and activate the new version
      if (navigator.serviceWorker.controller) {
        navigator.serviceWorker.controller.postMessage({
          type: 'SKIP_WAITING'
        });
      }
      
      // Reload the page to use the updated service worker
      window.location.reload();
    });
  }
  
  // Auto-hide after 10 seconds
  setTimeout(() => {
    notification.classList.add('hide');
    
    // Remove from DOM after animation
    setTimeout(() => {
      notification.remove();
    }, 300);
  }, 10000);
}

// Listen for messages from the service worker
if (navigator.serviceWorker) {
  navigator.serviceWorker.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'UPDATE_AVAILABLE') {
      showUpdateNotification();
    }
  });
}

// Check if the app is running as a PWA
function isRunningAsPWA() {
  return (window.matchMedia('(display-mode: standalone)').matches) || 
         (window.navigator.standalone) || 
         document.referrer.includes('android-app://');
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    isRunningAsPWA
  };
}
