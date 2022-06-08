const { 
    findStart,
    findEnd,
    reduceDutyEventsToVehiclesIds,
    checkStartAndEndDutyEvents,
    formatHour,
    findFirstServiceTrip,
    findLastServiceTrip,
    findBreaks,
} = require("../../utils/report.utils");

const converter = require('json-2-csv');

var fs = require('fs');
const { SERVICE_TRIP } = require("../../utils/constants");

const ReportControler = {
    returnShortReport(req, res, next) {
        const { vehicles, duties } = req;
        const allDuties = duties.getAllDuties();
        const shortReportDuty = [];
        allDuties.forEach(duty => {
            let dutyEvents =  duty.duty_events;
            const { start_time, end_time } = checkStartAndEndDutyEvents(dutyEvents);
            // reduce dutyEvents to vehicle_ids
            dutyEvents = reduceDutyEventsToVehiclesIds(dutyEvents);
            let dutyVehicle = [];
            dutyEvents.forEach(events => {
                const vehicle_events = vehicles.findVehicleByIdAndDutyId(events, duty.duty_id);
                if (vehicle_events) dutyVehicle = [...dutyVehicle, ...vehicle_events];
            });
            const reportDuty = {
                'Duty Id': duty.duty_id,
                'Start Time': formatHour(start_time || findStart(dutyVehicle)),
                'End Time': formatHour(end_time || findEnd(dutyVehicle)),
            }
            shortReportDuty.push(reportDuty);
        });
        req.response = shortReportDuty;
        req.filename = 'shortReportDuty.csv';
        next()
    },

    returnMediumReport(req, res, next) {
        const { stops, trips, vehicles, duties } = req;
        const allDuties = duties.getAllDuties();//.slice(4,6);
        const mediumReportDuty = [];
        allDuties.forEach(duty => {
            let dutyEvents =  duty.duty_events;
            let { start_time, end_time } = checkStartAndEndDutyEvents(dutyEvents);
            // reduce dutyEvents to vehicle_ids
            dutyEvents = reduceDutyEventsToVehiclesIds(dutyEvents);
            let dutyVehicle = [];
            dutyEvents.forEach(events => {
                const vehicle_events = vehicles.findVehicleByIdAndDutyId(events, duty.duty_id);
                if (vehicle_events) dutyVehicle = [...dutyVehicle, ...vehicle_events];
            });
            start_time = formatHour(start_time || findStart(dutyVehicle));
            end_time = formatHour(end_time || findEnd(dutyVehicle));
            const firstTripVehicle = findFirstServiceTrip(dutyVehicle);
            const firtTripEvent = trips.findTripsById(firstTripVehicle?.trip_id);
            const firstTripStopName = stops.findStopById(firtTripEvent.origin_stop_id)?.stop_name
            const lastTripVehicle = findLastServiceTrip(dutyVehicle);
            const lastTripEvent = trips.findTripsById(lastTripVehicle?.trip_id);
            const lastTripStopName = stops.findStopById(firtTripEvent.destination_stop_id)?.stop_name
            
            const reportDuty = {
                'Duty Id': duty.duty_id,
                'Start Time': start_time,
                'End Time': end_time,
                'Start Stop Description': firstTripStopName || '',
                'End Stop Description': lastTripStopName || '',
            }
            mediumReportDuty.push(reportDuty);
        });
        req.response = mediumReportDuty;
        req.filename = 'mediumReportDuty.csv';
        next()
    },

    returnLongReport(req, res, next) {
        const { stops, trips, vehicles, duties } = req;
        const allDuties = duties.getAllDuties();
        const longReportDuty = [];
        allDuties.forEach(duty => {
            let dutyEvents =  duty.duty_events;
            let { start_time, end_time } = checkStartAndEndDutyEvents(dutyEvents);
            // reduce dutyEvents to vehicle_ids
            dutyEvents = reduceDutyEventsToVehiclesIds(dutyEvents);
            let dutyVehicle = [];
            dutyEvents.forEach(events => {
                const vehicle_events = vehicles.findVehicleByIdAndDutyId(events, duty.duty_id);
                if (vehicle_events) dutyVehicle = [...dutyVehicle, ...vehicle_events];
            });
            start_time = formatHour(start_time || findStart(dutyVehicle));
            end_time = formatHour(end_time || findEnd(dutyVehicle));
            const dutyw = JSON.parse(JSON.stringify(dutyVehicle));
            const dutyVehicleWithTrips = dutyw.map((vehicle) => {
                if (vehicle?.vehicle_event_type === SERVICE_TRIP) {
                    vehicle = JSON.parse(JSON.stringify(trips.findTripsById(vehicle?.trip_id)));
                }
                const stop_start = stops.findStopById(vehicle.origin_stop_id);
                const stop_end = stops.findStopById(vehicle.destination_stop_id);
                vehicle.origin_stop_id = stop_start;
                vehicle.destination_stop_id = stop_end;
                return vehicle;
            });

            const findBreaksDuty = findBreaks(dutyVehicleWithTrips);
            const firstTripVehicle = findFirstServiceTrip(dutyVehicle);
            const firtTripEvent = trips.findTripsById(firstTripVehicle?.trip_id);
            const firstTripStopName = stops.findStopById(firtTripEvent.origin_stop_id)?.stop_name;
            const lastTripVehicle = findLastServiceTrip(dutyVehicle);
            const lastTripEvent = trips.findTripsById(lastTripVehicle?.trip_id);
            const lastTripStopName = stops.findStopById(firtTripEvent.destination_stop_id)?.stop_name;

            const reportDuty = {
                'Duty Id': duty.duty_id,
                'Start Time': start_time,
                'End Time': end_time,
                'Start Stop Description': firstTripStopName || '',
                'End Stop Description': lastTripStopName || '',
                'Break Start Time': findBreaksDuty.breakStartTime,
                'Break Duration': findBreaksDuty.breakDuration,
                'Break Stop Name': findBreaksDuty.breakStopName,
            }
            longReportDuty.push(reportDuty);
        });
        req.response = longReportDuty;
        req.filename = 'longReportDuty.csv';
        next()
    },

    returnFile(req, res, next) {
        converter.json2csv(req.response, (err, csv) => {
            if (err) {
                throw err;
            }
            file = process.cwd()+ '/files/' + req.filename;
            console.log(file)
            fs.writeFileSync(file, csv);
            var filestream = fs.createReadStream(file);
            filestream.pipe(res);
        });
    },
}

module.exports = ReportControler;
