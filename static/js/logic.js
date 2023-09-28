// Creating the map object
let myMap = L.map("map", {
    center: [28.425402930286264, 0.4296523247558295],
    zoom: 2
  });
  
  // Adding the tile layer
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(myMap);
  
  // Load the GeoJSON data.
  let geoData = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";
  
  // Get the data with d3.
  d3.json(geoData).then(function(data) {
  
    function getValue(x) {
        return x > 90 ? "#F06A6A" :
               x > 70 ? "#F0A76A" :
               x > 50 ? "#F3B94C" :
               x > 30 ? "#F3DB4C" :
               x > 10 ? "#E1F34C" :
                   "#B6F34C";
    }
    
    function style(feature) {
        return {
            fillColor: getValue(feature.geometry.coordinates[2]),
            stroke: true,
            color: "#000",
            weight: 0.5,
            fillOpacity: 0.8,
            radius:feature.properties.mag*3
        };
    }
    
     L.geoJson(data, {
        pointToLayer: function (feature, latlng) {
            return L.circleMarker(latlng, style(feature));
        },

  
      // Binding a popup to each layer
      onEachFeature: function(feature, layer) {
        layer.bindPopup("<strong>" + feature.properties.place + "</strong><br /><br />magnitude: " +
          feature.properties.mag + "<br /><br />depth: " + feature.geometry.coordinates[2]);
      }
    }).addTo(myMap);

    /// Set up the legend.
    let legend = L.control({ position: "bottomright" });
    legend.onAdd = function() {
      let div = L.DomUtil.create("div", "info legend");
      
      let colors = ['#B6F34C', '#E1F34C', '#F3DB4C', '#F3B94C', '#F0A76A','#F06A6A'];
      let labels = [-10,10,30,50,70,90];

      for (let i = 0; i < labels.length; i++) {
        div.innerHTML += "<i style='background: " + colors[i] + "'></i> "
          + labels[i] + (labels[i + 1] ? "&ndash;" + labels[i + 1] + "<br>" : "+");
      }
      return div;
    };
  
    // Adding the legend to the map
    legend.addTo(myMap); 
   
  });