import React, { useState } from 'react';
import APIFetch from "../../../utils/APIFetch";

const ViewJudgements = ({ participantID }) => {

    const [loadJudgements, setLoad] = useState(false);
    const [isLoading, setLoading] = useState(false);
    const [judgements, setJudgements] = useState([]);

    const fetch = () => {
        setLoad(true);
        setLoading(true);
        APIFetch({
            query: `
            query ($participantID: ID!){
              participantScores(participantID: $participantID){
                judge
                {
                  title
                  name
                  username
                }
                points
              }
            }`,
            variables: { participantID }
        }).then(({ success, data, errors }) => {
            setLoading(false);
            if(success && data.participantScores){
                setJudgements(data.participantScores);
            }
        })
    }

    return <div>
        {loadJudgements ?
            isLoading ? <div>Loading Judgments</div> :
            <div className="p-2 alert alert-info">
                {judgements.length > 0 ?
                    <div>
                        {judgements.map((j, i) =>
                            <div className="d-flex my-1 align-items-center">
                                {j.judge &&
                                    <div className="mr-1">
                                        {i+1}. {j.judge.name} (@{j.judge.username})
                                    </div>
                                }
                                - {j.points} Pts
                            </div>
                        )}
                    </div> : null
                }
            </div>
        : <div>
            <button
                onClick={fetch}
                className="btn-primary btn px-3 py-2"
            >
                View Judgements
            </button>
        </div>}
    </div>;


};

export default ViewJudgements;