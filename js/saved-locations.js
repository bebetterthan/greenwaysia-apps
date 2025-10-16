let currentClickedFeature = null;
let savedLocationMarkers = [];

function initSavedLocations() {
    const sidebar = document.getElementById('control-sidebar');
    const toggleBtn = document.getElementById('sidebar-toggle');

    if (toggleBtn) {
        toggleBtn.addEventListener('click', () => {
            sidebar.classList.toggle('active');
        });
    }

    loadSavedLocations();
}

async function loadSavedLocations() {
    const token = localStorage.getItem('token');
    const listElement = document.getElementById('saved-locations-list');

    if (!listElement) return;

    if (!token) {
        listElement.innerHTML = `
            <div class="empty-state-container">
                <div class="empty-icon">🔐</div>
                <p class="empty-message">Please login to save locations</p>
                <button class="save-current-btn" onclick="window.location.href='/login.html'">
                    <span>Login</span>
                </button>
            </div>
        `;
        return;
    }

    listElement.innerHTML = `
        <div class="loading-container">
            <div class="spinner"></div>
            <p>Loading saved locations...</p>
        </div>
    `;

    try {
        const response = await fetch(window.location.origin + '/api/saved-locations', {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json'
            }
        });

        const result = await response.json();

        if (result.success && result.data.length > 0) {
            displaySavedLocations(result.data);
        } else {
            listElement.innerHTML = `
                <div class="empty-state-container">
                    <div class="empty-icon">📍</div>
                    <p class="empty-message">No saved locations yet</p>
                    <button class="save-current-btn" onclick="saveCurrentLocation()">
                        <span style="font-size: 1.2rem; margin-right: 6px;">➕</span>
                        <span>Save Current Location</span>
                    </button>
                    <p class="empty-hint">Tip: Right-click on the map to save any location</p>
                </div>
            `;
        }
    } catch (error) {
        console.error('Error loading saved locations:', error);
        listElement.innerHTML = `
            <div class="empty-state-container">
                <div class="empty-icon">⚠️</div>
                <p class="empty-message">Error loading saved locations</p>
                <button class="save-current-btn" onclick="loadSavedLocations()">
                    <span>Retry</span>
                </button>
            </div>
        `;
    }
}

function displaySavedLocations(locations) {
    const container = document.getElementById('saved-locations-list');
    if (!container) return;

    savedLocationMarkers.forEach(marker => map.removeLayer(marker));
    savedLocationMarkers = [];

    const html = `
        <button class="save-current-btn" onclick="saveCurrentLocation()">
            <span style="font-size: 1.2rem; margin-right: 6px;">➕</span>
            <span>Save Current Location</span>
        </button>
        <div class="saved-locations-count">
            <span>${locations.length} saved location${locations.length !== 1 ? 's' : ''}</span>
        </div>
        <div class="saved-locations-container">
            ${locations.map(location => createLocationCard(location)).join('')}
        </div>
    `;

    container.innerHTML = html;

    locations.forEach(location => {
        if (location.location_data && location.location_data.lat && location.location_data.lng) {
            addLocationMarker(location);
        }
    });
}

function createLocationCard(location) {
    const icon = getLocationTypeIcon(location.location_type);
    const color = getLocationTypeColor(location.location_type);
    const date = location.created_at ? new Date(location.created_at) : new Date();
    const timeAgo = getTimeAgo(date);
    const lat = location.location_data?.lat || 0;
    const lng = location.location_data?.lng || 0;

    return `
        <div class="saved-location-card" data-id="${location.id}">
            <div class="location-card-header">
                <div class="location-icon" style="background: ${color};">${icon}</div>
                <div class="location-info-header">
                    <h5 class="location-name">${location.name}</h5>
                    <span class="location-type-badge" style="background: ${color};">
                        ${location.location_type}
                    </span>
                </div>
            </div>

            <div class="location-card-body">
                ${location.notes ? `<p class="location-notes">${location.notes}</p>` : ''}

                <div class="location-coords">
                    <span class="coord-icon">📍</span>
                    <span class="coord-text">${lat.toFixed(6)}, ${lng.toFixed(6)}</span>
                </div>

                <div class="location-meta">
                    <span class="meta-item">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" style="width: 14px; height: 14px; opacity: 0.7;">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        ${timeAgo}
                    </span>
                </div>
            </div>

            <div class="location-card-actions">
                <button class="action-btn view-btn" onclick="viewSavedLocation(${location.id})" title="View on map">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" style="width: 16px; height: 16px;">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                        <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    View
                </button>
                <button class="action-btn directions-btn" onclick="getDirectionsTo(${location.id})" title="Get directions">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" style="width: 16px; height: 16px;">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M9 6.75V15m6-6v8.25m.503 3.498l4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 00-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0z" />
                    </svg>
                    Directions
                </button>
                <button class="action-btn delete-btn-icon" onclick="deleteSavedLocation(${location.id})" title="Delete">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" style="width: 16px; height: 16px;">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                    </svg>
                </button>
            </div>
        </div>
    `;
}

