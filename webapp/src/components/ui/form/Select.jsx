import React from 'react';
import styled from "@emotion/styled";

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

const Select = ({
    label, className, options = [], value, onChange = () => {},
}) => {

    return <FormSelect>
        <label>{label}</label>
        <select
            value={value}
            onChange={(e) => onChange(e.currentTarget.value) }
            className={className}
        >
            <option disabled selected value> -- select -- </option>
            {options?.length > 0 ?
                options.map((o) =>
                    <option value={o.value}>{o.label}</option>
                ) : null
            }
        </select>
    </FormSelect>

};

export default Select;