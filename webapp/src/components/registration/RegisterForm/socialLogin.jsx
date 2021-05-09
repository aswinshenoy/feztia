import React from 'react';
import styled from "@emotion/styled";
import {Button, Col, Row} from "srx";

const SocialButton = styled(Button)`
    text-align: left!important;
    color: #eee!important;
    background: #555!important;
    transition: all 0.25s ease-in;
    box-shadow: 3px 5px 8px rgba(0,0,0,0.3);
    padding: 0.5rem!important;
    width: 100%;
    justify-content: start!important;
    border-radius: 0!important;
    img {
        width: 32px;
        padding: 3px;
        margin-right: 8px;
        background: white;
        border-radius: 3px;
    }
    span {
      font-size: 12px!important;
      font-weight: 400;
      display: block;
      margin-bottom: 2px;
      text-transform: lowercase;
    }
    b {
      font-size: 16px!important;
      font-weight: 600;
    }
    &:hover, &:focus{
       box-shadow: none!important;
       transition: all 0.25s ease-in;
    }
`;
const SocialLogin = () => {

    return <div>
        <div className="text-center font-italic my-3">or else you can</div>
        <Row>
            <Col s={6} px={1}>
                <SocialButton
                >
                    <img
                        src={require('../../../assets/icons/google_icon.png')}
                        alt="Login with Google" draggable="false"
                    />
                    <div>
                        <span>Continue with</span>
                        <b>Google</b>
                    </div>
                </SocialButton>
            </Col>
            <Col s={6} px={1}>
                <SocialButton
                >
                    <img
                        src={require('../../../assets/icons/microsoft_icon.png')}
                        alt="Login with Microsoft" draggable="false"
                    />
                    <div>
                        <span>Continue with</span>
                        <b>Microsoft</b>
                    </div>
                </SocialButton>
            </Col>
        </Row>
    </div>

};

export default SocialLogin;