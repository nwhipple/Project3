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

////Map Data
  // // Create the tile layer that will be the background of our map.
  //   let streetmap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  //     attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  //   });

  //   // Initialize all the LayerGroups that we'll use.
  //   let layers = {
  //   Operating: new L.LayerGroup(),
  //   Mothballed: new L.LayerGroup(),
  //   PreConstruction: new L.LayerGroup(),
  //   Construction: new L.LayerGroup(),
  //   Retired: new L.LayerGroup(),
  //   Announced: new L.LayerGroup(),
  //   Cancelled: new L.LayerGroup()
  //   };

  //   // Create the map with our layers.
  //   let map = L.map("map-id", {
  //   center: [40.73, -74.0059],
  //   zoom: 1,
  //   layers: [
  //     layers.COMING_SOON,
  //     layers.EMPTY,
  //     layers.LOW,
  //     layers.NORMAL,
  //     layers.OUT_OF_ORDER
  //   ]
  //   });

  //   // Add our "streetmap" tile layer to the map.
  //   streetmap.addTo(map);

  //   // Create an overlays object to add to the layer control.
  //   let overlays = {
  //   "Operating": layers.OPERATING,
  //   "Mothballed": layers.MOTHBALLED,
  //   "Pre Construction": layers.PRECONSTRUCTION,
  //   "Construction": layers.CONSTRUCTION,
  //   "Retired": layers.RETIRED,
  //   "Announced": layers.ANNOUNCED,
  //   "Cancelled": layers.CANCELLED
  //   };

  //   // Create a control for our layers, and add our overlays to it.
  //   L.control.layers(null, overlays).addTo(map);

  //   // Create a legend to display information about our map.
  //   let info = L.control({
  //   position: "bottomright"
  //   });

  //   // When the layer control is added, insert a div with the class of "legend".
  //   info.onAdd = function() {
  //   let div = L.DomUtil.create("div", "legend");
  //   return div;
  //   };
  //   // Add the info legend to the map.
  //   info.addTo(map);

  //   // Initialize an object that contains icons for each layer group.
  //   let icons = {
  //   OPERATING: L.ExtraMarkers.icon({
  //     markerColor: "yellow",
  //     shape: "star"
  //   }),
  //   MOTHBALLED: L.ExtraMarkers.icon({
  //     markerColor: "red",
  //     shape: "circle"
  //   }),
  //   PRECONSTRUCTION: L.ExtraMarkers.icon({
  //     markerColor: "blue-dark",
  //     shape: "penta"
  //   }),
  //   CONSTRUCTION: L.ExtraMarkers.icon({
  //     markerColor: "orange",
  //     shape: "circle"
  //   }),
  //   RETIRED: L.ExtraMarkers.icon({
  //     markerColor: "orange",
  //     shape: "circle"
  //   }),
  //   ANNOUNCED: L.ExtraMarkers.icon({
  //     markerColor: "orange",
  //     shape: "circle"
  //   }),
  //   CANCELLED: L.ExtraMarkers.icon({
  //     markerColor: "green",
  //     shape: "circle"
  //   })
  //   };

  //   // Perform an API call to the Citi Bike station information endpoint.
  //   d3.json("https://gbfs.citibikenyc.com/gbfs/en/station_information.json").then(function(infoRes) {

  //   // When the first API call completes, perform another call to the Citi Bike station status endpoint.
  //   d3.json("https://gbfs.citibikenyc.com/gbfs/en/station_status.json").then(function(statusRes) {
  //     let updatedAt = infoRes.last_updated;
  //     let stationStatus = statusRes.data.stations;
  //     let stationInfo = infoRes.data.stations;

  //     // Create an object to keep the number of markers in each layer.
  //     let stationCount = {
  //       OPERATING: 0,
  //       MOTHBALLED: 0,
  //       PRECONSTRUCTION: 0,
  //       CONSTRUCTION: 0,
  //       RETIRED: 0,
  //       ANNOUNCED: 0,
  //       CANCELLED: 0,
  //     };

  //     // Initialize stationStatusCode, which will be used as a key to access the appropriate layers, icons, and station count for the layer group.
  //     let stationStatusCode;

  //     // Loop through the stations (they're the same size and have partially matching data).
  //     for (let i = 0; i < stationInfo.length; i++) {

  //       // Create a new station object with properties of both station objects.
  //       let station = Object.assign({}, stationInfo[i], stationStatus[i]);
  //       // If a station is listed but not installed, it's coming soon.
  //       if (!station.is_installed) {
  //         stationStatusCode = "COMING_SOON";
  //       }
  //       // If a station has no available bikes, it's empty.
  //       else if (!station.num_bikes_available) {
  //         stationStatusCode = "EMPTY";
  //       }
  //       // If a station is installed but isn't renting, it's out of order.
  //       else if (station.is_installed && !station.is_renting) {
  //         stationStatusCode = "OUT_OF_ORDER";
  //       }
  //       // If a station has less than five bikes, it's status is low.
  //       else if (station.num_bikes_available < 5) {
  //         stationStatusCode = "LOW";
  //       }
  //       // Otherwise, the station is normal.
  //       else {
  //         stationStatusCode = "NORMAL";
  //       }

  //       // Update the station count.
  //       stationCount[stationStatusCode]++;
  //       // Create a new marker with the appropriate icon and coordinates.
  //       let newMarker = L.marker([station.lat, station.lon], {
  //         icon: icons[stationStatusCode]
  //       });

  //       // Add the new marker to the appropriate layer.
  //       newMarker.addTo(layers[stationStatusCode]);

  //       // Bind a popup to the marker that will  display on being clicked. This will be rendered as HTML.
  //       newMarker.bindPopup(station.name + "<br> Capacity: " + station.capacity + "<br>" + station.num_bikes_available + " Bikes Available");
  //     }

  //     // Call the updateLegend function, which will update the legend!
  //     updateLegend(updatedAt, stationCount);
  //   });
  //   });

  //   // Update the legend's innerHTML with the last updated time and station count.
  //   function updateLegend(time, stationCount) {
  //   document.querySelector(".legend").innerHTML = [
  //     "<p>Updated: " + moment.unix(time).format("h:mm:ss A") + "</p>",
  //     "<p class='out-of-order'>Out of Order Stations: " + stationCount.OUT_OF_ORDER + "</p>",
  //     "<p class='coming-soon'>Stations Coming Soon: " + stationCount.COMING_SOON + "</p>",
  //     "<p class='empty'>Empty Stations: " + stationCount.EMPTY + "</p>",
  //     "<p class='low'>Low Stations: " + stationCount.LOW + "</p>",
  //     "<p class='healthy'>Healthy Stations: " + stationCount.NORMAL + "</p>"
  //   ].join("");
  //   }


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
