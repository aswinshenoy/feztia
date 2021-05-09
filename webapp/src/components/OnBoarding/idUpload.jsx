import React, {useState} from 'react';
import {Button, Col, Row} from "srx";

import FormButton from "../ui/styled-components/Button";
import FileUploader from "../ui/form/FileUploader";

const IDUploader = ({ profile, hideSkip = false, onContinue = () => {}, onSkip = () => {} }) => {

    const [hasChanged, setChanged] = useState(false);
    const [file, setFile] = useState(
        profile?.idCard ? {url: URL.createObjectURL(profile?.idCard) }  :
            profile?.IDCardURL ? { url: profile.IDCardURL }
            : null
    );

    const handleComplete = (e) => {
        onContinue({ ...profile, idCard: file.file })
    };

    return <div>
         <h2 style={{ color: '#AF0C3E', fontWeight: '600' }} className="mb-3">Upload ID Card (Optional)</h2>
        <p style={{ maxWidth: '600px' }}>
            We might need to manually verify your ID card for reviewing especially if you have won any prizes.
            If you skip now, you will asked only if you win any prize.
            Please make sure that details on the card are matching to the information provided,
            and are legible when you upload.
        </p>
        {file ?
        <React.Fragment>
            <div>
                <div className="font-weight-bold mb-2">Your ID Card</div>
                <div className="position-relative">
                    <img alt="Uploaded ID Card" src={file.url} className="shadow" style={{ width: '320px', maxWidth: '100%' }} />
                    <Button
                        variant="warning" round={0} onClick={() =>  { setFile(null); }}
                        text="Change" my={2} px={4} py={3}
                        className="position-absolute" style={{ bottom: 0, left: '5px' }}
                    />
                </div>
            </div>
        </React.Fragment> :
        <FileUploader
            formats="image/*"
            onUpload={(f) => { setChanged(true); setFile(f) }}
        />}
        <Row>
            <Col md={6} />
            <Col md={6} p={2} className="mt-4" flexHR>
                {!hideSkip &&
                <FormButton
                    text="Skip"
                    onClick={onSkip}
                    py={4} px={5} round={0}
                    className="mr-2"
                    background="#333!important"
                />}
                {hasChanged && <FormButton
                    text="Submit ID Card"
                    onClick={handleComplete}
                    py={4} px={5} round={0}
                />}
            </Col>
        </Row>
    </div>

};

export default IDUploader;