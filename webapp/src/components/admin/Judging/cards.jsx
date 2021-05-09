import React, { useState } from 'react';
import ReactStars from "react-rating-stars-component";

import SubmissionPreview from "../RegistrationVerifier/SubmissionPreview";
import APIFetch from "../../../utils/APIFetch";

export default ({
    id, fields, profile, team, myPoints, formData, submissions
}) => {

    const [points, setPoints] = useState(myPoints);
    const [isUpdating, setUpdated] = useState(false);
    const [isSaved, setSaved] = useState(false);

    const getSubmissionFieldByKey = (key) => {
        if(fields?.length > 0 && fields.some((f) => f.key === key)){
            return fields.filter((f) => f.key === key)[0];
        }
        return null;
    };

    const judge = (points) => {
        setUpdated(true);
        APIFetch({
            query: `mutation ($participantID: ID!, $points: Int!){
              judgeParticipant(participantID: $participantID, points: $points)
            }`,
            variables: {
                participantID: id,
                points
            }
        }).then(({ success, data, errors }) => {
            setUpdated(false);
            if(success) {
               setSaved(true);
            }
        })
    };

    return <div className="card p-3 my-3">
        {profile ?
            <React.Fragment>
                <h2 className="my-2">
                    {profile?.title && `${profile?.title}.`} {profile.name}
                </h2>
                <div>
                    <b>Account Type:</b> {
                    profile?.type === 0 ? 'Admin' :
                        profile?.type === 1 ? 'Student' :
                            profile?.type === 2 ? 'Academia' :
                                profile?.type === 3 ? 'Industry' : 'Other'
                }
                </div>
            </React.Fragment> :
            team ? <React.Fragment>
            <h2 className="my-2">
                {team.name}
            </h2>
            {team?.members?.length > 0 &&
            <div className="row mx-0">
                {team.members.map((m) =>
                    <div className="col-md-4 p-2">
                        <a href={`/admin/profile/${m.id}`} className="p-2 card">
                            <div>{m.title} {m.name}</div>
                        </a>
                    </div>
                )}
            </div>}
        </React.Fragment> : null}
        {formData?.length > 0 &&
        <div className="row p-2 alert-info my-3 mx-0">
            <div className="col-12 p-0">
                <h4>Form Data</h4>
            </div>
            {formData.map((f) => {
                const field = getSubmissionFieldByKey(f.label);
                const value = (() => {
                    if(field?.options?.length > 0){
                        if(field.type === 'checkbox' || field.type === 'multiselect'){
                            try{
                                const list = JSON.parse(f.value)
                                let val = '';
                                if(list && list.length >0){
                                    list.forEach((v) => {
                                        const fil = field.options.filter((f) => f.value === v);
                                        if(fil?.length > 0){
                                            val += fil[0].label + ', ';
                                        }
                                    })
                                } else {
                                    return f.value;
                                }
                                return val;
                            } catch (e) {
                                console.error(e);
                            }
                        }
                    }
                    return f.value
                })();
                return <div className="col-md-4 p-1">
                    <div className="font-weight-bold">{field ? field.label : f.label}</div>
                    <div>{value}</div>
                </div>
            })}
        </div>}
        {submissions?.length > 0 &&
        <div className="row p-2 alert-info my-3 mx-0">
            <div className="col-12 p-0">
                <h4>Submissions</h4>
            </div>
            {submissions?.map((s) =>
                <div className="col-lg-4 col-md-6 p-1">
                    <SubmissionPreview field={getSubmissionFieldByKey(s.key)} submission={s} />
                </div>
            )}
        </div>}
        <div>
            <div className="mb-2 small">
                You can rate this participant from 1 to 10 stars, including half stars (at 20 point scale).
            </div>
            <ReactStars
                count={10}
                onChange={(p) => { setPoints(Math.round(p*2)); judge(p*2) }}
                value={points/2}
                size={64}
                isHalf={true}
            />
        </div>
        {isUpdating ? <div>Updating Your Points</div> :
        isSaved ? <h4 className="font-weight-bold text-success">Your Points Recorded</h4> :
        null}
    </div>;

};
