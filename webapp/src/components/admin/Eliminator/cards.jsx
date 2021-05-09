import React, { useState } from 'react';
import ReactStars from "react-rating-stars-component";

import SubmissionPreview from "../RegistrationVerifier/SubmissionPreview";
import APIFetch from "../../../utils/APIFetch";
import FormButton from "../../ui/styled-components/Button";

export default ({
    id, fields, profile, team, formData, submissions
}) => {

    const [isUpdating, setUpdated] = useState(false);
    const [isSaved, setSaved] = useState(false);

    const getSubmissionFieldByKey = (key) => {
        if(fields?.length > 0 && fields.some((f) => f.key === key)){
            return fields.filter((f) => f.key === key)[0];
        }
        return null;
    };

    const eliminate = () => {
        setUpdated(true);
        APIFetch({
            query: `mutation ($participantID: ID!, $feedback: String) {
              eliminateParticipant(participantID: $participantID, feedback: $feedback)
            }`,
            variables: {
                participantID: id,
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
        <FormButton
            onClick={eliminate}
            text="Eliminate"
            px={3} py={4}
            shadow={2}
            variant="danger"
        />
        {isUpdating ? <div>Updating Your Points</div> :
            isSaved ? <h4 className="font-weight-bold text-danger">Eliminated</h4> :
        null}
    </div>;

};
