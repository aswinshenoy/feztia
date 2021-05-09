import React, { useState, useEffect } from 'react';
import styled from "@emotion/styled";

import APIFetch from "../../../utils/APIFetch";
import {MY_EVENT_REGS} from "../../../graphql/queries/event";

const eventID = process.env.eventID;

const MyEventsCard = styled.div`
    background: white;
    border-radius: 0.35rem;
    box-shadow: 3px 5px 8px rgba(0,0,0,0.15);
    .top-section {
      padding: 1rem;
      border-top-left-radius: 0.35rem;
      border-top-right-radius: 0.35rem;
      background: ${({ theme }) => theme?.colors.primary};
        color: ${({ theme }) => theme?.colors.primaryInv};
        h3 {
            font-weight: 600;
            margin-bottom: 0;
        }
    }
`;

const MyEventRegistrations = () => {

    const [events, setEvents] = useState(null);
    const [isLoaded, setLoaded] = useState(false);


    const fetchEvents = () => {
        APIFetch({
            query: MY_EVENT_REGS,
            variables: {
                eventID
            }
        }).then(({ data, success, errors }) => {
            if(success){
                setEvents(data.myEvents);
                setLoaded(true)
            }
        })
    };

    useEffect(fetchEvents, []);

    return isLoaded ?
    <MyEventsCard>
        <div className="top-section">
            <h3>My Registrations</h3>
        </div>
        {events?.length > 0 ?
        <div>
            <div className="row mx-0 p-2 alert-danger font-weight-bold py-2">
                <div className="col-5 col-md-6 p-1">
                        Event Name
                </div>
                <div className="col-3 p-1">Status</div>
                <div className="col-4 col-md-3 d-flex justify-content-end p-1">

                </div>
            </div>
            {events.map((e) =>
            <div className="row mx-0 border-top p-2">
                <div className="col-5 p-1">
                    <div className="font-weight-bold mb-0">
                        {e.event.name}
                    </div>
                </div>
                <div className="col-3 p-1">{
                    e.prize ?
                    <div style={{ fontSize: '110%' }} className="font-weight-bold text-success">
                        {e.prize === 1 ? 'Winner 🎉' : e.prize === 2 ? 'Runner-Up 🎉' : e.prize === 3 ? 'Second RunnerUp 🎉' : `${e.prize} prize 🎉`}
                    </div> :
                    e.isApproved ? <div className="text-success">Approved</div>
                        : <div className="text-danger">Pending</div>
                }</div>
                <div className="col-4 d-flex justify-content-end p-1">
                    {e?.isCertificateAvailable ?
                    <div className="mr-2">
                        <a href={`/my-certificate/${e.event.id}`} className="font-weight-bold" style={{ color: '#4a148c' }}>
                            Open Certificate
                        </a>
                    </div> :
                    e.isApproved && e.event.postApprovalFields?.length>0 ?
                    <a href={`/register/${e.event.slug}`} className="font-weight-bold btn btn-danger rounded-0 text-light px-1 px-md-2 py-2">
                        Submit Work
                    </a> :
                    <a href={`/register/${e.event.slug}`} className="text-primary">
                        Edit
                    </a>}
                </div>
            </div>
        )}</div> :
            <div className="p-2 d-flex align-items-center justify-content-center text-center" style={{ minHeight: '18vh' }}>
                <div>
                    <h3>No Registrations</h3>
                    <div className="font-weight-bold mb-3">You have not registered for any event (yet)</div>
                </div>
            </div>}
    </MyEventsCard> : <div />;


};

export default MyEventRegistrations;