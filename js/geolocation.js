let userLocationMarker = null;
let userLocationAccuracyCircle = null;
let watchId = null;
let lastKnownPosition = null;
let lastGeocodedPosition = null;
let geocodeTimeout = null;
let smoothedPosition = null;
let positionHistory = [];

function initUserLocation() {
    console.log('🚀 Initializing user location...');

    if (!('geolocation' in navigator)) {
        console.error('❌ Geolocation is not supported by this browser');
        if (typeof showToast === 'function') {
            showToast('Geolocation not supported in your browser', 'error');
        }
        return;
    }

    console.log('✓ Geolocation API available');

    if ('permissions' in navigator) {
        navigator.permissions.query({ name: 'geolocation' }).then(result => {
            console.log(`📍 Permission status: ${result.state}`);

            if (result.state === 'denied') {
                console.error('❌ Location permission DENIED');
                if (typeof showToast === 'function') {
                    showToast('Location permission denied. Please enable in browser settings.', 'error');
                }
                return;
            }

            startLocationTracking();
            initRecenterButton();
        }).catch(error => {
            console.warn('⚠️ Could not check permissions, proceeding anyway...');
            console.warn(`   Error: ${error.message}`);
            startLocationTracking();
            initRecenterButton();
        });
    } else {
        console.log('   Permissions API not available, proceeding...');
        startLocationTracking();
        initRecenterButton();
    }
}

function smoothPosition(newLat, newLng, accuracy) {
    const maxHistorySize = 8;
    const accuracyWeight = 1 / Math.pow(accuracy + 1, 2);

    positionHistory.push({
        lat: newLat,
        lng: newLng,
        accuracy: accuracy,
        weight: accuracyWeight,
        timestamp: Date.now()
    });

    if (positionHistory.length > maxHistorySize) {
        positionHistory.shift();
    }

    const recentPositions = positionHistory.filter(p =>
        (Date.now() - p.timestamp) < 60000
    );

    if (recentPositions.length <= 2) {
        return { lat: newLat, lng: newLng };
    }

    const totalWeight = recentPositions.reduce((sum, p) => sum + p.weight, 0);

    const smoothLat = recentPositions.reduce((sum, p) =>
        sum + (p.lat * p.weight), 0) / totalWeight;
    const smoothLng = recentPositions.reduce((sum, p) =>
        sum + (p.lng * p.weight), 0) / totalWeight;

    console.log(`   🔄 Smoothed (${recentPositions.length} samples)`);

    return { lat: smoothLat, lng: smoothLng };
}

function startLocationTracking() {
    if (typeof showToast === 'function') {
        showToast('📍 Getting your location...', 'info');
    }

    console.log('� Optimized Location Detection: Multi-Stage Strategy');
    console.log('   Stage 1: Quick network location (low accuracy, fast)');
    console.log('   Stage 2: High accuracy GPS (precise, slower)\n');

    let locationAcquired = false;
    let quickLocationTimer = null;

    quickLocationTimer = setTimeout(() => {
        if (!locationAcquired) {
            console.log('⚡ Quick mode: Requesting any available location...');
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    if (!locationAcquired) {
                        locationAcquired = true;
                        console.log('✅ Network location acquired (quick mode)');
                        console.log(`   Accuracy: ±${position.coords.accuracy.toFixed(0)}m`);

                        updateUserLocation(position);
                        const currentZoom = map.getZoom();
                        if (currentZoom < 10) {
                            map.setView([position.coords.latitude, position.coords.longitude], 13);
                        }

                        if (typeof showToast === 'function') {
                            showToast('Location found! Improving accuracy...', 'success');
                        }
                    }
                },
                () => {},
                {
                    enableHighAccuracy: false,
                    timeout: 5000,
                    maximumAge: 60000
                }
            );
        }
    }, 2000);

    navigator.geolocation.getCurrentPosition(
        (position) => {
            if (quickLocationTimer) clearTimeout(quickLocationTimer);
            locationAcquired = true;

            console.log('✅ Precise location acquired!');
            console.log(`   Lat: ${position.coords.latitude.toFixed(6)}`);
            console.log(`   Lng: ${position.coords.longitude.toFixed(6)}`);
            console.log(`   Accuracy: ±${position.coords.accuracy.toFixed(0)}m`);

            updateUserLocation(position);
            const currentZoom = map.getZoom();
            if (currentZoom < 10) {
                map.setView([position.coords.latitude, position.coords.longitude], 15);
            }

            if (typeof showToast === 'function') {
                showToast('Location found!', 'success');
            }

            console.log('🔄 Starting continuous tracking for improvements...\n');
            startContinuousTracking();
        },
        (error) => {
            console.warn('⚠️ High accuracy mode failed');
            console.warn(`   Error: ${error.message} (Code: ${error.code})`);

            if (!locationAcquired) {
                if (quickLocationTimer) clearTimeout(quickLocationTimer);
                console.log('🔄 Trying fallback strategies...\n');
                startLocationTrackingFallback();
            }
        },
        {
            enableHighAccuracy: true,
            timeout: 8000,
            maximumAge: 0
        }
    );
}

