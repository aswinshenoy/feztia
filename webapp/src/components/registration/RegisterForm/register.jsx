import React, {useEffect, useState} from 'react';
import {Col, Row } from "srx";
import Fade from "react-reveal/Fade";

import FormButton from "../../ui/styled-components/Button";
import Input from "../../ui/form/Input";

const RegisterForm = ({ onRegister = () => {} }) => {

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passConfirm, setPassConfirm] = useState('');
    const [passwordMismatch, setPasswordMismatch] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        if(passConfirm!==password) setPasswordMismatch(true);
        else {
            onRegister({ name, email, password });
        }
    };

    useEffect(() => {
        if(passConfirm.length > 0 && !password.startsWith(passConfirm)){
            setPasswordMismatch(true)
        } else {
            setPasswordMismatch(false)
        }
    }, [passConfirm])

    return <form className="py-2" onSubmit={handleSubmit}>
        <div className="mb-2">
            <Fade up delay={100}>
                <Input
                    label="Name"
                    name="name"
                    title="Please enter your name"
                    value={name}
                    onChange={setName}
                    placeholder="Enter Your Name"
                    alwaysShowLabel
                    isRequired
                    className="w-100"
                />
            </Fade>
        </div>
        <div className="mb-2">
            <Fade up delay={200}>
                <Input
                    label="Email"
                    name="email"
                    type="email"
                    value={email}
                    autoComplete="email"
                    onChange={setEmail}
                    placeholder="Enter Your Email"
                    alwaysShowLabel
                    isRequired
                    className="w-100"
                />
            </Fade>
        </div>
        <div className="mb-2">
            <Fade up delay={300}>
                <Input
                    label="Password"
                    name="new-password"
                    type="password"
                    value={password}
                    onChange={setPassword}
                    autoComplete="new-password"
                    placeholder="Enter Your Password"
                    alwaysShowLabel
                    isRequired
                    className="w-100"
                />
            </Fade>
        </div>
        <div className="mb-3">
            <Fade up delay={400}>
                <Input
                    label="Confirm Password"
                    name="repeat-password"
                    type="password"
                    value={passConfirm}
                    onChange={setPassConfirm}
                    placeholder="Confirm Your Password"
                    autoComplete="new-password"
                    alwaysShowLabel
                    isRequired
                    className="w-100"
                    errorText={passwordMismatch ? 'Passwords do not match' : null}
                />
            </Fade>
        </div>
        <Fade up delay={500}>
            <Row mt={2} py={2}>
                <Col md={8} p={1} flexVC>
                    <div className="pr-2 pb-3" style={{ fontSize: '10px', lineHeight: '1.6' }}>
                        By registering for {process.env.eventName}, you accept our
                        <span className="d-inline-block">
                            <a href="/terms" className="font-weight-bold pr-1">Terms & Conditions</a> and
                            <a href="/privacy" className="font-weight-bold pl-1">Privacy Policy</a>.
                        </span>
                    </div>
                </Col>
                <Col md={4} p={0} flexHR>
                    <FormButton
                        key="register-button"
                        text="Register"
                        type="submit" fw
                        py={4} px={5} round={0}
                        isDisabled={passwordMismatch}
                    />
                </Col>
            </Row>
        </Fade>
    </form>

};

export default RegisterForm;