import React, {useState} from "react";
import {Col, Row} from "srx";
import Fade from "react-reveal/Fade";

import Input from "../../ui/form/Input";
import FormButton from "../../ui/styled-components/Button";

const LoginForm = ({ onLogin = () => {}, onReset = () => {} }) => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        onLogin({ email, password });
    }

    return <form className="py-3 h-100" onSubmit={handleSubmit}>
        <div className="mb-2">
            <Fade up delay={100}>
                <Input
                    label="Email"
                    name="email"
                    type="email"
                    value={email}
                    onChange={setEmail}
                    autoComplete="email"
                    placeholder="Enter Your Email"
                    alwaysShowLabel
                    isRequired
                    className="w-100"
                />
            </Fade>
        </div>
        <div className="mb-2">
            <Fade up delay={200}>
                <Input
                    label="Password"
                    name="current-password"
                    type="password"
                    value={password}
                    onChange={setPassword}
                    autoComplete="current-password"
                    placeholder="Enter Your Password"
                    alwaysShowLabel
                    isRequired
                    className="w-100"
                />
            </Fade>
        </div>
        <Fade up delay={300}>
            <Row mt={2} py={2}>
                <Col md={8} p={2} flexVC>
                    <div className="pr-2 pb-3" style={{ fontSize: '13px', lineHeight: '1.6' }}>
                        Facing trouble to login?
                        <button
                           onClick={onReset} title="Get help with login"
                           style={{ color: '#AF0C3E' }} type="button"
                           className="font-weight-bold plain-button px-1"
                        >
                            Get Help
                        </button>
                    </div>
                </Col>
                <Col md={4} p={0} flexHR>
                    <FormButton
                        key="login-button"
                        text="Login"
                        type="submit" fw
                        py={4} px={5} round={0}
                    />
                </Col>
            </Row>
        </Fade>
    </form>

};

export default LoginForm;