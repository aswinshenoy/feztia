import React, {useEffect} from 'react';

import Base from "../src/components/shared/Base";
import ViewAuthenticator from "../src/components/shared/ViewAuthenticator";
import {setUserInfo, useAuthState} from "../src/states";
import FormButton from "../src/components/ui/styled-components/Button";


const RegistrationCompletePage = () => {

    const [userInfo] = useAuthState('userInfo');

    useEffect(() => {
        setUserInfo({ ...userInfo, isProfileComplete: true });
    }, [])

    return <Base meta={{ title: 'Registration Completed' }}>
        <ViewAuthenticator
            renderAdmin={() => <div/>}
            renderJudge={() => <div/>}
            renderAuth={() => {
                return <div style={{ borderRadius: '1rem' }} className="bg-white text-center py-5 px-3">
                    <h1 style={{ color: '#015970' }} className="my-3 font-weight-bold">Registration Completed</h1>
                    <p className="mb-3" style={{ fontSize: '1.5rem' }}>
                        Thank You for Registering! You can now view your dashboard, where you will find more information.
                    </p>
                    <iframe
                        src={`https://dialstar.gotrackier.com/pixel?av=5ff7f18e59db1c1c700df39a&sub1=${userInfo?.id}&sub2=&sub3=&sub4=`}
                        scrolling="no" frameBorder="0"
                        width="1" height="1"
                    />
                    <a target="_blank" className="plain-link text-decoration-none mb-5" href="https://events.amrita.edu/">
                        <FormButton
                            text="Open Dashboard"
                            py={4} px={5} round={0}
                        />
                    </a>
                </div>
            }}
            renderPublic={() => <div />}
        />
    </Base>;

};

export default RegistrationCompletePage;