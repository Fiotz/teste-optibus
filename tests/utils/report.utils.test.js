const { findStart, findEnd, checkStartAndEndDutyEvents } = require('../../utils/report.utils');

describe('Report Utils', () => {
    it('should return a start time when it receives an array of events', () => {
        const dutyVehicle = require('../mockFiles/dutyVehicles.json').dutyVehicles;
        const result = findStart(dutyVehicle);
        expect(typeof result).toBe('string');
        expect(result).toBe('0.03:25');
    });

    it('should return a end time when it receives an array of events', () => {
        const dutyVehicle = require('../mockFiles/dutyVehicles.json').dutyVehicles;
        const result = findEnd(dutyVehicle);
        expect(typeof result).toBe('string');
        expect(result).toBe('0.11:39');
    });

    it('should not return start_time or end_time when it receives an array of duties witout this fields', () => {
        const duties = require('../mockFiles/dutyWithoutStartOrEnd.json').duties;
        const { start_time, end_time } = checkStartAndEndDutyEvents(duties[0].duty_events);
        expect(typeof start_time).toBe('undefined');
        expect(typeof end_time).toBe('undefined');
    });

    it('should return start_time when it receives an array of duties with this field', () => {
        const duties = require('../mockFiles/dutyWithStart.json').duties;
        const { start_time, end_time } = checkStartAndEndDutyEvents(duties[0].duty_events);
        expect(typeof start_time).toBe('string');
        expect(start_time).toBe('0.07:40');
        expect(typeof end_time).toBe('undefined');
    });

    it('should return end_time when it receives an array of duties with this field', () => {
        const duties = require('../mockFiles/dutyWithEnd.json').duties;
        const { start_time, end_time } = checkStartAndEndDutyEvents(duties[0].duty_events);
        expect(typeof start_time).toBe('undefined');
        expect(typeof end_time).toBe('string');
        expect(end_time).toBe('0.17:56');
    });
});