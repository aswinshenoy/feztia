import React from 'react';
import { useMediaQuery } from 'react-responsive'

import Base from "../shared/Base";
import Header from "../shared/Header";
import MobileView from "./MobileView";
import DesktopView from "./DesktopView";


const DashboardPage = () => {

    const isDesktopOrLaptop = useMediaQuery({ minDeviceWidth: 768 })

    return <Base meta={{ title: 'Dashboard' }}>
        {isDesktopOrLaptop ?
        <div className="d-none d-md-block">
            <Header transparent />
            <DesktopView />
        </div> :
        <div className="d-block d-md-none">
            <Header />
            <MobileView />
        </div>}
    </Base>;

};

export default DashboardPage;