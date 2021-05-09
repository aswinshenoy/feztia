import React, { useState } from 'react';
import format from "date-fns/format";
import parseISO from "date-fns/parseISO";
import styled from "@emotion/styled";

import Header from "../../shared/Header";
import Footer from "../../shared/Footer";

import FormButton from "../../ui/styled-components/Button";

import SubmissionFeed from "../../dashboard/Feed";
import MarkdownViewer from "../../shared/MarkdownViewer";
import Winners from "./winners";

const CoverSection = styled.section`
    background: ${({ theme }) => theme?.colors.primary};
    color: white;
    min-height: 35vh;
    padding: 5vh 2.5vw;
    display: flex;
    align-items: flex-end;
    box-shadow: 1px 8px 8px rgba(0,0,0,0.25);
`;

const TabButton = styled.div`
    padding: 1rem;
    font-size: 18px;
    margin: 5px;
    cursor: pointer;
    background: ${({ active, theme }) => active ? theme?.colors.primary : `none!important` };
    color: ${({ active, theme }) => active ? theme?.colors.primaryInv : theme?.colors.primary };
`;


const CompetitionPage = ({ event, }) => {

    const [currentTab, setTab] = useState('about');

    return <div>
        <Header />
        <CoverSection>
            <div className="container">
                <div className="row mx-0">
                    <div className="col-md-6 px-2">
                        {event?.coverURL &&
                        <img
                            src={event?.coverURL}
                            alt={event?.name}
                            className="shadow rounded"
                            draggable="false"
                        />}
                    </div>
                    <div className="col-md-6 px-2">
                        <h1 className="display-4 mb-1 font-weight-bold">{event?.name}</h1>
                        <div
                            style={{ color: '#AF0C3E' }}
                            className="bg-white d-inline-block shadow-sm px-3 py-2 mb-3 rounded"
                        >
                            {event?.isTeamEvent ? 'Team Competition' : 'Individual Competition'}
                        </div>
                        <div style={{ fontSize: '18px'}}>{event?.shortDescription}</div>
                        <div className="mt-3 text-dark bg-white d-inline-block p-3 rounded">
                            {(event?.acceptRegistrations && event?.isUserAllowedToRegister) ?
                                <div>
                                    <FormButton
                                        text="Register Now"
                                        link={`/register/${slug}`}
                                        py={3} px={4} fw
                                    />
                                    {event?.registrationCloseTimestamp &&
                                    <div style={{ fontSize: '17px' }} className="mt-3 text-danger text-center">
                                        Registrations close at {format(parseISO(event?.registrationCloseTimestamp), 'hh:MM a, dd-MM-yyyy')}
                                    </div>}
                                </div> :
                                event?.acceptRegistrations ?
                                    <div>
                                        This event is not open for you.
                                    </div> :
                                    <div>
                                        This event is not accepting registrations at the moment.
                                    </div>}
                        </div>
                    </div>
                </div>
            </div>
        </CoverSection>
        {(event?.hasGallery || event?.hasWinners) &&
        <div className="p-0 d-flex align-items-center justify-content-center bg-white">
            <TabButton onClick={() => setTab('about')} active={currentTab==='about'}>
                About
            </TabButton>
            {event?.hasGallery  &&
            <TabButton onClick={() => setTab('submissions')} active={currentTab==='submissions'}>
                View Submissions
            </TabButton>}
            {event?.hasWinners  &&
            <TabButton onClick={() => setTab('winners')} active={currentTab==='winners'}>
                View Winners
            </TabButton>}
        </div>}
        <div className="container px-2">
            {currentTab === 'submissions' ?
                <div className="my-3">
                    <SubmissionFeed eventID={event?.id} event={event} />
                </div> :
            currentTab === 'about' ?
                <div className="bg-white p-3 my-3 shadow">
                    <MarkdownViewer content={event?.details}/>
                </div> :
            currentTab === 'winners' ?
                <div className="my-3">
                    <Winners eventID={event?.id} />
                </div> :
            null}
        </div>
        <Footer />
    </div>

};

export default CompetitionPage;