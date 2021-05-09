import React from 'react';

const SubmissionPreview = ({
    field, submission
}) => {


    return <div className="card p-2">
        <div className="font-weight-bold mb-2">
            {field?.label ? field.label : submission.key}
        </div>
        {submission.url}
        <div>
            {field?.formats === 'image/*' ?
            <div>
                <div className="mb-2 small">Click on the image below to view it in full size.</div>
                <a target="_blank" href={submission.fileURL}>
                    <img
                        alt="Click to view the submission image"
                        draggable="false"
                        src={submission.fileURL}
                    />
                </a>
                <a className="mt-2" target="_blank" href={submission.fileURL}>Download</a>
            </div>:
            field?.formats === 'audio/*' ?
            <div>
                <audio controls className="w-100 mt-2">
                    <source src={submission.fileURL ? submission.fileURL : submission.url} />
                </audio>
                <a className="mt-2" target="_blank" href={submission.fileURL}>Download</a>
            </div> :
            <a target="_blank" href={submission.fileURL}>Download</a>
            }
        </div>
    </div>

};

export default SubmissionPreview;