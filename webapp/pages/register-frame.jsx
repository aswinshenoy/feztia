import React from "react";

import Base from "../src/components/shared/Base";
import RegistrationForm from "../src/components/registration/RegisterForm";
import ViewAuthenticator from "../src/components/shared/ViewAuthenticator";

import {Button} from "srx";

const RegisterFrame = () => {

    return <Base meta={{title: 'Register'}}>
        <ViewAuthenticator
            renderPublic={() => <div>
                <RegistrationForm type="register" isFrame/>
            </div>}
            renderAuth={() =>
            <div className="p-3">
                <h1>Registered Successfully</h1>
                <Button
                    variant="primary"
                    link="https://events.amrita.edu/"
                    px={4} py={3}
                    text="Open Dashboard"
                />
            </div>}
        />
    </Base>;

};

export default RegisterFrame;