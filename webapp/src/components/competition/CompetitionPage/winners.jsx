import React, { useState, useEffect } from 'react';

import APIFetch from "../../../utils/APIFetch";
import {EVENT_WINNERS_QUERY} from "../../../graphql/queries/event";
import SubmissionPost from "../../dashboard/Feed/Post";

const Winners = ({ eventID }) => {

    const [event, setEvent] = useState();

    const fetchWinners = () => {
        APIFetch({
            query: EVENT_WINNERS_QUERY,
            variables: {
                eventID
            }
        }).then(({ data, success}) => {
            if(success) {
                setEvent(data.event);
            }
        })
    }

    useEffect(fetchWinners, []);

    return <div>
        {event?.winners?.length > 0 ?
            <div>
                <div className="row mx-0">
                {event.winners.map((w) =>
                    <div className="col-md-4 py-2">
                        <SubmissionPost
                            event={event}
                            {...w}
                            participant={{ profile: { name: w.name }}}
                            hideEventName
                            prize={w.prize}
                        />
                    </div>
                )}
                </div>
            </div> : null
        }
    </div>

};

export default Winners;