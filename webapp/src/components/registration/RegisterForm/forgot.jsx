import React, {useState} from "react";
import {Col, Row} from "srx";
import Fade from "react-reveal/Fade";
import {useMutation} from "graphql-hooks";

import {REQUEST_PASSWORD_RESET, RESET_PASSWORD__MUTATION} from "../../../graphql/queries/user";
import FormButton from "../../ui/styled-components/Button";
import Input from "../../ui/form/Input";
import OTP from "../../ui/form/OTP";

const ResetForm = ({  }) => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [otp, setOTP] = useState('');
    const [hasEmailed, setEmailed] = useState(false);
    const [changed, setChanged] = useState(false);
    const [isInvalid, setInvalid] = useState(false);

    const [requestPasswordReset] = useMutation(REQUEST_PASSWORD_RESET);
    const [resetPassword] = useMutation(RESET_PASSWORD__MUTATION)

    const handleSubmit = (e) => {
        e.preventDefault();
        if(!hasEmailed){
            requestPasswordReset({ variables: { email }}).then(({ data, error }) => {
                if(data?.requestPasswordReset){
                    setEmailed(true);
                } else {
                    setInvalid(true);
                }
            })
        } else {
            if(password.length > 5 && otp.length === 6){
                resetPassword({ variables: { email, otp, password }}).then(({ data, error }) => {
                    if(data?.resetPassword){
                        setInvalid(false);
                        setChanged(true);
                    } else {
                        setInvalid(true)
                    }
                })
            }
        }
    }

    return <form className="py-3 h-100" onSubmit={handleSubmit}>
        {
            changed ?
                <React.Fragment>
                    <div className="my-1">
                        <Fade up delay={100}>
                            <h1 className="font-weight-bold text-success">Password Changed</h1>
                        </Fade>
                    </div>
                    <p className="p-1">
                        Your password has been successfully changed. You can login with your new password now.
                    </p>
                </React.Fragment> :
            hasEmailed ?
                <React.Fragment>
                    {isInvalid && <div className="text-danger my-2">
                        <p>Please check the details you provided, we could not validate the request</p>
                    </div>}
                    <Fade up delay={100}>
                        <OTP
                            value={otp}
                            onChange={setOTP}
                            allowResend={false}
                        />
                    </Fade>
                    {otp.length === 6 &&
                    <div className="my-1 p-2">
                        <Fade up delay={100}>
                            <Input
                                value={password}
                                onChange={setPassword}
                                type="password"
                                autoComplete="new-password"
                                label="New Password"
                                placeholder="Enter new password"
                                className="w-100"
                            />
                        </Fade>
                    </div>}
                    <Fade up delay={300}>
                        {otp.length < 6 ?
                            `Please check your email for the OTP code.` :
                            password.length < 8 ?
                                `Please enter a new strong password with at-least 8 characters.`
                                : <div className="p-2 mt-3">
                                    <FormButton
                                        key="reset-password"
                                        text="Reset"
                                        type="submit" fw
                                        py={4} px={4} round={0}
                                    />
                                </div>
                        }
                    </Fade>
            </React.Fragment> :
            <React.Fragment>
                {isInvalid && <div className="text-danger my-2">
                    <p>Please check the email you have entered, we couldn't verify it.</p>
                </div>}
                <Fade up delay={100}>
                    <Input
                        label="Email"
                        name="email"
                        type="email"
                        value={email}
                        onChange={setEmail}
                        autoComplete="email"
                        placeholder="Enter Your Email"
                        isRequired
                        className="w-100"
                    />
                </Fade>
                <Fade up delay={300}>
                    <Row mt={4} p={0}>
                        <Col md={6} p={2} flexVC>
                            <div className="pr-2 pb-3" style={{ fontSize: '12px', lineHeight: '1.3' }}>
                                We will send you a code with which you can recover your password.
                            </div>
                        </Col>
                        <Col md={6} p={1} flexHR>
                            <FormButton
                                key="reset-password"
                                text="Get Code"
                                type="submit" fw
                                py={4} px={5} round={0}
                            />
                        </Col>
                    </Row>
                </Fade>
            </React.Fragment>
        }
        </form>

};

export default ResetForm;