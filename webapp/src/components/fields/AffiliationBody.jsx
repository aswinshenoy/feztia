import React from 'react';
import {useMutation, useQuery} from "graphql-hooks";
import AsyncCreatableSelect from 'react-select/async-creatable';
import debounce from "lodash/debounce";
import {components} from "react-select";

import {ADD_AFFILIATION_BODY, AFFILIATION_BODY_QUERY} from "../../graphql/queries/affiliation";

const Menu = props => {
    if (props.selectProps.inputValue.length < 3) return null

    return (
        <>
            <components.Menu {...props} />
        </>
    )
}

const AffiliationBody = ({
    value, onChange = () => {},
    isAcademician = false, isStudent = false, isIndustry = false,
}) => {

    const {
        loading: bodyLoading,
        error: bodyError,
        data: bodyList,
        refetch: refetchBodies
    } = useQuery(AFFILIATION_BODY_QUERY, { useCache: true });

    const [createAffiliationBody] = useMutation(ADD_AFFILIATION_BODY);

    const asyncLoadBodies = debounce((keyword, callback) => {
        refetchBodies({ variables: { keyword }}).then(({ data }) => {
            if (data?.affiliationBodies) {
                callback(data.affiliationBodies);
            }
        })
    }, 500);

    const handleCreate = (name) => {
        createAffiliationBody({ variables: { name }}).then(({ data, error }) => {
            if(data?.addAffiliationBody){
                onChange(data.addAffiliationBody);
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
            {isStudent ? 'College / School' :
                isAcademician ? 'Institution' :
                    isIndustry ? 'Organization / Company'
                        : 'Affiliation Body'
            }
        </label>
        <AsyncCreatableSelect
            id="affiliation-body-input"
            placeholder={
                `Enter ${isStudent ? 'College / School' :
                    isAcademician ? 'Institution' :
                        isIndustry ? 'Organization / Company'
                            : 'Affiliation Body'
                }`
            }
            onChange={onChange}
            value={value}
            onCreateOption={handleCreate}
            cacheOptions
            components={{
                Menu,
                IndicatorSeparator: (p) => null,
                DropdownIndicator: (p) =>
                <components.DropdownIndicator {...p}>
                    <i className="fa fa-landmark" />
                </components.DropdownIndicator>,
            }}
            loadOptions={asyncLoadBodies}
            styles={customStyles}
        />
    </div>;

};

export default AffiliationBody;