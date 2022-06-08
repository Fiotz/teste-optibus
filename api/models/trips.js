// Trips:
//     Trip ID
//     Route number
//     Origin stop ID
//     Destination stop ID
//     Departure time
//     Arrival time

class Trips {
    constructor(data) {
        const { trips } = data;
        this.database = trips;
    }

    findTripsById(id) {
        return this.database.find((trip) => trip.trip_id === id);
    }

    getAllTrips() {
        return this.database;
    }
}

module.exports = Trips;