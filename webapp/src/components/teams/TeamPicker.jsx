import React, {useEffect, useState} from 'react';
import APIFetch from "../../utils/APIFetch";
import {MY_TEAMS_QUERY} from "../../graphql/queries/team";

const TeamPicker = ({
    onPick = () => {},
}) => {

    const [teams, setTeams] = useState(null);

    const fetchTeams = () => {
        APIFetch({
            query: MY_TEAMS_QUERY,
        }).then(({ success, data, errors }) => {
            if (success) {
                setTeams(data.myTeams);
            }
        })
    };

    useEffect(fetchTeams, []);

    return <div className="bg-white p-0 shadow-sm card my-3" style={{ width: '600px', maxWidth: '100%' }}>
        <div className="p-3">
            <h3 className="mb-3" style={{ color: '#AF0C3E', fontWeight: '600' }}>My Teams</h3>
            <p style={{ fontSize: '13px' }}>
                To register for team events, you will need to form a team. Each member of a team needs to have
                their own individual accounts. You can create a team and share its invite code to other team-mates,
                or get an invite code from your team captain and join the team. Any one member, and only member from
                the team needs to register for the event, picking that team.
            </p>
            <div className="alert-danger p-2">
                {teams && teams.length > 0 ?
                    <div className="row py-2 mx-0">
                        {teams.map((t) =>
                            <div className="col-md-6 p-1">
                                <div className="card shadow-sm p-2">
                                    <h4 className="font-weight-bold text-center mb-2">{t.name}</h4>
                                    <div className="mb-3">
                                        {t.members?.length > 0 &&
                                        t.members.map((t) =>
                                            <span>{t.name}, </span>
                                        )}
                                    </div>
                                    <button onClick={() => onPick(t.id)} className="btn btn-primary px-4 py-2">
                                        Register with this Team
                                    </button>
                                </div>
                            </div>
                        )}
                    </div> :
                    <div className="text-center py-5">
                        <h3 className="font-weight-bold mb-2">You're not part of any teams (yet)</h3>
                        <p>Please create a team or join a team using an invite code to register for this event.</p>
                    </div>}
            </div>
        </div>
        <div className="d-flex align-items-center border-top justify-content-center text-center py-2 my-2">
            <div>
                <div className="mb-1">Don't have a team already? </div>
                <a href="/create-team" className="btn btn-danger font-weight-bold text-light m-1 px-4 py-2">Create A Team</a>
                <a href="/join-team" className="btn btn-danger font-weight-bold text-light m-1 px-4 py-2">Join A Team</a>
            </div>
        </div>
    </div>;

};

export default TeamPicker;