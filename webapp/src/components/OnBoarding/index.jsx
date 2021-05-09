import React, {useEffect, useState} from 'react';
import styled from "@emotion/styled";
import {Col, Row} from "srx";
import { useMutation, useQuery} from "graphql-hooks";
import Fade from "react-reveal/Fade";
import shortid from "shortid";

import UserTypeSelector from "./typeSelector";
import EmailVerifyCard from "./emailVerify";
import PhoneVerifyCard from "./phoneVerify";
import IDUploader from "./idUpload";
import {setUserInfo} from "../../states";
import Header from "../shared/Header";
import AffiliationForm from "./affiliation";
import BasicInfoForm from "./BasicInfo";

import {MY_EVENT_PROFILE_QUERY, PARTICIPATE_MUTATION} from "../../graphql/queries/event";
import {MY_PROFILE_QUERY, UPDATE_MUTATION} from "../../graphql/queries/user";
import EventFieldsForm from "../fields/EventForm";

const eventID = process.env.eventID;


const OnBoardWrap = styled.div`
    background: #EFEFEF;
    color: black;
    min-height: 100vh;
`;

const StageButton = styled.button`
  background: ${({ active, complete }) => complete ? '#a02541!important' : active ? 'white!important' : 'none!important'};
  border: none!important;
  border-radius: 0;
  color: ${({active, complete }) => complete ? 'white!important' : '#444!important'};;
  padding: 8px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: start;
  margin-bottom: 1rem;
  width: 100%;
  font-size: 14px;
  text-align: left;
  img {
    width: 45px;
    margin-right: 10px;
  }
  &:focus, &:hover {
    outline: none!important;
  }
`;

const BodyContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 80vh;
`;

const BodyCol = styled(Col)`
    margin-bottom: 5vh;
    @media (min-width: 768px) {
        min-height: 60vh;
        margin-bottom: 0;
    }
