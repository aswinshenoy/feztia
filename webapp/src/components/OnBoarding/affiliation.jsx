import React, {useState} from 'react';
import styled from "@emotion/styled";
import {Button, Col, Row} from "srx";
import Fade from "react-reveal/Fade";

import AffiliationTitle from "../fields/AffiliationTitle";
import AffiliationBody from "../fields/AffiliationBody";

const FormButton = styled(Button)`
    color: white!important;
    background: #AF0C3E!important;
    transition: all 0.25s ease-in;
    box-shadow: 3px 5px 8px rgba(0,0,0,0.3);
    &:hover, &:focus{
       box-shadow: none!important;
       transition: all 0.25s ease-in;
    }
`;


const AffiliationForm = ({
   profile: profileProp, onSave = () => {},
   isAcademician = false, isStudent = false, isIndustry = false,
}) => {

    const [profile, setProfile] = useState(profileProp);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(profile);
    };

    return <form onSubmit={handleSubmit}>
        <h2 style={{ color: '#AF0C3E', fontWeight: '600' }}>Affiliation</h2>
        <p>Enter the college, school, academic institution, organization or company you are affiliated with.</p>
        <div className="p-3">
            <div className="alert alert-info p-3">
                The dropdown selectors below search and populate choices as you type, and you can add your own
                option in case you don't find it there. In case the title/designation or institution/company name
                is not available in the dropdown, you can enter it and click on "create" to add it.
            </div>
        </div>
        <Row>
            <Col md={6} p={2}>
                <AffiliationTitle
                    value={profile?.affiliationTitle} isStudent={isStudent} isAcademician={isAcademician} isIndustry={isIndustry}
                    onChange={(affiliationTitle) => setProfile({...profile, affiliationTitle })}
                />
            </Col>
            <Col md={6} p={2}>
                <AffiliationBody
                    value={profile?.affiliationBody} isStudent={isStudent} isAcademician={isAcademician} isIndustry={isIndustry}
                    onChange={(affiliationBody) => setProfile({...profile, affiliationBody })}
                />
            </Col>
            <Col md={8} />
            <Col md={4} p={2} className="mt-4" flexHR>
                <Fade delay={350}>
                    <FormButton
                        text="Continue"
                        type="submit" fw
                        py={4} px={5} round={0}
                    />
                </Fade>
            </Col>
        </Row>
    </form>

};

export default AffiliationForm;