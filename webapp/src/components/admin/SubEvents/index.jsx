import React, { useState, useEffect } from 'react';
import {Card, Col, Row} from "srx";

import APIFetch from "../../../utils/APIFetch";
import {EVENTS_QUERY} from "../../../graphql/queries/event";


const AdminSubEventsLister = ({ event, eventID }) => {

    const [events, setEvents] = useState([]);

    const fetchEvents = () => {
        APIFetch({
            query: EVENTS_QUERY,
            variables: { parentID: eventID }
        }).then(({ data, errors, success}) => {
            if(success){
                setEvents(data.events.events);
            }
        })
    };

    useEffect(fetchEvents, []);

    return events?.length > 0 ?
    <div className="my-5">
        <h2 style={{ color: '#AF0C3E', fontWeight: '600' }} className="font-weight-bold mb-2">Sub Events of {event?.name}</h2>
        <Row>{events.map((e) =>
            <Col md={4} p={2}>
                <a href={`/admin/event/${e.id}`} className="plain-link">
                    <Card bg="white" p={4} shadow={2} round={3}>
                        <h3 className="mb-0" style={{ color: '#AF0C3E', fontWeight: '600' }}>{e.name}</h3>
                        <div>{e.shortDescription}</div>
                    </Card>
                </a>
            </Col>
        )}</Row>
    </div> : <div />;

};

export default AdminSubEventsLister;