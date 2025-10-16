class TouchGestureHandler {
    constructor(map) {
        this.map = map;
        this.touchStart = null;
        this.touchEnd = null;
        this.longPressTimer = null;
        this.isLongPress = false;
        this.isPinching = false;
        this.lastDistance = 0;
        this.lastCenter = null;

        this.init();
    }

    init() {
        const mapContainer = this.map.getContainer();

        mapContainer.addEventListener('touchstart', this.handleTouchStart.bind(this), { passive: false });
        mapContainer.addEventListener('touchmove', this.handleTouchMove.bind(this), { passive: false });
        mapContainer.addEventListener('touchend', this.handleTouchEnd.bind(this), { passive: false });

        mapContainer.addEventListener('contextmenu', (e) => {
            if (this.isLongPress) {
                e.preventDefault();
            }
        });

        console.log('✋ Touch gestures initialized');
    }

    handleTouchStart(e) {
        this.touchStart = {
            x: e.touches[0].clientX,
            y: e.touches[0].clientY,
            time: Date.now()
        };

        if (e.touches.length === 2) {
            this.isPinching = true;
            this.lastDistance = this.getDistance(e.touches[0], e.touches[1]);
            this.lastCenter = this.getCenter(e.touches[0], e.touches[1]);

            if (this.longPressTimer) {
                clearTimeout(this.longPressTimer);
                this.longPressTimer = null;
            }
        }
        else if (e.touches.length === 1) {
            this.isLongPress = false;

            this.longPressTimer = setTimeout(() => {
                this.isLongPress = true;
                this.handleLongPress(e.touches[0]);
            }, 500);
        }
    }

    handleTouchMove(e) {
        if (this.longPressTimer) {
            const moveThreshold = 10;
            const deltaX = Math.abs(e.touches[0].clientX - this.touchStart.x);
            const deltaY = Math.abs(e.touches[0].clientY - this.touchStart.y);

            if (deltaX > moveThreshold || deltaY > moveThreshold) {
                clearTimeout(this.longPressTimer);
                this.longPressTimer = null;
            }
        }

        if (e.touches.length === 2 && this.isPinching) {
            e.preventDefault();

            const currentDistance = this.getDistance(e.touches[0], e.touches[1]);
            const currentCenter = this.getCenter(e.touches[0], e.touches[1]);

            if (this.lastDistance > 0) {
                const scale = currentDistance / this.lastDistance;
                const currentZoom = this.map.getZoom();

                if (scale > 1.02) {
                    this.map.setZoom(currentZoom + 0.3, { animate: false });
                } else if (scale < 0.98) {
                    this.map.setZoom(currentZoom - 0.3, { animate: false });
                }
            }

            this.lastDistance = currentDistance;
            this.lastCenter = currentCenter;
        }
    }

    handleTouchEnd(e) {
        if (this.longPressTimer) {
            clearTimeout(this.longPressTimer);
            this.longPressTimer = null;
        }

        if (e.touches.length < 2) {
            this.isPinching = false;
            this.lastDistance = 0;
            this.lastCenter = null;
        }

        if (!this.isLongPress && this.touchStart && e.changedTouches.length === 1) {
            this.touchEnd = {
                x: e.changedTouches[0].clientX,
                y: e.changedTouches[0].clientY,
                time: Date.now()
            };

            this.detectSwipe();
        }

        if (e.touches.length === 0) {
            this.touchStart = null;
            this.touchEnd = null;
            this.isLongPress = false;
        }
    }

    handleLongPress(touch) {
        const containerPoint = L.point(touch.clientX, touch.clientY);
        const layerPoint = this.map.containerPointToLayerPoint(containerPoint);
        const latlng = this.map.layerPointToLatLng(layerPoint);

        if (navigator.vibrate) {
            navigator.vibrate(50);
        }

        this.showLocationContextMenu(latlng, touch);
    }

    showLocationContextMenu(latlng, touch) {
        const popupContent = `
            <div style="text-align: center; min-width: 200px;">
                <div style="background: linear-gradient(135deg, #2196F3, #1976D2); color: white; padding: 8px; border-radius: 6px 6px 0 0; margin: -9px -9px 8px -9px;">
                    <strong>📍 Location Options</strong>
                </div>
                <div style="padding: 8px 0;">
                    <button onclick="copyCoordinates(${latlng.lat}, ${latlng.lng})" class="context-menu-btn">
                        <i class="fas fa-copy"></i> Copy Coordinates
                    </button>
                    <button onclick="saveThisLocation(${latlng.lat}, ${latlng.lng})" class="context-menu-btn">
                        <i class="fas fa-bookmark"></i> Save Location
                    </button>
                    <button onclick="getDirections(${latlng.lat}, ${latlng.lng})" class="context-menu-btn">
                        <i class="fas fa-directions"></i> Get Directions
                    </button>
                    <button onclick="shareLocation(${latlng.lat}, ${latlng.lng})" class="context-menu-btn">
                        <i class="fas fa-share-alt"></i> Share
                    </button>
                </div>
                <div style="font-size: 0.75rem; color: #666; padding-top: 8px; border-top: 1px solid #e0e0e0;">
                    ${latlng.lat.toFixed(6)}, ${latlng.lng.toFixed(6)}
                </div>
            </div>
            <style>
                .context-menu-btn {
                    display: flex;
                    align-items: center;
                    justify-content: flex-start;
                    gap: 8px;
                    width: 100%;
                    padding: 10px 16px;
                    margin: 4px 0;
                    border: none;
                    background: white;
                    color: #333;
                    font-size: 14px;
                    cursor: pointer;
                    transition: all 0.2s;
                    border-radius: 4px;
                }
                .context-menu-btn:hover {
                    background: #f5f5f5;
                    color: #2196F3;
                }
                .context-menu-btn:active {
                    transform: scale(0.98);
                }
                .context-menu-btn i {
                    width: 20px;
                    text-align: center;
                }
            </style>
        `;

        const popup = L.popup({
            closeButton: true,
            autoClose: true,
            closeOnClick: true,
            className: 'context-menu-popup'
        })
        .setLatLng(latlng)
        .setContent(popupContent)
        .openOn(this.map);

        const tempMarker = L.circleMarker(latlng, {
            radius: 8,
            fillColor: '#2196F3',
            color: '#fff',
            weight: 2,
            opacity: 0.8,
            fillOpacity: 0.6
        }).addTo(this.map);

        popup.on('remove', () => {
            this.map.removeLayer(tempMarker);
        });
    }

    detectSwipe() {
        if (!this.touchStart || !this.touchEnd) return;

        const deltaX = this.touchEnd.x - this.touchStart.x;
        const deltaY = this.touchEnd.y - this.touchStart.y;
        const deltaTime = this.touchEnd.time - this.touchStart.time;

        const absX = Math.abs(deltaX);
        const absY = Math.abs(deltaY);

        const minDistance = 50;
        const maxTime = 300;

        if (absX < minDistance && absY < minDistance) return;
        if (deltaTime > maxTime) return;

        if (absX > absY) {
            if (deltaX > 0) {
                console.log('👉 Swipe right');
                this.handleSwipeRight();
            } else {
                console.log('👈 Swipe left');
                this.handleSwipeLeft();
            }
        } else {
            if (deltaY > 0) {
                console.log('👇 Swipe down');
                this.handleSwipeDown();
            } else {
                console.log('👆 Swipe up');
                this.handleSwipeUp();
            }
        }
    }

    handleSwipeRight() {
        const sidebar = document.querySelector('.control-sidebar');
        if (sidebar && !sidebar.classList.contains('open')) {
            sidebar.classList.add('open');
            document.body.classList.add('sidebar-open');
        }
    }

    handleSwipeLeft() {
        const sidebar = document.querySelector('.control-sidebar');
        if (sidebar && sidebar.classList.contains('open')) {
            sidebar.classList.remove('open');
            document.body.classList.remove('sidebar-open');
        }
    }

    handleSwipeUp() {
        const sidebar = document.querySelector('.control-sidebar');
        if (sidebar && window.innerWidth <= 768) {
            sidebar.classList.add('open');
            document.body.classList.add('sidebar-open');
        }
    }

    handleSwipeDown() {
        const sidebar = document.querySelector('.control-sidebar');
        if (sidebar && window.innerWidth <= 768 && sidebar.classList.contains('open')) {
            sidebar.classList.remove('open');
            document.body.classList.remove('sidebar-open');
        }
    }

    getDistance(touch1, touch2) {
        const dx = touch1.clientX - touch2.clientX;
        const dy = touch1.clientY - touch2.clientY;
        return Math.sqrt(dx * dx + dy * dy);
    }

    getCenter(touch1, touch2) {
        return {
            x: (touch1.clientX + touch2.clientX) / 2,
            y: (touch1.clientY + touch2.clientY) / 2
        };
    }

    destroy() {
        const mapContainer = this.map.getContainer();
        mapContainer.removeEventListener('touchstart', this.handleTouchStart);
        mapContainer.removeEventListener('touchmove', this.handleTouchMove);
        mapContainer.removeEventListener('touchend', this.handleTouchEnd);

        if (this.longPressTimer) {
            clearTimeout(this.longPressTimer);
        }

        console.log('✋ Touch gestures destroyed');
    }
}

