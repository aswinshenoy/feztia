import React, { useEffect, useState } from 'react';
import { useAuthState } from '../../states';

const ViewAuthenticator = ({
   renderAdmin = null,
   renderAuth = () => <div />,
   renderPublic = () => <div />,
   renderLoading = () => <div />,
   renderJudge = null
}) => {

    const [hasLoaded, setLoaded] = useState(false);
    const [isLoggedIn] = useAuthState('isLoggedIn');
    const [userInfo] = useAuthState('userInfo');

    // prettier-ignore
    useEffect(() => { setLoaded(true); }, []);

    return hasLoaded ? (
        isLoggedIn ? (
            userInfo?.type === 4 ? (renderJudge ? renderJudge(userInfo) : renderAuth(userInfo)) :
            userInfo?.type === 0 ? (renderAdmin ? renderAdmin(userInfo) : renderAuth(userInfo)) :
            renderAuth(userInfo)
        ) : renderPublic()
    ) : renderLoading();
};

export default ViewAuthenticator;
