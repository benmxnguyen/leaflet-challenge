async function main() {
    const response = await fetch("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_week.geojson");
    const data = await response.json();
    console.log(data);

    function markerSize(magnitude) {
        return Math.sqrt(magnitude) * 50;
      }

    function createMarkers(dataset) {
        //Define arrays to hold earthquake markers
        var earthquakeMarkers = []
        for (var i = 0; i < dataset.length; i++) {
            let coordinates = dataset[i].geometry.coordinates
            earthquakeMarkers.push(
                L.circle([coordinates[1], coordinates[0]], {
                stroke: false,
                fillOpacity: 0.75,
                color: "purple",
                fillColor: "purple",
                radius: markerSize(dataset[i].properties.mag)
                }).bindPopup(`<h6>${dataset[i].properties.title}</h6>`)
            )
        }
        return earthquakeMarkers
    }
}

main();