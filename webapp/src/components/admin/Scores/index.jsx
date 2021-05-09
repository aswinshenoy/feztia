import React, {useState, useEffect } from 'react';

import {JUDGE_SCORES_QUERY} from "../../../graphql/queries/user"

import APIFetch from "../../../utils/APIFetch";
import Scorecard from "./cards";

const JudgingScores = ({ eventID }) => {

    const [profiles, setProfiles] = useState([]);
    const [error, setError] = useState(null);

    const fetch = () => {
        APIFetch({
            query: JUDGE_SCORES_QUERY,
            variables: { eventID }
        }).then(({ success, data, errors }) => {
            if(success) {
                setProfiles(data.scores);
            } else {
                setError(errors);
            }
        })
    };

    useEffect(fetch, []);

    return error ? <div>Error occurred while loading. Please refresh to retry</div> :
    <div>
        <h1>Judgement Scores</h1>
        <div>
            {profiles?.length > 0 ?
                <div>
                    {profiles.map((p, i) => <Scorecard rank={i+1} {...p} />)}
                </div> :
                <div className="w-100">No judgement found</div>}
        </div>
    </div>;
};

export default JudgingScores;