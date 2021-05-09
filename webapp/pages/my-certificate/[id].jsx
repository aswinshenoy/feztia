import React from 'react';
import Base from "../../src/components/shared/Base";

import RegistrationForm from "../../src/components/registration/RegisterForm";
import ViewAuthenticator from "../../src/components/shared/ViewAuthenticator";
import ParticipationCertificate from "../../src/components/ParticipationCertificate";


const ParticipationCertificatePage = ({ id }) => {

    return <ViewAuthenticator
        renderAdmin={() => <ParticipationCertificate id={id} />}
        renderAuth={() => <ParticipationCertificate id={id} />}
        renderPublic={() =>
            <Base meta={{ title: 'Registration' }}>
                <RegistrationForm />
            </Base>}
    />

}

ParticipationCertificatePage.getInitialProps = async ({ query }) => {
    return { id: query.id };
};

export default ParticipationCertificatePage;