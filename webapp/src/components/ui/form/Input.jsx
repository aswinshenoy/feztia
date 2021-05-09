import React from 'react';
import styled from "@emotion/styled";

const FormInput = styled.div`
  input {
    font-size: 15px!important;
    border: 1px solid #AF0C3E!important;
    padding: 8px 10px;
    margin: 1px;
    border-radius: 0;
    &:focus {
      border: 2px solid #AF0C3E!important;
      margin: 0!important;
      outline: none!important;
    }
  }
  label {
    font-size: 12px;
    font-weight: 500!important;
    margin: 0.35rem 0;
    display: block;
  }
`;

const Input = ({
   label, type, value, className, charLimit, autoComplete, placeholder, onChange = () => {}, isRequired = false
}) => {

    return <FormInput>
        <label>{label}</label>
        {type === 'textarea' ?
        <textarea
            title={label}
            placeholder={placeholder}
            required={isRequired}
            aria-label={label}
            aria-required={isRequired}
            value={value}
            onChange={(e) =>
                e.currentTarget.value.length <= charLimit ? onChange(e.currentTarget.value) : null
            }
            className={className}
            rows={3}
        /> :
        <input
            title={label}
            placeholder={placeholder}
            value={value}
            type={type}
            autoComplete={autoComplete}
            className={className}
            onChange={(e) =>
                charLimit ? (e.currentTarget.value.length <= charLimit ? onChange(e.currentTarget.value) : null) :
                    onChange(e.currentTarget.value)
            }
            required={isRequired}
            aria-label={label}
            aria-required={isRequired}
        />}
        {charLimit && <div>Maximum Characters: {charLimit}</div>}
    </FormInput>

};

export default Input;