import React from "react";

import Base from "../src/components/shared/Base";
import RegistrationForm from "../src/components/registration/RegisterForm";
import ViewAuthenticator from "../src/components/shared/ViewAuthenticator";

import FormButton from "../src/components/ui/styled-components/Button";

import '../src/styles/frame.css';
import OnBoarding from "../src/components/OnBoarding";


const RegisterFrame = () => {

    return <Base meta={{title: 'Register'}}>
        <ViewAuthenticator
            renderPublic={() => <div>
                <RegistrationForm type="register" isFrame />
            </div>}
            renderAuth={(userInfo) =>
            (userInfo?.isProfileComplete || userInfo?.type === 0) ?
            <div style={{ borderRadius: '1rem' }} className="bg-white text-center py-5 px-3">
                <h1 style={{ color: '#015970' }} className="my-3 font-weight-bold">Account Created</h1>
                <p className="mb-3" style={{ fontSize: '1.5rem' }}>
                    Please complete your profile opening the dashboard to complete your registration.
                </p>
                <a target="_blank" className="plain-link text-decoration-none mb-5" href="https://events.amrita.edu/">
                    <FormButton
                        text="Open Dashboard to Continue"
                        py={4} px={5} round={0}
                    />
                </a>
            </div> : <OnBoarding isFrame />}
        />
    </Base>;

};

export default RegisterFrame;