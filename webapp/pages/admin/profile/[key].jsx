import React from 'react';

import ViewAuthenticator from "../../../src/components/shared/ViewAuthenticator";
import Base from "../../../src/components/shared/Base";
import Header from "../../../src/components/shared/Header";
import RegistrationForm from "../../../src/components/registration/RegisterForm";
import ProfileViewer from "../../../src/components/admin/ProfileViewer";

const ProfileViewerPage = ({ keyword }) => {

    return <ViewAuthenticator
        renderAdmin={() =>
            <Base meta={{ title: 'View Profile' }}>
                <Header />
                <ProfileViewer keyword={keyword} />
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

ProfileViewerPage.getInitialProps = async ({ query }) => {
    return { keyword: query['key'] };
};

export default ProfileViewerPage;