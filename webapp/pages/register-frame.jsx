import React from "react";

import Base from "../src/components/shared/Base";
import RegistrationForm from "../src/components/registration/RegisterForm";
import ViewAuthenticator from "../src/components/shared/ViewAuthenticator";

import {Button} from "srx";
import FormButton from "../src/components/ui/styled-components/Button";

const RegisterFrame = () => {

    return <Base meta={{title: 'Register'}}>
        <ViewAuthenticator
            renderPublic={() => <div>
                <RegistrationForm type="register" isFrame/>
            </div>}
            renderAuth={() =>
            <div className="p-3">
                <h1 className="mb-3 font-weight-bold">Registered Successfully</h1>
                <a target="_blank" href="https://events.amrita.edu/">
                    <FormButton
                        text="Open Dashboard"
                        py={4} px={5} round={0}
                    />
                </a>
            </div>}
        />
    </Base>;

};

export default RegisterFrame;