const { SERVICE_TRIP, BREAKTIME_LIMIT } = require("./constants");

const findStart = (events) => {
    return events[0]?.start_time;
}

const findEnd = (events) => {
    return events[events.length-1]?.end_time;
}

const checkStartAndEndDutyEvents = (events) => {
    const start_time = findStart(events);
    const end_time = findEnd(events);
    return {
        start_time,
        end_time,
    };
}

const reduceDutyEventsToVehiclesIds = (events) => {
    return events.reduce((vehs, evt) => {
        return vehs.includes(evt.vehicle_id) ? vehs : [...vehs, evt.vehicle_id]
    }, []);
}

const formatHour = (time) => {
    return time.split('.')[1];
}

const toMin = (time) => {
    const slpitedDay = time.split('.');
    const DayInMin = 60*24;
    const Hour = slpitedDay[1].split(':');
    return slpitedDay[0] === '1'
        ? DayInMin + (parseInt(Hour[0])*60) + parseInt(Hour[1])
        : (parseInt(Hour[0])*60) + parseInt(Hour[1]);
}

const findFirstServiceTrip = (events, type) => {
    return events.find((evt) => evt?.vehicle_event_type === SERVICE_TRIP); //events[0]?.origin_stop_id;
}

const findLastServiceTrip = (events) => {
    return findFirstServiceTrip(events.reverse());
}

const findBreaks = (events) => {
    const breaks = {
        breakStartTime: [],
        breakDuration: [],
        breakStopName: [],
    };
    console.log('findbreaks ', events);
    for (let index = 1; index < events.length; index++) {
        const lastEvent = events[index-1];
        const currentEvent = events[index];
        const lastEventArrival = toMin(lastEvent?.end_time || lastEvent?.arrival_time);
        const currentEventDeparture = toMin(currentEvent?.start_time || currentEvent?.departure_time);
        const duration = currentEventDeparture - lastEventArrival;
        console.log({lastEventArrival});
        console.log({duration});
        console.log(lastEvent.destination_stop_id.stop_name);
        if (duration > BREAKTIME_LIMIT) {
            breaks.breakStartTime.push(formatHour(lastEvent?.end_time || lastEvent?.arrival_time));
            breaks.breakDuration.push(duration);
            breaks.breakStopName.push(lastEvent.destination_stop_id.stop_name)
        }
    }
    console.log('breaks -> ', breaks);
    return breaks;
}

module.exports = {
    findStart,
    findEnd,
    checkStartAndEndDutyEvents,
    reduceDutyEventsToVehiclesIds,
    formatHour,
    findFirstServiceTrip,
    findLastServiceTrip,
    findBreaks,
};
// 59 112 114 122 124 126 141, 142