function startLocationTrackingFallback() {
    console.log('🔄 Fallback Strategy: Progressive accuracy acceptance');
    console.log('   Accept any position, improve over time\n');

    let firstPosition = null;
    let bestPosition = null;
    let attempts = 0;
    const maxWaitTime = 6000;
    const startTime = Date.now();
    let locationSet = false;

    function processPosition(position) {
        if (locationSet) return;

        const accuracy = position.coords.accuracy;
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        const altitude = position.coords.altitude;
        const elapsed = Date.now() - startTime;

        attempts++;
        console.log(`\n📍 Reading #${attempts} (${(elapsed/1000).toFixed(1)}s)`);
        console.log(`   Lat: ${lat.toFixed(7)}, Lng: ${lng.toFixed(7)}`);
        console.log(`   Accuracy: ±${accuracy.toFixed(1)}m`);
        console.log(`   Source: ${altitude !== null ? 'GPS' : 'Network'}`);

        if (accuracy > 100000) {
            console.log(`   ❌ Rejected: too inaccurate (>100km)`);
            return;
        }

        if (!firstPosition) {
            firstPosition = position;
            console.log(`   ✓ First position saved`);
        }

        if (!bestPosition || accuracy < bestPosition.coords.accuracy) {
            bestPosition = position;
            console.log(`   ✓ Best position updated (±${accuracy.toFixed(1)}m)`);
        }

        if (accuracy <= 50) {
            console.log(`\n✅ Perfect! (±${accuracy.toFixed(0)}m)`);
            setLocation(position);
        } else if (accuracy <= 500) {
            console.log(`\n✅ Excellent! (±${accuracy.toFixed(0)}m)`);
            setLocation(position);
        } else if (accuracy <= 2000 && elapsed >= 1000) {
            console.log(`\n✅ Good! (±${(accuracy/1000).toFixed(1)}km)`);
            setLocation(position);
        } else if (accuracy <= 10000 && elapsed >= 2000) {
            console.log(`\n✅ City-level accuracy (±${(accuracy/1000).toFixed(1)}km)`);
            setLocation(position);
        } else if (accuracy <= 30000 && elapsed >= 3000) {
            console.log(`\n✅ Regional accuracy (±${(accuracy/1000).toFixed(1)}km)`);
            setLocation(position);
        } else if (elapsed >= maxWaitTime - 500) {
            if (bestPosition) {
                console.log(`\n⏱️ Using best available (±${(bestPosition.coords.accuracy/1000).toFixed(1)}km)`);
                setLocation(bestPosition);
            } else if (firstPosition) {
                console.log(`\n⏱️ Using first position (±${(firstPosition.coords.accuracy/1000).toFixed(1)}km)`);
                setLocation(firstPosition);
            }
        } else {
            console.log(`   ⏳ Improving... (${((maxWaitTime - elapsed)/1000).toFixed(1)}s left)`);
        }
    }

    function setLocation(position) {
        if (locationSet) return;
        locationSet = true;

        updateUserLocation(position);
        const currentZoom = map.getZoom();
        if (currentZoom < 10) {
            map.setView([position.coords.latitude, position.coords.longitude], 15);
        }
        startContinuousTracking();

        if (typeof showToast === 'function') {
            showToast('Location found', 'success');
        }
    }

    console.log('   Starting watchPosition...');

    watchId = navigator.geolocation.watchPosition(
        processPosition,
        (error) => {
            console.error(`\n❌ Geolocation Error!`);
            console.error(`   Message: ${error.message}`);
            console.error(`   Code: ${error.code} (1=PERMISSION_DENIED, 2=POSITION_UNAVAILABLE, 3=TIMEOUT)`);

            if (!locationSet && bestPosition) {
                console.log(`   📍 Using best available position`);
                setLocation(bestPosition);
            } else if (!locationSet && firstPosition) {
                console.log(`   📍 Using first position`);
                setLocation(firstPosition);
            } else if (!locationSet) {
                handleLocationError(error);
            }
        },
        {
            enableHighAccuracy: false,
            timeout: 15000,
            maximumAge: 0
        }
    );

    console.log(`   watchId: ${watchId}`);    setTimeout(() => {
        if (!locationSet) {
            console.log(`\n⏱️ Force timeout after ${maxWaitTime/1000}s`);
            navigator.geolocation.clearWatch(watchId);

            if (bestPosition) {
                console.log(`   Using best position: ±${bestPosition.coords.accuracy.toFixed(1)}m`);
                setLocation(bestPosition);
            } else if (firstPosition) {
                console.log(`   Using first position: ±${firstPosition.coords.accuracy.toFixed(1)}m`);
                setLocation(firstPosition);
            } else {
                console.log(`   ❌ NO POSITION CAPTURED AT ALL!`);
                console.log(`   This means watchPosition never fired success callback`);
                if (typeof showToast === 'function') {
                    showToast('Unable to get location. Check permissions or try again.', 'error');
                }
            }
        } else {
            navigator.geolocation.clearWatch(watchId);
            console.log(`   ✓ Location already set, cleared watch`);
        }
    }, maxWaitTime);

    console.log(`   ⏱️ Timeout guard set for ${maxWaitTime/1000} seconds\n`);
}

