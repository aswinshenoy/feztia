import React from 'react';
import {CSVLink} from "react-csv";
import format from "date-fns/format";
import parseISO from "date-fns/parseISO";

export default ({
    fields, profiles, isTeamEvent,
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

    const generateCSVData = () => {
        const d = [];
        if(profiles.length > 0 && !isTeamEvent){
            const formfields = [];
            if(fields?.length > 0){
                fields.map((f) => formfields.push(f.key));
            }
            d.push([
                '#', 'Title', 'Name', 'Status', 'Type', 'Phone', 'Email', 'Date Joined', 'City', 'State',
                'County', 'Gender', 'Affiliation Title', 'Affiliation Body',
                ...formfields
            ])
            profiles.forEach(({ profile: s, isApproved, remarks, formData: f }, index) => {
                if(s){
                    const fieldData = [];
                    fields?.map((d) => {
                        const list = f.filter((fd) => fd.label === d.key)
                        if(list?.length > 0){
                            const item = list[0];
                            try{
                                if(d?.options?.length > 0){
                                    const parsedValue = JSON.parse(item.value);
                                    if(parsedValue) {
                                        let values = parsedValue.map((v) => `${v}; `);
                                        fieldData.push(values.toString());
                                    }
                                } else {
                                    fieldData.push(data[0].value);
                                }
                            } catch (e) {
                                fieldData.push('-');
                            }
                        } else {
                            fieldData.push('-');
                        }
                    })
                    d.push([
                        `${index+1}`,
                        `${s.title}`,
                        `${s.name}`,
                        `${ isApproved ? 'Approved' :
                            remarks?.length > 0 ? 'Rejected with Remarks'
                                : s?.IDCardURL?.length > 0 ? 'Ready for Review (ID Uploaded)'
                                : !s?.isPhoneVerified ? 'Phone Not Verified'
                                    : !s?.isEmailVerified ? 'Email Not Verified'
                                        : s?.IDCardURL == null ? 'ID Not Uploaded' :
                                            'Incomplete Profile'
                        }`,
                        `${getTypeName(s.type)}`,
                        `${s.phone}`,
                        `${s.email}`,
                        `${format(parseISO(s.dateJoined), 'hh:MM a, dd-MM-yyyy')}`,
                        `${s.city}`,
                        `${s.state}`,
                        `${s.country}`,
                        `${s.gender}`,
                        `${s.affiliationTitle?.label}`,
                        `${s.affiliationBody?.label}`,
                        ...fieldData
                    ])
                }
            })
        } else if(isTeamEvent){
            const formfields = [];
            if(fields?.length > 0){
                fields.map((f) => formfields.push(f.key));
            }
            d.push([
                '#', 'Name', 'Leader', 'Affiliation Body', 'Members',
                ...formfields
            ])
            profiles.forEach(({ team, isApproved, remarks, formData: f }, index) => {
                    const fieldData = [];
                    fields?.map((d) => {
                        const list = f.filter((fd) => fd.label === d.key)
                        if(list?.length > 0){
                            const item = list[0];
                            try{
                                if(d?.options?.length > 0){
                                    const parsedValue = JSON.parse(item.value);
                                    if(parsedValue) {
                                        let values = parsedValue.map((v) => `${v}; `);
                                        fieldData.push(values.toString());
                                    }
                                } else {
                                    fieldData.push(data[0].value);
                                }
                            } catch (e) {
                                fieldData.push('-');
                            }
                        } else {
                            fieldData.push('-');
                        }
                    })
                    d.push([
                        `${index+1}`,
                        `${team?.name}`,
                        `${team?.leader ? `${team?.leader?.title} ${team?.leader?.name}` : ''}`,
                        `${team?.leader ? `${team?.leader?.affiliationBody?.label}` : ''}`,
                        `${team?.members?.length > 0 ? team.members.map((m) => `${m.title} ${m.name} (${m.email}), `) : ''}`,
                        ...fieldData
                    ])
            })
        }
        return d;
    }

    return <CSVLink
        data={generateCSVData()}
        filename={"registrations-export.csv"}
        target="_blank"
    >
        Download CSV Export
    </CSVLink>

}