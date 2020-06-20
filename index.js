const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const request = require('request');

const app = express();

app.use(bodyParser.urlencoded({ extended: true })); 

app.get('/', (req, res) => { res.sendFile(path.join(__dirname + '/form.html'))});

app.post('/', function(req, res){
    console.log(`Start Location: ${req.body.start} and End Location: ${req.body.end}`);
    res.send("Form successfully submitted!");

    const start = req.body.start.replace(/ /g, "+");
    const end = req.body.end.replace(/ /g, "+");

    request('http://open.mapquestapi.com/geocoding/v1/address?key=3RPKDErBGRFQ7bnjN2Pl0YSYGQ61iWnw&location=start', 
    function(error, res, body) {
        console.log(res.body);
        //console.log(res.json.results[0].locations[0].displayLatLng.lat);
        //console.log(res.body.results[0].locations[0].displayLatLng.lng);
    });
 });


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));