function startContinuousTracking() {
    if (watchId !== null) {
        navigator.geolocation.clearWatch(watchId);
    }

    console.log('🔄 Continuous tracking: Smart updates only\n');

    let lastAccuracy = Infinity;
    let updateCount = 0;
    let bestPosition = null;
    let lastUpdateTime = Date.now();

    watchId = navigator.geolocation.watchPosition(
        (position) => {
            updateCount++;
            const accuracy = position.coords.accuracy;
            const lat = position.coords.latitude;
            const lng = position.coords.longitude;
            const altitude = position.coords.altitude;

            console.log(`📡 Update #${updateCount}`);
            console.log(`   Lat: ${lat.toFixed(7)}, Lng: ${lng.toFixed(7)}`);
            console.log(`   Accuracy: ±${accuracy.toFixed(1)}m`);
            console.log(`   Source: ${altitude !== null ? 'GPS' : 'Network'}`);

            if (accuracy > 20000) {
                console.log(`   ❌ Rejected (too inaccurate)\n`);
                return;
            }

            if (!bestPosition || accuracy < bestPosition.coords.accuracy) {
                bestPosition = position;
            }

            const timeSinceLastUpdate = Date.now() - lastUpdateTime;
            const significantImprovement = accuracy < lastAccuracy * 0.75;
            const majorImprovement = accuracy < lastAccuracy * 0.5;
            const isExcellent = accuracy <= 100;
            const isGood = accuracy <= 500;
            const isAcceptable = accuracy <= 1000;

            if (isExcellent) {
                updateUserLocation(position);
                lastAccuracy = accuracy;
                lastUpdateTime = Date.now();
                console.log(`   ✅ Excellent! (±${accuracy.toFixed(0)}m)\n`);
            } else if (majorImprovement) {
                updateUserLocation(position);
                lastAccuracy = accuracy;
                lastUpdateTime = Date.now();
                console.log(`   ✅ Major improvement! (±${lastAccuracy.toFixed(0)}m → ±${accuracy.toFixed(0)}m)\n`);
            } else if (isGood && significantImprovement) {
                updateUserLocation(position);
                lastAccuracy = accuracy;
                lastUpdateTime = Date.now();
                console.log(`   ✅ Improved! (±${accuracy.toFixed(0)}m)\n`);
            } else if (isAcceptable && accuracy < lastAccuracy - 100) {
                updateUserLocation(position);
                lastAccuracy = accuracy;
                lastUpdateTime = Date.now();
                console.log(`   ✅ Better! (±${accuracy.toFixed(0)}m)\n`);
            } else if (updateCount === 1 && accuracy <= 5000) {
                updateUserLocation(position);
                lastAccuracy = accuracy;
                lastUpdateTime = Date.now();
                console.log(`   ✅ Initial update (±${(accuracy/1000).toFixed(1)}km)\n`);
            } else if (timeSinceLastUpdate > 30000 && accuracy < lastAccuracy * 1.5) {
                updateUserLocation(position);
                lastAccuracy = accuracy;
                lastUpdateTime = Date.now();
                console.log(`   ✅ Periodic refresh (±${accuracy.toFixed(0)}m)\n`);
            } else {
                console.log(`   ⏭️ Skipped (current best: ±${lastAccuracy.toFixed(0)}m)\n`);
            }
        },
        (error) => {
            console.warn(`⚠️ Tracking error: ${error.message}`);
        },
        {
            enableHighAccuracy: true,
            timeout: 30000,
            maximumAge: 5000
        }
    );
}

