import React, { useEffect, useState } from 'react';
import styled from '@emotion/styled';

import APIFetch from "../utils/APIFetch";
import {EVENT_GALLERY_QUERY} from "../graphql/queries/event";


const GalleryCard = styled.div`
    padding: 0.75rem;
    background: white;
    color: black;
    box-shadow: 3px 5px 8px rgba(0,0,0,0.15);
    img {
        max-width: 100%;
        border-radius: 5px;
        margin-bottom: 5px;
        box-shadow: 3px 5px 8px rgba(0,0,0,0.5);
    }
`;

const SubmissionGallery = ({ id }) => {

    const [items, setItems] = useState(null);
    const [event, setEvent] = useState(null);
    const [hasLoaded, setLoaded] = useState(false);

    const fetchItems = () => {
        APIFetch({
            query: EVENT_GALLERY_QUERY,
            variables: { eventID: id }
        }).then(({ data, errors, success }) => {
            if(success) {
                setEvent(data.event);
                setItems(data.gallery);
                setLoaded(true)
            }
        })
    };

    useEffect(fetchItems, []);

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

    return <div>
        {items?.length > 0 ?
            <div>
                <div className="row mx-0">
                    {items.map((e) =>
                        <div className="col-4 p-2">
                            <GalleryCard>
                                {e?.submissions?.length > 0 &&
                                    e.submissions.map((e) =>  <div className="p-1">
                                        {renderSubmission(e)}
                                    </div>)
                                }
                                <div className="line-height-1 p-2">
                                    <div>Submitted by</div>
                                    <div style={{ fontSize: '16px' }} className="text-primary font-weight-bold">
                                        {e.participant?.profile?.title} {e.participant?.profile?.name}
                                    </div>
                                </div>
                            </GalleryCard>
                        </div>
                    )}
                </div>
        </div> :
        hasLoaded ?
            <div>
                <h1>No submissions found</h1>
            </div> :
            <div>
                <h1>Loading</h1>
            </div>
        }
    </div>;

};

export default SubmissionGallery;