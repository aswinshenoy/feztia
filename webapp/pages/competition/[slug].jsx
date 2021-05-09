import React, { useEffect, useState } from 'react';

import Base from "../../src/components/shared/Base";
import APIFetch from "../../src/utils/APIFetch";
import {EVENT_DETAILS_QUERY} from "../../src/graphql/queries/event";
import Header from "../../src/components/shared/Header";

import CompetitionPage from "../../src/components/competition/CompetitionPage";

const eventID = process.env.eventID;

const Competition = ({ slug }) => {

    const [event, setEvent] = useState(null);

    const fetchEvent = () => {
        APIFetch({
            query: EVENT_DETAILS_QUERY,
            variables: {
                slug,
                parentID: eventID
            }
        }).then(({ data, success, errors }) => {
            if(success) {
                setEvent(data.event);
            }
        })
    }

    useEffect(fetchEvent, []);

    return event ?
    <Base meta={{ title: event?.name ? `${event.name} - Competition` : 'Competition' }}>
        <CompetitionPage event={event} />
    </Base> : <Base meta={{ title: 'Loading Event Details' }}>
        <Header />
        <h1>Loading</h1>
    </Base>

};

Competition.getInitialProps = async ({ query }) => {
    return { slug: query.slug };
};

export default Competition;