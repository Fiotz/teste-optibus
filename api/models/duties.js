// Duties:
//     Duty ID
//     Duty Events:
//         Duty event sequence
//         Duty event type
//         Vehicle event sequence
//         Vehicle ID
class Duties {
    constructor(data) {
        const { duties } = data;
        this.database = duties;
    }

    findDutiesById(id) {
        return this.database.find((duty) => duty.duty_id === id);
    }

    getAllDuties() {
        return this.database;
    }
}

module.exports = Duties;
