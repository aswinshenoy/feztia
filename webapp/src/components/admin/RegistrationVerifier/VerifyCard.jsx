import React, { useEffect, useState } from 'react';
import styled from "@emotion/styled";
import {useMutation} from "graphql-hooks";
import {REVIEW_PARTICIPANT_MUTATION} from "../../../graphql/queries/verification";
import Select from "../../ui/form/Select";
import Input from "../../ui/form/Input";
import PlacePicker from "../../ui/form/PlacePicker";
import SubmissionPreview from "./SubmissionPreview";


const genders = require('../../../data/commons/gender.json');
const userTypes = require('../../../data/commons/user-types.json');
const userTitles = require('../../../data/commons/user-titles.json');

const StyledInput = styled.input`
    padding: 0.5rem 1rem;
    font-size: 16px;
    width: 100%;
`;

const EditorForm = styled.div`
    label {
       display: block;
    }
`;

const TextInput = ({ as = 'input', label, placeholder, value, onChange }) => {
    return <StyledInput
        as={as}
        placeholder={placeholder}
        aria-label={label}
        value={value}
        onChange={(e) => onChange(e.currentTarget.value)}
    />
}

const VerifyCard = ({
    id, profile: profileProps, team, formData, timestamp, event, remarks, submissions
}) => {

    const [isCompleted, setCompleted] = useState(false);
    const [profile, setProfile] = useState(profileProps);
    const [form, setForm] = useState(formData);
    const [remark, setRemark] = useState(remarks);

    const [reviewParticipant] = useMutation(REVIEW_PARTICIPANT_MUTATION);
    const handleReview = (approve) => {
        reviewParticipant({
            variables: {
                participantID: id,
                approve,
                remarks: remark
            }
        }).then(({ data, error }) => {
            if(data?.reviewParticipant){
                setCompleted(true)
            }
        });
    };

    const getSubmissionFieldByKey = (key) => {
        if(event?.formFields?.length > 0 && event.formFields.some((f) => f.key === key)){
            return event.formFields.filter((f) => f.key === key)[0];
        }
        return null;
    }

    return isCompleted ? <div /> :
        <div className="card shadow-sm p-3">
            {profile ?
            <React.Fragment>
                <h2 className="my-2">
                    {profile?.title && `${profile?.title}.`} {profile.name}
                </h2>
                <div className="row alert-info p-2 mx-0">
                    <div className="col-12 p-0">
                        <h4>User Profile</h4>
                    </div>
                    <div className="col-md-4 p-1">
                        <h5 style={{ color: '#AF0C3E' }}>Basic Info</h5>
                        <div>
                            <div>
                                <b>Type:</b> {
                                profile?.type === 0 ? 'Admin' :
                                    profile?.type === 1 ? 'Student' :
                                        profile?.type === 2 ? 'Academia' :
                                            profile?.type === 3 ? 'Industry' : 'Other'
                            }
                            </div>
                            <div>
                                <b>Location:</b> {profile.country ?
                                `${profile?.city}, ${profile.state}, ${profile.country}`
                                : 'N/A'}
                            </div>
                            <div>
                                <b>Gender:</b> {profile.gender ? profile.gender : 'N/A'}
                            </div>
                        </div>
                    </div>
                    <div className="col-md-4 p-1">
                        <h5 style={{ color: '#AF0C3E' }}>Contact Information</h5>
                        <div>
                            <b>Phone No.:</b> {profile.phone ? profile.phone : 'N/A'}
                        </div>
                        <div>
                            <b>Email Address.:</b> {profile.email ? profile.email : 'N/A'}
                        </div>
                    </div>
                    <div className="col-md-4 p-1">
                        <h4 style={{ color: '#AF0C3E' }}>Affiliation Information</h4>
                        <div>
                            <b>Affiliation Title:</b> {profile.affiliationTitle ? profile.affiliationTitle.name ||  profile.affiliationTitle.label : 'N/A'}
                        </div>
                        <div>
                            <b>Affiliation Body.:</b> {profile.affiliationBody ? profile.affiliationBody.name || profile.affiliationBody.label : 'N/A'}
                        </div>
                    </div>
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
                                <div>{m.phone} | {m.email}</div>
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
            <div className="row mx-0">
                {profile &&
                <div className="col-md-6 p-2">
                    <a href={profile?.IDCardURL} target="_blank">
                        <img src={profile?.IDCardURL} alt="ID Card" />
                    </a>
                </div>}
                {(profile||team) &&
                <div className="col-md-6 p-2">
                    <EditorForm>
                        <div>
                            {remarks &&
                            <div className="alert-info alert my-2 p-2">
                                Was already rejected with a remark. Please check if corrections are made, so that it can be approved
                            </div>}
                        </div>
                        <div className="p-2">
                            <label>Remarks (only for rejecting)</label>
                            <TextInput
                                as="textarea"
                                label="Remark" placeholder="Remarks for rejecting, will be mailed to the participant"
                                value={remark}
                                onChange={(v) => setRemark(v)}
                            />
                        </div>
                        <div className="d-flex align-items-center justify-content-end mt-2 p-2">
                            <button onClick={() => handleReview(false)} className="btn btn-danger font-weight-bold mx-2 px-4 py-3">Reject</button>
                            <button onClick={() => handleReview(true)} className="btn btn-success font-weight-bold mx-1 px-4 py-3">Save & Approve</button>
                        </div>
                    </EditorForm>
                </div>}
            </div>
            <div className="row mx-0 p-1">

            </div>
        </div>

};

export default VerifyCard;