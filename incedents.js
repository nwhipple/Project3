// Define a custom styling function based on the INES level
function getColor(inesLevel) {
    var color = inesLevel >= 7 ? '#800026' :
                inesLevel >= 6 ? '#BD0026' :
                inesLevel >= 5 ? '#E31A1C' :
                inesLevel >= 4 ? '#FC4E2A' :
                inesLevel >= 3 ? '#FD8D3C' :
                inesLevel >= 2 ? '#FEB24C' :
                inesLevel >= 1 ? '#FED976' :
                                 '#FFEDA0';
    
    // Darken the color based on the INES level
    var darkenedColor = darkenColor(color, inesLevel);

    return darkenedColor;
}

// Function to darken a color based on the INES level
function darkenColor(color, inesLevel) {
    // Calculate the darkness factor based on the INES level (adjust as needed)
    var darknessFactor = 10 * (7 - inesLevel);

    // Parse the color into RGB components
    var r = parseInt(color.slice(1, 3), 16);
    var g = parseInt(color.slice(3, 5), 16);
    var b = parseInt(color.slice(5, 7), 16);

    // Darken the color by reducing the RGB values
    r = Math.max(0, r - darknessFactor);
    g = Math.max(0, g - darknessFactor);
    b = Math.max(0, b - darknessFactor);

    // Convert the darkened RGB values back to a hex color
    var darkenedColor = '#' + r.toString(16).padStart(2, '0') + g.toString(16).padStart(2, '0') + b.toString(16).padStart(2, '0');

    return darkenedColor;
}

var map = L.map('map').setView([20, 0], 2); // Adjust zoom level for a broader view

// Add the title "Nuclear Incidents by Country" using Leaflet's Control class
var titleControl = L.Control.extend({
    onAdd: function(map) {
        var div = L.DomUtil.create('div', 'map-title');
        div.innerHTML = '<h3>Nuclear Incidents by Country</h3>';
        return div;
    }
});

// Add the custom control to the map
map.addControl(new titleControl());

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
}).addTo(map);

d3.json("nuclearincidents.json").then(data => {
    console.log(data);

    var geojsonFeatures = {
        "type": "FeatureCollection",
        "features": []
    };

    data.forEach(function(incident) {
        if (incident.Latitude && incident.Longitude) {
            var feature = {
                "type": "Feature",
                "properties": {
                    "Year": incident.Year,
                    "Incident": incident.Incident,
                    "INES level": incident['INES level'],
                    "Country": incident.Country,
                    "IAEA description": incident['IAEA description']
                },
                "geometry": {
                    "type": "Point",
                    "coordinates": [incident.Longitude, incident.Latitude]
                }
            };
            geojsonFeatures.features.push(feature);
        }
    });

    L.geoJSON(geojsonFeatures, {
        pointToLayer: function(feature, latlng) {
            return L.circleMarker(latlng, {
                radius: getRadius(feature.properties['INES level']),
                fillColor: getColor(feature.properties['INES level']),
                color: "#000",
                weight: 1,
                opacity: 1,
                fillOpacity: 0.8
            });
        },
        onEachFeature: function(feature, layer) {
            layer.bindPopup(`<b>${feature.properties.Incident}</b><br>${feature.properties.Country}<br>INES Level: ${feature.properties['INES level']}<br><br>${feature.properties.Year}`);
        }
    }).addTo(map);
})
.catch(error => console.error('Error loading JSON file:', error));

// Function to map the INES level to a specific radius value for the circle marker
function getRadius(inesLevel) {
    return inesLevel >= 7 ? 20 :
           inesLevel >= 6 ? 16 :
           inesLevel >= 5 ? 12 : 10; // Default value if none of the conditions are met
}