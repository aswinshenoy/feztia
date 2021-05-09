import React from 'react';
import RegistrationStatus from "./status";
import MyEventRegistrations from "./MyEvents";
import MyTeams from "../../teams/MyTeams";
import ViewAuthenticator from "../../shared/ViewAuthenticator";

const MyProfile = () => {

    return <div className="p-1">
        <ViewAuthenticator
            renderAdmin={() =>
                <div className="p-3 shadow mx-2" style={{ background: '#DFD' }}>
                    <h4 className="font-weight-bold">You're an Admin</h4>
                    <a href="/admin" className="btn btn-primary text-light font-weight-bold px-4 mt-2 py-3 rounded-0">
                        Open Admin Panel
                    </a>
                </div>
            }
            renderJudge={() =>
                <div className="p-3 shadow mx-2" style={{ background: '#DFD' }}>
                    <h4 className="font-weight-bold">You're a Judge</h4>
                    <a href="/admin" className="btn btn-primary text-light font-weight-bold px-4 mt-2 py-3 rounded-0">
                        Open Judge Panel
                    </a>
                </div>
            }
        />
        {process.env.features?.profile?.registrationStatus &&
        <ViewAuthenticator
            renderAuth={() =>
                <div className="mb-3">
                    <RegistrationStatus />
                </div>
            }
       />}
        {process.env.features?.profile?.myRegistrations &&
        <ViewAuthenticator
            renderAuth={() =>
                <div className="mb-3">
                    <MyEventRegistrations />
                </div>
            }
        />}
        {process.env.features?.team &&
        <ViewAuthenticator
            renderAuth={() =>
                <div className="mb-3">
                    <MyTeams />
                </div>
            }
        />}
    </div>

};

export default MyProfile;