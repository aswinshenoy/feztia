import React from 'react';
import format from "date-fns/format";
import parseISO from "date-fns/parseISO";

const UserProfile = ({
    profile
}) => {

    return <div className="card h-100 p-4">
        <h1 className="font-weight-bold mb-1" style={{ color: '#AF0C3E' }}>{profile?.title} {profile?.name}</h1>
        <div>UserID: #{profile.id} | Username: @{profile.username} | Joined: {format(parseISO(profile.dateJoined), 'hh:MM a, dd-MM-yyyy')}</div>
        <div className="my-2">
            <h4 style={{ color: '#AF0C3E' }}>Basic Information</h4>
            <div>
                <b>Type:</b> {
                profile?.type === 0 ? 'Admin' :
                    profile?.type === 1 ? 'Student' :
                        profile?.type === 2 ? 'Academia' :
                            profile?.type === 3 ? 'Industry' : 'Other'
                }
            </div>
            <div>
                <b>Location:</b> {profile.country ?
                `${profile?.city}, ${profile.state}, ${profile.country}`
                : 'N/A'}
            </div>
            <div>
                <b>Gender:</b> {profile.gender ? profile.gender : 'N/A'}
            </div>
        </div>
        <div className="my-2">
            <h4 style={{ color: '#AF0C3E' }}>Contact Information</h4>
            <div>
                <b>Phone No.:</b> {profile.phone ? profile.phone : 'N/A'}
            </div>
            <div>
                <b>Email Address.:</b> {profile.email ? profile.email : 'N/A'}
            </div>
        </div>
        <div className="my-2">
            <h4 style={{ color: '#AF0C3E' }}>Affiliation Information</h4>
            <div>
                <b>Affiliation Title:</b> {profile.affiliationTitle ? profile.affiliationTitle.name : 'N/A'}
            </div>
            <div>
                <b>Affiliation Body.:</b> {profile.affiliationBody ? profile.affiliationBody.name : 'N/A'}
            </div>
        </div>
    </div>

};

export default UserProfile;