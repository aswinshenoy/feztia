import React, {useState} from 'react';
import APIFetch from "../../../utils/APIFetch";


const WinnerSelector = ({ participantID, prize }) => {

    const [isSaving, setSaving] = useState(false);
    const [isSaved, setSaved] = useState(false);

    const saveWinner = (prizeID) => {
        setSaving(true);
        APIFetch({
            query: `
            mutation ($participantID: ID!, $prizeID: Int!){
              declareWinner(participantID: $participantID, prizeID: $prizeID)
            }`,
            variables: {
                prizeID, participantID
            }
        }).then(({ data, success }) => {
            setSaving(false);
            if(success && data.declareWinner) {
                setSaved(prizeID);
            }
        })
    };

    return <div className="mt-2">
        {isSaved || prize ?
            <div>
                Given the
                {prize === 1 ? ' First' : prize === 2 ? ' Second' : prize === 3 ? ' Third' : prize} prize
            </div> :
            isSaving ? <div>Saving</div> :
            <div>
                <div className="d-flex align-items-center">
                    <button
                        onClick={() => saveWinner(1)}
                        className="btn-primary btn px-3 py-2 mr-2"
                    >
                        Give 1st Prize
                    </button>
                    <button
                        onClick={() => saveWinner(2)}
                        className="btn-primary btn px-3 py-2 mr-2"
                    >
                        Give 2nd Prize
                    </button>
                    <button
                        onClick={() => saveWinner(3)}
                        className="btn-primary btn px-3 py-2"
                    >
                        Give 3rd Prize
                    </button>
                </div>
                <div className="mt-2 small text-danger">You will not be able to change it</div>
            </div>
        }

    </div>

};

export default WinnerSelector;