function getLocationTypeIcon(type) {
    const icons = {
        mangrove: '🌳',
        plantation: '🌾',
        deforestation: '🪓',
        custom: '📍',
        home: '🏠',
        work: '💼',
        favorite: '⭐'
    };
    return icons[type] || '📍';
}

function getLocationTypeColor(type) {
    const colors = {
        mangrove: '#27ae60',
        plantation: '#f39c12',
        deforestation: '#e74c3c',
        custom: '#3498db',
        home: '#9b59b6',
        work: '#34495e',
        favorite: '#f1c40f'
    };
    return colors[type] || '#95a5a6';
}

function getTimeAgo(date) {
    const seconds = Math.floor((new Date() - date) / 1000);

    if (seconds < 60) return 'just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
    if (seconds < 2592000) return `${Math.floor(seconds / 604800)}w ago`;

    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function addLocationMarker(location) {
    if (!location.location_data || !location.location_data.lat || !location.location_data.lng) return;

    const markerColor = getLocationTypeColor(location.location_type);
            const markerIcon = L.divIcon({
                className: 'saved-location-marker',
                html: `<div style="background: ${markerColor}; width: 15px; height: 15px; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 10px rgba(0,0,0,0.5);"></div>`,
                iconSize: [15, 15],
                iconAnchor: [7.5, 7.5]
            });

            const marker = L.marker([location.location_data.lat, location.location_data.lng], {
                icon: markerIcon
            }).addTo(map);

            marker.bindPopup(`
                <div style="text-align: center;">
                    <strong>${location.name}</strong><br>
                    <small>${location.location_type}</small><br>
                    ${location.notes ? `<small>${location.notes}</small>` : ''}
                </div>
            `);

            marker.on('click', () => {
                map.setView([location.location_data.lat, location.location_data.lng], 12);
            });

            savedLocationMarkers.push(marker);
        }
    });

    const items = container.querySelectorAll('.saved-location-item');
    items.forEach(item => {
        item.addEventListener('click', (e) => {
            if (!e.target.classList.contains('delete-btn')) {
                const locationId = parseInt(item.dataset.id);
                const location = locations.find(loc => loc.id === locationId);
                if (location && location.location_data) {
                    map.setView([location.location_data.lat, location.location_data.lng], 12);
                }
            }
        });
    });
}

async function saveCurrentLocation() {
    const token = localStorage.getItem('token');

    if (!token) {
        if (typeof showToast === 'function') {
            showToast('Please login to save locations', 'warning');
        } else {
            alert('Please login to save locations');
        }
        return;
    }

    if (!currentClickedFeature) {
        if (typeof showToast === 'function') {
            showToast('Please click on a location first', 'warning');
        } else {
            alert('Please click on a location first');
        }
        return;
    }

    const name = prompt('Enter a name for this location:');
    if (!name) return;

    const notes = prompt('Add notes (optional):');

    try {
        const response = await fetch('/api/saved-locations', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                location_type: currentClickedFeature.type,
                location_data: currentClickedFeature.data,
                name: name,
                notes: notes
            })
        });

        const result = await response.json();

        if (result.success) {
            if (typeof showToast === 'function') {
                showToast('Location saved successfully!', 'success');
            } else {
                alert('Location saved successfully!');
            }
            loadSavedLocations();
        } else {
            if (typeof showToast === 'function') {
                showToast(result.message || 'Error saving location', 'error');
            } else {
                alert('Error saving location: ' + (result.message || 'Unknown error'));
            }
        }
    } catch (error) {
        console.error('Error saving location:', error);
        if (typeof showToast === 'function') {
            showToast('Error saving location', 'error');
        } else {
            alert('Error saving location');
        }
    }
}

