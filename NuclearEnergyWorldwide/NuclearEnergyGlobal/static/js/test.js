
// country container geojson data from https://geojson-maps.kyd.au/
const geoJsonData = "static/data/customgeo.json";
let countriesLayer;
let globalData; // Global variable for country data
let globalGeoJsonData;  // Global variable to store the GeoJSON data
let startYear = 2022;
let countriesWithReactors = [];



// d3.json("../../../saved_finished/country_data_nuclear_countries.json").then(function(loadedData) {
//     globalData = loadedData;
//     updateLayers(startYear);
//     loadDataFromSlider(startYear);
//     })

//Initialize a map object using the Dylanmap id
let dylanMap = L.map("dylanMap", {
    center: [50, -60],
    zoom: 2
});


// Providing layers to the map and an overlay to add to layer control


let layer3Percent = {
    NO_REACTORS: new L.LayerGroup(),
    ZERO_TEN: new L.LayerGroup(),
    TEN_TWENTYFIVE: new L.LayerGroup(),
    TWENTYFIVE_FORTYFIVE: new L.LayerGroup(),
    FORTYFIVE_SEVENTY: new L.LayerGroup(),
    SEVENTY_HUNDRED: new L.LayerGroup()
        // MOST: new L.LayerGroup()}.addTo(dylanMap),
    };
// let layer2EnergyConsumption = new L.LayerGroup();
// let layer1NuclearGeneration = new L.LayerGroup();

// let layers = [layer1NuclearGeneration, layer2EnergyConsumption, layer3Percent];

let overlays = {
    // "Nuclear Generation (TWh)": layer1NuclearGeneration,
    // "Energy Consumption (EJ)": layer2EnergyConsumption,
    "Nuclear Power accounts for 0% of power": layer3Percent.NO_REACTORS,
    "Nuclear Power: 0% - 10%": layer3Percent.ZERO_TEN,
    "Nuclear Power: 10% - 25%": layer3Percent.TEN_TWENTYFIVE,
    "Nuclear Power: 25% - 45%": layer3Percent.TWENTYFIVE_FORTYFIVE,
    "Nuclear Power: 45% - 70%": layer3Percent.FORTYFIVE_SEVENTY,
    "Nuclear Power: 70% - 100%": layer3Percent.SEVENTY_HUNDRED
};
    // "Nuclear Power: Highest Percentage": layer3Percent.MOST


// Functions for Coloring
//From dictionary 3 in json
function getColorNuclearPercent(output) {
    var color = "#bfbdbc";
    //need to include the "MOST"
    if (output>=.70 && output<2) color = "#20ff03";
    else if (output>=.45 && output<.70) color = "#9eff30";
    else if (output>=.25 && output<.45) color = "#ffe033";
    else if (output>=.10 && output<.25) color = "#ff954a";
    else if (output>=.0 && output<.10) color = "#ff452c";
    return color;
  };

//   //From dictionary 2 in json
// function getColorEnergyConsumption(output) {
//     if (output > 90) color =  "darkred";
//     else if (output > 20) color = "red";
//     else if (output > 5) color =  "orange";
//     else if (output > 0) color = "yellow";
//     else color =  "yellow";
//     return color;
// }

// //From dictionary 1 in json
// function getColorNuclearGeneration(output) {
//     if (output > 300) color = "darkgreen";
//     else if (output > 100) color =  "green";
//     else if (output > 50) color =  "lightgreen";
//     else if (output > 0) color = "lightyellow";
//     else color =  "light grey";
//     return color;
// }









