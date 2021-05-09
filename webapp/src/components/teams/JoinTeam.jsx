import React, { useState } from 'react';
import Input from "../ui/form/Input";
import FormButton from "../ui/styled-components/Button";
import APIFetch from "../../utils/APIFetch";
import {JOIN_TEAM_MUTATION} from "../../graphql/mutations/team";

const JoinTeam = () => {

    const [isJoined, setJoined] = useState(false);
    const [code, setCode] = useState(null);
    const [team, setTeam] = useState(null);

    const joinTeam = (e) => {
        e.preventDefault();
        APIFetch({
            query: JOIN_TEAM_MUTATION,
            variables: { code }
        }).then(({ success, data, errors }) => {
            if(success){
                setJoined(true);
                setTeam(data.joinTeam);
            }
        })
    };

    return !isJoined ?
    <div className="card p-3 shadow-sm">
        <h2 style={{ color: '#AF0C3E', fontWeight: '600' }}>Join A Team</h2>
        <div className="p-2">
            <form onSubmit={joinTeam} style={{ maxWidth: '500px' }}>
                <Input
                    label="Invite Code"
                    placeholder="Invite Code"
                    value={code}
                    className="w-100"
                    onChange={setCode}
                />
                <div className="my-3">
                    <FormButton
                        text="Join Team"
                        type="submit"
                        py={4} px={5} round={0}
                    />
                </div>
            </form>
        </div>
    </div> :
    <div className="card p-3 shadow-sm">
        <h2 style={{ color: '#AF0C3E', fontWeight: '600' }}>Joined the team - {team?.name}</h2>
    </div>;

};

export default JoinTeam;