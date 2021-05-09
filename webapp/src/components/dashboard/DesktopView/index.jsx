import React from 'react';
import {Col, Row} from "srx";
import styled from "@emotion/styled";

import UpcomingEvents from "../UpcomingEvents";
import MyProfile from "../MyProfile";
import EventListing from "./Listing";
import Footer from "../../shared/Footer";


const CoverSection = styled.section`
    background: ${({ theme }) => theme?.colors.primary};
    color: ${({ theme }) => theme?.colors.primaryInv};
    min-height: 35vh;
    padding: 5vh 2.5vw;
    display: flex;
    align-items: flex-end;
    box-shadow: 1px 8px 8px rgba(0,0,0,0.25);
`;

const DashboardDesktopView = () => {

    return <div>
        <CoverSection>
            <div className="container px-2">
                <h1>Dashboard</h1>
            </div>
        </CoverSection>
        <div style={{ minHeight: '100vh' }} className="px-2 py-5">
            <UpcomingEvents />
            <Row>
                <Col md={4} p={2}>
                    <MyProfile />
                </Col>
                <Col md={8} p={2}>
                    <EventListing />
                </Col>
            </Row>
        </div>
        <Footer />
    </div>

};

export default DashboardDesktopView;