async function deleteSavedLocation(id) {
    const token = localStorage.getItem('token');

    if (!confirm('Are you sure you want to delete this location?')) {
        return;
    }

    try {
        const response = await fetch(`/api/saved-locations/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json'
            }
        });

        const result = await response.json();

        if (result.success) {
            if (typeof showToast === 'function') {
                showToast('Location deleted successfully!', 'success');
            } else {
                alert('Location deleted successfully!');
            }
            loadSavedLocations();
        } else {
            if (typeof showToast === 'function') {
                showToast(result.message || 'Error deleting location', 'error');
            } else {
                alert('Error deleting location: ' + (result.message || 'Unknown error'));
            }
        }
    } catch (error) {
        console.error('Error deleting location:', error);
        if (typeof showToast === 'function') {
            showToast('Error deleting location', 'error');
        } else {
            alert('Error deleting location');
        }
    }
}

function updateLocationDetails(feature, layer) {
    const detailsContainer = document.getElementById('location-details');

    let detailsHTML = '<table>';

    if (feature.properties) {
        for (let key in feature.properties) {
            if (feature.properties[key]) {
                detailsHTML += `
                    <tr>
                        <td>${key}</td>
                        <td>${feature.properties[key]}</td>
                    </tr>
                `;
            }
        }
    }

    detailsHTML += '</table>';
    detailsHTML += '<button class="save-location-btn" onclick="saveCurrentLocation()">Save This Location</button>';

    detailsContainer.innerHTML = detailsHTML;

    const latlng = layer.getLatLng ? layer.getLatLng() : layer.getBounds().getCenter();

    currentClickedFeature = {
        type: feature.properties.type || 'mangrove',
        data: {
            lat: latlng.lat,
            lng: latlng.lng,
            properties: feature.properties
        }
    };
}

async function viewSavedLocation(id) {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
        const response = await fetch(window.location.origin + '/api/saved-locations', {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json'
            }
        });

        const result = await response.json();
        if (result.success) {
            const location = result.data.find(loc => loc.id === id);
            if (location && location.location_data && location.location_data.lat && location.location_data.lng) {
                map.setView([location.location_data.lat, location.location_data.lng], 15, {
                    animate: true,
                    duration: 1
                });

                const marker = savedLocationMarkers.find(m => m.options.locationId === id);
                if (marker) {
                    marker.openPopup();
                }

                if (typeof showToast === 'function') {
                    showToast(`Viewing: ${location.name}`, 'info');
                }
            }
        }
    } catch (error) {
        console.error('Error viewing location:', error);
    }
}

async function getDirectionsTo(id) {
    const token = localStorage.getItem('token');
    if (!token) return;

    if (!lastKnownPosition) {
        if (typeof showToast === 'function') {
            showToast('Current location not available', 'warning');
        }
        return;
    }

    try {
        const response = await fetch(window.location.origin + '/api/saved-locations', {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json'
            }
        });

        const result = await response.json();
        if (result.success) {
            const location = result.data.find(loc => loc.id === id);
            if (location && location.location_data && location.location_data.lat && location.location_data.lng) {
                const fromLat = lastKnownPosition.coords.latitude;
                const fromLng = lastKnownPosition.coords.longitude;
                const toLat = location.location_data.lat;
                const toLng = location.location_data.lng;

                const url = `https://www.google.com/maps/dir/?api=1&origin=${fromLat},${fromLng}&destination=${toLat},${toLng}`;
                window.open(url, '_blank');

                if (typeof showToast === 'function') {
                    showToast(`Opening directions to ${location.name}`, 'info');
                }
            }
        }
    } catch (error) {
        console.error('Error getting directions:', error);
        if (typeof showToast === 'function') {
            showToast('Error getting directions', 'error');
        }
    }
}

if (typeof window !== 'undefined') {
    window.viewSavedLocation = viewSavedLocation;
    window.getDirectionsTo = getDirectionsTo;
    window.saveCurrentLocation = saveCurrentLocation;
    window.deleteSavedLocation = deleteSavedLocation;
}
