import React from 'react';

import ViewAuthenticator from "../../../src/components/shared/ViewAuthenticator";
import Base from "../../../src/components/shared/Base";
import Header from "../../../src/components/shared/Header";
import AccountsViewer from "../../../src/components/admin/AccountsViewer";
import RegistrationForm from "../../../src/components/registration/RegisterForm";

const RegistrationsViewer = ({ id }) => {

    return <ViewAuthenticator
        renderAdmin={() =>
            <Base meta={{ title: 'View Registrations' }}>
                <Header />
                <AccountsViewer eventID={id} />
            </Base>
        }
        renderAuth={() =>
            <div>
                <h1>Access Denied</h1>
            </div>}
        renderPublic={() =>
            <Base meta={{ title: 'Registration' }}>
                <RegistrationForm />
            </Base>
        }
    />;

};

RegistrationsViewer.getInitialProps = async ({ query }) => {
    return { id: query.id };
};

export default RegistrationsViewer;