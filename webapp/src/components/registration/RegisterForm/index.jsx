import React, {useState} from 'react';
import styled from "@emotion/styled";
import classNames from 'classnames';
// import {Col, Row} from "srx";
import { useMutation } from 'graphql-hooks'
import Fade from "react-reveal/Fade";

import RegisterForm from "./register";
import LoginForm from "./login";
// import SocialLogin from "./socialLogin";

import {LOGIN_MUTATION, REGISTER_MUTATION} from "../../../graphql/queries/user";
import {setUserInfo} from "../../../states";
import ResetForm from "./forgot";
import Header from "../../shared/Header";

const TabSwitchers = styled.div`
    button {
      font-size: 1.75rem;
      font-weight: 500;
      padding: 0.75rem;
      border-bottom: ${({ theme }) => `3.5px solid ${theme.colors.primary}`};
      width: 50%;
    }
    .active {
      color: ${({ theme }) => theme?.colors.primary};
      font-weight: 600;
      border-bottom: ${({ theme }) => `3.5px solid ${theme.colors.primary}`};;
    }
`;


const RegisterPageWrapper = styled.main`
  width: 100%;
  background-color: #340853;
  background-size: cover;
  min-height: 100vh;
  //.container-lg{
  //    display: flex;
  //    align-items: center;
  //    justify-content: center;
  //    min-height: 100vh;
  //    max-width: 900px;
  //}
  .footer-organizer-bar {
      padding: 1rem;
      text-align: center;
      color: ${({ theme }) => theme?.colors.primaryInv};
      background-color: ${({ theme }) => theme?.colors.primary};
      img {
          max-height: 64px;
      }
  }
`;


const eventID = process.env.eventID;
const organizerURL = process?.env?.links?.organizerURL || null;
const organizerName = process?.env?.labels?.organizerName || null;

const RegistrationForm = ({ type = 'login' }) => {

    const [currentTab, setTab] = useState(type);

    const [isRegistering, setRegistering] = useState(false);
    const [error, setError] = useState(null);

    const [registerUser] = useMutation(REGISTER_MUTATION);
    const [loginUser] = useMutation(LOGIN_MUTATION);

    const handleSignIn = ({ email, password }) => {
        loginUser({ variables: { username: email, password }}).then(({ data, error}) => {
            setRegistering(false);
            if(data?.authenticateUser?.success){
                setUserInfo({
                    ...data.authenticateUser.user,
                });
            } else {
                setError(error);
            }
        });
    };

    const handleRegisterFormSubmit = (p) => {
        setRegistering(true)
        registerUser({
            variables: {
                input: {
                    email: p.email,
                    password: p.password,
                    name: p.name,
                    eventID
                }
            }
        }).then(({ data, error}) => {
            if(data?.register?.success){
                handleSignIn({ email: p.email, password: p.password });
            } else {
                setRegistering(false);
                setError(error)
            }
        });
    };

    const renderError = () =>
    <div className="alert-danger mt-3 p-3">
        {error?.graphQLErrors?.length > 0 ?
            <div>
                {error.graphQLErrors[0].message}
                <span className="d-block"> code: {error.graphQLErrors[0].code}</span>
            </div> :
            <div>
                An unknown error occurred. Try Again.
            </div>
        }
    </div>

    return <RegisterPageWrapper
        style={{ backgroundImage: `url(${require('../../../assets/backgrounds/login_page.jpg')})` }}
    >
        <div className="w-100" style={{ minHeight: '120px' }}>
            <Header transparent hideAuthButtons hideHeaderNav />
        </div>
        <div style={{ minHeight: '90vh' }} className="d-block d-md-flex align-items-center justify-content-center px-0">
            <div>
                <Fade up timeout={500}>
                    <section className="bg-white  pb-5 rounded-top shadow" style={{ width: '450px', maxWidth: '100%', minHeight: '500px' }}>
                        <TabSwitchers>
                            <button
                                aria-label="Register for Biocrest"
                                onClick={() => { setError(null); setTab('register')}} title="Register for Biocrest"
                                className={classNames("plain-button", {'active': currentTab === 'register'})}
                            >
                                Register
                            </button>
                            <button
                                aria-label="Login with your Biocrest account"
                                onClick={() =>  { setError(null); setTab('login')}} title="Login with your Biocrest account"
                                className={classNames("plain-button", {'active': currentTab === 'login'})}
                            >
                                Login
                            </button>
                        </TabSwitchers>
                        <div className="position-relative p-4">
                            {isRegistering &&
                            <div
                                style={{
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    width: '100%',
                                    height: '100%',
                                    background: `rgba(0,0,0,0.85)`
                                }}
                                className="d-flex align-items-center text-light justify-content-center text-center"
                            >
                                <h3>Registering</h3>
                            </div>}
                            {error && renderError()}
                            {   currentTab === 'forgot' ?
                                <ResetForm /> :
                                currentTab === 'register' ?
                                // <RegisterForm onRegister={handleRegisterFormSubmit} /
                                <div
                                    style={{ minHeight: '35vh' }}
                                    className="text-center p-3 d-flex align-items-center justify-content-center"
                                >
                                    <div>
                                        <h1 className="font-weight-bold text-danger">Registrations Closed</h1>
                                        <p>
                                            Registrations for Biocrest 2021 has been closed, registered
                                            participants can use login as usual.
                                        </p>
                                    </div>
                                </div>:
                                <LoginForm onLogin={handleSignIn} onReset={() => setTab('forgot')} />
                            }
                        </div>
                        {/*<div className="p-2">*/}
                        {/*    <SocialLogin />*/}
                        {/*</div>*/}
                    </section>
                    <div className="footer-organizer-bar rounded-bottom">
                        <a rel="noreferrer nofollow" href={organizerURL}>
                            <img
                                alt={organizerName} draggable="false"
                                src={require('../../../assets/branding/organizer_logo.png')}
                            />
                        </a>
                    </div>
                </Fade>
            </div>
        </div>
    </RegisterPageWrapper>;

};

export default RegistrationForm;