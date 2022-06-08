// Stops:
//     Stop ID
//     Stop Name
//     Latitude
//     Longitude
//     Is depot

class Stops {
    constructor(data) {
        const { stops } = data;
        this.database = stops;
    }

    findStopById(id) {
        return this.database.find((stop) => stop.stop_id === id);
    }

    getAllStops() {
        return this.database;
    }
}

module.exports = Stops;