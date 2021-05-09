import React, { useEffect, useState } from "react";
import Base from "../../src/components/shared/Base";
import Header from "../../src/components/shared/Header";

import APIFetch from "../../src/utils/APIFetch";
import {EVENT_REG_FORM_QUERY, MY_BASIC_EVENT_PROFILE_QUERY} from "../../src/graphql/queries/event";
import EventRegister from "../../src/components/register";
import FormButton from "../../src/components/ui/styled-components/Button";
import Footer from "../../src/components/shared/Footer";
import AdminPanel from "../../src/components/admin";
import ViewAuthenticator from "../../src/components/shared/ViewAuthenticator";
import RegistrationForm from "../../src/components/registration/RegisterForm";
import EventWorkSubmit from "../../src/components/register/work";

const eventID = process.env.eventID;

const EventRegistrationPage = ({ slug }) => {

    const [event, setEvent] = useState(null);
    const [myProfile, setProfile] = useState(null);
    const [isRegistered, setRegistered] = useState(false);
    const [isEditor, showEditor] = useState(false);
    const [isWorkEditor, showWorkEditor] = useState(false);

    const fetchForm = () => {
        APIFetch({
            query: EVENT_REG_FORM_QUERY,
            variables: {
                slug,
                parentID: eventID
            }
        }).then(({ success, data, errors }) => {
            if(success) {
                APIFetch({
                    query: MY_BASIC_EVENT_PROFILE_QUERY,
                    variables: {
                        eventID: data?.event.id
                    }
                }).then(({ success, data: profile, errors }) => {
                    setEvent(data.event);
                    if(success) {
                        setProfile(profile.myEventProfile);
                        setRegistered(true);
                    }
                })

            }
        })
    };

    useEffect(fetchForm, []);

    return <ViewAuthenticator
        renderAdmin={() =>
            <Base meta={{ title: 'Admin Panel' }}>
                <Header />
                <div className="container-lg px-2 py-5">
                    <AdminPanel />
                </div>
            </Base>
        }
        renderAuth={() =>
        <Base meta={{ title: 'Competition Registration' }}>
            <Header />
            <div style={{ minHeight: '90vh' }}>
            {isWorkEditor ?
                <EventWorkSubmit
                    isEditor
                    myProfile={myProfile}
                    event={event}
                    onRegister={(p) => { showWorkEditor(false);  }}
                /> :
            isEditor ?
                <EventRegister
                    isEditor
                    myProfile={myProfile}
                    event={event}
                    onRegister={(p) => { fetchForm(); showEditor(false); setProfile(p); setRegistered(true) }}
                /> :
            isRegistered ?
                <div className="container p-2 my-3 d-flex align-items-center justify-content-center">
                    <div>
                        <nav aria-label="breadcrumb">
                            <ol className="mb-3 breadcrumb bg-white shadow-sm">
                                <li className="breadcrumb-item"><a href="/">Dashboard</a></li>
                                <li className="breadcrumb-item"><a href={`/event/${event?.slug}`}>{event?.name}</a></li>
                                <li className="breadcrumb-item active" aria-current="page">Registration</li>
                            </ol>
                        </nav>
                        <div className="bg-white p-3 shadow-sm" style={{ width: '720px', maxWidth: '100%' }}>
                            <h1 style={{ color: '#AF0C3E', fontWeight: '600' }}>
                                {!myProfile?.isApproved ? 'Pending Approval' : 'Registration Successful'}
                            </h1>
                            {!myProfile?.isApproved  ?
                                <p>
                                    We will inform you by email and through your dashboard once
                                    your registration / submission is approved.
                                </p> :
                                <p>
                                    You have successfully registered for the event
                                </p>}
                            {(!myProfile?.isApproved && event?.formFields?.length > 0) &&
                            <div>
                                <FormButton
                                    text="Edit Registration"
                                    onClick={() => showEditor(true)}
                                    px={4} py={3}
                                />
                            </div>}
                            {(myProfile?.isApproved && event?.postApprovalFields?.length > 0) &&
                            <div>
                                <FormButton
                                    text="Submit Work"
                                    onClick={() => showWorkEditor(true)}
                                    px={4} py={3}
                                />
                            </div>}
                        </div>
                    </div>
                </div> :
            event ?
                <EventRegister
                    event={event}
                    onRegister={(p) => { setProfile(p); setRegistered(true) }}
                /> :
            <div>Loading</div>}
            </div>
            <Footer />
        </Base>}
        renderPublic={() =>
            <Base meta={{ title: 'Registration' }}>
                <RegistrationForm />
            </Base>
        }
        />

};

EventRegistrationPage.getInitialProps = async ({ query }) => {
    return { slug: query.slug };
};

export default EventRegistrationPage;