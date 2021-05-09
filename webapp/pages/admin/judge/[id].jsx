import React from 'react';

import Base from "../../../src/components/shared/Base";
import Header from "../../../src/components/shared/Header";
import RegistrationForm from "../../../src/components/registration/RegisterForm";
import ViewAuthenticator from "../../../src/components/shared/ViewAuthenticator";
import JudgingPanel from "../../../src/components/admin/Judging";


const JudgeAdmin = ({ id }) => {

    return <ViewAuthenticator
        renderAdmin={() =>
            <Base meta={{ title: 'Judging Panel' }}>
                <Header />
                <div className="container-lg px-2 py-5">
                    <JudgingPanel eventID={id} />
                </div>
            </Base>}
        renderJudge={() =>
            <Base meta={{ title: 'Judging Panel' }}>
                <Header />
                <div className="container-lg px-2 py-5">
                    <JudgingPanel eventID={id} />
                </div>
            </Base>
        }
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

JudgeAdmin.getInitialProps = async ({ query }) => { return { id: query.id }; };

export default JudgeAdmin;