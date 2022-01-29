
//карта
var map = L.map('map').setView([40.291463, 69.626437], 15);


L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

//reverse
function createButton(label, container) {
  var btn = L.DomUtil.create('button', '', container);
  btn.setAttribute('type', 'button');
  btn.innerHTML = label;
  return btn;
}

var ReversablePlan = L.Routing.Plan.extend({
  createGeocoders: function(){
    var container = L.Routing.Plan.prototype.createGeocoders.call(this),
      reverseButton = createButton('↑↓', container);
      L.DomEvent.on(reverseButton, 'click', function() {
        var waypoints = this.getWaypoints(); 
        this.setWaypoints(waypoints.reverse()); 
       }, this)
    return container
  }
})

var start = L.latLng(40.28080252029305, 69.61976051330568)
var goal = L.latLng(40.285011457685464, 69.619165090437)



var plan = new ReversablePlan(
  [start, goal], 
  {geocoder: L.Control.Geocoder.nominatim(),
   }
  )


//маршрут с двумя пунктами
var control = L.Routing.control(
  { showAlternatives: true, 
    plan: plan,
    language: 'ru',
  }).on('routesfound', function(e) {
    let countOfPunkts = e.routes[0].inputWaypoints.length
    //console.log('routes: ', e.routes[0].inputWaypoints);
    
    
    var colors = ['orange', 'green', 'blue', 'white', 'fuchia']
    var array = []
    var array2 = []
    var array3 = []

for(var i = 0; i< countOfPunkts; i++){
  let lat = e.routes[0].inputWaypoints[i].latLng.lat
  let lng = e.routes[0].inputWaypoints[i].latLng.lng
 
 
  var rout = L.Routing.control({
    lineOptions: {styles: [{color: colors[i], opacity: 0.9, weight: 4}]},
    waypoints: [
      start,
      L.latLng(lat, lng)
    ]
  }).on('routesfound',  function(e) {
    array2.push( { latlng: e.routes[0].inputWaypoints[1].latLng, distance: e.routes[0].summary.totalDistance})
    array.push(e.routes[0].summary.totalDistance) 
    let sort =  array.sort()

    //console.log('distance', e.routes[0].inputWaypoints[1].latLng, e.routes[0].summary.totalDistance);
    console.log('sort', sort, array2);
    /*
    for(var p = 0; p < sort.length; p++){
      for(var j = 0; j < array2.length; j++){
        if(sort[j] == array2[j]){
          array3.push(array2[j])
          console.log('array3: ', array3);
        }
      }
      //console.log('array3: ', array3);
    } */
    //удали addTo(map)
}).addTo(map)


}
map.removeLayer(rout)
}).addTo(map);



