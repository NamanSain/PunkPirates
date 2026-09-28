document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize Map
    // Default coordinates: Water 7 (Venice-like coordinates for realism)
    let defaultLat = 45.4408;
    let defaultLng = 12.3155;
    
    const map = L.map('map', {
        zoomControl: false // We will move it to bottom right
    }).setView([defaultLat, defaultLng], 13);
    
    L.control.zoom({
        position: 'bottomright'
    }).addTo(map);

    // 2. Map Layers
    const streetLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
    });
    
    // Esri World Imagery for Satellite view
    const satelliteLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
    });

    // Add default layer
    streetLayer.addTo(map);

    // 3. Layer Toggle Logic
    const viewRadios = document.querySelectorAll('input[name="mapView"]');
    viewRadios.forEach(radio => {
        radio.addEventListener('change', (e) => {
            if (e.target.value === 'streets') {
                map.removeLayer(satelliteLayer);
                streetLayer.addTo(map);
            } else {
                map.removeLayer(streetLayer);
                satelliteLayer.addTo(map);
            }
        });
    });

    // 4. Handle URL Query Params for Search
    const urlParams = new URLSearchParams(window.location.search);
    const query = urlParams.get('q');
    const locationInput = document.getElementById('locationInput');
    
    if (query) {
        locationInput.value = query;
        performSearch(query);
    } else {
        loadMockData(); // Just load default Water 7 docks
    }

    // 5. Search Button Logic
    const searchBtn = document.getElementById('searchUpdateBtn');
    searchBtn.addEventListener('click', () => {
        const val = locationInput.value.trim();
        if (val) performSearch(val);
    });

    locationInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const val = locationInput.value.trim();
            if (val) performSearch(val);
        }
    });

    // 6. Mock Data & Search Function
    const mockDocks = [
        { id: 1, name: 'Galley-La Dock 1', desc: 'Premium repairs and mooring.', lat: 45.4408, lng: 12.3155, type: 'dock', price: '500,000 Berries' },
        { id: 2, name: 'Blue Station Dock', desc: 'Sea Train transit dock.', lat: 45.4380, lng: 12.3200, type: 'dock', price: '150,000 Berries' },
        { id: 3, name: 'Loguetown Harbor', desc: 'The town of the beginning and the end.', lat: 45.4500, lng: 12.3300, type: 'mooring', price: '50,000 Berries' }
    ];

    let markers = [];

    function performSearch(q) {
        const lowerQ = q.toLowerCase();
        
        // Very basic mock geocoding based on query
        if (lowerQ.includes('loguetown')) {
            map.flyTo([45.4500, 12.3300], 14);
        } else {
            map.flyTo([45.4408, 12.3155], 13);
        }

        renderResults(lowerQ);
    }

    function loadMockData() {
        renderResults("");
    }

    function renderResults(filterQuery) {
        const resultsList = document.getElementById('resultsList');
        const resultsMsg = document.getElementById('resultsMsg');
        
        // Clear existing markers
        markers.forEach(m => map.removeLayer(m));
        markers = [];
        resultsList.innerHTML = '';

        const filtered = mockDocks.filter(d => 
            d.name.toLowerCase().includes(filterQuery) || 
            d.desc.toLowerCase().includes(filterQuery) ||
            filterQuery === ""
        );

        if (filtered.length === 0) {
            resultsMsg.style.display = 'block';
            resultsMsg.innerHTML = '<strong>No Docks Found.</strong> Move the map, search, or adjust your filters to find berths.';
        } else {
            resultsMsg.style.display = 'none';
            
            filtered.forEach(dock => {
                // Add Marker
                const marker = L.marker([dock.lat, dock.lng]).addTo(map);
                marker.bindPopup(`<b>${dock.name}</b><br>${dock.price}`);
                markers.push(marker);

                // Add Card to List
                const card = document.createElement('div');
                card.className = 'dock-card';
                card.innerHTML = `
                    <img src="assets/crews.jpg" alt="${dock.name}" class="dock-card-img">
                    <div class="dock-card-info">
                        <h3>${dock.name}</h3>
                        <p>${dock.desc}</p>
                        <p style="margin-top:5px; font-weight:600; color: #d82a20;">${dock.price}</p>
                    </div>
                `;
                
                card.addEventListener('click', () => {
                    map.flyTo([dock.lat, dock.lng], 16);
                    marker.openPopup();
                });

                resultsList.appendChild(card);
            });
        }
    }
});
