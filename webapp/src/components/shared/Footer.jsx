import React from 'react';
import styled from "@emotion/styled";

const FooterWrap = styled.div`
    background: ${({ theme }) => theme?.colors.primary};
    padding: 3vh 5vw;
    color: #EEE;
    a {
        color: #EEE!important;
        margin-right: 1rem;
    }
`;

const organizerURL = process?.env?.links?.organizerURL || null;
const organizerName = process?.env?.labels?.organizerName || null;

const Footer = () => {

    return <FooterWrap>
        <div className="row mx-0">
            <div className="col-md-6 p-1">
                <a rel="noreferrer nofollow" href={organizerURL}>
                    <img
                        alt={organizerName}
                        className="mr-2 mb-3"
                        draggable="false"
                        style={{ maxWidth: '220px' }}
                        src={require('../../assets/branding/organizer_logo.png')}
                    />
                </a>
                <div>
                    Copyright &copy; 2020-{new Date().getFullYear()} {process.env.labels?.copyrightHolder}.
                    <span className="d-inline-block ml-1">
                        All Rights Reserved.
                    </span>
                    <span className="d-inline-block ml-1">
                        Powered by <a href="https://github.com/aswinshenoy" className="plain-link" target="_blank">Feztia</a>.
                    </span>
                </div>
            </div>
            <div className="col-md-6 p-2 d-flex align-items-end justify-content-center justify-content-md-end">
                <a href="#">Privacy Policy</a>
                <a href="#">Terms of Service</a>
            </div>
        </div>
    </FooterWrap>

};

export default Footer;