import React, { useState } from 'react';
import {useMutation} from "graphql-hooks";

import EventFieldsForm from "../fields/EventForm";
import {PARTICIPATE_MUTATION, SUBMIT_MUTATION} from "../../graphql/queries/event";
import TeamPicker from "../teams/TeamPicker";
import FormButton from "../ui/styled-components/Button";

const EventWorkSubmit = ({ isEditor, myProfile, teamID: teamIDProps, event, onRegister = () => {} }) => {

    const [participate] = useMutation(PARTICIPATE_MUTATION);
    const [submit] = useMutation(SUBMIT_MUTATION);
    const [teamID, setTeamID] = useState(teamIDProps);
    const [isSubmitting, setSubmitting] = useState(false);

    const processRegistration = (s) => {
        const filesToUpload = [];
        const sanitizedData = {};
        setSubmitting(true);
        Object.keys(s).forEach((k) => {
            if(s[k].file) {
                filesToUpload.push({
                    key: k,
                    file: s[k].file?.file,
                })
            } else if(s[k].url) {
                filesToUpload.push({
                    key: k,
                    url: s[k].url,
                })
            } else {
                sanitizedData[k] = s[k];
            }
        });
        participate({ variables: {
                eventID: event.id, teamID,
                postApprovalData: JSON.stringify(sanitizedData)
        }}).then(async ({ data, error}) => {
            if(!error && data?.participate){
                const participantID = data?.participate.id;
                await filesToUpload.forEach( (f, index) => {
                    submit({ variables: {
                            participantID, file: f.file, key: f.key, url: f.url,
                    }}).then(({ data, error }) => {
                        if(!error){
                            if(index+1===filesToUpload.length) {
                                setSubmitting(false);
                                onRegister(data)
                            }
                            return true;
                        }
                    })
                })
                return data
            }
        })
    };

    return (teamID || !event.isTeamEvent) ?
        <div className="container p-2 my-3 d-flex align-items-center justify-content-center">
            <div className="bg-white p-3 shadow-sm" style={{ width: '720px', maxWidth: '100%' }}>
                {   isSubmitting ?
                    <div>
                        <h1>Submitting</h1>
                        <p>Please wait.</p>
                    </div>:
                event.postApprovalFields?.length > 0 ?
                    <EventFieldsForm
                        {...event}
                        {...myProfile}
                        formData={myProfile?.postApprovalData}
                        formFields={event?.postApprovalFields}
                        isEditor={isEditor}
                        eventName={event.name}
                        titleLabel="Submission"
                        onSave={processRegistration}
                    /> :
                    <div className="text-center py-3">
                        <h2 className="font-weight-bold my-3">{isEditor ? `Edit Registration for ${event.name}` : `Register for ${event.name}`}</h2>
                        <FormButton
                            text="Register"
                            onClick={() => processRegistration({})}
                            py={4} px={5} round={0}
                        />
                    </div>}
            </div>
        </div> :
        <div>
            <div className="container p-2 my-3 d-flex align-items-center justify-content-center">
                <div>
                    <h2 style={{ color: '#AF0C3E', fontWeight: '600' }}>Choose a Team</h2>
                    <TeamPicker onPick={(t) => setTeamID(t)} />
                </div>
            </div>
        </div>

};

export default EventWorkSubmit;