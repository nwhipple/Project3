// First section on Nuclear Power Plants Dashboard
let reactorlist = "./reactorlist.geoJSON";
d3.json(reactorlist).then(function (data) {
  createFeatures(data.features);
});

function createFeatures(reactorMetaData) {
  function onEachFeature_func(feature, layer) {
    layer.bindPopup(`<h3>${feature.properties.place}</h3><hr><p>${feature.properties.mag}</p><p>${new Date(feature.properties.time)}</p>`);
  }
  function markerFunction(feature, latlng) {
    return L.circleMarker(latlng);
  }
  function reactorstatusColor(d) {
    return d=="announced" ? "cyan" :
      d=="planning" ? "magenta" :
      d=="pre-construction" ? "red" :
      d=="construction" ? "yellow" :
      d=="operating" ? "green" :
      d=="mothballed" ? "black" :
      d=="retired" ? "black" :
      d=="cancelled" ? "white" :
                        "#00441b";
  }
  function style(feature) {
    return {
      radius: feature.properties["Capacity (MW)"]/100,
      fillColor: reactorstatusColor(feature.properties.Status),
      color: "black",
      weight: 1,
      opacity: 1,
      fillOpacity: 0.8
    }
  }
  let reactorLocations = L.geoJSON(reactorMetaData, {
    onEachFeature: onEachFeature_func,
    pointToLayer: markerFunction, 
    style: style
  });
  createMap(reactorLocations);

//Add a legend
  var legend = L.control({position: 'bottomright'});

  legend.onAdd = function (map) {
  
      var div = L.DomUtil.create('div', 'info legend'),
          grades = [0, 10, 20, 50, 100, 200, 500, 1000],
          labels = [];
  
      // loop through our density intervals and generate a label with a colored square for each interval
      for (var i = 0; i < grades.length; i++) {
          div.innerHTML +=
              '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
              grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
      }
  
      return div;
  };
  
  legend.addTo(map);

}

function createMap(reactorspots) {

  // Create the base layers.
  let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  })

  // let topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
  //   attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
  // });

  // Create a baseMaps object.
  let baseMaps = {
    "Street Map": street,
    // "Topographic Map": topo
  };

  // Create an overlay object to hold our overlay.
  let overlayMaps = {
    Earthquakes: reactorspots
  };

  // Create our map, giving it the streetmap and earthquakes layers to display on load.
  let myMap = L.map("map", {
    center: [
      33.5731, 7.5898
    ],
    zoom: 2,
    layers: [street, 
      reactorspots
    ]
  });

  // Create a layer control.
  // Pass it our baseMaps and overlayMaps.
  // Add the layer control to the map.
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);
}



// Build the metadata panel
function buildMetadata(sample) {
  GlobalReactorList.then((data) => {

    // get the metadata field
    let metadatafield = data.Data

    //initializes the page with a default
    let idfield = metadatafield.filter(sampleobj=>sampleobj.GEMunitID==sample)
    let result = idfield[0]

    // Filter the metadata for the object with the desired sample number
      let PANEL = d3.select("#sample-metadata"); //This is where user selected country is passed through into PANEL
      PANEL.html("")
      for (key in result){
        PANEL.append("h6").text(`${key.toUpperCase()}: ${result[key]}`);
      };
});
}


//// Third Section on Average waste per kWh by source of energy
let title = 'Average Waste per kWh by source of energy, in pounds';

let Source = ["Coal", "Natural Gas", "Solar", "Hydropower", "Nuclear"];

let WasteAmount = [1850, 970, 32, 28, 0.007];

let trace1 = {
  x: Source,
  y: WasteAmount,
  type: 'bar'
};

let data = [trace1];

let layout = {
  title: title
};

Plotly.newPlot("plot", data, layout);


function buildScatter(selectedCountry) {

//// Second Section on Reactor Cost Data
let currentdata = reactorcostdata.find(d => d.country===selectedCountry);
console.log(currentdata)
let yearbuilt = currentdata.year;
let reactorcost = currentdata.cost;
// console.log(country_abbr);
console.log(yearbuilt);
console.log(reactorcost);
// let occ = reactorcostdata.cost;

// Build a Bubble Chart
let scattertrace = {
  x: yearbuilt,
  y: reactorcost,
  mode: "markers", // This specifies that the chart should be a scatter plot with markers.
};
let scatterdata = [scattertrace];
let scatterlayout = {
  title: "Cost per reactor in equivalent USD (2010$)/kW"
};

//     //  Render the Scatter Chart
Plotly.newPlot("scatter", scatterdata, scatterlayout);
}
// Function to run on page load
function init() {
  // countries.then((countries) => {
    // console.log(data.names);
    // Get the names field
    // let countrylist = countries
    // Use d3 to select the dropdown with id of `#selDataset`
    let countrydropdownMenu = d3.select("#selCountry")

    // Use the list of sample names to populate the select options
    // Hint: Inside a loop, you will need to use d3 to append a new
    // option for each sample name.
    for (let i = 0; i < countries.length; i++) {
      const name = countries[i];
      countrydropdownMenu.append("option").property("value", name).text(name)
    }

    // Get the first sample from the list
    let firstcountry = countries[0];

    // Build charts and metadata panel with the first sample
    countryChanged(firstcountry)
  // });
}

//Function for event listener
function countryChanged(newCountry) {
  // console.log(newCountry)
  // Build charts and metadata panel each time a new sample is selected
  buildScatter(newCountry)
}
// Initialize the dashboard
init();



///Part 1.5 Incidents
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

var map = L.map('incidents').setView([20, 0], 2); // Adjust zoom level for a broader view

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