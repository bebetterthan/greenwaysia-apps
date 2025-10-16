document.addEventListener('DOMContentLoaded', () => {
    checkAuth();
    loadSavedLocationsPage();
});

function checkAuth() {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = '/login';
        return;
    }
}

async function loadSavedLocationsPage() {
    const loadingState = document.getElementById('loading-state');
    const emptyState = document.getElementById('empty-state');
    const savedGrid = document.getElementById('saved-grid');

    try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://127.0.0.1:8000/api/saved-locations', {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json'
            }
        });

        if (!response.ok) throw new Error('Failed to load saved locations');

        const data = await response.json();
        const locations = data.data || [];

        loadingState.style.display = 'none';

        if (locations.length === 0) {
            emptyState.style.display = 'block';
            savedGrid.style.display = 'none';
        } else {
            emptyState.style.display = 'none';
            savedGrid.style.display = 'grid';
            renderLocations(locations);
        }
    } catch (error) {
        console.error('Error loading saved locations:', error);
        loadingState.style.display = 'none';
        emptyState.style.display = 'block';
        showToast('Failed to load saved locations', 'error');
    }
}

function renderLocations(locations) {
    const savedGrid = document.getElementById('saved-grid');
    savedGrid.innerHTML = '';

    locations.forEach(location => {
        const card = createLocationCard(location);
        savedGrid.appendChild(card);
    });
}

function createLocationCard(location) {
    const card = document.createElement('div');
    card.className = 'location-card';

    const typeColor = location.type === 'mangrove' ? '#4CAF50' : '#FF9800';
    const typeLabel = location.type === 'mangrove' ? 'Mangrove' : 'Plantation';
    const icon = location.type === 'mangrove' ? '🌿' : '🌾';

    card.innerHTML = `
        <div class="location-image" style="background: linear-gradient(135deg, ${typeColor}, ${typeColor}dd);">
            ${icon}
        </div>
        <div class="location-content">
            <h3 class="location-title">${location.name || 'Unnamed Location'}</h3>
            <span class="location-type" style="background: ${typeColor};">${typeLabel}</span>
            <div class="location-coords">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" style="width: 16px; height: 16px;">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                </svg>
                <span>${location.latitude}, ${location.longitude}</span>
            </div>
            ${location.notes ? `<p class="location-notes">${location.notes}</p>` : ''}
            <div class="location-actions">
                <button class="btn-view" onclick="viewOnMap(${location.latitude}, ${location.longitude})">View on Map</button>
                <button class="btn-delete" onclick="deleteLocationPage(${location.id})">Delete</button>
            </div>
        </div>
    `;

    return card;
}

function viewOnMap(lat, lng) {
    window.location.href = `/maps?lat=${lat}&lng=${lng}`;
}

async function deleteLocationPage(id) {
    if (!confirm('Are you sure you want to delete this location?')) {
        return;
    }

    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://127.0.0.1:8000/api/saved-locations/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json'
            }
        });

        if (!response.ok) throw new Error('Failed to delete location');

        showToast('Location deleted successfully', 'success');
        loadSavedLocationsPage();
    } catch (error) {
        console.error('Error deleting location:', error);
        showToast('Failed to delete location', 'error');
    }
}
