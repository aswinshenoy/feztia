import React from 'react';

import Base from "../../../src/components/shared/Base";
import Header from "../../../src/components/shared/Header";
import AdminPanel from "../../../src/components/admin";
import RegistrationForm from "../../../src/components/registration/RegisterForm";
import ViewAuthenticator from "../../../src/components/shared/ViewAuthenticator";


const EventAdmin = ({ id }) => {

    return <ViewAuthenticator
        renderAdmin={() =>
        <Base meta={{ title: 'Admin Panel' }}>
            <Header />
            <div className="container-lg px-2 py-5">
                <AdminPanel eventID={id} />
            </div>
        </Base>}
        renderAuth={() =>
        <div>
            <h1>Access Denied</h1>
        </div>}
        renderPublic={() =>
        <Base meta={{ title: 'Registration' }}>
            <RegistrationForm />
        </Base>}
    />;

};

EventAdmin.getInitialProps = async ({ query }) => { return { id: query.id }; };

export default EventAdmin;