import React from 'react';

import ViewAuthenticator from "../../../src/components/shared/ViewAuthenticator";
import Base from "../../../src/components/shared/Base";
import Header from "../../../src/components/shared/Header";
import RegistrationForm from "../../../src/components/registration/RegisterForm";
import EmailSender from "../../../src/components/admin/EmailSender";


const BulkEmailerPage = ({ id }) => {

    return <ViewAuthenticator
        renderAdmin={() =>
            <Base meta={{ title: 'Send Bulk Emails' }}>
                <Header />
                <EmailSender eventID={id} />
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

BulkEmailerPage.getInitialProps = async ({ query }) => {
    return { id: query.id };
};

export default BulkEmailerPage;