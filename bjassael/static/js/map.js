

/* MAPS */ 
var map = L.mapbox.map('map-canvas', 'examples.map-i86l3621')
    .setView([40.718217, -73.998284], 4);

var map2 = L.mapbox.map('map-canvas-2', 'examples.map-i86l3621')
    .setView([40.718217, -73.998284], 4);


/* MAKERS FIRST TAB */ 
function create_marker (checkins){
	$.getJSON('https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=ffa6f25a9340c2561515e67d1f169bef&accuracy=16&lat='+checkins.latitude+'&lon='+checkins.longitude+'&per_page=11&page=1&format=json&nojsoncallback=1', function(data1) {
		$.getJSON('https://api.flickr.com/services/rest/?method=flickr.photos.getSizes&api_key=ffa6f25a9340c2561515e67d1f169bef&photo_id='+data1.photos.photo[Math.floor((Math.random() * 10) + 1)].id +'&format=json&nojsoncallback=1', function(data2) {
			var source = data2.sizes.size[1].source
			var marker = new L.Marker(new L.LatLng(checkins.latitude, checkins.longitude))
				.bindPopup('<image class="photo" src="'+source+'">');
				map.addLayer(marker);
		});
	});
}

$.getJSON('test2.json', function(data) {
  for (var i in data.checkins) {
		  create_marker(data.checkins[i]);
    };
});


/* MARKERS SECOND TAB */
var geojson1 = [];
var geojson2 = [];
// Archivo utilizado en local debido a problemas con allowed host en browser diferentes a safari
// $.getJSON('http://doge.ing.puc.cl/iic1005/input1.json', function(data) {
$.getJSON('files/input1.json', function(data) {
	for (ii = 0 ; ii < 3; ii++){
  	var geojson = [];
	  for (var i in data.usuarios[ii]['check-ins']) {
	  	var g = {
			    type: 'Feature',
			    geometry: {
			        type: 'Point',
			        coordinates: [
				        data.usuarios[ii]['check-ins'][i].longitude,
			          data.usuarios[ii]['check-ins'][i].latitude
			        ]
			    },
			    properties: {
			        title: 'User',
			        'marker-size': 'large',
			        'marker-color': '#bebebe',
			        'id': ((ii == 0)? 965 : ((ii == 1)? 8852 : 10590)),
			        'date': new Date(data.usuarios[ii]['check-ins'][i].time.split(' ').join("T")),
			        'friend': false
			    }
			};
	  	if (parseInt(i) !== parseInt(data.usuarios[ii]['check-ins'].length)-1){
				var line =
					  {
					    type: "Feature",
					    geometry: {
				      type: "LineString",
			        coordinates: [
				        [data.usuarios[ii]['check-ins'][i].longitude,
			          data.usuarios[ii]['check-ins'][i].latitude],
			          [data.usuarios[ii]['check-ins'][parseInt(i)+1].longitude,
			          data.usuarios[ii]['check-ins'][parseInt(i)+1].latitude]
			        ]
					    },
					    "properties": {
					      "stroke": "#fc4353",
					      "stroke-width": 2,
					      'date': new Date(data.usuarios[ii]['check-ins'][i].time.split(' ').join("T")),
					      'id': ((ii == 0)? 965 : ((ii == 1)? 8852 : 10590)),
					      'line': true
					    }
					  };
			}
		  geojson1.push(g)
		  geojson2.push(line)
		};
		for (var t in data.usuarios[ii]['amigos']) {
		  for (var e in data.usuarios[ii]['amigos'][t]['check-ins']) {
		  	var g6 = {
			    type: 'Feature',
			    geometry: {
			        type: 'Point',
			        coordinates: [
				        data.usuarios[ii]['amigos'][t]['check-ins'][e].longitude,
			          data.usuarios[ii]['amigos'][t]['check-ins'][e].latitude
			        ]
			    },
			    properties: {
			        title: 'Friend',
			        'marker-size': 'large',
			        'marker-color': '#FF0000',
			        'id': ((ii == 0)? 965 : ((ii == 1)? 8852 : 10590)),
			        'date': new Date(data.usuarios[ii]['amigos'][t]['check-ins'][e].time.split(' ').join("T")),
			        'friend': true
			    }
				};
				geojson1.push(g6)
			};
		};
	};
	lines = L.mapbox.featureLayer().setGeoJSON(geojson2);
	lines.addTo(map2) // Add lines to map.
	lines.setFilter(function(f) { // Hide lines until filter is set. 
  return false;
	});
	markers1 = L.mapbox.featureLayer().setGeoJSON(geojson1);
	markers1.addTo(map2) // Add markers to map.
	markers1.setFilter(function(f) { // Hide markers until filter is set. 
	  return false;
	});
});


