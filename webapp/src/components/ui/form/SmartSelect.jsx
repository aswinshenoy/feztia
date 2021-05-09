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
          font-weight: 500!important; 
          margin-bottom: 0;
          display: block;
      }
`;

const SmartSelect = ({
    label, className, options = [], value, onChange = () => {},
}) => {

    const getValueObject = () => {
        if(value) {
            if(options.some((o) => o.value === value)){
                return options.filter((o) => o.value === value)[0]
            }
        }
        return null;
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

    return <FormSelect>
        <label>{label}</label>
        <Select
            value={getValueObject()}
            onChange={(o) => onChange(o.value)}
            className={className}
            options={options}
            styles={customStyles}
            menuPortalTarget={document.body}
        />
    </FormSelect>

};

export default SmartSelect;