`;


const OnBoarding = ({ startZero = false, }) => {

    const [participate] = useMutation(PARTICIPATE_MUTATION);

    const {
        loading: eventProfileLoading,
        error: eventProfileLoadingError,
        data: eventProfileData
    } = useQuery(MY_EVENT_PROFILE_QUERY, { variables: { eventID }});
    const [eventProfile, setEventProfile] = useState(null);

    useEffect(() => {
        if(
            eventProfileLoadingError?.graphQLErrors?.length > 0 &&
            eventProfileLoadingError.graphQLErrors[0].code === 'NOT_PARTICIPANT'
        ) {
            console.log('registering user for the event')
            participate({ variables: { eventID }}).then(({ data, error }) => {
                if(data.participate){
                    setEventProfile(data.participate);
                }
            });
        }
    }, [eventProfileLoadingError])

    useEffect(() => {
        if(!eventProfileLoadingError && !eventProfileLoading && eventProfileData) {
            setEventProfile(eventProfileData?.myEventProfile);
        }
    }, [eventProfileLoading]);

    const {
        loading: profileLoading,
        error: profileLoadError,
        data: profileData,
    } = useQuery(MY_PROFILE_QUERY);
    const [profile, setProfile] = useState(null);

    useEffect(() => {
        if(!profileLoading && profileData) {
            setProfile(profileData.me);
        }
    }, [profileLoading]);

    const [isSubmitting, setSubmitting] = useState(false);

    const eventName = process?.env?.eventName || '';

    const stages_list = [
        {
            "value": "basic_profile",
            "label": "Basic Info",
            "icon": require('../../assets/icons/basic_info.png'),
        },
        {
            "value": "type_select",
            "label": "Profile Type",
            "icon": require('../../assets/icons/type.png'),
        },
        {
            "value": "affiliation_form",
            "label": "Institution / Organization",
            "icon": require('../../assets/icons/organization.png'),
        },
        {
            "value": "event_profile",
            "label": `${eventName} Registration`,
            "icon": require('../../assets/icons/info.png'),
        },
        {
            "value": "email_verify",
            "label": "Verify Email",
            "icon": require('../../assets/icons/email.png'),
        },
        {
            "value": "phone_verify",
            "label": "Verify Phone",
            "icon": require('../../assets/icons/phone.png')
        },
        {
            "value": "id_upload",
            "label": "Upload ID Card",
            "icon": require('../../assets/icons/id_verify.png'),
        }
    ];

    const setActive = (stages, value) => {
        return stages.map((s) => {
            if(s.value === value)
                return { ...s, active: true }
            return s;
        });
    };

    const setCompleted = (stages, value) => {
        let flag = false;
        return stages.map((s) => {
            if(s.value === value)
                flag = true;
            if(flag === false)
                return { ...s, complete: true }
            return s;
        });
    };

    const getInitialState = () => {
        if(startZero || !(profile?.name.length > 0) || !(profile?.country?.length > 0))
            return setCompleted(setActive(stages_list, 'basic_profile'), 'basic_profile');
        if(profile?.type == null)
            return setCompleted(setActive(stages_list, 'type_select'), 'type_select');
        if(!profile?.affiliationBody)
            return setCompleted(setActive(stages_list, 'affiliation_form'), 'affiliation_form');
        if((eventProfile?.uuid?.length > 0 && eventProfile?.formData?.length === 0))
            return setCompleted(setActive(stages_list, 'event_profile'), 'event_profile');
        if(!profile?.emailVerified)
            return setCompleted(setActive(stages_list, 'email_verify'), 'email_verify');
        if(!profile?.phoneVerified)
            return setCompleted(setActive(stages_list, 'phone_verify'), 'phone_verify');
        return setCompleted(setActive(stages_list, 'id_upload'), 'id_upload');
    };

    const [stages, setStages] = useState([]);

    useEffect(() => {
        if(!profileLoading && !eventProfileLoading && profile && stages.length === 0){
            setStages(getInitialState())
        }
    }, [profile, eventProfileLoading, profileLoading]);

    const changeStage = (curr, next) => {
        let newStages = stages.map((s) => {
            if(s.value === curr)
                return { ...s, active: false, complete: true }
            else if (s.value === next)
                return {...s, active: true }
            return s;
        });
        setStages([...newStages]);
    }

    const [updateProfile] = useMutation(UPDATE_MUTATION);
    const handleInfoComplete = (profile) => {
        setProfile({ ...profile });
        updateProfile({
            variables: { update: {
                title: profile.title, name: profile.name, email: profile.email, gender: profile.gender,
                city: profile.city, state: profile.state, country: profile.country
            } }
        }).then(({ data, error }) => {
            if(data?.updateProfile?.success){
                console.log('updated');
            }
        })
        changeStage('basic_profile', 'type_select');
    }

    const handleTypeComplete = (type) => {
        setProfile({...profile, type});
        updateProfile({ variables: { update: { type } }}).then(({ data, error }) => {
            if(data?.updateProfile?.success){
                console.log('updated');
            }
        })
        changeStage('type_select', 'affiliation_form');
    };

    const handleAffiliationForm = (data) => {
        setProfile(data);
        updateProfile({ variables: { update: {
            affiliationTitleID: data.affiliationTitle.value,
            affiliationBodyID: data.affiliationBody.value,
        } }}).then(({ data, error }) => {
            if(data?.updateProfile?.success){
                console.log('updated');
            }
        })
        changeStage('affiliation_form', 'event_profile');
    };


    const handleEventProfileSave = (data) => {
        participate({ variables: { eventID, data: JSON.stringify(data) }}).then(({ data, error}) => {
             if(!error && data?.participate){
                 setEventProfile(data.participate);
             }
        })
        changeStage('event_profile', 'email_verify')
    }


    const handleVerifyEmail = (profile) => {
        setProfile(profile);
        changeStage('email_verify', 'phone_verify');
    };

    const handleVerifyPhone = (profile) => {
        setUserInfo(profile);
        changeStage('phone_verify', 'id_upload');
    };

    const handleSkipPhone = () => {
        changeStage('phone_verify', 'id_upload');
    };

    const handleUploadID = (profile) => {
        setSubmitting(true);
        updateProfile({ variables: { update: { idCard: profile.idCard } }}).then(({ data, error }) => {
            setSubmitting(false);
            if(data?.updateProfile?.success){
                setProfile({
                    ...profile,
                    isProfileComplete: true
                })
                setUserInfo({
                    ...profile,
                    isProfileComplete: true
                })
            }
        });
    };

    const handleSkipID = (profile) => {
        setUserInfo({
            ...profile,
            isProfileComplete: true
        })
    }

    const openStage = (value) => {
        let newStages = stages.map((s) => {
            if(s.value === value) {
                return { ...s, active: true }
            } else if (s.active) {
                return {...s, active: false }
            } return s;
        });
        setStages([...newStages]);
    }

    const onOpen = (stage) => {
        if(stage.complete || startZero) {
            let newStages = stages.map((s) => {
                if(s.value === stage.value) {
                    return { ...s, active: true }
                } else if (s.active) {
                    return {...s, active: false }
                } return s;
            });
            setStages([...newStages]);
        }
    };

    const beforeStages = () => {
        const st = [];
        stages.every((s) => {
            st.push(s);
            return !s.active;
        });
        return st;
    };

    const afterStages = () => {
        const st = [];
        let over = false;
        stages.forEach((s) => {
            if(over) st.push(s);
            if(s.active) over = true;
        })
        return st;
    };

    const renderStages = (s) =>
    s.map((s, index) =>
        <Fade key={`${s.value}_${index}`} left delay={50*index}>
            <StageButton
                onClick={() => onOpen(s)}
                disabled={!s?.complete&&!s?.active && !startZero}
                complete={s?.complete && !s.active && !startZero}
                active={s?.active}
            >
                {s.complete && !s.active && !startZero ?
                    <img
                        src={require('../../assets/icons/tick_box.png')}
                        alt="completed" draggable="false"
                    /> :
                    <img alt={s.label} draggable="false" src={s.icon} />
                }
                <div>{s.label}</div>
            </StageButton>
        </Fade>
    );

    const renderSubmitting = () =>
    <BodyContainer>
        <div className="text-center">
            <h1 className="mb-3">Registering</h1>
            <div className="d-flex justify-content-center">
                <p style={{ maxWidth: '75%' }}>Please hold on a second while we process your registration.</p>
            </div>
        </div>
    </BodyContainer>;


    const renderForm = () =>
    <BodyContainer>
        <div className="container px-0" style={{ maxWidth: '1200px' }}>
            <Row>
                <Col md={3} p={0}>
                    <div className="d-md-block d-none">
                        {renderStages(stages)}
                    </div>
                    <div className="d-block d-md-none">
                        {renderStages(beforeStages())}
                    </div>
                </Col>
                <BodyCol md={9} px={2} py={0}>
                    <section className="bg-white p-3">
                        {stages.filter((s) => s.active === true).map((s) => {
                            if(s.value === 'basic_profile')
                                return <Fade key={shortid.generate()}>
                                    <BasicInfoForm profile={profile} onSave={handleInfoComplete} />;
                                </Fade>;
                            if(s.value === 'type_select')
                                return <Fade key={shortid.generate()}>
                                    <UserTypeSelector
                                        type={profile?.type ? parseInt(profile.type) : null}
                                        onComplete={handleTypeComplete}
                                    />
                                </Fade>;
                            if(s.value === 'affiliation_form')
                                return <Fade key={shortid.generate()}>
                                    <AffiliationForm
                                        profile={profile}
                                        isStudent={profile?.type === 1}
                                        isAcademician={profile?.type === 2}
                                        isIndustry={profile?.type === 3}
                                        onSave={handleAffiliationForm}
                                    />
                                </Fade>
                            if(s.value === 'event_profile')
                                return <Fade key={shortid.generate()}>
                                    <EventFieldsForm
                                        eventName="Biocrest"
                                        formFields={eventProfile?.event?.formFields}
                                        formData={eventProfile?.formData}
                                        onSave={handleEventProfileSave}
                                        userType={profile.type}
                                    />
                                </Fade>
                            if(s.value === 'email_verify')
                                return <Fade key={shortid.generate()}>
                                    <EmailVerifyCard
                                        profile={profile}
                                        onVerify={handleVerifyEmail}
                                        onRequestChange={() => openStage('basic_profile')}
                                    />
                                </Fade>;
                            if(s.value === 'phone_verify')
                                return <Fade key={shortid.generate()}>
                                    <PhoneVerifyCard
                                        profile={profile}
                                        onVerify={handleVerifyPhone}
                                        onSkip={handleSkipPhone}
                                    />
                                </Fade>
                            if(s.value === 'id_upload')
                                return <Fade key={shortid.generate()}>
                                    <IDUploader
                                        profile={profile}
                                        onContinue={handleUploadID}
                                        hideSkip={startZero}
                                        onSkip={() => handleSkipID(profile)}
                                    />
                                </Fade>
                            return <div>Failed to Load. Please Try Again</div>;
                        })}
                    </section>
                </BodyCol>
                <Col md={3} p={0}>
                    <div className="d-block d-md-none">
                        {renderStages(afterStages())}
                    </div>
                </Col>
            </Row>
        </div>
    </BodyContainer>;


    return <OnBoardWrap>
        <Header />
        {
            profileLoading ? <div >Loading Your Profile</div > :
                (startZero || (profile && !profile?.isProfileComplete)) ?
                    (isSubmitting ? renderSubmitting() : renderForm()) : <div />
        }
    </OnBoardWrap>;

};

export default OnBoarding;