/* FILTERS FUNCTIONS */
$(function () {
	$('.dropdown').dropdown({
			transition: 'drop',
			onChange: function(value, text, $choice) {
					$('.ui.checkbox').checkbox('uncheck');
				}
     });
	$('#friends_checkbox').checkbox({
		onChecked: function () {
		var filter = $('.dropdown option:selected').val();
    markers1.setFilter(function(f) {
    	id = f.properties['id'] == filter
			start_time = new Date($('#start_datetimepicker').val()) < f.properties['date'];
			end_time = f.properties['date'] < new Date($('#end_datetimepicker').val());
        return (id && start_time && end_time);
			});
		},
		onUnchecked: function () {
			var filter = $('.dropdown option:selected').val();
			if (typeof markers1 !== 'undefined'){
		    markers1.setFilter(function(f) {
					id = f.properties['id'] == filter;
					friend = f.properties['friend'] == false;
					start_time = new Date($('#start_datetimepicker').val()) < f.properties['date'];
					end_time = f.properties['date'] < new Date($('#end_datetimepicker').val());
		    return ( id && friend && start_time && end_time)? true : false;
				});
		  }
		}
	});
	$('#rutes_checkbox').checkbox({
		onChecked: function () {
		var filter = $('.dropdown option:selected').val();
    lines.setFilter(function(f) {
    	id = f.properties['id'] == filter
			start_time = new Date($('#start_datetimepicker').val()) < f.properties['date'];
			end_time = f.properties['date'] < new Date($('#end_datetimepicker').val());
        return (id && start_time && end_time);
			});
		},
		onUnchecked: function () {
			var filter = $('.dropdown option:selected').val();
			if (typeof lines !== 'undefined'){
		    lines.setFilter(function(f) {
		    return false;
				});
		  }
		}
	});
});

$(function (){
	$('#start_datetimepicker').datetimepicker({
		  value: new Date("2011-01-01T01:10:00"),
			onChangeDateTime:function(current_time,$input){
				var filter = $('.dropdown option:selected').val();
		    markers1.setFilter(function(f) {
					id = f.properties['id'] == filter;
					friend = ($('#friends_checkbox').checkbox('is checked'))? true :f.properties['friend'] == false;
					end_time = new Date($('#end_datetimepicker').val()) > f.properties['date'];
					start_time = f.properties['date'] > current_time;
	      return ( id && friend && start_time && end_time)? true : false;
		    });
		    if ($('#rutes_checkbox').checkbox('is checked')){
					$('#rutes_checkbox').checkbox('check');
				}
			}
		 });
	$('#end_datetimepicker').datetimepicker({
		  value: new Date("2011-12-10T01:10:00"),
			onChangeDateTime:function(current_time,$input){
				var filter = $('.dropdown option:selected').val();
		    markers1.setFilter(function(f) {
					id = f.properties['id'] == filter;
					friend = ($('#friends_checkbox').checkbox('is checked'))? true :f.properties['friend'] == false;
					start_time = new Date($('#start_datetimepicker').val()) < f.properties['date'];
					end_time = f.properties['date'] < current_time;
	      return ( id && friend && start_time && end_time)? true : false;
	   })
	    if ($('#rutes_checkbox').checkbox('is checked')){
				$('#rutes_checkbox').checkbox('check');
			}
	  }
	});
});