import React from 'react';
import format from "date-fns/format";
import parseISO from "date-fns/parseISO";

const UserRegistrations = ({
   registrations
}) => {

    return <div className="card p-3">
        <h3 className="font-weight-bold mb-3" style={{ color: '#AF0C3E' }}>Registrations</h3>
        {registrations?.length > 0 ?
            <div>
                <div className="p-2 font-weight-bold alert-info border-bottom">
                    <div className="row mx-0">
                        <div className="col-md-4 px-1">
                            Event Name
                        </div>
                        <div className="col-md-3 px-1">
                            Registration Date
                        </div>
                        <div className="col-md-2 px-1">
                            Current Status
                        </div>
                    </div>
                </div>
                {registrations.map((r) =>
                    <div className="p-2 border-bottom">
                        <div className="row mx-0">
                            <div className="col-md-4 px-1">
                                <div className="font-weight-bold">{r.event?.name}</div>
                            </div>
                            <div className="col-md-3 px-1">
                                {format(parseISO(r.timestampRegistered), 'hh:MM a, dd-MM-yyyy')}
                            </div>
                            <div className="col-md-2 px-1">
                                <div>{r.isApproved ? 'Approved' : r.remarks ? 'Pending with Remarks' : 'Pending'}</div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        : <div>
                <h4>No Registrations Found</h4>
        </div>
        }
    </div>

};

export default UserRegistrations;