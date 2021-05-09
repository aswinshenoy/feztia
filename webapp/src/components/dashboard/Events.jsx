import React, { useState, useEffect } from 'react';
import APIFetch from "../../utils/APIFetch";
import {EVENTS_QUERY} from "../../graphql/queries/event";
import {Card, Col, Row} from "srx";
import EventCard from "./EventCard";
import shortid from "shortid";
import Fade from "react-reveal/Fade";

const eventID = process.env.eventID;


const EventsListing = ({ showAll = false }) => {

    const [events, setEvents] = useState([]);

    const fetchEvents = () => {
        APIFetch({
            query: EVENTS_QUERY,
            variables: {
                parentID: eventID
            }
        }).then(({ data, errors, success}) => {
            if(success){
                setEvents(data.events.events);
            }
        })
    };

    useEffect(fetchEvents, [])

    return <div className="my-3">
        <h2 style={{ color: '#AF0C3E', fontWeight: '600' }} className="font-weight-bold">Competitions</h2>
        {events?.filter((e) => !(!e.isUserAllowedToRegister) || showAll ).length > 0 ?
        <Row>{events.filter((e) => !(!e.isUserAllowedToRegister) || showAll).map((e, i) =>
            <Col md={4} p={2}>
                <Fade delay={i*200} key={shortid.generate()}>
                    <EventCard {...e} />
                </Fade>
            </Col>
        )}</Row> : <div>
            <h3>No events listed now</h3>
        </div>}
    </div>;

};

export default EventsListing;