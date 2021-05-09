import React from "react";

import {Col, Row} from "srx";
import LiveEvents from "./LiveEvents";
import NextEvents from "./NextEvents";

const UpcomingEvents = () => {

    return <Row>
        {process.env.features?.dashboard?.liveEvents &&
        <Col md={4} p={2} className="h-100">
            <LiveEvents />
        </Col>}
        {process.env.features?.dashboard?.nextEvents &&
        <Col md={8} p={2}>
            <NextEvents />
        </Col>}
    </Row>

};

export default UpcomingEvents;