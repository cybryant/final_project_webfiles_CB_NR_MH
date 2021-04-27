/* MainCounty.js for map of GeoJSON data for Change in Urbanization, 1960-2017; Author:Cherie Bryant, 2021*/

//Instantiate the Leaflet map
function createMap(){
    //create the map
	var map = L.map('map', {
		center: [37.8, -96],
		zoom: 4
	});

    // access mapbox tiles
    L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>', 
        maxZoom: 18, 
        id: 'mapbox/light-v9', 
        tileSize: 512, 
        zoomOffset: -1, 
        accessToken: 'pk.eyJ1IjoiY3licnlhbnQiLCJhIjoiY2p2c3JpOThkMndrcjQ0cGh2Y2Z4bXRkaiJ9.DQF9Z_FoHTZXs-NJdw5vag'
    }).addTo(map);

    //call getData function
    getData(map);
}//End createMap();


//Retrieve the GeoJSON data and place it on the map
function getData(map){
    //load the data
    $.ajax("data/merge_counties_5indicators.geojson", {
        dataType: "json",
        success: function(data){
 
            function getColor(d) {
                return  d > 40 ? '#800026' :
                        d > 35  ? '#BD0026' :
                        d > 30  ? '#E31A1C' :
                        d > 25  ? '#FC4E2A' :
                        d > 20   ? '#FD8D3C' :
                        d > 15   ? '#FEB24C' :
                        d > 10   ? '#FED976' :
                        '#FFEDA0';
            } //end getColor()

            //style the choropleth units
            function style(feature) {
                return {
                    fillColor: getColor(Number(feature.properties.PCT_OBESE_ADULTS17)),
                    weight: 2,
                    opacity: 1,
                    color: 'white',
                    strokecolor: "#000000",
                    dashArray: '3',
                    fillOpacity: 0.7
                };
            } //end style()
            
            var geojson;
            
            //create highlight of state/county when hover
            function highlightFeature(e) {
                var layer = e.target;

                layer.setStyle({
                    weight: 5,
                    color: '#666',
                    dashArray: '',
                    fillOpacity: 0.7
                });

                if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
                    layer.bringToFront();
                }
                
                info.update(layer.feature.properties);
            }
            
            //reset style after move past state/county
            function resetHighlight(e) {
                geojson.resetStyle(e.target);
                info.update();
            }
            
            function onEachFeature(feature, layer) {
                layer.on({
                    mouseover: highlightFeature,
                    mouseout: resetHighlight,
                    click: zoomToFeature
                });
            }
            
            geojson = L.geoJson(data, {
                style: style,
                onEachFeature: onEachFeature
            }).addTo(map);
            
            function zoomToFeature(e) {
                map.fitBounds(e.target.getBounds());
            }
            
            //add pop-ups on hover
            var info = L.control();

            info.onAdd = function (map) {
                this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
                this.update();
                return this._div;
            };

            // method that we will use to update the control based on feature properties passed
            info.update = function (props) {
                this._div.innerHTML = '<h4>Obese Adults</h4>' +  (props ?
                    '<b>' + props.County + '</b><br />' + props.PCT_OBESE_ADULTS17 + '%'
                    : 'Hover over a county to see percentage');
            };

            info.addTo(map);
            
            //create a legend
            var legend = L.control({position: 'bottomright'});
            legend.onAdd = function (map) {
                var div = L.DomUtil.create('div', 'info legend'),
                    grades = [0, 10, 15, 20, 25, 30, 35, 40],
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
            
            //make button trigger colorUnits
            //$("#lowIncome").click(colorUnits);
            
            
            //make button trigger colorUnits
            //$("#lowIncome").click(L.geoJson(data, {style: style})).addTo(map);  
            
        }
    });
    //call function to create overlays
    createOverlays(map);
    

}//end getData()


$(document).ready(createMap);

/*
//FINAL MAP VARIABLES ARE ALL PERCENTAGES, SO SCALE COULD BE THE SAME FOR ALL, DEPENDING ON HOW THE DATA IS SPREAD OUT
//create a color scale for choropleth units 
function getColor(d) {
    return  d > 250 ? '#800026' :
            d > 200  ? '#BD0026' :
            d > 150  ? '#E31A1C' :
            d > 125  ? '#FC4E2A' :
            d > 100   ? '#FD8D3C' :
            d > 50   ? '#FEB24C' :
            d > 25   ? '#FED976' :
            '#FFEDA0';
} //end getColor()
*/

/*
//style the lowIncome choropleth units
function style_lowIncome(feature) {
    return {
        fillColor: getColor(Number(feature.properties.lowIncome)),
        weight: 2,
        opacity: 1,
        color: 'white',
        strokecolor: "#000000",
        dashArray: '3',
        fillOpacity: 0.7
    };
} //end style_lowIncome()
*/