function onEachFeature(feature, layer) {
    // if (feature.geometry.type == "polygon") {
        // let middlePoint = calculateMiddle(feature.geometry.coordinates[0]);
        // createMarker(middlePoint, feature.properties.name);
    // } else if (feature.geometry.type === "MultiPolygon") {
    //     let middlePoint = calculateMiddle(feature.geometry.coordinates[0][0]);
    //     createMarker(middlePoint, feature.properties.name);
    // }
    // layer.setStyle({
    //     fillColor: 'light grey',
    //     weight: 1,
    //     color: 'grey',
    //     fillOpacity: 0.7,
    //     opacity: 1
    // });
    layer.on({
        mouseover: function(event) {
            var layer = event.target;
            layer.setStyle({
                weight: 5,
                color: "white",
                fillColor: "white",
                fillOpacity: .3
            });

    },
    mouseout: function(event) {
        // var layer = event.target;
        // layer.setStyle({
        //     fillColor: 'light grey',
        //     weight: 1,
        //     color: 'grey',
        //     fillOpacity: 0.7,
        //     opacity: 1
        // });
        countriesLayer.resetStyle(event.target);
    }
    });
};


function calculateMiddle(coords, type) {
    let firstCoordinates = [];
    if (type === "Polygon") {
        firstCoordinates = coords[0];
    }
    else if (type === "MultiPolygon") {
        firstCoordinates = coords[0][0];
    }
    let middle = [0, 0];
    let count = 0;
    firstCoordinates.forEach(coord => {
        middle[0] += coord[0]; // this one is longitude
        middle[1] += coord[1]; // this is latitudes
        count ++;
    });
    middle[0] /= count;
    middle[1] /= count;
    return middle;
}

function addMarkers(countriesData) {
    countryMarkers.clearLayers();
    // Iterate through the countries from the 40 relevent countries in dataset
    countriesData.forEach(country => {
        let marker = L.marker([country.Middlepoint[1], country.Middlepoint[0]], {
            title: country.Country
        }).bindPopup(`<b>Country:</b> ${country.Country} <br> <br>
                <b>Nuclear Output (TWh):</b> ${country["Nuclear Output (TWh)"]} <br>
                <b>Total Energy Consumption:</b> ${country["Total Energy Consumption"]} <br>
                <b>Percent of Energy from Nuclear:</b> ${country["Percent of Energy from Nuclear"].toFixed(5)}`);
            marker.addTo(countryMarkers);
            }
    );
}


function updateLayers(year) {
    Object.values(layer3Percent).forEach(layer => layer.clearLayers());

    globalGeoJsonData.features.forEach(feature => {
        const country = feature.properties.name;
        if (globalData[country] && globalData[country]["percent_consumption_from_nuclear"]) {        
            const percentNuclear = globalData[country]["percent_consumption_from_nuclear"][year];

        
        if (percentNuclear !== undefined) {
            const color = getColorNuclearPercent(percentNuclear);
            const countryLayer = L.geoJSON(feature, {
                style: {
                    fillColor: color,
                    weight: 1,
                    opacity: 1,
                    color: 'light grey',
                    fillOpacity: 0.7
                }
                // onEachFeature: onEachFeature
            });
            if (percentNuclear > .70) layer3Percent.SEVENTY_HUNDRED.addLayer(countryLayer);
            else if (percentNuclear > .45 && percentNuclear <= .70) layer3Percent.FORTYFIVE_SEVENTY.addLayer(countryLayer);
            else if (percentNuclear > .25 && percentNuclear <= .45) layer3Percent.TWENTYFIVE_FORTYFIVE.addLayer(countryLayer);
            else if (percentNuclear > .10 && percentNuclear <= .25) layer3Percent.TEN_TWENTYFIVE.addLayer(countryLayer);
            else if (percentNuclear > .0 && percentNuclear <= .10) layer3Percent.ZERO_TEN.addLayer(countryLayer);
            else if (percentNuclear === 0) layer3Percent.NO_REACTORS.addLayer(countryLayer);
        }
    }});
}