function copyCoordinates(lat, lng) {
    const coords = `${lat.toFixed(6)}, ${lng.toFixed(6)}`;

    if (navigator.clipboard) {
        navigator.clipboard.writeText(coords).then(() => {
            if (typeof showToast === 'function') {
                showToast('📋 Coordinates copied!', 'success');
            }
        });
    } else {
        // Fallback for older browsers
        const input = document.createElement('input');
        input.value = coords;
        document.body.appendChild(input);
        input.select();
        document.execCommand('copy');
        document.body.removeChild(input);

        if (typeof showToast === 'function') {
            showToast('📋 Coordinates copied!', 'success');
        }
    }
}

function saveThisLocation(lat, lng) {
    if (typeof showToast === 'function') {
        showToast('📍 Location save feature coming soon!', 'info');
    }
}

function getDirections(lat, lng) {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
    window.open(url, '_blank');

    if (typeof showToast === 'function') {
        showToast('🗺️ Opening Google Maps...', 'info');
    }
}

function shareLocation(lat, lng) {
    const coords = `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
    const url = `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lng}&zoom=15`;

    if (navigator.share) {
        navigator.share({
            title: 'Location from Greenesia',
            text: `Check out this location: ${coords}`,
            url: url
        }).then(() => {
            console.log('📤 Location shared successfully');
        });
    } else {
        if (navigator.clipboard) {
            navigator.clipboard.writeText(url);
            if (typeof showToast === 'function') {
                showToast('🔗 Location link copied!', 'success');
            }
        }
    }
}

if (typeof window !== 'undefined') {
    window.TouchGestureHandler = TouchGestureHandler;
}
