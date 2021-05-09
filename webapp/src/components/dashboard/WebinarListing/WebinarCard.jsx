import React from 'react';
import {Card} from "srx";
import styled from "@emotion/styled";
import format from "date-fns/format";
import parseISO from "date-fns/parseISO";

const WebinarCardWrap = styled.div`
  display: block;
  transform: translateY(0);
  transition: 0.5s all ease;
  h3 {
    color: ${({ theme }) => theme?.colors.primary};
    font-weight: 600;
    margin-bottom: 8px;
    font-size: calc(1.1rem + 0.5vw);
  }
  p {
    margin-bottom: 0;
    font-size: calc(0.8rem + 0.3vw);
    line-height: 1.2;
  }
  &:hover {
    transform: translateY(-10px);
    transition: 0.5s all ease;
  }
  a {
    border: 2px solid #4125a0;
    color: #4125a0!important;
    font-weight: 600;
    padding: 0.35rem 0.5rem;
    display: inline-block;
    text-decoration: none!important;
    img {
      width: 28px;
      margin-right: 8px;
    }
    &:hover {
      background: rgba(20,0,80, 0.15);
    }
  }
`;

const DayWrap = styled.div`
    font-size: calc(1.1rem + 0.3vw);;
    font-weight: 600;
    margin-right: 6px;
    color: #39246a;
`;

const Timing = styled.div`
    font-size: calc(1rem + 0.2vw);
    color: ${({ theme }) => theme?.colors.primary};
`;



const WebinarCard = ({
    posterURL, slug, name, shortDescription, registrationCloseTimestamp,
    startTimestamp, endTimestamp, webinarLink
}) => {

    const renderDates = () => {
        const st = parseISO(startTimestamp);
        const et = parseISO(endTimestamp);
        if(st && et && st.getDate() === et.getDate())
            return <div className="d-flex align-items-center">
                <DayWrap>
                    {format(st, 'dd MMM')}
                </DayWrap>
                <Timing>
                    {format(st, 'hh:mma')} - {format(et, 'hh:mma')}
                </Timing>
            </div>
    }

    const makeUrl = (base, query) => Object.keys(query).reduce(
        (accum, key, index) => {
            const value = query[key];
            if (value !== null) {
                return `${accum}${index === 0 ? "?" : "&"}${key}=${encodeURIComponent(value)}`;
            }
            return accum;
        },
        base
    );

    const makeTime = (time) => new Date(time).toISOString().replace(/[-:]|\.\d{3}/g, "");

    const makeGoogleCalendarUrl = (event) => makeUrl("https://calendar.google.com/calendar/render", {
        action: "TEMPLATE",
        dates: `${makeTime(event.startsAt)}/${makeTime(event.endsAt)}`,
        timezone: event.timezone,
        text: event.name,
        details: event.details
    });

    return <WebinarCardWrap>
        <Card bg="white" p={1} shadow={2} round={0}>
            <div className="row mx-0">
                {/*<div className="col-4 p-2">*/}
                {/*    {posterURL && <img draggable="false" src={posterURL} alt={name} />}*/}
                {/*</div>*/}
                <div className="col-12 p-2">
                    {renderDates()}
                    <h3>{name}</h3>
                    <p>{shortDescription}</p>
                    {registrationCloseTimestamp && (parseISO(registrationCloseTimestamp) > new Date()) &&
                    <div style={{ fontSize: '13px' }} className="mt-2 text-danger">
                        Register before {format(parseISO(registrationCloseTimestamp), 'dd MMM')}
                    </div>}
                    <div className="d-flex align-items-center mt-3">
                        {webinarLink &&
                        <a href={webinarLink} className="mr-2" target="_blank" rel="noreferrer nofollow">
                            <img
                                alt="Zoom" draggable="false"
                                src={require('../../../assets/icons/zoom_app.png')}
                            />
                            Open Zoom
                        </a>}
                        {(startTimestamp && endTimestamp) &&
                        <a
                            target="_blank"
                            href={makeGoogleCalendarUrl({
                                name,
                                details: `${shortDescription}. ${webinarLink ? webinarLink : 'https://amrita.edu/biocrest'}`,
                                startsAt: startTimestamp && parseISO(startTimestamp).toLocaleString(),
                                endsAt: endTimestamp && parseISO(endTimestamp).toLocaleString(),
                                timezone: 'Asia/Kolkata'
                            })}
                        >
                            <img
                                alt="Add to Google Calendar" style={{ width: '28px' }}
                                src={require('../../../assets/icons/google_calendar.png')}
                            />
                            Add to Calendar
                        </a>}
                    </div>
                </div>
            </div>
        </Card>
    </WebinarCardWrap>;

};

export default WebinarCard;