fetch(geoJsonData).then(response => 
    response.json()).then(json => {
        globalGeoJsonData = json;
        countriesLayer = L.geoJSON(json, {
            onEachFeature: onEachFeature,
            style: {
                color: "light grey",
                opacity: 1,
                fillOpacity: .25
            }
    }).addTo(dylanMap);

        return d3.json("../../../saved_finished/country_data_nuclear_countries.json");
    }).then(data => {
        globalData = data;


    updateLayers(startYear);
    loadDataFromSlider(startYear);
})

        


var slider = L.control.slider(function(value) {
    loadDataFromSlider(value);
    console.log("User Selected:", value);
}, {
    size: '400px',
    position: 'bottomright',
    min: 1965,
    max: 2022,
    step: 1,
    id: 'yearSlider',
    value: 2022, //intital load
    collapsed: false,
    title: 'Select Year',
    logo: 'Y',
    orientation:'horizontal',
    showValue: true,
    increment: true, //show increment/decrement buttons next to it
    //syncSlider: if set true, the value synchronizes slider's position, default is false.
});


// Adding the tile layer
let streetMap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(dylanMap);


// Create a baseMaps object to hold the streetmap layer.
let baseMaps = {
"World Map": streetMap
};

// Create an overlayMaps object to hold the Nuclear energy and consumption layer, and percent.
let countryMarkers = L.layerGroup().addTo(dylanMap);
let nuclearOutputLayer = L.layerGroup().addTo(dylanMap);
let energyConsumptionLayer = L.layerGroup().addTo(dylanMap);
let percentEnergyLayer = L.layerGroup().addTo(dylanMap);



let overlayMaps = {
    "Nuclear Output (TWh)": nuclearOutputLayer,
    "Energy Consumption (EJ)": energyConsumptionLayer,
    "Percent of Energy from Nuclear": percentEnergyLayer
}; //Is there a way to just pick one?




L.control.layers(baseMaps, overlays).addTo(dylanMap);



slider.addTo(dylanMap);







// Parsing and Iterating over the data
// Within a function to use a slider to choose the year




function loadDataFromSlider(year) {
    if (!globalGeoJsonData) {
        console.error("GeoJSON data is not loaded yet");
        return;
    }
    console.log("Making map for year: " + year);
    let grabPath = "../../../saved_finished/country_data_nuclear_countries.json";
    d3.json(grabPath).then(function(data) {
    console.log(data);  
    countriesWithReactors = [];
    // countryMarkers.clearLayers();

    Object.keys(data).forEach(country => {
        // countriesWithReactors.push(country);
        //grabbing shortcuts for each dictionary in the json
        const nuclearData = data[country]["nuclear_output_(TWh)"];
        const consumptionData = data[country]["energy_consumption_(EJ)"];
        const percentFromNuclear = data[country]["percent_consumption_from_nuclear"];


    //Here i might want to define the MOST to be used later
    //might have to add another row (country) to hold the name of the country with highest value for each year
        const geoFeatures = globalGeoJsonData.features.find(c => c.properties.name === country);
        if (geoFeatures) {
            var countryInfo = {
                "Country": country,
                "Nuclear Output (TWh)": nuclearData[year], //If i want this in EJ (or petraJoules i can convert here. *  0.00036 (EJ) or * 0.36 (PJ))
                "Total Energy Consumption": consumptionData[year],
                "Percent of Energy from Nuclear": percentFromNuclear[year],
                // color: getColorNuclearPercent(percentFromNuclear[year])
                "Middlepoint": calculateMiddle(geoFeatures.geometry.coordinates, geoFeatures.geometry.type)
            };
            if (country === "France") {
                countryInfo.Middlepoint = [2.2137, 46.2276]; 
            }
            countriesWithReactors.push(countryInfo);
        } else {
            console.log("No matching country found in GeoJSON for: " + country);
            }
        

       
        console.log(countryInfo);

        });
        addMarkers(countriesWithReactors);
        updateLayers(year);
    })};








// loadDataFromSlider(startYear) //, () => {
//     console.log(countriesWithReactors.length);
//     addMarkers(countriesWithReactors).addTo(dylanMap);
// }
;
