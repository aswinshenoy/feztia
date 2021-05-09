import { createGlobalState } from 'react-hooks-global-state';

import store from 'store2';

const defaultState = {
    isLoggedIn: store.get('UserInfo'),
    userInfo: store.get('UserInfo') || null,
};

const { setGlobalState, useGlobalState } = createGlobalState(defaultState);

export const setUserInfo = (userInfo) => {
    if (userInfo === null) {
        store.remove('UserInfo');
        setGlobalState('isLoggedIn', false);
    } else {
        store.set('UserInfo', userInfo);
        setGlobalState('isLoggedIn', true);
    }
    setGlobalState('userInfo', userInfo);
};

export { useGlobalState };
