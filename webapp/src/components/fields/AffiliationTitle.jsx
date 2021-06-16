import React from 'react';
import {useMutation, useQuery} from "graphql-hooks";
import AsyncCreatableSelect from 'react-select/async-creatable';
import debounce from "lodash/debounce";
import { components } from 'react-select'

import { ADD_AFFILIATION_TITLE, AFFILIATION_TITLES_QUERY } from "../../graphql/queries/affiliation";

const Menu = props => {
    if (props.selectProps.inputValue.length < 3) return null

    return (
        <>
            <components.Menu {...props} />
        </>
    )
}

const AffiliationTitle = ({
  value, onChange = () => {},
  isAcademician = false, isStudent = false, isIndustry = false,
}) => {

    const {
        loading: affiliationLoading,
        error: affiliationLoadError,
        data: titleList,
        refetch: refetchAffiliations,
    } = useQuery(AFFILIATION_TITLES_QUERY, { useCache: true });

    const [createAffiliationTitle] = useMutation(ADD_AFFILIATION_TITLE);

    const asyncLoadTitles = debounce((keyword, callback) => {
        refetchAffiliations({ variables: { keyword }}).then(({ data }) => {
            if(data?.affiliationTitles) {
                callback(data.affiliationTitles);
            }
        })
    }, 500);

    const handleCreate = (name) => {
        createAffiliationTitle({ variables: { name }}).then(({ data, error }) => {
            if(data?.addAffiliationTitle){
                onChange(data.addAffiliationTitle);
            }
        })
    };

    const customStyles = {
        control: (provided, state) => ({
            ...provided,
            borderRadius: 0,
            border: '1px solid #AF0C3E'
        }),
    };

    return <div>
        <label style={{ fontWeight: 600, color: '#333' }} className="px-1 mb-1">
            {isStudent ? 'Course / Qualification' :
                isAcademician || isIndustry ? 'Job Title'
                : 'Affiliation Title'
            }
        </label>
        <AsyncCreatableSelect
            id="affiliation-title-input"
            placeholder="Enter Affiliation Title"
            onChange={onChange}
            value={value}
            onCreateOption={handleCreate}
            cacheOptions
            components={{
                Menu,
                IndicatorSeparator: (p) => null,
                DropdownIndicator: (p) =>
                <components.DropdownIndicator {...p}>
                    <i className="fa fa-id-card" />
                </components.DropdownIndicator>,
            }}
            // defaultOptions={titleList?.affiliationTitles}
            loadOptions={asyncLoadTitles}
            styles={customStyles}
        />
    </div>;

};

export default AffiliationTitle;