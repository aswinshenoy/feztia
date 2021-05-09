import React from 'react';
import {Card} from "srx";
import styled from "@emotion/styled";
import format from "date-fns/format";
import parseISO from "date-fns/parseISO";

const CompetitionCardWrap = styled.a`
    display: block;
    transform: translateY(0);
    transition: 0.5s all ease;
    height: 100%;
    h3 {
        color: ${({ theme }) => theme?.colors.primary};
        font-weight: 600;
        margin-bottom: 3px;
        font-size: calc(1rem + 0.5vw);
    }
    p {
        margin-bottom: 0;
        font-size: calc(0.8rem + 0.3vw);
        line-height: 1;
    }
    &:hover {
      transform: translateY(-10px);
      transition: 0.5s all ease;
    }
`;

const CompetitionCard = ({
   posterURL, slug, name, shortDescription, registrationCloseTimestamp
}) => {

    return <CompetitionCardWrap href={`/competition/${slug}`} className="plain-link">
        <Card bg="white" p={0} shadow={2} round={0} className="h-100">
            {posterURL && <img draggable="false" src={posterURL} alt={name} />}
            <div className="px-2 py-3 p-md-3">
                <h3>{name}</h3>
                <p>{shortDescription}</p>
                {registrationCloseTimestamp && (parseISO(registrationCloseTimestamp) > new Date()) &&
                <div style={{ fontSize: '13px' }} className="mt-2 text-danger">
                    Register before {format(parseISO(registrationCloseTimestamp), 'dd MMM')}
                </div>}
            </div>
        </Card>
    </CompetitionCardWrap>;

};

export default CompetitionCard;