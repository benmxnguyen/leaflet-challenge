async function main() {
    const response = await fetch("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_week.geojson");
    const data = await response.json();
    console.log(data);

    function markerSize(magnitude) {
        return magnitude * 1000;
      }
    
    function markerColor(depth) {
        return depth <= 100 ? '#fef0d9' :
               depth <= 200 ? '#fdd49e' :
               depth <= 300 ? '#fdbb84' :
               depth <= 400 ? '#fc8d59' :
               depth <= 500 ? '#ef6548' :
               depth <= 600 ? '#d7301f' :
               depth > 600 ? '#990000' :
                             '#000000' ;       
    }

    function createMarkers(dataset) {
        //Define arrays to hold earthquake markers
        var earthquakeMarkers = []
        for (var i = 0; i < dataset.features.length; i++) {
            let coordinates = dataset.features[i].geometry.coordinates
            earthquakeMarkers.push(
                L.circle([coordinates[1], coordinates[0]], {
                stroke: false,
                fillOpacity: 0.75,
                color: markerColor(coordinates[2]),
                fillColor: markerColor(coordinates[2]),
                radius: markerSize(dataset.features[i].properties.mag)
                }).bindPopup(`<h6>${dataset.features[i].properties.title}</h6>`)
            )
        }
        return earthquakeMarkers
    }

    // var basic = L.tileLayer('https://api.maptiler.com/maps/basic/{z}/{x}/{y}.png', {
    //     attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    //   })
    var street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      });
    
    var earthquakeMarkers = createMarkers(data);
    console.log(earthquakeMarkers);

    var earthquakeLayer = L.layerGroup(earthquakeMarkers)

    var baseMaps = {
        "Street Map": street
      };
    
      var overlayMaps = {
        "Earthquakes": earthquakeLayer
      };
    

    var myMap = L.map("map", {
        center: [40.73, -74.0059],
        zoom: 5,
        layers: [street, earthquakeLayer]
    });
    
    L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
      }).addTo(myMap);
}

main();