import React, {useEffect, useState} from 'react';
import {useQuery} from "graphql-hooks";
import {TextInput} from "srx";

import {JUDGE_PROFILES_QUERY} from "../../../graphql/queries/user"
import {EVENT_QUERY} from "../../../graphql/queries/event";

import APIFetch from "../../../utils/APIFetch";
import JudgingCard from "./cards";
import {Waypoint} from "react-waypoint";

const JudgingPanel = ({ eventID }) => {

    const { loading: loadingEvent, error: eventError , data: event, refetch: refetchEvent } = useQuery(
        EVENT_QUERY, { variables: { eventID,} }
    );

    const [profiles, setProfiles] = useState([]);
    const [after, setAfter] = useState(null);
    const [hasNext, setHasNext] = useState(true);
    const [hasLoaded, setLoaded] = useState(false);
    const [error, setError] = useState(null);

    const [keyword, setKeyword] = useState('');
    const [type, setType] = useState(null);

    const [totalCount, setTotalCount] = useState(null);

    const fetch = (forced = false) => {
        if(hasNext || forced){
            APIFetch({
                query: JUDGE_PROFILES_QUERY,
                variables: {
                    eventID,
                    after: !forced ? after : null,
                    search: keyword,
                    judgeListing: true,
                    filters: {
                        type: type > 0 ? type : null,
                        status: status !== 0 ? status : null,
                    }
                }
            }).then(({ success, data, errors }) => {
                setLoaded(true);
                if(success) {
                    setTotalCount(data?.participants?.totalCount);
                    if(!forced && data?.participants?.participants?.length > 0 && profiles.length > 0){
                        setProfiles([...profiles, ...data?.participants?.participants]);
                    } else if(data?.participants?.participants?.length > 0){
                        setProfiles([...data?.participants?.participants])
                    } else {
                        setProfiles([]);
                    }
                    setAfter(data.participants.lastCursor);
                    setHasNext(data.participants.hasNext);
                } else {
                    setError(errors);
                }
            })
        }
    };

    useEffect(fetch, []);


    useEffect(() => {
        fetch(true);
    }, [type, status])

    const SearchBoxTable = () =>
        <div className="bg-white p-2">
            <div className="row w-100 mx-0">
                <div className="col-md-4 p-1">
                    <form className="d-flex align-items-center" onSubmit={(e) => { e.preventDefault(); fetch(true);} }>
                        <TextInput
                            className="w-100"
                            label="Search" name="search"
                            placeholder="Search by name, phone or email"
                            value={keyword} onChange={setKeyword}
                        />
                        <button className="btn btn-primary p-2" type="submit">Search</button>
                    </form>
                </div>
                <div className="col-md-4 d-flex align-items-center p-1">
                    <div className="w-50 p-1">
                        <label className="d-block mb-0">Type</label>
                        <select
                            value={type}
                            onChange={(e) => setType(e.currentTarget.value)}
                            className="w-100 px-3 py-2"
                        >
                            <option value={0}>All</option>
                            <option value={1}>Student</option>
                            <option value={2}>Academia</option>
                            <option value={3}>Industry</option>
                        </select>
                    </div>
                </div>
            </div>
        </div>;

    const getFields = () => {
        let fields = [];
        if(event?.event?.formFields?.length > 0) {
            fields = [...event.event.formFields];
        }
        if(event?.event?.postApprovalFields?.length > 0) {
            if(fields?.length > 0){
                fields = [...fields, ...event.event.postApprovalFields];
            } else {
                fields = [...event.event.postApprovalFields]
            }
        }
        return fields;
    };

    return error ? <div>Error occurred while loading. Please refresh to retry</div> :
    !hasLoaded ? <div>Loading</div> :
    <div>
        <div className="my-2">
            {SearchBoxTable()}
            {totalCount &&
            <div className="bg-white p-2">
                <div className="row mx-0">
                    <div className="col-md-4 px-2">
                        <h4>Total Count - <b>{totalCount}</b></h4>
                    </div>
                </div>
            </div>}
        </div>
        <div>
        {profiles?.length > 0 ?
            <div>
                {profiles.map((p) => <JudgingCard fields={getFields()} {...p} />)}
                <Waypoint onEnter={() => fetch()}>
                    <div className="my-3 w-100 p-2">
                        <button onClick={() => fetch()} className="btn btn-primary p-3">Load More</button>
                    </div>
                </Waypoint>
            </div> :
        <div className="w-100">No profiles found</div>}
        </div>
    </div>;
};

export default JudgingPanel;