/*
//style the choropleth units
function style(feature) {
    return {
        fillColor: getColor(Number(feature.properties.var3)),
        weight: 2,
        opacity: 1,
        color: 'white',
        strokecolor: "#000000",
        dashArray: '3',
        fillOpacity: 0.7
    };
} //end style_carFree()


//shade lowIncome choropleth units
//$("#lowIncome").click(function (data, map, style){
//    L.geoJson(data, {style: style_lowIncome}).addTo(map);  
//})

//shade carFree choropleth units
function colorUnits(data, map, style){
    L.geoJson(data, {style: style}).addTo(map);  
}//End colorUnits()
*/




//// EXAMPLE CODE FOR OVERLAYS
//Create overlay for most and least urbanized
function createOverlays(map){
    //create 'increasing' icon
    var upIcon = L.icon({
        iconUrl: 'img/green_pin.png',
        iconSize:     [25, 40], // size of the icon
        iconAnchor:   [12, 40], // point of the icon which will correspond to marker's location
        popupAnchor:  [20, -40] // point from which the popup should open relative to the iconAnchor
    });

    //variables for top ten urbanized countries
    var gabon               = L.marker([-0.803689, 11.609444], {icon: upIcon}).bindPopup('Gabon: 71.58%'),
        oman                = L.marker([21.512583, 55.923255], {icon: upIcon}).bindPopup('Oman: 67.16%'),
        botswana            = L.marker([-22.328474, 24.684866], {icon: upIcon}).bindPopup('Botswana: 65.64%'),
        saoTome             = L.marker([0.18636, 6.613081], {icon: upIcon}).bindPopup('Sao Tome and Principe: 55.90%'),
        angola	            = L.marker([-11.202692,17.873887], {icon: upIcon}).bindPopup('Angola:	54.40%'),
        southKorea	        = L.marker([35.907757, 127.766922], {icon: upIcon}).bindPopup('South Korea: 53.79%'),
        libya	            = L.marker([26.3351, 17.228331], {icon: upIcon}).bindPopup('Libya:	52.49%'),
        saudiArabia         = L.marker([23.885942, 45.079162], {icon: upIcon}).bindPopup('Saudi Arabia:	52.37%'),
        dominicanRepublic	= L.marker([18.735693, -70.162651], {icon: upIcon}).bindPopup('Dominican Republic: 50.09%'),
        puertoRico	        = L.marker([18.220833, -66.590149], {icon: upIcon}).bindPopup('Puerto Rico: 49.04%');
    
    //create 'decreasing' icon
    var downIcon = L.icon({
        iconUrl: 'img/red_pin.png',
        iconSize:     [25, 40], // size of the icon
        iconAnchor:   [12, 40], // point of the icon which will correspond to marker's location
        popupAnchor:  [20, -40] // point from which the popup should open relative to the iconAnchor
    });    
    
    //variables for negative percentage change urbanized countries
    var samoa           = L.marker([-13.759029, -172.104629], {icon: downIcon}).bindPopup('Samoa: -0.47%'),
        guyana          = L.marker([4.860416, -58.93018], {icon: downIcon}).bindPopup('Guyana: -2.47%'),
        isleOfMan       = L.marker([54.236107, -4.548056], {icon: downIcon}).bindPopup('Isle of Man: -2.67%'),
        stLucia         = L.marker([13.909444, -60.978893], {icon: downIcon}).bindPopup('St. Lucia: -2.85%'),
        barbados	    = L.marker([13.193887, -59.543198], {icon: downIcon}).bindPopup('Barbados:	-5.62%'),
        liechtenstein	= L.marker([47.166, 9.555373], {icon: downIcon}).bindPopup('Liechtenstein: -6.12%'),
        tajikistan	    = L.marker([38.861034, 71.276093], {icon: downIcon}).bindPopup('Tajikistan: -6.19%'),
        austria         = L.marker([47.516231, 14.550072], {icon: downIcon}).bindPopup('Austria: -6.63%'),
        aruba	        = L.marker([12.52111, -69.968338], {icon: downIcon}).bindPopup('Aruba: -7.48%'),
        belize	        = L.marker([17.189877, -88.49765], {icon: downIcon}).bindPopup('Belize: - 8.43%'),
        antiguaBarbuda	= L.marker([17.060816, -61.796428], {icon: downIcon}).bindPopup('Antigua and Barbuda: -14.94%');    

        //create layer group to hold the top ten countries
        var top10 = L.layerGroup([gabon, oman, botswana, saoTome, angola, southKorea, libya, saudiArabia, dominicanRepublic, puertoRico]);
    
        //create layer group to hold the negative countries
        var negativeUrban = L.layerGroup([samoa, guyana, isleOfMan, stLucia, barbados, liechtenstein, tajikistan, austria, aruba, belize, antiguaBarbuda]);

        //create overlay controls
        var overlayMaps = {
            "Top 10 Most Urbanized Countries, 1960 to 2017": top10,
            "Countries with Negative Urbanization, 1960 to 2017": negativeUrban
        };

        L.control.layers(null, overlayMaps).addTo(map);
}//End createOverlays();
