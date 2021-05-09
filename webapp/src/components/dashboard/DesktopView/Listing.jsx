import React, { useState } from 'react';
import styled from '@emotion/styled';
import CompetitionsListing from "../../competition/CompetionListing";
import WebinarListing from "../WebinarListing";
import SubmissionFeed from "../Feed";

const TabSwitch = styled.button`
  padding: 1rem;
  font-size: 18px;
  cursor: pointer;
  background: ${({ active, theme }) => active ? theme?.colors?.primary : `none` };
  color: ${({ active, theme }) => active ? theme?.colors?.primaryInv : theme?.colors?.primary };
  border: none!important;
  display: flex;
  align-items: center;
  text-align: left;
  line-height: 1;
  img {
      width: 33px;
      margin-right: 5px;
  }
  &:focus {
      outline: none!important;
  }
  &:hover {
      background: #901591;
      color: white;
      outline: none!important;
  }
`;

const EventListing = ({
    defaultTab = 'competition', showAll = false,
}) => {

    const [currentTab, setTab] = useState(defaultTab)

    return <div>
        <div className="d-flex align-items-center bg-white">
            {process.env.features?.competition &&
            <TabSwitch
                active={currentTab === 'competition'}
                onClick={() => setTab('competition')}
            >
                <div className="d-flex justify-content-center">
                    <img
                        alt="competition" draggable="false"
                        src={require('../../../assets/icons/competition.png')}
                    />
                </div>
                Competitions
            </TabSwitch>}
            {process.env.features?.webinar &&
            <TabSwitch
                active={currentTab === 'webinar'}
                onClick={() => setTab('webinar')}
            >
                <div className="d-flex justify-content-center">
                    <img
                        alt="webinar" draggable="false"
                        src={require('../../../assets/icons/conference.png')}
                    />
                </div>
                Schedule
            </TabSwitch>}
            {process.env.features?.feed &&
            <TabSwitch
                active={currentTab === 'feed'}
                onClick={() => setTab('feed')}
            >
                <div className="d-flex justify-content-center">
                    <img
                        alt="feed" draggable="false"
                        src={require('../../../assets/icons/feed.png')}
                    />
                </div>
                Submission Feed
            </TabSwitch>}
        </div>
        <div className="p-2">
            {currentTab === 'competition' && process.env.features?.competition ?
                <CompetitionsListing showAll={showAll} /> :
            currentTab === 'webinar' && process.env.features?.webinar ?
                <WebinarListing showAll={showAll} /> :
            currentTab === 'feed' && process.env.features?.feed ?
                <SubmissionFeed showAll={showAll} />
            : null}
        </div>
    </div>

};

export default EventListing;