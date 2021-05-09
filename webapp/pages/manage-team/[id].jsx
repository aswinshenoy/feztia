import React from 'react';
import ViewAuthenticator from "../../src/components/shared/ViewAuthenticator";
import Base from "../../src/components/shared/Base";
import Header from "../../src/components/shared/Header";
import AdminPanel from "../../src/components/admin";
import RegistrationForm from "../../src/components/registration/RegisterForm";

const eventID = process.env.eventID;


const TeamManagerPage = ({ id }) => {

    return <ViewAuthenticator
        renderAdmin={() =>
            <Base meta={{ title: 'Admin Panel' }}>
                <Header />
                <div className="container-lg px-2 py-5">
                    <AdminPanel eventID={eventID} />
                </div>
            </Base>}
        renderAuth={() =>
            <Base meta={{ title: 'Manage My Team' }}>
                <Header />
            </Base>
        }
        renderPublic={() =>
            <Base meta={{ title: 'Registration' }}>
                <RegistrationForm />
            </Base>}
    />;

};

TeamManagerPage.getInitialProps = async ({ query }) => {
    return { id: query.id };
};

export default TeamManagerPage;