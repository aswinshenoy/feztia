import React from 'react';
import ViewJudgements from "./judgements";
import WinnerSelector from "./WinnerSelector";

export default ({
    participant: { id, profile, team, prize },
    rank, avgPoints, noOfJudges, highScore, lowScore, stdDiv, variance,
}) => {

    return <div className="card p-3 my-3">
        <div className="row mx-0">
            <div className="col-md-10 px-2">
                {profile ?
                    <React.Fragment>
                        <h2 className="my-2">
                            <span className="font-weight-bold pr-1">#{rank}. </span>
                            {profile?.title && `${profile?.title}.`} {profile.name}
                        </h2>
                        <div>{
                            profile?.type === 0 ? 'Admin' :
                                profile?.type === 1 ? 'Student' :
                                    profile?.type === 2 ? 'Academia' :
                                        profile?.type === 3 ? 'Industry' : 'Other'
                        }</div>
                    </React.Fragment> :
                    team ? <React.Fragment>
                        <h2 className="my-2">
                            {team.name}
                        </h2>
                        {team?.members?.length > 0 &&
                        <div className="row mx-0">
                            {team.members.map((m) =>
                                <div className="col-md-4 p-2">
                                    <a href={`/admin/profile/${m.id}`} className="p-2 card">
                                        <div>{m.title} {m.name}</div>
                                    </a>
                                </div>
                            )}
                        </div>}
                    </React.Fragment> : null}
            </div>
            <div className="col-md-2 d-flex align-items-center justify-content-end px-2">
                <div>
                    <h4 className="font-weight-bold">{avgPoints && (Math.round((avgPoints + Number.EPSILON) * 100) / 100)} Pts</h4>
                    <h5>{noOfJudges} votes</h5>
                </div>

            </div>
        </div>
        <div className="d-flex align-items-center p-2">
            <div className="mr-2">
                Votes: <b>{noOfJudges}</b>
            </div>
            <div className="mr-2">
                High: <b>{highScore && (Math.round((highScore + Number.EPSILON) * 100) / 100)}</b> Pts
            </div>
            <div className="mr-2">
                Low: <b>{lowScore && (Math.round((lowScore + Number.EPSILON) * 100) / 100)}</b> Pts
            </div>
            <div className="mr-2">
                Avg: <b>{avgPoints && (Math.round((avgPoints + Number.EPSILON) * 100) / 100)}</b> Pts
            </div>
            <div className="mr-2">
                Variance: <b>{variance && (Math.round((variance + Number.EPSILON) * 100) / 100)}</b>
            </div>
            <div className="mr-2">
                Std. Deviation: <b>{stdDiv && (Math.round((stdDiv + Number.EPSILON) * 100) / 100)}</b>
            </div>
        </div>
        <div className="row mx-0">
            <div className="col-md-6 p-2">
                <ViewJudgements participantID={id} />
            </div>
            <div className="col-md-6 p-2">
                <WinnerSelector participantID={id} prize={prize} />
            </div>
        </div>
    </div>;

};