function updateUserLocation(position) {
    let lat = position.coords.latitude;
    let lng = position.coords.longitude;
    const accuracy = position.coords.accuracy;

    console.log(`📍 Updating map marker...`);

    // Apply light smoothing for better stability
    if (accuracy <= 300) {
        const smoothed = smoothPosition(lat, lng, accuracy);
        lat = smoothed.lat;
        lng = smoothed.lng;
    }

    lastKnownPosition = { lat, lng };

    if (userLocationMarker) {
        userLocationMarker.setLatLng([lat, lng]);

        const popupContent = `
            <div style="text-align: center; padding: 5px;">
                <div style="background: linear-gradient(135deg, #2196F3, #1976D2); color: white; padding: 8px 12px; border-radius: 8px 8px 0 0; margin: -9px -9px 8px -9px;">
                    <strong style="font-size: 14px;">📍 Your Location</strong>
                </div>
                <div style="font-size: 12px; color: #333;">
                    <strong>Coordinates:</strong><br>
                    ${lat.toFixed(6)}, ${lng.toFixed(6)}<br>
                    <small style="color: #666;">Accuracy: ±${Math.round(accuracy)}m</small>
                </div>
            </div>
        `;
        userLocationMarker.getPopup().setContent(popupContent);
    } else {
        const userIcon = L.divIcon({
            className: 'user-location-marker',
            html: `
                <div style="position: relative; width: 60px; height: 60px;">
                    <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); background: rgba(33, 150, 243, 0.25); width: 56px; height: 56px; border-radius: 50%; z-index: 1;"></div>
                    <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 56px; height: 56px; border-radius: 50%; border: 3px solid #2196F3; opacity: 0.6; animation: userPulse 2.5s ease-in-out infinite; z-index: 2;"></div>
                    <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); background: #2196F3; width: 26px; height: 26px; border-radius: 50%; border: 5px solid white; box-shadow: 0 0 0 2px rgba(33, 150, 243, 0.3), 0 0 20px rgba(33, 150, 243, 0.6), 0 4px 10px rgba(0,0,0,0.3); z-index: 3;"></div>
                </div>
                <style>
                    @keyframes userPulse {
                        0% {
                            transform: translate(-50%, -50%) scale(1);
                            opacity: 0.7;
                        }
                        50% {
                            transform: translate(-50%, -50%) scale(1.35);
                            opacity: 0.25;
                        }
                        100% {
                            transform: translate(-50%, -50%) scale(1);
                            opacity: 0.7;
                        }
                    }
                </style>
            `,
            iconSize: [60, 60],
            iconAnchor: [30, 30]
        });

        userLocationMarker = L.marker([lat, lng], { icon: userIcon }).addTo(map);

        const popupContent = `
            <div style="text-align: center; padding: 5px;">
                <div style="background: linear-gradient(135deg, #2196F3, #1976D2); color: white; padding: 8px 12px; border-radius: 8px 8px 0 0; margin: -9px -9px 8px -9px;">
                    <strong style="font-size: 14px;">📍 Your Location</strong>
                </div>
                <div style="font-size: 12px; color: #333;">
                    <strong>Coordinates:</strong><br>
                    ${lat.toFixed(6)}, ${lng.toFixed(6)}<br>
                    <small style="color: #666;">Accuracy: ±${Math.round(accuracy)}m</small>
                </div>
            </div>
        `;
        userLocationMarker.bindPopup(popupContent);
    }

    const maxRadius = 300;
    const minRadius = 30;
    let displayRadius = accuracy;

    if (accuracy > maxRadius) {
        displayRadius = maxRadius;
    } else if (accuracy < minRadius) {
        displayRadius = minRadius;
    }

    if (userLocationAccuracyCircle) {
        userLocationAccuracyCircle.setRadius(displayRadius);
        userLocationAccuracyCircle.setLatLng([lat, lng]);
    } else {
        userLocationAccuracyCircle = L.circle([lat, lng], {
            radius: displayRadius,
            color: '#2196F3',
            fillColor: '#2196F3',
            fillOpacity: 0.15,
            weight: 2,
            opacity: 0.6,
            dashArray: '8, 4'
        }).addTo(map);
    }

    displayLocationInfo(lat, lng, accuracy);
}

