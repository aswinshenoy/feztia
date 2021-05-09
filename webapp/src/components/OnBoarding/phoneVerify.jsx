import React, {useEffect, useState} from 'react';
import {Col, Row} from "srx";
import {useMutation} from "graphql-hooks";

import {RESEND_OTP_MUTATION, VERIFY_OTP_MUTATION} from "../../graphql/queries/otp";
import FormButton from "../ui/styled-components/Button";
import Input from "../ui/form/Input";
import OTP from "../ui/form/OTP";

const PhoneVerifyCard = ({
   profile, onVerify = () => {}, onSkip = () => {},
}) => {

   const [phone, setPhone] = useState(profile.phone ? profile.phone : '+91');
   const [phoneEntered, setPhoneEntered] = useState(false);
   const [otp, setOtp] = useState('');
   const [isVerified, setVerified] = useState(profile?.phoneVerified);

   const [requestOTP] = useMutation(RESEND_OTP_MUTATION);
   const [verifyOTP] = useMutation(VERIFY_OTP_MUTATION);

   const handleVerify = (e) => {
      e.preventDefault();
      if(isVerified){
         onVerify({ ...profile, phone, phoneVerified: true });
      }
   };

   const [error, setError] = useState(null)
   const handleEnter = (e) => {
      e.preventDefault();
      requestOTP({ variables: { phone }}).then(({ data, error }) => {
         if(data?.resendOTP) {
            console.log('OTP send');
            setPhoneEntered(true);
            if( profile?.country !== "India"){
               onSkip();
            }
         } else {
            setError(error)
         }
      })
   };

   useEffect(() => {
      if(!isVerified && otp.length >= 6){
         verifyOTP({ variables: { otp }}).then(({ data, error }) => {
            if(data?.verifyOTP){
               setVerified(true);
            } else {
               setVerified(false);
            }
         })
      }
   }, [otp]);

   const renderError = () => {
      if(error?.graphQLErrors?.length > 0){
         return `${error.graphQLErrors[0].message} (Code: ${error.graphQLErrors[0].code})`
      }
      return `Unknown error occurred. Please try again.`;
   }

   return <div>{
      profile?.phoneVerified ?
         <React.Fragment>
            <h2 className="font-weight-bold text-success">Phone Verified</h2>
            <p className="mb-5" style={{ maxWidth: '550px' }}>
               Thank You. We have already verified your phone number -  <span style={{ color: '#AF0C3E' }}>{profile?.phone}</span>.
               If you would like to change this number, you could do that later.
            </p>
            <Row>
               <Col md={8} />
               <Col md={4} p={1} flexHR>
                  <FormButton
                      onClick={() => onVerify(null)}
                      text="Continue" fw
                      py={4} px={5} round={0}
                  />
               </Col>
            </Row>
         </React.Fragment> :
         phoneEntered ?
             profile?.country !== "India" ?
                 <React.Fragment>
                    <h2 className="font-weight-bold text-success">Verification not required</h2>
                    <p className="mb-5" style={{ maxWidth: '550px' }}>
                       Since you are an international participant, we shall communicate with you
                       mostly through emails, and sometimes through WhatsApp.
                       We therefore, do no require verification of your phone number.
                    </p>
                    <Row>
                       <Col md={8} />
                       <Col md={4} p={1} flexHR>
                          <FormButton
                              onClick={() => onSkip()}
                              text="Continue" fw
                              py={4} px={5} round={0}
                          />
                       </Col>
                    </Row>
                 </React.Fragment> :
            <React.Fragment>
             <h2 style={{ color: '#AF0C3E', fontWeight: '600' }} className="mb-3">Let's Verify Your Phone Number</h2>
             <p style={{ maxWidth: '600px' }}>
                We have send you a code via SMS to
                <span className="px-1" style={{ color: '#AF0C3E' }}>{phone}</span>
                <button onClick={() => setPhoneEntered(false)} className="plain-button text-primary font-weight-bold pl-0 pr-1">(Change)</button>,
                please check your messages and enter the code below to verify your phone.
             </p>
             <form onSubmit={handleVerify}>
                <OTP
                    isVerified={isVerified}
                    value={otp}
                    onChange={setOtp}
                    onRequestNewOTP={handleEnter}
                />
                <Row>
                   <Col md={8} />
                   {(isVerified) && <Col md={4} p={1} flexHR>
                      <FormButton
                          text="Continue"
                          type="submit" fw
                          py={4} px={5} round={0}
                      />
                   </Col>}
                </Row>
             </form>
       </React.Fragment> :
       <React.Fragment>
          <h2 style={{ color: '#AF0C3E', fontWeight: '600' }} className="mb-3">Your Phone Number</h2>
          <p style={{ maxWidth: '600px' }}>
             We need to have your WhatsApp number to communicate important updates about the event.
          </p>
          <form onSubmit={handleEnter}>
             <div className="p-1">
                {error && <div className="text-danger mb-1">{renderError()}</div>}
                <div style={{ maxWidth: '450px' }}>
                   <Input
                       label="Phone Number"
                       placeholder="Enter your Phone Number"
                       value={phone}
                       onChange={setPhone}
                   />
                </div>
                <Row>
                   <Col md={8} />
                   <Col md={4} p={1} flexHR>
                   {(phone?.length===13) &&
                   <FormButton
                       text="Continue"
                       type="submit"
                       py={4} px={5} round={0}
                   />}
                   </Col>
                </Row>
             </div>
          </form>
       </React.Fragment>
      }
   </div>

};

export default PhoneVerifyCard;