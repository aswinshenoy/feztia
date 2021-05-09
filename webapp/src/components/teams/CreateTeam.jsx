import React, { useState } from 'react';
import APIFetch from "../../utils/APIFetch";
import {CREATE_TEAM_MUTATION} from "../../graphql/mutations/team";
import Input from "../ui/form/Input";
import FormButton from "../ui/styled-components/Button";

const CreateTeam = ({
    showContinue = true, onComplete = () => {}
}) => {

    const [isCreated, setCreated] = useState(false);
    const [name, setName] = useState(null);
    const [team, setTeam] = useState(null);

    const createTeam = (e) => {
        e.preventDefault();
        APIFetch({
            query: CREATE_TEAM_MUTATION,
            variables: {
                name
            }
        }).then(({ success, data, errors}) => {
            if(success) {
                setCreated(true);
                setTeam(data.createTeam);
            }
        })
    };

    return !isCreated ?
    <div className="card p-3 shadow-sm">
        <h2 style={{ color: '#AF0C3E', fontWeight: '600' }}>Create A Team</h2>
        <div className="p-2">
            <form onSubmit={createTeam} style={{ maxWidth: '500px' }}>
                <Input
                    label="Team Name"
                    placeholder="Enter your team name"
                    value={name}
                    className="w-100"
                    onChange={setName}
                />
                <div className="my-3">
                    <FormButton
                        text="Create Team"
                        type="submit"
                        py={4} px={5} round={0}
                    />
                </div>
            </form>
        </div>
    </div> :
    <div className="card p-3 shadow-sm">
        <h2 style={{ color: '#AF0C3E', fontWeight: '600' }}>Team {name} created.</h2>
        <div>
            <div className="mb-0">Invite your team mates using the below code - </div>
            <div className="display-4 font-weight-bold">{team?.inviteCode}</div>
        </div>
        {showContinue &&
        <div className="d-flex align-items-center justify-content-end my-2">
            <FormButton
                text="Continue"
                onClick={() => onComplete(team)}
                py={4} px={5} round={0}
            />
        </div>}
    </div>

};

export default CreateTeam;