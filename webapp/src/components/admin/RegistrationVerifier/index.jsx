import React, { useEffect, useState } from 'react';
import {Waypoint} from "react-waypoint";

import APIFetch from "../../../utils/APIFetch";
import {PROFILES_QUERY} from "../../../graphql/queries/user";

import VerifyCard from "./VerifyCard";
import {EVENT_REG_FORM_QUERY} from "../../../graphql/queries/event";

const RegistrationVerifier = ({ eventID }) => {

    const [profiles, setProfiles] = useState([]);
    const [after, setAfter] = useState(null);
    const [hasNext, setHasNext] = useState(true);
    const [count, setCount] = useState(null);

    const fetch = () => {
        if(hasNext){
            APIFetch({
                query: PROFILES_QUERY,
                variables: {
                    eventID,
                    after,
                    filters: {
                        verificationRequired: true
                    }
                }
            }).then(({ success, data, errors }) => {
                if(success) {
                    setCount(data?.participants?.totalCount);
                    if(data?.participants?.participants?.length > 0 && profiles.length > 0){
                        setProfiles([...profiles, ...data?.participants?.participants]);
                    } else if(data?.participants?.participants?.length > 0){
                        setProfiles([...data?.participants?.participants])
                    }
                    setAfter(data.participants.lastCursor);
                    setHasNext(data.participants.hasNext);
                }
            })
        }
    };

    const [event, setEvent] = useState([]);
    const fetchEvent = () => {
        APIFetch({
            query: EVENT_REG_FORM_QUERY,
            variables: {
                eventID
            }
        }).then(({ success, data, errors }) => {
            if(success) {
                setEvent(data.event);
            }
        })
    }

    useEffect(fetch, [])
    useEffect(fetchEvent, [])

    return <div>{profiles?.length > 0 && event ?
        <div>
            <h1 className="mb-4">Pending Verifications ({count} total)</h1>
            {profiles.map((p) =>
                <div className="my-2">
                    <VerifyCard event={event} {...p} />
                </div>
            )}
            {hasNext && <Waypoint onEnter={() => fetch()}>
                <div className="my-3 p-2">
                    <button onClick={() => fetch()} className="btn btn-primary p-3">Load More</button>
                </div>
            </Waypoint>}
        </div> :
        <div>No profiles to verify</div>
    }</div>;

};

export default RegistrationVerifier;