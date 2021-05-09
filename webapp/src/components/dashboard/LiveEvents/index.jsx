import React, { useState, useEffect } from 'react';

import APIFetch from "../../../utils/APIFetch";
import {LIVE_EVENTS_QUERY} from "../../../graphql/queries/event";
import LiveEventCard from "./LiveEventCard";

const eventID = process.env.eventID;

const LiveEvents = () => {

    const [events, setEvents] = useState(null);
    const [hasLoaded, setLoaded] = useState(false)

    const fetchEvents = () => {
        APIFetch({
            query: LIVE_EVENTS_QUERY,
            variables: {
                eventType: 3,
                parentID: eventID
            }
        }).then(({ success, data, errors }) => {
            setLoaded(true);
            if(success) {
                setEvents(data.liveEvents)
            }
        })
    };

    useEffect(fetchEvents, [])

    return <div className="h-100">
        {hasLoaded ?
            <div>
                {events?.length > 0 ?
                    <LiveEventCard {...events[0]} /> :
                    <div
                        className="p-2 text-center h-100 d-flex align-items-center justify-content-center"
                        style={{ minHeight: '25vh', background: '#fff176' }}
                    >
                        <div>
                            <img src={require('../../../assets/icons/live.png')} />
                            <h3 className="font-weight-bold">Nothing Live Now</h3>
                            <p>
                                No events are happening at the moment.
                            </p>
                        </div>
                    </div>}
            </div>
            : <div>
                <h3>Loading</h3>
            </div>}
    </div>

};

export default LiveEvents;