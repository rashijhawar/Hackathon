const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const request = require('request');
const fetch = require('node-fetch');

const app = express();

app.use(bodyParser.urlencoded({ extended: true })); 

app.get('/', (req, res) => { res.sendFile(path.join(__dirname + '/form.html'))});


// To get the coordinates for start and end location
var startlat, startlng, endlat, endlng;
app.post('/', function(req, res) { 
    console.log(`Start Location: ${req.body.start}\nEnd Location: ${req.body.end}`);

    const start = req.body.start.replace(/ /g, "+");
    const end = req.body.end.replace(/ /g, "+");

    request('http://mapquestapi.com/geocoding/v1/address?key=3RPKDErBGRFQ7bnjN2Pl0YSYGQ61iWnw&location='+start, 
    function(err, res, body) {
        const output = JSON.parse(body);
        startlat = output.results[0].locations[0].displayLatLng.lat;
        startlng = output.results[0].locations[0].displayLatLng.lng;

        console.log("Start Lat: "+startlat);
        console.log("Start Lng: "+startlng);

        //storeVal("start", {startlat: startlat, startlng: startlng})

        request('http://mapquestapi.com/geocoding/v1/address?key=3RPKDErBGRFQ7bnjN2Pl0YSYGQ61iWnw&location='+end, 
        function(err, res, body) {
            const output = JSON.parse(body);
            endlat = output.results[0].locations[0].displayLatLng.lat;
            endlng = output.results[0].locations[0].displayLatLng.lng;
            
            console.log("End Lat: "+endlat);
            console.log("End Lng: "+endlng);
    
            storeVal("start", {startlat: startlat, startlng: startlng}, "end", {endlat: endlat, endlng: endlng})
        });
    });
    res.send("Form successfully submitted!");
});

var finalvalues = {};
async function storeVal(start, startobj, end, endobj) {
    finalvalues[start] = startobj;
    finalvalues[end] = endobj;
    // console.log(`Location is ${location} Lat value is ${lat} Lng value is ${lng} AQI value is ${aqi} `);
    
    
    // console.log(finalvalues);

    request('https://api.mapbox.com/directions/v5/mapbox/driving/'+finalvalues.start.startlng+','+finalvalues.start.startlat+';'+finalvalues.end.endlng+','+finalvalues.end.endlat+'?access_token=pk.eyJ1IjoidGhlcG90YXRvcHJvdG9jb2wiLCJhIjoiY2tiZXVhbmd5MDJ3cjJybWw4ZjBiazlnbCJ9.kGmYejAtsmbfEV_XNdGfrw&geometries=geojson',
    async function(err, res, body) {
        const output = JSON.parse(body);
        const routeCoordinates = output.routes[0].geometry.coordinates;
        // console.log(routeCoordinates);
        finalvalues['route'] = routeCoordinates;
        // console.log(finalvalues.route.length);
        // console.log(finalvalues);


        function getRoute(url) {
            return new Promise((resolve, reject) => {
                fetch(url)
                    .then((resp) => resp.json())
                    .then((data) => {
                        resolve(data);
                    })
            })
        }

        function loadUsers(){
            let userRequest=[]

            var routelength = finalvalues.route.length;
            var i;

            for(i=0; i<routelength||i===(routelength-1); i+=16) {
                userRequest.push(getRoute('https://api.airvisual.com/v2/nearest_city?lat='+finalvalues.route[i][1]+'&lon='+finalvalues.route[i][0]+'&key=79fa36ae-8812-41c9-a4ee-84284278cfca'))
            }
            userRequest.push(getRoute('https://api.airvisual.com/v2/nearest_city?lat='+finalvalues.route[routelength-1][1]+'&lon='+finalvalues.route[routelength-1][0]+'&key=79fa36ae-8812-41c9-a4ee-84284278cfca'));

            Promise.all(userRequest).then((allRouteData) => {
                console.log(allRouteData);
            })
        }
        loadUsers();
    });
}

//app.get('/map', (req, res) => { res.sendFile(path.join(__dirname + '/map.html')) });

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));