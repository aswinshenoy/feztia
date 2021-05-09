import React, { useEffect, useState } from 'react';
import { useAuthState } from '../../states';

const ViewAuthenticator = ({
   renderAdmin = () => <div />,
   renderAuth = () => <div />,
   renderPublic = () => <div />,
   renderLoading = () => <div />,
   renderJudge = () => <div />,
}) => {

    const [hasLoaded, setLoaded] = useState(false);
    const [isLoggedIn] = useAuthState('isLoggedIn');
    const [userInfo] = useAuthState('userInfo');

    // prettier-ignore
    useEffect(() => { setLoaded(true); }, []);

    return hasLoaded ? (isLoggedIn ?
        userInfo?.type === 4 ? renderJudge(userInfo) :
        userInfo?.type === 0 ? renderAdmin(userInfo) :
        renderAuth(userInfo) : renderPublic()
    ) : renderLoading();
};

export default ViewAuthenticator;
