import React, { useState, useEffect } from 'react';
import styled from "@emotion/styled";

import AdminSubEventsLister from "./SubEvents";
import APIFetch from "../../utils/APIFetch";

import UpcomingEvents from "../dashboard/UpcomingEvents";
import EventListing from "../dashboard/DesktopView/Listing";


const MenuButton = styled.a`
    background: white;
    padding: 1rem;
    min-height: 20vh;
    width: 100%;
    border: none!important;
    font-weight: 600;
    font-size: 16px;
    display: block;
    text-decoration: none!important;
    text-align: center;
    img {
      margin-bottom: 12px;
    }
`;


const defaultEventID = process.env.eventID || 1;

const AdminPanel = ({ eventID = defaultEventID }) => {

    const [event, setEvent] = useState(null);

    const fetchEventDetails = () => {
        APIFetch({
            query: `query ($eventID: ID!){
              event(eventID: $eventID){
                name
              }
            }`,
            variables: { eventID }
        }).then(({ data, success, errors }) => {
            if(success) {
                setEvent(data.event);
            }
        })
    };

    useEffect(fetchEventDetails, []);


    return <div className="row mx-0">
        <div className="col-12 p-3">
            {event && <h1>{event.name} Admin Panel</h1>}
            <a href="/" className="btn btn-primary text-light font-weight-bold px-4 mt-2 py-3 rounded-0">
                Open Dashboard
            </a>
        </div>
        <div className="col-6 col-md-4 p-2">
            <MenuButton href={`/admin/verify/${eventID}`}>
                <img alt="ID Verification" src={require('../../assets/icons/check.png')} />
                <div>Verify Registrations</div>
            </MenuButton>
        </div>
        <div className="col-6 col-md-4 p-2">
            <MenuButton href={`/admin/view/${eventID}`}>
                <img alt="Search User" src={require('../../assets/icons/search-user.png')} />
                <div>View & Search Participants</div>
            </MenuButton>
        </div>
        <div className="col-6 col-md-4 p-2">
            <MenuButton href={`/admin/email/${eventID}`}>
                <img alt="Send Email" src={require('../../assets/icons/send-email.png')} />
                <div>Send Emails</div>
            </MenuButton>
        </div>
        <div className="col-6 col-md-4 p-2">
            <MenuButton href={`/admin/judge/${eventID}`}>
                <img alt="Judge" src={require('../../assets/icons/rating.png')} />
                <div>Judge Participants</div>
            </MenuButton>
        </div>
        <div className="col-6 col-md-4 p-2">
            <MenuButton href={`/admin/scores/${eventID}`}>
                <img alt="Judge" src={require('../../assets/icons/rating.png')} />
                <div>View Scores</div>
            </MenuButton>
        </div>
        <div className="col-6 col-md-4 p-2">
            <MenuButton href={`/admin/eliminate/${eventID}`}>
                <img alt="Eliminate" src={require('../../assets/icons/eliminate.png')} />
                <div>Eliminate Participants</div>
            </MenuButton>
        </div>
        <div className="col-12 p-2">
            <AdminSubEventsLister event={event} eventID={eventID} />
        </div>
    </div>
};

export default AdminPanel