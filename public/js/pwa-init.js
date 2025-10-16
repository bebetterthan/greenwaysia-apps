class PWAManager {
    constructor() {
        this.deferredPrompt = null;
        this.isOnline = navigator.onLine;
        this.swRegistration = null;

        this.init();
    }

    init() {
        if ('serviceWorker' in navigator) {
            this.registerServiceWorker();
        }

        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            this.deferredPrompt = e;
            this.showInstallPrompt();
        });

        window.addEventListener('appinstalled', () => {
            console.log('✅ PWA installed successfully');
            this.deferredPrompt = null;
            this.hideInstallPrompt();

            if (typeof showToast === 'function') {
                showToast('📱 App installed! Launch from your home screen.', 'success');
            }
        });

        window.addEventListener('online', () => {
            this.isOnline = true;
            this.hideOfflineIndicator();
            if (typeof showToast === 'function') {
                showToast('🌐 You are back online!', 'success');
            }
        });

        window.addEventListener('offline', () => {
            this.isOnline = false;
            this.showOfflineIndicator();
            if (typeof showToast === 'function') {
                showToast('📵 You are offline. Some features may be limited.', 'warning');
            }
        });

        if (window.matchMedia('(display-mode: standalone)').matches) {
            console.log('✅ Running as PWA');
            this.hideInstallPrompt();
        }

        if (!this.isOnline) {
            this.showOfflineIndicator();
        }

        console.log('🚀 PWA Manager initialized');
    }

    async registerServiceWorker() {
        try {
            this.swRegistration = await navigator.serviceWorker.register('/sw.js', {
                scope: '/'
            });

            console.log('✅ Service Worker registered:', this.swRegistration.scope);

            this.swRegistration.addEventListener('updatefound', () => {
                const newWorker = this.swRegistration.installing;
                console.log('🔄 Service Worker update found');

                newWorker.addEventListener('statechange', () => {
                    if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                        console.log('🆕 New version available');
                        this.showUpdatePrompt();
                    }
                });
            });

            navigator.serviceWorker.addEventListener('controllerchange', () => {
                console.log('🔄 Service Worker controller changed');
                window.location.reload();
            });

        } catch (error) {
            console.error('❌ Service Worker registration failed:', error);
        }
    }

    showInstallPrompt() {
        const existingPrompt = document.querySelector('.pwa-install-prompt');
        if (existingPrompt) return;

        const promptHTML = `
            <div class="pwa-install-prompt" id="pwa-install-prompt">
                <div class="pwa-install-content">
                    <div class="pwa-install-icon">📱</div>
                    <div class="pwa-install-text">
                        <h4>Install Greenesia App</h4>
                        <p>Add to your home screen for quick access and offline mode</p>
                    </div>
                    <div class="pwa-install-actions">
                        <button class="pwa-install-btn" id="pwa-install-btn">Install</button>
                        <button class="pwa-dismiss-btn" id="pwa-dismiss-btn">Later</button>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', promptHTML);

        setTimeout(() => {
            document.getElementById('pwa-install-prompt').classList.add('show');
        }, 1000);

        document.getElementById('pwa-install-btn').addEventListener('click', () => {
            this.installPWA();
        });

        document.getElementById('pwa-dismiss-btn').addEventListener('click', () => {
            this.hideInstallPrompt();
            localStorage.setItem('pwa-install-dismissed', Date.now());
        });
    }

    hideInstallPrompt() {
        const prompt = document.getElementById('pwa-install-prompt');
        if (prompt) {
            prompt.classList.remove('show');
            setTimeout(() => {
                prompt.remove();
            }, 300);
        }
    }

    async installPWA() {
        if (!this.deferredPrompt) {
            console.log('❌ Install prompt not available');
            return;
        }

        this.deferredPrompt.prompt();
        const { outcome } = await this.deferredPrompt.userChoice;
        console.log(`User response: ${outcome}`);

        this.deferredPrompt = null;
        this.hideInstallPrompt();
    }

    showUpdatePrompt() {
        if (typeof showToast === 'function') {
            showToast('🆕 New version available! Refresh to update.', 'info', 10000);
        }

        const updateHTML = `
            <div class="pwa-update-prompt" id="pwa-update-prompt" style="
                position: fixed;
                top: 20px;
                right: 20px;
                background: white;
                padding: 16px;
                border-radius: 8px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                z-index: 10002;
                max-width: 300px;
            ">
                <div style="display: flex; align-items: center; gap: 12px;">
                    <div style="font-size: 2rem;">🆕</div>
                    <div style="flex: 1;">
                        <h4 style="margin: 0 0 4px 0; font-size: 0.95rem;">Update Available</h4>
                        <p style="margin: 0; font-size: 0.85rem; color: #666;">A new version is ready to install</p>
                    </div>
                </div>
                <div style="display: flex; gap: 8px; margin-top: 12px;">
                    <button id="pwa-update-btn" style="
                        flex: 1;
                        padding: 8px;
                        background: #2ecc71;
                        color: white;
                        border: none;
                        border-radius: 4px;
                        font-weight: 600;
                        cursor: pointer;
                    ">Update Now</button>
                    <button id="pwa-update-dismiss" style="
                        padding: 8px 12px;
                        background: #f5f5f5;
                        color: #333;
                        border: none;
                        border-radius: 4px;
                        cursor: pointer;
                    ">Later</button>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', updateHTML);

        document.getElementById('pwa-update-btn').addEventListener('click', () => {
            this.updatePWA();
        });

        document.getElementById('pwa-update-dismiss').addEventListener('click', () => {
            document.getElementById('pwa-update-prompt').remove();
        });
    }

    updatePWA() {
        if (this.swRegistration && this.swRegistration.waiting) {
            this.swRegistration.waiting.postMessage({ action: 'skipWaiting' });
        }
    }

    showOfflineIndicator() {
        let indicator = document.querySelector('.offline-indicator');

        if (!indicator) {
            indicator = document.createElement('div');
            indicator.className = 'offline-indicator';
            indicator.innerHTML = '📵 You are offline - Using cached data';
            document.body.appendChild(indicator);
        }

        setTimeout(() => {
            indicator.classList.add('show');
        }, 100);
    }

    hideOfflineIndicator() {
        const indicator = document.querySelector('.offline-indicator');
        if (indicator) {
            indicator.classList.remove('show');
            setTimeout(() => {
                indicator.remove();
            }, 300);
        }
    }

    clearCache() {
        if ('caches' in window) {
            caches.keys().then((cacheNames) => {
                return Promise.all(
                    cacheNames.map((cacheName) => {
                        console.log('🗑️ Deleting cache:', cacheName);
                        return caches.delete(cacheName);
                    })
                );
            });
        }
    }

    getNetworkStatus() {
        return {
            online: this.isOnline,
            effectiveType: navigator.connection?.effectiveType || 'unknown',
            downlink: navigator.connection?.downlink || 'unknown',
            rtt: navigator.connection?.rtt || 'unknown'
        };
    }
}

let pwaManager = null;

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        pwaManager = new PWAManager();
        window.pwaManager = pwaManager;
    });
} else {
    pwaManager = new PWAManager();
    window.pwaManager = pwaManager;
}

if (typeof window !== 'undefined') {
    window.PWAManager = PWAManager;
}