function handleLocationError(error) {
    console.error('\n❌ LOCATION ERROR HANDLER CALLED');
    console.error(`   Code: ${error.code}`);
    console.error(`   Message: ${error.message}`);

    let errorMessage = 'Unable to retrieve your location';
    let errorType = 'error';

    switch(error.code) {
        case 1:
            errorMessage = 'Location access denied. Please enable location permissions in your browser.';
            errorType = 'warning';
            console.error(`   → PERMISSION_DENIED: User blocked location access`);
            break;
        case 2:
            errorMessage = 'Location information unavailable. Check network connection.';
            errorType = 'warning';
            console.error(`   → POSITION_UNAVAILABLE: Network or GPS not available`);
            break;
        case 3:
            errorMessage = 'Location request timed out. Trying again...';
            errorType = 'warning';
            console.error(`   → TIMEOUT: Browser could not get location in time`);
            break;
        default:
            console.error(`   → UNKNOWN ERROR CODE: ${error.code}`);
    }

    if (typeof showToast === 'function') {
        showToast(errorMessage, errorType);
    }
}

function displayLocationInfo(lat, lng, accuracy) {
    const infoDiv = document.getElementById('location-info');
    if (infoDiv) {
        infoDiv.innerHTML = `
            <div style="background: white; color: #333; padding: 10px; border-radius: 8px; margin-bottom: 10px; border: 1px solid #e0e0e0;">
                <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" style="width: 20px; height: 20px; color: #2ecc71;">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                    </svg>
                    <strong style="font-size: 0.95rem; color: #333;">Your Location</strong>
                </div>
                <div id="location-address" style="font-size: 0.85rem; color: #666; margin-bottom: 8px;">
                    <div style="display: flex; align-items: center; gap: 5px;">
                        <div style="width: 16px; height: 16px; border: 2px solid #2ecc71; border-top-color: transparent; border-radius: 50%; animation: spin 1s linear infinite;"></div>
                        <span>Getting location name...</span>
                    </div>
                </div>
                <div style="font-size: 0.75rem; color: #999; border-top: 1px solid #e0e0e0; padding-top: 6px;">
                    <div>${lat.toFixed(6)}, ${lng.toFixed(6)}</div>
                    <div style="background: #f5f5f5; color: #666; padding: 3px 6px; border-radius: 4px; display: inline-block; margin-top: 4px;">
                        Accuracy: ±${Math.round(accuracy)}m
                    </div>
                </div>
            </div>
            <style>
                @keyframes spin {
                    to { transform: rotate(360deg); }
                }
            </style>
        `;

        debouncedReverseGeocode(lat, lng);
    }
}

