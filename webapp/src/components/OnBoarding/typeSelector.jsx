import React, {useState} from 'react';
import styled from "@emotion/styled";
import {Col, Row} from "srx";
import Fade from "react-reveal/Fade";

import FormButton from "../ui/styled-components/Button";

const RoleButton = styled.button`
    background: ${({active, selected}) => active || !selected ? 'white' : '#EEE'};
    border: ${({ active, selected }) => active ? '5px solid #a02541!important' : selected ? '5px solid #EEE!important' : '5px solid white!important'};
    color: ${({ active }) => active ? '#a02541' : 'black'};
    border-radius: 0;
    width: 100%;
    padding: 5vh 1rem;
    transition: all 0.25s ease-in;
    box-shadow: 3px 5px 8px rgba(0,0,0,0.5);
    height: 100%;
    img {
      max-height: 90px;
    }
    h4 {
        margin-top: 1rem;
        margin-bottom: 0;
    }
    &:focus {
      outline: none!important;
    }
    &:hover {
      transform: translateY(-10px);
      transition: all 0.25s ease-in;
      background: white!important;
      border-color: white!important;
    }
`

const UserTypeSelector = ({
    type: typeProp, onComplete = () => {},
}) => {

    const [role, setRole] = useState(typeProp ? typeProp : null);

    const roles = [
        {
            "value": 1,
            "label": "Student",
            "icon": require('../../assets/icons/student.png')
        },
        {
            "value": 2,
            "label": "Academia",
            "icon": require('../../assets/icons/teacher.png')
        },
        {
            "value": 3,
            "label": "Industry",
            "icon": require('../../assets/icons/industry.png')
        }
    ]

    return <div>
        <h2 style={{ color: '#AF0C3E', fontWeight: '600' }} className="mb-3">We would like to know a little more about you</h2>
        <p>You would like to register as - </p>
        <Row py={2}>
            {roles.map((r, index) =>
                <Col key={`role-${r.value}-${r.label}`} s={6} lg={3} px={2} py={2}>
                    <Fade delay={250*index}>
                        <RoleButton selected={role!==null} active={r.value===role} onClick={() => setRole(r.value)}>
                            <img
                                src={r.icon}
                                alt={r.label} draggable="false"
                            />
                            <h4 className="font-weight-bold">{r.label}</h4>
                        </RoleButton>
                    </Fade>
                </Col>
            )}
        </Row>
        {role !== null &&
            <Row className="px-2 mt-3 mb-5">
                <Col md={8} px={2} className="d-none d-md-block" />
                <Col md={4} px={0} className="mt-4" flexHR>
                    <FormButton
                        py={4} px={5} className="w-100" round={0}
                        onClick={() => onComplete(role)}
                    >
                        Continue
                    </FormButton>
                </Col>
            </Row>
        }
    </div>

};

export default UserTypeSelector;