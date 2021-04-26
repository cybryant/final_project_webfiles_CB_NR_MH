/* Main.js for map of GeoJSON data for Change in Urbanization, 1960-2017; Author:Cherie Bryant, 2021*/

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

  var styles = {
    "win1" : { 'fillColor': '#8073AC', 'color': '#000000', 'weight': 1.5, 'fillOpacity': 0.65 },
    "win2" : { 'fillColor': '#E08214', 'color': '#000000', 'weight': 1.5, 'fillOpacity': 0.65 },
    "tie" : { 'fillColor': '#F7F7F7', 'color': '#000000', 'weight': 1.5, 'fillOpacity': 0.65 },
    "none" : { 'fillColor': '#888888', 'color': '#000000', 'weight': 1.5, 'fillOpacity': 0.65 }
  };
  var onEachFeature = function(feature, layer) {
    if (feature.properties) {
      var data = feature.properties;
      var winnerR, winnerD;
      if (parseInt(data.cruz, 10) > parseInt(data.dewhurst, 10)) {
        winnerR = "Cruz";
      } else if (parseInt(data.cruz, 10) < parseInt(data.dewhurst, 10)) {
        winnerR = "Dewhurst";
      } else {
        winnerR = '';
      }
      if (parseInt(data.sadler, 10) > parseInt(data.yarbrough, 10)) {
        winnerD = "Sadler";
      } else if (parseInt(data.sadler, 10) < parseInt(data.yarbrough, 10)) {
        winnerD = "Yarbrough";
      } else {
        winnerD = '';
      }
      layer.on('mouseover', function (_) {
        layer.setStyle({ weight: 3 });
        var popup = $('<div\>', {
          id: 'popup',
          css: {
            position: 'absolute',
            top: '10px',
            right: '10px',
            zIndex: 1002,
            backgroundColor: 'white',
            padding: '8px',
            border: "1px solid #444444"
          }
        });
        var body = $('<div\>', {
          html: '<div class="popupHeader">' + data.county + ' County</div>' +
          '<div class="popupTableHeader">Republican Party Results</div>' +
          '<table class="data basic popupTable">' +
          '<thead>' +
          '<tr><th>Candidate</th><th>Votes</th><th>Percent of Vote</th></tr></thead>' +
          '<tbody>' +
          '<tr class="' + ((winnerR === 'Cruz') ? 'victor' : '') + '"><td class="tableLabel">Ted Cruz</td><td>' + addCommas(data.cruz) + '</td><td>' + percentBuilder(data.cruz_perc) + '</td></tr>' +
          '<tr class="' + ((winnerR === 'Dewhurst') ? 'victor' : '') + '"><td class="tableLabel">David Dewhurst</td><td>' + addCommas(data.dewhurst) + '</td><td>' + percentBuilder(data.dewhurst_perc) + '</td></tr>' +
          '</tbody></table>' +
          '<div class="popupTableHeader">Democratic Party Results</div>' +
          '<table class="data basic popupTable">' +
          '<thead>' +
          '<tr><th>Candidate</th><th>Votes</th><th>Percent of Vote</th></tr></thead>' +
          '<tbody>' +
          '<tr class="' + ((winnerD === 'Sadler') ? 'victor' : '') + '"><td class="tableLabel">Paul Sadler</td><td>' + addCommas(data.sadler) + '</td><td>' + percentBuilder(data.sadler_perc) + '</td></tr>' +
          '<tr class="' + ((winnerD === 'Yarbrough') ? 'victor' : '') + '"><td class="tableLabel">Grady Yarbrough</td><td>' + addCommas(data.yarbrough) + '</td><td>' + percentBuilder(data.yarbrough_perc) + '</td></tr>' +
          '</tbody></table>',
          css: { width: '250px' }
        }).appendTo(popup);
        popup.appendTo("#mapCanvas");
      });
      layer.on("mouseout", function (e) {
        layer.setStyle({ weight: 1.5 });
        $("#popup").remove();
      });
    }
  };
  var repGeoLayer = L.geoJson(countyvote, {
    onEachFeature: onEachFeature,
    style: function(feature) {
      var data = feature.properties;
      if ((data.dewhurst + data.cruz) === "00") {
        return styles.none;
      } else if (data.dewhurst_perc === data.cruz_perc) {
        return styles.tie;
      }  else if (data.dewhurst_perc > 50) {
        return styles.win1;
      } else if (data.dewhurst_perc < 50) {
        return styles.win2;
      }
    }
  });
  var demGeoLayer = L.geoJson(countyvote, {
    onEachFeature: onEachFeature,
    style: function(feature) {
      var data = feature.properties;
      if ((data.yarbrough + data.sadler) === "00") {
        return styles.none;
      } else if (data.yarbrough_perc === data.sadler_perc) {
        return styles.tie;
      }  else if (data.yarbrough_perc > 50) {
        return styles.win1;
      } else if (data.yarbrough_perc < 50) {
        return styles.win2;
      }
    }
  });
  map.addLayer(repGeoLayer);
  $('#mapChange').change( function() {
    var val = this.value;
    if (val === "rep") {
      map.removeLayer(demGeoLayer).addLayer(repGeoLayer);
      $('#legendText1').text('Cruz Victory');
      $('#legendText2').text('Dewhurst Victory');
    } else {
      map.removeLayer(repGeoLayer).addLayer(demGeoLayer);
      $('#legendText1').text('Sadler Victory');
      $('#legendText2').text('Yarbrough Victory');
    }
  });
  $('#staticMapHover').appendTo('#mapCanvas');
  $('#legendBox').appendTo('#mapContainer');



