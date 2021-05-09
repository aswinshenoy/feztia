import React from 'react';
import styled from "@emotion/styled";
import {useMutation} from "graphql-hooks";
import ScrollContainer from 'react-indiana-drag-scroll'

import {setUserInfo} from "../../states";
import ViewAuthenticator from "./ViewAuthenticator";

const HeaderWrapTransparent = styled.header`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    background: rgba(0,0,0,0.15);
    img {
        max-height: 8vh;
    }
`;

const HeaderWrap = styled.header`
    background: ${({ theme }) => theme?.colors.primary};
    padding: 0.35rem;
    width: 100%;
    img {
        max-height: 8vh;
    }
`;

const HeaderHorizontalNavBar = styled(ScrollContainer)`
    display: flex;
    align-items: center;
    padding: 0;
    height: 100%;
    a {
        font-size: calc(1.25rem + 0.25vw);
        color: ${({ theme }) => `${theme?.colors.primaryInv}!important`};
        padding: 0.75rem 1rem;
        text-decoration: none!important;
        height: 100%;
        width: fit-content;
        max-width: 250px;
        display: flex;
        align-items: center;
        white-space: nowrap;
        &:hover {
            background: ${({ theme }) => theme?.colors.primaryInv};
            color: ${({ theme }) => `${theme?.colors.primary}!important`};
        }
    }
`;

const Header = ({
    transparent = false, hideAuthButtons = false
}) => {

    const [logoutUser] = useMutation(`mutation {  logoutUser }`);

    const handleLogOut = () => {
        logoutUser().then(({ data, error }) => {
            setUserInfo(null);
        });
    };

    const renderLogoutButton = () =>
    <button
        style={{ background: 'white', border: 'none', fontSize: '15px', padding: '5px 10px' }}
        onClick={handleLogOut}
    >
        Logout
    </button>;

    const renderLoginButton = () =>
    <a
        style={{ background: 'white', border: 'none', fontSize: '15px', padding: '5px 10px' }}
        href="/login"
    >
        Login
    </a>;

    const HeaderLinks = process?.env?.links?.headerLinks || [];
    const eventName = process?.env?.eventName || null;

    const renderHeader =
    <div className="container-lg px-0">
        <div className="row mx-0">
            <div className="col col-md-3 d-flex align-items-center justify-content-center p-2">
                <a href="/">
                    <img
                        draggable="false" alt={eventName}
                        src={require('../../assets/branding/logo_light.png')}
                    />
                </a>
            </div>
            {!hideAuthButtons &&
            <div className="col-6 d-md-none d-flex align-items-center justify-content-end p-2">
                <ViewAuthenticator
                    renderAuth={() => renderLogoutButton()}
                    renderJudge={() => renderLogoutButton()}
                    renderAdmin={() => renderLogoutButton()}
                    renderPublic={() => renderLoginButton()}
                />
            </div>}
            <div className="col-md-6 p-0 d-flex align-items-center">
                {HeaderLinks?.length > 0 &&
                <HeaderHorizontalNavBar>
                    {HeaderLinks.map((l) =>
                    <div>
                        <a href={l.url}>
                            {l.label}
                        </a>
                    </div>
                    )}
                </HeaderHorizontalNavBar>}
            </div>
            {!hideAuthButtons &&
            <div className="col-md-3 d-none d-md-flex p-2 justify-content-end align-items-center">
                <ViewAuthenticator
                    renderAuth={() => renderLogoutButton()}
                    renderJudge={() => renderLogoutButton()}
                    renderAdmin={() => renderLogoutButton()}
                    renderPublic={() => renderLoginButton()}
                />
            </div>}
        </div>
    </div>

   return transparent ?
   <HeaderWrapTransparent children={renderHeader} /> :
   <HeaderWrap children={renderHeader} />;

};

export default Header;