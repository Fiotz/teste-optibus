// Vehicles:
//     Vehicle ID
//     Vehicle events:
//         Vehicle event sequence
//         Vehicle event type
//         Start time
//         End time
//         Origin stop ID
//         Destination stop ID
//         Duty ID
class Vehicles {
    constructor(data) {
        const { vehicles } = data;
        this.database = vehicles;
    }

    findVehicleById(id) {
        return this.database.find((vehicle) => vehicle.vehicle_id === id);
    }

    findVehicleByIdAndDutyId(id, dutyId) {
        const vehicle = this.findVehicleById(id);        
        return vehicle ? vehicle.vehicle_events.reduce(
            (vehs, evt) => {
                return evt.duty_id === dutyId ? [...vehs, evt] : vehs
            },
            [],
        )
        : null;
    }

    getAllVehicles() {
        return this.database;
    }
}

module.exports = Vehicles;