import React from 'react';

import Base from "../src/components/shared/Base";
import ViewAuthenticator from "../src/components/shared/ViewAuthenticator";
import {setUserInfo, useAuthState} from "../src/states";
import FormButton from "../src/components/ui/styled-components/Button";


const RegistrationCompletePage = () => {

    const [userInfo] = useAuthState('userInfo');
    setUserInfo({ isProfileComplete: true });

    return <ViewAuthenticator
        renderAdmin={() => <div/>}
        renderJudge={() => <div/>}
        renderAuth={() => {
            return <Base meta={{ title: 'Registration Completed' }}>
                <div style={{ borderRadius: '1rem' }} className="bg-white text-center py-5 px-3">
                    <h1 style={{ color: '#015970' }} className="my-3 font-weight-bold">Registration Completed</h1>
                    <p className="mb-3" style={{ fontSize: '1.5rem' }}>
                        Thank You for Registering! You can now view your dashboard, where you will find more information.
                    </p>
                    <a target="_blank" className="plain-link text-decoration-none mb-5" href="https://events.amrita.edu/">
                        <FormButton
                            text="Open Dashboard"
                            py={4} px={5} round={0}
                        />
                    </a>
                </div>
            </Base>;
        }}
        renderPublic={() => <div />}
    />;

};

    export default RegistrationCompletePage;