function debouncedReverseGeocode(lat, lng) {
    if (geocodeTimeout) {
        clearTimeout(geocodeTimeout);
    }

    if (lastGeocodedPosition) {
        const distance = map.distance(
            [lastGeocodedPosition.lat, lastGeocodedPosition.lng],
            [lat, lng]
        );

        if (distance < 50) {
            return;
        }
    }

    geocodeTimeout = setTimeout(() => {
        reverseGeocode(lat, lng);
        lastGeocodedPosition = { lat, lng };
    }, 1000);
}

async function reverseGeocode(lat, lng) {
    try {
        lastGeocodedPosition = { lat, lng };

        console.log(`🌍 Geocoding: ${lat.toFixed(7)}, ${lng.toFixed(7)}`);

        const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1&accept-language=id`;

        const response = await fetch(url, {
            headers: {
                'Accept': 'application/json',
                'User-Agent': 'Greenesia-App/1.0'
            }
        });

        if (!response.ok) throw new Error('Geocoding failed');

        const data = await response.json();

        const detectedCity = data.address.city || data.address.town || data.address.municipality || 'N/A';
        console.log(`   → ${detectedCity}`);

        const addressDiv = document.getElementById('location-address');

        if (addressDiv && data.address) {
            const address = data.address;
            let locationParts = [];

            if (address.village || address.suburb || address.hamlet) {
                locationParts.push(address.village || address.suburb || address.hamlet);
            } else if (address.neighbourhood) {
                locationParts.push(address.neighbourhood);
            }

            if (address.city_district || address.county) {
                const kecamatan = address.city_district || address.county;
                if (!locationParts.includes(kecamatan)) {
                    locationParts.push(kecamatan);
                }
            }

            if (address.city || address.town || address.municipality) {
                locationParts.push(address.city || address.town || address.municipality);
            }

            if (address.state && address.state !== 'Indonesia') {
                locationParts.push(address.state);
            }

            const locationName = locationParts.length > 0
                ? locationParts.join(', ')
                : 'Your Location';

            addressDiv.innerHTML = `
                <div style="font-weight: 600; margin-bottom: 4px; font-size: 0.9rem;">
                    📍 ${locationName}
                </div>
                ${address.country ? `<div style="opacity: 0.9; font-size: 0.8rem;">${address.country}</div>` : ''}
            `;
        }
    } catch (error) {
        console.error('Reverse geocoding error:', error);
        const addressDiv = document.getElementById('location-address');
        if (addressDiv) {
            addressDiv.innerHTML = `
                <div style="opacity: 0.9; font-size: 0.85rem;">
                    📍 Location detected
                </div>
            `;
        }
    }
}

function stopLocationTracking() {
    if (watchId !== null) {
        navigator.geolocation.clearWatch(watchId);
        watchId = null;
    }
    if (userLocationMarker) {
        map.removeLayer(userLocationMarker);
        userLocationMarker = null;
    }
    if (userLocationAccuracyCircle) {
        map.removeLayer(userLocationAccuracyCircle);
        userLocationAccuracyCircle = null;
    }
}

function initRecenterButton() {
    const recenterBtn = document.getElementById('recenter-btn');
    if (recenterBtn) {
        recenterBtn.addEventListener('click', recenterToUserLocation);
        recenterBtn.disabled = true;

        const checkLocationInterval = setInterval(() => {
            if (lastKnownPosition) {
                recenterBtn.disabled = false;
                clearInterval(checkLocationInterval);
            }
        }, 500);
    }
}

function recenterToUserLocation() {
    if (lastKnownPosition) {
        map.setView([lastKnownPosition.lat, lastKnownPosition.lng], 14, {
            animate: true,
            duration: 0.8
        });
    }
}
