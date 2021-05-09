import React, { useState, useEffect } from 'react';

import APIFetch from "../../../utils/APIFetch";
import {UPCOMING_EVENTS_QUERY} from "../../../graphql/queries/event";
import NextEventCard from "./NextEventCard";

const eventID = process.env.eventID;

const NextEvents = () => {

    const [events, setEvents] = useState(null);
    const [hasLoaded, setLoaded] = useState(false)

    const fetchEvents = () => {
        APIFetch({
            query: UPCOMING_EVENTS_QUERY,
            variables: {
                eventType: 3,
                parentID: eventID
            }
        }).then(({ success, data, errors }) => {
            setLoaded(true);
            if(success) {
                setEvents(data.upcomingEvents)
            }
        })
    };

    useEffect(fetchEvents, [])

    return <div>
        {hasLoaded ?
        <div>
            <h5 className="font-weight-bold mb-1">Coming Next</h5>
            {events?.length > 0 ?
            <div className="row mx-0">
                {events.map((e) =>
                    <div className="col-md-4 p-2">
                        <NextEventCard {...e} />
                    </div>
                )}
            </div> :
            <div>
                <h3>No Upcoming Events</h3>
            </div>}
        </div>
        : <div>
            <h3>Loading</h3>
        </div>}
    </div>

};

export default NextEvents;