import React from 'react';
import styled from "@emotion/styled";
import OtpInput from "react-otp-input";

const OTPBoxes = styled(OtpInput)`
    input {
        padding: 0.5rem;
        margin-right: min(5px, 2vw);
        font-size: calc(0.8rem + 0.8vw);
        width: min(50px, 13vmax)!important;
        height: min(50px, 13vmax)!important;
        border: ${({ success, failed }) =>
            failed ? `3px solid red!important` :
                success ? `3px solid green!important`
                    : `3px solid #999!important`
        };
        &:focus {
          outline: none!important;
          border-color: ${({ success, failed }) =>
            failed ? `red!important` :
                success ? `green!important`
                    : `#AF0C3E!important`
          };
        }
    }
`;

const OTP = ({
    isVerified, isVerifying, value, OTPLength = 6,
    allowResend = true,
    onChange = () => {}, onRequestNewOTP = () => {},
}) => {

    return <div>
        <div className="px-2 py-3">
            <div className="font-weight-bold mb-2">Enter Code</div>
            <OTPBoxes
                success={isVerified}
                failed={isVerifying===false&&isVerified===false&&value?.length===6}
                value={value}
                onChange={(v) => !isVerified ? onChange (v) : null}
                numInputs={OTPLength}
                separator={<span />}
                isInputNum
            />
            {isVerified ?
            <div className="mt-4">
                Verified successfully.
            </div>:
            allowResend ? <div className="mt-4">
                Didn't get a code?
                <button
                    onClick={onRequestNewOTP}
                    type="button"
                    className="plain-button px-1 font-weight-bold"
                    style={{ color: '#AF0C3E' }}
                >
                    Resend OTP
                </button>
            </div> : null}
        </div>
    </div>

};

export default OTP;