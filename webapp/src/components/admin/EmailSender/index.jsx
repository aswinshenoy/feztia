import React, {useState} from 'react';
import {useMutation, useQuery} from "graphql-hooks";

import {EVENT_QUERY} from "../../../graphql/queries/event";

import FileUploader from "../../ui/form/FileUploader";
import Input from "../../ui/form/Input";
import FormButton from "../../ui/styled-components/Button";

import { SEND_BULK_EMAIL_MUTATION } from '../../../graphql/mutations/email'
import {Button} from "srx";

const EmailSender = ({ eventID }) => {

    const { loading: loadingEvent, error: eventError , data: event, refetch: refetchEvent } = useQuery(
        EVENT_QUERY, { variables: { eventID,} }
    );

    const [sendEmail] = useMutation(SEND_BULK_EMAIL_MUTATION);

    const [type, setType] = useState(null);
    const [status, setStatus] = useState(null);
    const [subject, setSubject] = useState('');
    const [url, setURL] = useState('');
    const [image, setImage] = useState(null);

    const [hasSent, setSent] = useState(false)

    const SendEmail = () => {
        sendEmail({
            variables: {
                eventID,
                status,
                type,
                subject,
                url,
                image: image?.file,
            }
        }).then(({ data, error }) => {
            if(!error){
                setSent(true);
            }
        })
    }

    return !hasSent ?
    <div>
        <div className="container py-3" style={{ maxWidth: '900px' }}>
            <div className="my-4">
                <h1 style={{ color: '#AF0C3E', fontWeight: '600' }}>Send Bulk Emails</h1>
                <div>Send bulk emails to {event?.event?.name} registrations</div>
            </div>
            <div className="bg-white p-2">
                <div className="row mx-0">
                    <div className="col-md-6 p-1">
                        <div className="p-1">
                            <label className="d-block font-weight-bold my-2">Account Type</label>
                            <select
                                value={type}
                                onChange={(e) => setType(e.currentTarget.value)}
                                className="w-100 p-3"
                            >
                                <option value={null}>All</option>
                                <option value={1}>Student</option>
                                <option value={2}>Academia</option>
                                <option value={3}>Industry</option>
                            </select>
                        </div>
                        <div className="p-1">
                            <label className="d-block font-weight-bold my-2">Registration Status</label>
                            <select
                                value={status}
                                onChange={(e) => setStatus(e.currentTarget.value)}
                                className="w-100 p-3"
                            >
                                <option value={0}>All</option>
                                <option value={1}>Approved</option>
                                <option value={2}>Changes Requested</option>
                            </select>
                        </div>
                        <div className="p-2">
                            <Input
                                label="Subject"
                                className="w-100"
                                placeholder="Enter Subject Line"
                                value={subject}
                                onChange={setSubject}
                            />
                        </div>
                        <div className="p-2">
                            <Input
                                label="URL"
                                className="w-100"
                                placeholder="Enter URL"
                                value={url}
                                onChange={setURL}
                            />
                        </div>
                    </div>
                    <div className="col-md-6 p-1">
                        {image ?
                            <React.Fragment>
                                <div>
                                    <div className="font-weight-bold mb-2">Your Email Image Card</div>
                                    <div className="position-relative">
                                        <img alt="Uploaded ID Card" src={image.url} className="shadow" style={{ maxWidth: '100%', maxHeight: '50vh' }} />
                                        <Button
                                            variant="warning" round={0} onClick={() =>  { setImage(null); }}
                                            text="Change" my={2} px={4} py={3}
                                            className="position-absolute" style={{ bottom: 0, left: '5px' }}
                                        />
                                    </div>
                                </div>
                            </React.Fragment> :
                            <React.Fragment>
                                <label className="d-block font-weight-bold px-2 mt-2">Email Image</label>
                                <FileUploader
                                    formats="image/*"
                                    onUpload={setImage}
                                />
                            </React.Fragment>}

                    </div>
                </div>
                <div className="p-2">
                    <div className="mb-2">Please be 100% certain before clicking on send button below.</div>
                    <FormButton
                        onClick={SendEmail}
                        text="Send Email"
                        py={3} px={4}
                    />
                </div>
            </div>
        </div>
    </div> :
    <div>
        <div className="container py-3" style={{ maxWidth: '900px' }}>
            <div className="my-4">
                <h1 style={{ color: '#AF0C3E', fontWeight: '600' }}>Emails Sent</h1>
                <div>The emails have been sent. Refresh this page again to send again.</div>
            </div>
        </div>
    </div>
};

export default EmailSender;