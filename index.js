const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const request = require('request');

const app = express();

app.use(bodyParser.urlencoded({ extended: true })); 

app.get('/', (req, res) => { res.sendFile(path.join(__dirname + '/form.html'))});



// To get the coordinates for start and end location
var startlat, startlng, endlat, endlng;
app.post('/', function(req, res) { 
    console.log(`Start Location: ${req.body.start} and End Location: ${req.body.end}`);
    res.send("Form successfully submitted!");

    const start = req.body.start.replace(/ /g, "+");
    const end = req.body.end.replace(/ /g, "+");

    request('http://open.mapquestapi.com/geocoding/v1/address?key=3RPKDErBGRFQ7bnjN2Pl0YSYGQ61iWnw&location='+start, 
    function(error, res, body) {
        const output = JSON.parse(body);
        startlat = output.results[0].locations[0].displayLatLng.lat;
        startlng = output.results[0].locations[0].displayLatLng.lng;
        console.log(startlat);
        console.log(startlng);
    });

    request('http://open.mapquestapi.com/geocoding/v1/address?key=3RPKDErBGRFQ7bnjN2Pl0YSYGQ61iWnw&location='+end, 
    function(error, res, body) {
        const output = JSON.parse(body);
        endlat = output.results[0].locations[0].displayLatLng.lat;
        endlng = output.results[0].locations[0].displayLatLng.lng;
        console.log(endlat);
        console.log(endlng);
    });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
