async function main() {
  
  const response = await fetch("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_week.geojson");
  const data = await response.json();
  console.log(data);

  const response1 = await fetch("https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json")
  const data1 = await response1.json()
  console.log(data1)


  // Earthquake Layer
  function markerSize(magnitude) {
      return Math.sqrt(magnitude * 10);
    }
  
  function markerColor(depth) {
      return depth <= 0 ? '#fef0d9' :
             depth <= 20 ? '#fdd49e' :
             depth <= 50 ? '#fdbb84' :
             depth <= 100 ? '#fc8d59' :
             depth <= 200 ? '#ef6548' :
             depth <= 400 ? '#d7301f' :
             depth > 600 ? '#000000' :
                           '#990000' ;       
  }

  function createMarkers(dataset) {
    //Define arrays to hold earthquake markers
    var earthquakeMarkers = []
    for (var i = 0; i < dataset.features.length; i++) {
        let coordinates = dataset.features[i].geometry.coordinates
        earthquakeMarkers.push(
            L.circleMarker([coordinates[1], coordinates[0]], {
            fillOpacity: 1,
            color: 'black',
            weight: 1,
            fillColor: markerColor(coordinates[2]),
            radius: markerSize(dataset.features[i].properties.mag)
            }).bindPopup(`<h3>${dataset.features[i].properties.title}</h3> <h4>Magnitude: ${dataset.features[i].properties.mag}</h4>`)
        )
    }
    return earthquakeMarkers
  } 
  
  var earthquakeMarkers = createMarkers(data);
  var earthquakeLayer = L.layerGroup(earthquakeMarkers)

// Building tectonic plate layer
function createBorders(dataset) {
  //Define arrays to hold tectonic plate polygons
  var tectonicBorders = []
  for (var i = 0; i < dataset.features.length; i++) {
    var line = [dataset.features[i].geometry.coordinates]
    tectonicBorders.push(L.polyline(line,
      {
        color: "gold"
      }))
  }
  return tectonicBorders
}

var tectonicBorders = createBorders(data1)
var tectonicPlateLayer = L.layerGroup(tectonicBorders)

// Building different tile layers
  var street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });
  
  var OpenTopoMap = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
    maxZoom: 17,
    attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
  });

  var Esri_WorldImagery = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
	attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
});


  // defining base and overlay maps

  var baseMaps = {
      "Street Map": street,
      "Topography": OpenTopoMap,
      "World Image": Esri_WorldImagery
    };
  
    var overlayMaps = {
      "Earthquakes": earthquakeLayer,
      "Tectonic Plates": tectonicPlateLayer
    };
  

  var myMap = L.map("map", {
      center: [40.73, -74.0059],
      zoom: 3,
      layers: [street, earthquakeLayer, tectonicPlateLayer]
  });

  // Creating earthquake legend
  var legend = L.control({position: 'bottomright'});

  legend.onAdd = function () {
  
      var div = L.DomUtil.create('div', 'info legend'),
          grades = [0, 20, 50, 100, 200, 400, 600],
          labels = [];
  
      // loop through our depth intervals and generate a label with a colored square for each interval
      for (var i = 0; i < grades.length; i++) {
          div.innerHTML +=
              '<i style="background:' + markerColor(grades[i] + 1) + '"></i> ' +
              grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
      }
  
      return div;
  };

  legend.addTo(myMap);

  L.control.layers(baseMaps, overlayMaps, {
      collapsed: false
    }).addTo(myMap);
}

main();