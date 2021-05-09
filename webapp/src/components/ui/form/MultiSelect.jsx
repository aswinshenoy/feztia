import React from 'react';
import styled from "@emotion/styled";
import Select from 'react-select'

const FormSelect = styled.div`
      select{
          font-size: 15px!important; 
          border: 1px solid #AF0C3E!important; 
          padding: 9px 12px; 
          background: none;
          margin-top: 0.15rem;
          &:focus {
            border: 2px solid #AF0C3E!important;
            padding: 8px 11px; 
            outline: none!important;
          }
      }
      label { 
          font-size: 12px; 
          font-weight: 600!important; 
          margin-bottom: 0;
          display: block;
          color: #333;
      }
`;

const MultiSelect = ({
    label, maxSelections = null, className, options = [], value, onChange = () => {},
}) => {

    const getValueObject = () => {
        if(value) {
            if(options.some((o) => value?.length > 0 && value.includes(o.value))){
                return options.filter((o) => value.includes(o.value));
            }
        }
    };

    const customStyles = {
        menu: (provided, state) => ({
            ...provided,
            zIndex: 9999
        }),
        control: (provided, state) => ({
            ...provided,
            borderRadius: 0,
            border: '1px solid #AF0C3E',
            zIndex: 9000
        }),
    };

    const onSelect = (selections) => {
        const values = [];
        if(selections?.length > 0) {
            if(maxSelections === null || maxSelections >= selections?.length) {
                selections.forEach((o) => values.push(o.value));
                onChange(JSON.stringify(values));
            }
        } else {
            onChange(JSON.stringify(values));
        }
    }

    return <FormSelect>
        <label>{label}</label>
        <Select
            value={getValueObject()}
            onChange={onSelect}
            className={className}
            options={options}
            styles={customStyles}
            isMulti
            menuPortalTarget={document.body}
        />
    </FormSelect>

};

export default MultiSelect;