import React, {useEffect, useState} from 'react';
import {Col, Row} from "srx";
import {useMutation} from "graphql-hooks";

import {RESEND_EMAIL_MUTATION, VERIFY_EMAIL_MUTATION} from "../../graphql/queries/otp";
import FormButton from "../ui/styled-components/Button";
import OTP from "../ui/form/OTP";


const EmailVerifyCard = ({
    profile, onVerify = () => {}, onRequestChange = () => {},
}) => {

    const [otp, setOtp] = useState('');
    const [isVerified, setVerified] = useState(profile?.emailVerified);

    const [verifyOTP] = useMutation(VERIFY_EMAIL_MUTATION);

    const handleSubmit = (e) => {
        e.preventDefault();
        if(isVerified){
            onVerify({ ...profile, emailVerified: true });
        }
    };

    const [requestNewEmail] = useMutation(RESEND_EMAIL_MUTATION);
    const handleRequestNewMail = (e) => {
        e.preventDefault();
        requestNewEmail().then(({ data, error }) => {
            if(data?.resendConfirmationEmail){
                console.log('new mail send')
            }
        })
    };

    useEffect(() => {
        if(!isVerified && otp.length >= 6){
            verifyOTP({ variables: { otp }}).then(({ data, error }) => {
                if(data?.verifyEmail){
                    setVerified(true);
                } else {
                    setVerified(false);
                }
            })
        }
    }, [otp]);

    return <form onSubmit={handleSubmit}>
        {profile?.emailVerified ?
        <React.Fragment>
            <h2 className="font-weight-bold text-success">Email Verified</h2>
            <p className="mb-5" style={{ maxWidth: '550px' }}>
                Thank You. We have already verified your email -  <span style={{ color: '#AF0C3E' }}>{profile?.email}</span>.
                If you would like to change this email, you could do that later.
            </p>
        </React.Fragment> :
        <React.Fragment>
            <h2 style={{ color: '#AF0C3E', fontWeight: '600' }} className="mb-3">Let's Verify Your Email</h2>
            <p style={{ maxWidth: '600px' }}>
                We have already send you a code to
                <span className="px-1" style={{ color: '#AF0C3E' }}>{profile?.email}</span>
                <button
                    onClick={onRequestChange}
                    type="button"
                    className="plain-button text-primary font-weight-bold pl-0 pr-1"
                >
                    (Change)
                </button>,
                please check your inbox and enter the code below to verify your email.
            </p>
            <OTP
                isVerified={isVerified}
                value={otp}
                onChange={setOtp}
                onRequestNewOTP={handleRequestNewMail}
            />
        </React.Fragment>}
        <Row>
            <Col md={8} />
            {(isVerified) &&
            <Col md={4} p={1} flexHR>
                <FormButton
                    text="Continue"
                    type="submit" fw
                    py={4} px={5} round={0}
                />
            </Col>}
        </Row>
    </form>;

};

export default EmailVerifyCard;