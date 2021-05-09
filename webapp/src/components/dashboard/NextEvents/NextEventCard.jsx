import React from 'react';
import styled from '@emotion/styled';
import Countdown from 'react-countdown';
import parseISO from "date-fns/parseISO";
import format from "date-fns/format";

const NextEventWrap = styled.div`
    background: white;
    box-shadow: 3px 5px 8px rgba(0,0,0,0.25);
    h3 {
        color: #a02541;
        font-size: calc(1.2rem + 0.25vw);
        margin-bottom: 5px;
        font-weight: 600;
        line-height: 1.15;
    }
    p {
        font-size: calc(0.8rem + 0.15vw);
        line-height: 1.1;
        margin-bottom: 12px;
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
    .countdown{
        font-weight: 600;
        b {
            font-size: calc(0.95rem + 0.15vw);
        }
        color: #444;
    }
`;

const NextEventCard = ({
    name, startTimestamp, shortDescription, webinarLink,
}) => {


    return <NextEventWrap>
        <div className="row mx-0 px-1">
            <div className="col-6 d-flex align-items-center pt-2 px-2">
                {startTimestamp &&
                <div className="countdown">
                    {format(parseISO(startTimestamp), 'hh:mma, dd MMM')}
                </div>}
            </div>
            <div className="col-6 d-flex align-items-center justify-content-end pt-2 px-2">
                {startTimestamp &&
                <Countdown
                    date={parseISO(startTimestamp)}
                    renderer={({ days, hours, minutes, seconds, completed}) =>{
                        if(completed) return <div>Live Now</div>
                        else return <div className="countdown">
                            <b>{days}</b>d <b>{hours}</b>h <b>{minutes}</b>m <b>{seconds}</b>s
                        </div>
                    }}
                />}
            </div>
        </div>
        <div className="px-3 pt-1 pb-3">
            <h3>{name}</h3>
            <p>{shortDescription}</p>
            {webinarLink &&
            <a href={webinarLink} target="_blank" rel="noreferrer nofollow">
                <img
                    alt="Zoom" draggable="false"
                    src={require('../../../assets/icons/zoom_app.png')}
                />
                Open Zoom Meet
            </a>}
        </div>
    </NextEventWrap>

};

export default NextEventCard;