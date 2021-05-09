import React from 'react';
import styled from "@emotion/styled";
import format from 'date-fns/format';
import parseISO from 'date-fns/parseISO';
import {Waypoint} from "react-waypoint";

const StyledTable = styled.div`
    overflow-x: auto;
    max-width: 100%;
    max-height: 70vh;
    th {
      position: sticky;
      top: 0;
      left: 0;
      background: white;
      box-shadow: 2px 0px 5px rgba(0,0,0,0.3);
      border-bottom: 1px solid black;
    }
`

export default ({
    fields, isTeamEvent, profiles, loadMore = () => {}
}) => {

    const typeMap = {
        "0": "Admin",
        "1": "Student",
        "2": "Academician",
        "3": "Industry"
    }

    const getTypeName = (type) => {
        try {
            return typeMap[type]
        } catch (e) {
            return ''
        }
    };

    const renderFormColumns = (formData) =>
    fields?.map((d) => {
        const list = formData.filter((fd) => fd.label === d.key)
        if(list?.length > 0){
            const item = list[0];
            try{
                if(d?.options?.length > 0){
                    const parsedValue = JSON.parse(item.value);
                    return <td>
                        {parsedValue.map((v) =>
                            <li>{v}</li>
                        )}
                    </td>
                }
                return <td>{data[0].value}</td>

            } catch (e) {
                return <td> - </td>
            }
        }
        return <td>-</td>
    })

    return <StyledTable>
        <table className="table bg-white p-2">
            {!isTeamEvent ?
            <thead>
                <th style={{ minWidth: '40px' }}>#</th>
                <th style={{ minWidth: '150px' }}>Name</th>
                <th style={{ minWidth: '120px' }}>Status</th>
                <th style={{ minWidth: '90px' }}>Type</th>
                <th style={{ minWidth: '180px' }}>Affiliation</th>
                <th style={{ minWidth: '90px' }}>Gender</th>
                <th style={{ minWidth: '90px' }}>Phone</th>
                <th style={{ minWidth: '150px' }}>Email</th>
                <th style={{ minWidth: '90px' }}>Date Joined</th>
                {fields?.map((d) =>
                    <th style={{ minWidth: '190px' }}>{d.label}</th>
                )}
            </thead> :
            <thead>
                <th style={{ minWidth: '40px' }}>#</th>
                <th style={{ minWidth: '150px' }}>Team Name</th>
                <th style={{ minWidth: '150px' }}>Leader</th>
                <th style={{ minWidth: '150px' }}>Affiliation Body</th>
                <th style={{ minWidth: '150px' }}>Members</th>
                {fields?.map((d) =>
                    <th style={{ minWidth: '190px' }}>{d.label}</th>
                )}
            </thead>}
            {profiles?.length > 0 ?
                <tbody>
                    {profiles.map(({ profile: s, team, isApproved, remarks, formData }, index) =>
                        s ?
                        <tr className={isApproved ? 'alert-success' : null}>
                            <td>{index+1}.</td>
                            <td>
                                <a title="Click to view profile" href={`/admin/profile/${s.id}`} target="_blank">
                                    {s.title && `${s.title}.`} {s.name}
                                </a>
                            </td>
                            <td className={isApproved ? 'text-success font-weight-bold' : s.remarks?.length > 0 ? 'text-danger' : null}>
                                { isApproved ? 'Approved' :
                                    remarks?.length > 0 ? 'Rejected with Remarks'
                                        : s?.IDCardURL?.length > 0 ? 'Ready for Review (ID Uploaded)'
                                        : !s?.isPhoneVerified ? 'Phone Not Verified'
                                        : !s?.isEmailVerified ? 'Email Not Verified'
                                        : s?.IDCardURL == null ? 'ID Not Uploaded' :
                                        'Incomplete Profile'
                                }
                            </td>
                            <td>{getTypeName(s.type)}</td>
                            <td>
                                {s?.affiliationTitle?.label}, {s?.affiliationBody?.label}
                            </td>
                            <td>{s.gender}</td>
                            <td className={s.isPhoneVerified ? 'text-success' : 'text-danger font-weight-bold'}>{s.phone}</td>
                            <td className={s.isEmailVerified ? 'text-success' : 'text-danger font-weight-bold'}>{s.email}</td>
                            <td>{format(parseISO(s.dateJoined), 'hh:MM a, dd-MM-yyyy')}</td>
                            {renderFormColumns(formData)}
                        </tr> :
                        team ? <tr>
                            <td>{index+1}.</td>
                            <td>
                                {team.name}
                            </td>
                            <td>
                                {team?.leader &&
                                    <div>
                                        {team.leader?.title} {team.leader?.name}
                                    </div>
                                }
                            </td>
                            <td>
                                {team?.leader &&
                                <div>
                                    {team.leader?.affiliationBody?.label}
                                </div>}
                            </td>
                            <td>
                                {team.members?.length > 0 &&
                                team.members.map((t) =>
                                    <div>
                                        <span className="pr-1">{t.title} {t.name}</span>
                                        <span>({t.email})</span>
                                    </div>
                                )
                                }
                            </td>
                            {renderFormColumns(formData)}
                        </tr> : null
                    )}
                    <Waypoint onEnter={loadMore}>
                        <div className="my-3 w-100 p-2">
                            <button onClick={loadMore} className="btn btn-primary p-3">Load More</button>
                        </div>
                    </Waypoint>
                </tbody> :
                <div className="w-100">No profiles found</div>}
        </table>
    </StyledTable>;

};
