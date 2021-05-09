import React from 'react';
import styled from '@emotion/styled';
import formatDistanceToNow from "date-fns/formatDistanceToNow";
import parseISO from "date-fns/parseISO";

const GalleryCard = styled.div`
    padding: 0;
    background: white;
    color: black;
    box-shadow: 3px 5px 8px rgba(0,0,0,0.15);
    margin: 2px;
    border-radius: 5px;
    img {
        max-width: 100%;
        border-radius: 5px;
    }
`;


const SubmissionPost = ({
    participant, submissions, event, hideEventName, prize
}) => {

    const getField = (key) => {
        if(event?.formFields?.length){
            const fil = event.formFields.filter((f) => f.key === key);
            if(fil?.length > 0) {
                return fil[0]
            }
        }
        if(event?.postApprovalFields?.length){
            const fil = event.postApprovalFields.filter((f) => f.key === key);
            if(fil?.length > 0) {
                return fil[0]
            }
        }
    };


    const renderSubmission = (e) => {
        const field = getField(e.key);
        return <div>
            {field['formats'] === 'image/*' ?
                <img draggable="false" src={e.fileURL ? e.fileURL : e.url}/> :
                field['formats'] === 'audio/*' ?
                    <audio controls className="w-100 mt-2">
                        <source src={e.fileURL ? e.fileURL : e.url} />
                    </audio>
                    : null}
            {/*// <div>*/}
            {/*//     <a*/}
            {/*//         target="_blank"*/}
            {/*//         className="text-capitalize"*/}
            {/*//         href={e.fileURL ? e.fileURL : e.url}*/}
            {/*//     >*/}
            {/*//         View {field['key']}*/}
            {/*//     </a>*/}
            {/*// </div>}*/}
        </div>
    }

    return <GalleryCard>
        <div className="row mx-0 p-2">
            <div className="col-6 col-md-8 p-2">
                <div style={{ fontSize: '15px' }} className=" line-height-1">
                    {!hideEventName && <div className="mb-2">{event.name}</div>}
                    <div className="font-weight-bold text-primary">{participant?.profile?.title} {participant?.profile?.name}</div>
                </div>
            </div>
            <div className="col-6 col-md-4 d-flex justify-content-end align-items-center px-1">
                {(participant?.timestampApproved) &&
                formatDistanceToNow(parseISO(participant.timestampApproved), { addSuffix: true })}
                {prize &&
                <div className="font-weight-bold">
                    {prize === 1 ? 'First Prize' : prize === 2 ? 'Second Prize' : prize === 3 ? 'Third Prize' : `${prize} Prize`}
                </div>}
            </div>
        </div>
        {submissions?.length > 0 &&
        submissions.map((e) =>  <div className="p-1">
            {renderSubmission(e)}
        </div>)}
    </GalleryCard>

};

export default SubmissionPost;