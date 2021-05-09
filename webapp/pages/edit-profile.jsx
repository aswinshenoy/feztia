import React from 'react';

import RegistrationForm from "../src/components/registration/RegisterForm";
import OnBoarding from "../src/components/OnBoarding";

import Base from "../src/components/shared/Base";
import ViewAuthenticator from "../src/components/shared/ViewAuthenticator";

const RegisterPage = () => {

    return <ViewAuthenticator
        renderAdmin={() =>
            <Base meta={{ title: 'Complete Your Profile' }}>
                <OnBoarding startZero />
            </Base>
        }
        renderAuth={() =>
            <Base meta={{ title: 'Complete Your Profile' }}>
                <OnBoarding startZero />
            </Base>
        }
        renderPublic={() =>
            <Base meta={{ title: 'Registration' }}>
                <RegistrationForm />
            </Base>
        }
    />;

};

export default RegisterPage;