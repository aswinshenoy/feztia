import React from "react";

import Base from "../src/components/shared/Base";
import RegistrationForm from "../src/components/registration/RegisterForm";
import ViewAuthenticator from "../src/components/shared/ViewAuthenticator";

const RegisterFrame = () => {

    return <Base meta={{ title: 'Register' }}>
        <ViewAuthenticator
            renderPublic={() => <RegistrationForm type="register" isFrame />}
            renderAuth={() => <div className="p-3">
                <h1>Registered Successfully</h1>
                <a href="https://events.amrita.edu/" className="btn btn-primary px-4 py-3">
                    Open Dashboard
                </a>
            </div>}
        />
    </Base>;

};

export default RegisterFrame;