/*
//Retrieve the GeoJSON data and place it on the map
function getData(map){
    //load the data
    $.ajax("data/states_testdata.geojson", {
        dataType: "json",
        success: function(data){
            //shade choropleth units
            //colorUnits(data, map, style);
            //call function to create buttons
            //buttonControls(data);
            //create an attributes array
            var years_array = processData(data);
            //call function to create proportional symbols
            //createPropSymbols(response, map, years_array);
            //call function to create slider
            //createSequenceControls(map, years_array);
            //call function to create temporal legend
            //createLegend(map, years_array);
            
            //console.log(data);
            
            //var lowIncomeLayer = L.geoJson(data);
            //console.log(lowIncome);            
  
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

            //style the lowIncome choropleth units
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
            } //end style_lowIncome()
            
            /*
            //shade carFree choropleth units
            function colorUnits(data, map, style){
                L.geoJson(data, {style: style}).addTo(map);  
            }//End colorUnits()
            */
            
            //L.geoJson(data, {style: style}).addTo(map);
/*           
        
            var geojson;
                        
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
                this._div.innerHTML = '<h4>Percentage of Variable 3</h4>' +  (props ?
                    '<b>' + props.name + '</b><br />' + props.var3 + ' people / mi<sup>2</sup>'
                    : 'Hover over a state');
            };

            info.addTo(map);


            
            var legend = L.control({position: 'bottomright'});

            legend.onAdd = function (map) {

                var div = L.DomUtil.create('div', 'info legend'),
                    grades = [0, 25, 50, 100, 125, 100, 200, 250],
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

//function to create button controls
//function buttonControls(data){


/*
////OLD CODE
//Build an array of data for each year to pass to sequence controls
function processData(data){
    //empty array to hold attributes
    var years_array = [];
    
    //properties of the first feature in the dataset
    var properties = data.features[0].properties;
    
    //push each attribute name into years_array
    for (var attribute in properties){
        //only take attributes with population values
        if (attribute.indexOf("Perc") > -1){
            years_array.push(attribute); 
        } 
    }
    
    //check result
    //console.log(years_array);
    
    return years_array;
}//End processData();


//Add circle markers for point features to the map
function createPropSymbols(data, map, years_array){
    //create a Leaflet GeoJSON layer and add it to the map
    L.geoJson(data, {
        pointToLayer: function(feature, latlng){
            return pointToLayer(feature, latlng, years_array);
        }
    }).addTo(map);  
}//End createPropSymbols();
    

//Convert markers to circle markers
function pointToLayer(feature, latlng, years_array){
     //assign the current attribute based on the first index of years_array
    var attribute = years_array[0];   
    
    //check
    //console.log(attribute);

    //create marker options
    var options = {
        fillColor: "#ff7800",
        color: "#000",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8
    };  
    
    //for each feature, determine the value for the selected attribute
    var attValue = Number(feature.properties[attribute]);
    
    //give each feature's circle marker a radius based on its attribute value
    options.radius = calcPropRadius(attValue);    
    
    //create circle marker layer
    var layer = L.circleMarker(latlng, options);  

    //build popup content string to identify the country
    var popupContent = "<p><b>Country: </b>" + feature.properties.Entity + "</p>";
    
    //add formatted popup string for percent urban
    var year = attribute.split("P")[0]; 
    popupContent += "<p><b>Urban Population in " + year + ": </b>" + feature.properties[attribute] + "%</p>";
    
    //bind the popup to the circle marker
    layer.bindPopup(popupContent, {
        offset: new L.Point(0,-options.radius)
    });
    
    //event listeners to open popup on hover
    layer.on({
        mouseover: function(){
            this.openPopup();
        },
        mouseout: function(){
            this.closePopup();
        }
    });
    
    //return the circle marker to the L/geoJson pointToLayer option
    return layer;
}//End pointToLayer();


//Calculate the radius of each proportional symbol
function calcPropRadius(attValue) {
    //scale factor to adjust symbol size evenlyS
    var scaleFactor = 10;
    //area based on attribute value and scale factor
    var area = attValue * scaleFactor;
    //radius calculated based on area
    var radius = Math.sqrt(area/Math.PI); 
    return radius;
}//End calcPropRadius();


//Create sequence controls (original)
function createSequenceControls(map, years_array){    
    //create range input element (slider)
    $('#sequence-controls').append('<input class="range-slider" type="range">');
    
    //set slider attributes
    $('.range-slider').attr({
      max: 6,
      min: 0,
      value: 0,
      step: 1
    });
    
    //add reverse & skip buttons
    $('#sequence-controls').append('<button class="skip" id="reverse">Reverse</button>');
    $('#sequence-controls').append('<button class="skip" id="forward">Skip</button>');
    
        //WORK ON BUTTONS - ADD SVG INSTEAD OF TEXT; CORRECT HORIZONTAL ALIGNMENT
        //replace button content with images
        $('#reverse').html('<img src="img/backward_noun_Skip_559097b.png">');
        $('#forward').html('<img src="img/forward_noun_Skip_559098b.png">');  
        
    //click listener for buttons
    $('.skip').click(function(){
        //get the old index value
        var index = $('.range-slider').val();
        
        //increment or decrement depending on button clicked
        if ($(this).attr('id') == 'forward'){
            index++;
            //if past the last attribute, wrap around to first attribute
            index = index > 6 ? 0 : index;
        } else if ($(this).attr('id') == 'reverse'){
            index--;
            //if past the first attribut, wrap around to the last attribute
            index = index < 0 ? 6 : index;
        }
        
        //update slider
        $('.range-slider').val(index); 

        //pass new attibute to update symbols
        updatePropSymbols(map, years_array[index]);
        
        /*var year = attribute.split("P")[0]; 
        updateLegend(map, year)*/
