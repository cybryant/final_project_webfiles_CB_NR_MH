/* MAP3_STATE_main.js for Geog575 Final Project, MAP 3 - STATES - Dollar Chains; April 2021*/

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
    $.ajax("data/states_indicators.geojson", {
        dataType: "json",
        success: function(data){
 
            function getColor(d) {
                return  d > 35  ? '#800026' :
                        d > 30  ? '#BD0026' :
                        d > 25  ? '#E31A1C' :
                        d > 15  ? '#FC4E2A' :
                        d > 10  ? '#FD8D3C' :
                        d > 5   ? '#FED976' :
                        '#FFEDA0';
            } //end getColor()
            
            
            //create a legend
            var legend = L.control({position: 'bottomright'});
            legend.onAdd = function (map) {
                var div = L.DomUtil.create('div', 'info legend'),
                    grades = [0, 5, 10, 15, 25, 30, 35],
                    labels = [];                
                
                // loop through our intervals and generate a label with a colored square for each interval
                for (var i = 0; i < grades.length; i++) {
                    div.innerHTML +=
                        '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
                        grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
                }
                return div;
            };
            
            legend.addTo(map);
            
            //the info control
            var info = L.control();
            info.onAdd = function (map) {
                this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
                //this.update(); //this line removed from Leaflet tutorial example
                return this._div;
            };
            
            info.addTo(map); //this line added to the Leaflet tutorial example


//BUTTON FUNCTION CONTROLS   
            
            // setup OBESITY button click event
            $("#obese").click(function() {
                // remove the 'active CSS class from all buttons
                $('.btn-group button').removeClass('active');
                
                 var attribute = ["Obese"];               

                // add 'active' class to the clicked button
                $(this).addClass('active');

            
                //style the choropleth units
                function style(feature) {
                    return {
                        fillColor: getColor(Number(feature.properties[attribute])),
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
                
                //buttonOperator(map, data, attribute); //NOT WORKING YET
                
                // method that we will use to update the control based on feature properties passed
                info.update = function (props, measure) {
                    this._div.innerHTML = '<h4>Obese Adults</h4>' +  (props ?
                        '<b>' + props.NAME + '</b><br />' + props[attribute] + '% of adults'
                        : 'Hover over a state to see percentage of total'
                                                                     );
                };
                info.update()
            });            
            
            
            // setup LOW-INCOME button click event
            $("#lowIncome").click(function() {
                // remove the 'active CSS class from all buttons
                $('.btn-group button').removeClass('active');
                
                var attribute = ["Low-Income Households"]

                // add 'active' class to the clicked button
                $(this).addClass('active');

                //style the choropleth units
                function style(feature) {
                    return {
                        fillColor: getColor(Number(feature.properties[attribute])),
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

                // method that we will use to update the control based on feature properties passed
                info.update = function (props, measure) {

                    this._div.innerHTML = '<h4>Low-Income Households</h4>' +  (props ?
                        '<b>' + props.NAME + '</b><br />' + props[attribute] + '% of households'
                        : 'Hover over a state to see percentage of total');
                };
                info.update()

            });
            
            // setup CAR-FREE button click event
            $("#carFree").click(function() {
                // remove the 'active CSS class from all buttons
                $('.btn-group button').removeClass('active');
                
                var attribute = ["Car-Free Households"]; 

                // add 'active' class to the clicked button
                $(this).addClass('active');

                //style the choropleth units
                function style(feature) {
                    return {
                        fillColor: getColor(Number(feature.properties[attribute])),
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

                // method that we will use to update the control based on feature properties passed
                info.update = function (props, measure) {

                    this._div.innerHTML = '<h4>Car-Free Households</h4>' +  (props ?
                        '<b>' + props.NAME + '</b><br />' + props[attribute] + '% of households'
                        : 'Hover over a state to see percentage of total');
                };
                info.update()

            });            
 
            // setup DIABETES button click event
            $("#diabetes").click(function() {
                // remove the 'active CSS class from all buttons
                $('.btn-group button').removeClass('active');
                
                var attribute = ["Diabetes"]; 

                // add 'active' class to the clicked button
                $(this).addClass('active');

                //style the choropleth units
                function style(feature) {
                    return {
                        fillColor: getColor(Number(feature.properties[attribute])),
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

                // method that we will use to update the control based on feature properties passed
                info.update = function (props, measure) {

                    this._div.innerHTML = '<h4>Diabetic Adults</h4>' +  (props ?
                        '<b>' + props.NAME + '</b><br />' + props[attribute] + '% of adults'
                        : 'Hover over a state to see percentage of adults');
                };
                info.update()

            });            

            // setup COMBINED SCORE button click event 
            $("#combinedScore").click(function() {
                // remove the 'active CSS class from all buttons
                $('.btn-group button').removeClass('active');
                
                var attribute = ["Combined Score"]; 

                // add 'active' class to the clicked button
                $(this).addClass('active');

                //style the choropleth units
                function style(feature) {
                    return {
                        fillColor: getColor(Number(feature.properties[attribute])),
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

                // method that we will use to update the control based on feature properties passed
                info.update = function (props, measure) {

                    this._div.innerHTML = '<h4>Combined Poverty Score</h4>' +  (props ?
                        '<b>' + props.NAME + '</b><br />' + props[attribute] + '% of population'
                        : 'Hover over a state to see percentage');
                };
                info.update()

            });
            
            
            // trigger the button click for the default view
            $("#obese").trigger('click');
        }            
    });
    
    //call function to create Marker Clusters
    createMarkerClusters(map);
    
    //call function to create overlays - NOT ACTIVE
    //createOverlays(map);
    
    //call function to define button operations - NOT FULLY WORKING
    //function buttonOperator(map, data, attribute)

}//end getData()

$(document).ready(createMap);


//creates Marker Clusters
function createMarkerClusters(map){
		var markers = L.markerClusterGroup();
 		
		for (var i = 0; i < allStorePoints.length; i++) {
			var a = allStorePoints[i];
			var marker = L.marker(new L.LatLng(a[0], a[1]));
			markers.addLayer(marker);
		}

		map.addLayer(markers);
} //end createMarkerClusters


//function to remove duplication of button actions - NEED TO FIGURE OUT HOW TO ADAPT 'e.target' TO WORK OUTSIDE OF SPECIFIC BUTTON FUNCTIONS
/*function buttonOperator(map, data, attribute){
    // add 'active' class to the clicked button
    $(this).addClass('active');  
    
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
            fillColor: getColor(Number(feature.properties[attribute])),
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
} //end buttonOperator()
*/

//Create overlays for dollar store chain - WORKS BUT NOT USING. ALSO NEED TO RESOLVE STATE/COUNTY FILL COVERING MARKERS ON RESTYLE AFTER HOVER EVENT
/*function createOverlays(map){
    
    //create Dollar Tree layer
    var dollarTreeData = 'data/all_DollarTree.geojson';    
    var dollarTreeStores = L.geoJson(null, {
            pointToLayer: function(feature, latlng) {		
				return L.circleMarker(latlng, {
				radius: 4,
				opacity: .5,
                fillColor: 'orange',    
				fillOpacity: 0.8
				});
            },	
    });
    
    //create Dollar General layer
    var dollarGenData = 'data/all_DollarGeneral.geojson';    
    var dollarGenStores = L.geoJson(null, {
            pointToLayer: function(feature, latlng) {		
				return L.circleMarker(latlng, {
				radius: 4,
				opacity: .5,
                fillColor: 'purple',    
				fillOpacity: 0.8
				});
            },	
    });
    
    //create Family Dollar layer
    var famDollarData = 'data/all_FamilyDollar.geojson';    
    var famDollarStores = L.geoJson(null, {
            pointToLayer: function(feature, latlng) {		
				return L.circleMarker(latlng, {
				radius: 4,
				opacity: .5,
                fillColor: 'green',    
				fillOpacity: 0.8
				});
            },	
    });
    
    $.getJSON(dollarTreeData, function(dataDT) {
        return dollarTreeStores.addData(dataDT);
	});	
    
     $.getJSON(dollarGenData, function(dataDG) {
        return dollarGenStores.addData(dataDG);
	});
     
    $.getJSON(famDollarData, function(dataFD) {
        return famDollarStores.addData(dataFD);
	});	
    
    var overlays = {
        "Dollar Tree": dollarTreeStores,
        "Dollar General": dollarGenStores,
        "Family Dollar": famDollarStores
    };
    
    L.control.layers(null, overlays).addTo(map);
	//});   
} end createOverlays
*/
    