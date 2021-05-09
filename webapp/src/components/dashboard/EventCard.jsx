import React from 'react';
import {Card} from "srx";
import styled from "@emotion/styled";
import format from "date-fns/format";
import parseISO from "date-fns/parseISO";

const EventCardWrap = styled.a`
    display: block;
    transform: translateY(0);
    transition: 0.5s all ease;
    &:hover {
      transform: translateY(-10px);
      transition: 0.5s all ease;
    }
`;

const EventCard = ({
   posterURL, slug, name, shortDescription, registrationCloseTimestamp
}) => {

    return <EventCardWrap href={`/event/${slug}`} className="plain-link">
        <Card bg="white" p={0} shadow={2} round={0}>
            {posterURL && <img draggable="false" src={posterURL} alt={name} />}
            <div className="p-3">
                <h3 style={{ color: '#AF0C3E', fontWeight: '600' }}>{name}</h3>
                <div>{shortDescription}</div>
                {registrationCloseTimestamp && (parseISO(registrationCloseTimestamp) > new Date()) &&
                <div style={{ fontSize: '13px' }} className="mt-2 text-danger">
                    Register before {format(parseISO(registrationCloseTimestamp), 'dd MMM')}
                </div>}
            </div>
        </Card>
    </EventCardWrap>;

};

export default EventCard;