//    });
 
/*

    //input listener for slider
    $('.range-slider').on('input', function(){
        //get the new index value
        var index = $(this).val();
            
        //pass new attibute to update symbols
        updatePropSymbols(map, years_array[index]);     
    });   
}//end createSequenceControls();*/

/*
//Resize proportional symbols according to new attribute values
function updatePropSymbols(map, attribute){
    map.eachLayer(function(layer){
        if (layer.feature && layer.feature.properties[attribute]){

            //access feature properties
            var props = layer.feature.properties;

            //update each feature's radius based on new attribute values
            var radius = calcPropRadius(props[attribute]);
            layer.setRadius(radius);
            
            //add city to popup content string
            var popupContent = "<p><b>Country:</b> " + props.Entity + "</p>";

            //add formatted attribute to panel content string
            var year = attribute.split("P")[0]; 
            popupContent += "<p><b>Urban Population in " + year + ": </b>" + props[attribute] + "%</p>";

            //replace the layer popup
            layer.bindPopup(popupContent, {offset: new L.Point(0,-radius)
            });
            
            updateLegend(map, attribute)   
        }
    }); 
}//End updatePropSymbols();


//Create the legend
function createLegend(map, years_array){
    var LegendControl = L.Control.extend({
        options: {
            position: 'bottomleft'
        },
        
        onAdd: function(map) {
            //create the control container with a particular class name
            var container = L.DomUtil.create('div', 'legend-control-container');
            
            //add temporal legend div to container
            $(container).append('<div id="temporal-legend">')
                
            //start attribute legend svg string
            var svg = '<svg id="attribute-legend" width="160px" height="90px">';
            
            //array of circle names to base loop on
            var circles = {
                max: 15,
                mean: 30,
                min: 45
            };

            //loop to add each circle and text to svg string
            for (var circle in circles){
                //circle string
                svg += '<circle class="legend-circle" id="' + circle + '" fill="#F47821" fill-opacity="0.8" stroke="#000000" cx="60"/>';
    
                //text string
                svg += '<text id="' + circle + '-text" x="90" y="' + circles[circle] + '"></text>';
                
            };

            //close svg string
            svg += "</svg>";           
            
            //add atribute legend svg to container
            $(container).append(svg);
            
            return container;
        }
    });
    
    map.addControl(new LegendControl());
    
    //update the legend with the new year
    updateLegend(map, years_array[0]);
} //End createLegend();


//Update the legend with new attribute
function updateLegend(map, attribute){
    //create content for legend
    var year = attribute.split("P")[0];
    var content = "Percent Urban in " + year;
    
    //replace legend content
    $('#temporal-legend').html(content);

    //get the max, mean, and min values as an object
    var circleValues = getCircleValues(map, attribute);   

    for (var key in circleValues){
        //get the radius
        var radius = calcPropRadius(circleValues[key]);
        
        //assign the cy and r attributes
        $('#'+key).attr({
            cy: 45 - radius,
            r: radius
        });
        
        //add legend text
        $('#'+key+'-text').text(Math.round(circleValues[key]*100)/100 + "%");  
    };
}//End updateLegend();


//Calculate the max, mean, and min values for a given attribute
function getCircleValues(map, attribute){
    //start with min at highest possible and max at lowest possible number
    var min = Infinity,
        max = -Infinity;

    map.eachLayer(function(layer){
        //get the attribute value
        if (layer.feature){
            var attributeValue = Number(layer.feature.properties[attribute]);

            //test for min
            if (attributeValue < min){
                min = attributeValue;
            };

            //test for max
            if (attributeValue > max){
                max = attributeValue;
            };
        };
    });

    //set mean
    var mean = (max + min) / 2;

    //return values as an object
    return {
        max: max,
        mean: mean,
        min: min
    };
}//End getCircleValues();


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
*/