import React from 'react';

import Base from "../../../src/components/shared/Base";
import Header from "../../../src/components/shared/Header";

import ViewAuthenticator from "../../../src/components/shared/ViewAuthenticator";
import RegistrationVerifier from "../../../src/components/admin/RegistrationVerifier";
import RegistrationForm from "../../../src/components/registration/RegisterForm";

const VerifyPage = ({ eventID }) => {

    return <ViewAuthenticator
        renderAdmin={() =>
        <Base meta={{ title: 'Verify Registrations' }}>
            <Header />
            <div className="container-lg px-2 py-5">
                <RegistrationVerifier eventID={eventID} />
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

VerifyPage.getInitialProps = async ({ query }) => {
    return { eventID: query.id };
};

export default VerifyPage;
