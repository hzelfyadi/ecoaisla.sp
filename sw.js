/**
 * Service Worker for EcoAisla
 * Handles offline functionality, caching, and performance optimizations
 */

const CACHE_NAME = 'ecoaisla-v1';
const OFFLINE_URL = '/offline.html';
const PRECACHE_URLS = [
  '/',
  '/index.html',
  '/css/main.css',
  '/css/variables.css',
  '/css/base.css',
  '/css/utilities.css',
  '/css/animations.css',
  '/css/components.css',
  '/js/main.js',
  '/js/performance.js',
  '/images/logo.svg',
  '/images/favicon.ico',
  OFFLINE_URL
];

// Install event - cache static assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(PRECACHE_URLS);
      })
      .then(() => self.skipWaiting())
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
    .then(() => self.clients.claim())
  );
});

// Fetch event - serve from cache, falling back to network
self.addEventListener('fetch', event => {
  // Skip cross-origin requests
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }

  // Handle navigation requests with network-first strategy
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          // Cache the response for future use
          const responseToCache = response.clone();
          caches.open(CACHE_NAME)
            .then(cache => cache.put(event.request, responseToCache));
          return response;
        })
        .catch(() => {
          // If network fails, try to serve from cache
          return caches.match(event.request)
            .then(response => {
              // If not in cache, show offline page
              if (!response) {
                return caches.match(OFFLINE_URL);
              }
              return response;
            });
        })
    );
  } else {
    // For other requests, use cache-first strategy
    event.respondWith(
      caches.match(event.request)
        .then(response => {
          // Return cached response if found
          if (response) {
            return response;
          }
          
          // Otherwise, fetch from network
          return fetch(event.request)
            .then(response => {
              // Don't cache non-GET requests or error responses
              if (event.request.method !== 'GET' || !response || response.status !== 200 || response.type !== 'basic') {
                return response;
              }
              
              // Cache the response
              const responseToCache = response.clone();
              caches.open(CACHE_NAME)
                .then(cache => cache.put(event.request, responseToCache));
                
              return response;
            });
        })
    );
  }
});

// Background sync for form submissions when offline
self.addEventListener('sync', event => {
  if (event.tag === 'sync-form-data') {
    event.waitUntil(syncFormData());
  }
});

// Handle push notifications
self.addEventListener('push', event => {
  const data = event.data ? event.data.json() : {};
  const title = data.title || 'EcoAisla';
  const options = {
    body: data.body || 'Tienes una nueva notificación',
    icon: '/images/icon-192x192.png',
    badge: '/images/badge-72x72.png',
    data: data.data || {},
    vibrate: [100, 50, 100],
    actions: data.actions || []
  };

  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

// Handle notification clicks
self.addEventListener('notificationclick', event => {
  event.notification.close();
  
  // Handle the notification click
  event.waitUntil(
    clients.matchAll({ type: 'window' })
      .then(clientsList => {
        // If a window is already open, focus it
        for (const client of clientsList) {
          if (client.url === '/' && 'focus' in client) {
            return client.focus();
          }
        }
        
        // Otherwise, open a new window
        if (clients.openWindow) {
          return clients.openWindow('/');
        }
      })
  );
});

// Background sync for form data
async function syncFormData() {
  // Get all pending form submissions from IndexedDB
  const pendingSubmissions = await getPendingSubmissions();
  
  // Process each pending submission
  for (const submission of pendingSubmissions) {
    try {
      // Try to submit the form data
      const response = await fetch(submission.url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submission.data),
      });
      
      // If successful, remove from pending submissions
      if (response.ok) {
        await removePendingSubmission(submission.id);
      }
    } catch (error) {
      console.error('Error syncing form data:', error);
    }
  }
}

// Helper function to get pending form submissions from IndexedDB
async function getPendingSubmissions() {
  // In a real app, you would use IndexedDB to store pending submissions
  // This is a simplified example
  return [];
}

// Helper function to remove a pending submission from IndexedDB
async function removePendingSubmission(id) {
  // In a real app, you would remove the submission from IndexedDB
  // This is a simplified example
  console.log(`Removed pending submission: ${id}`);
}
