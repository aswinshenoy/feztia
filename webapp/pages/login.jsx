import React from 'react';

import RegistrationForm from "../src/components/registration/RegisterForm";
import OnBoarding from "../src/components/OnBoarding";

import DashboardPage from "../src/components/dashboard";
import Base from "../src/components/shared/Base";
import ViewAuthenticator from "../src/components/shared/ViewAuthenticator";

const RegisterPage = () => {

    return <ViewAuthenticator
        renderAdmin={() => <DashboardPage />}
        renderJudge={() => <DashboardPage />}
        renderAuth={(userInfo) =>
            !userInfo?.isProfileComplete ?
                <Base meta={{ title: 'Complete Your Profile' }}>
                    <OnBoarding />
                </Base> : <DashboardPage />
        }
        renderPublic={() =>
            <Base meta={{ title: 'Login' }}>
                <RegistrationForm type="login" />
            </Base>
        }
    />;

};

export default RegisterPage;