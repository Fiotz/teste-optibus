const express = require('express');
const Duties = require('./api/models/duties');
const Stops = require('./api/models/stops');
const Trips = require('./api/models/trips');
const Vehicles = require('./api/models/vehicles');
const database = require('./mini_json_dataset.json');
const app = express();

// Routes
const reportRoute = require('./api/routes/reports.route')

// Headers
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', '*');
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).json({});
    }
    req.stops = new Stops(database);
    req.trips = new Trips(database);
    req.vehicles = new Vehicles(database);
    req.duties = new Duties(database);
    next();
});



app.use('/reports', reportRoute);



module.exports = app;
