import React from 'react';
import styled from "@emotion/styled";
import QRCode from "react-qr-code";

const IDCardWrap = styled.div`
    background: white;
    box-shadow: 2px 3px 5px rgba(0,0,0,0.35);
    border-radius: 0.25rem;
    color: black;
    width: 550px;
    max-width: 100%;
    user-select: none;
    .top-section {
        width: 100%;
        margin: 0;
        background: ${({ theme }) => theme?.colors.primary};
        img {
            max-height: 45px;
        }
    }
    h2 {
      line-height: 1;
      color: ${({ theme }) => theme?.colors.primary};
      margin-bottom: 5px;
    }
    h3 {
        line-height: 1;
    }
`

const MyIDCard = ({
    uuid, id, profile,
}) => {

    return <IDCardWrap>
        <div className="row rounded-top top-section">
            <div className="col-6 col-md-3 pl-3 d-flex align-items-center">
                <img alt="biocrest" src={require('../../../assets/branding/logo_light.png')} />
            </div>
            <div className="col-6 col-md-9 text-right small d-flex justify-content-end align-items-center text-light p-3">
                <h3>{profile.type === 1 ? 'Student' : profile.type === 2 ? 'Academia' : 'Industry'}</h3>
            </div>
        </div>
        <div className="row w-100 p-3 mx-0">
            <div className="col-md-3 d-flex align-items-center justify-content-center p-2">
                <div className="d-md-block d-none">
                    <QRCode value={uuid} size={72} />
                </div>
                <div className="d-md-none d-block mb-2">
                    <QRCode value={uuid} size={120} />
                </div>
            </div>
            <div className="col-md-9 px-1">
                <h2>{profile.title} {profile.name}</h2>
                <div className="mb-1">{profile.email}</div>
                <div>{profile.gender} | {profile.city}, {profile.state && `${profile.state},`} {profile.country}</div>
            </div>
        </div>
    </IDCardWrap>
};

export default MyIDCard;