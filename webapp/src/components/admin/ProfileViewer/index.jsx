import React, { useState, useEffect } from 'react';
import APIFetch from "../../../utils/APIFetch";
import {VIEW_PROFILE_QUERY} from "../../../graphql/queries/profile";
import UserProfile from "./UserProfile";
import UserRegistrations from "./Registrations";

const ProfileViewer = ({ keyword }) => {

    const [profile, setProfile] = useState(null);
    const [hasLoaded, setLoaded] = useState(false);

    const fetchProfile = () => {
        APIFetch({
            query: VIEW_PROFILE_QUERY,
            variables: {
                key: keyword
            }
        }).then(({ data, success, errors }) => {
            setLoaded(true)
            if(success){
                setProfile(data.profile);
            }
        })
    };

    useEffect(fetchProfile, []);


    return hasLoaded ?
    profile ?
    <div className="row mx-0">
        <div className="col-md-4 h-100 px-0">
            <UserProfile profile={profile} />
        </div>
        <div className="col-md-8 my-3 px-2">
            <UserRegistrations registrations={profile?.registrations} />
        </div>
    </div> :
    <div>
        <h1>Not Found</h1>
    </div> :
    <div>
        <h1>Loading</h1>
    </div>;

};

export default ProfileViewer;