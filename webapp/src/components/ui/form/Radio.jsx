import React from 'react';
import styled from "@emotion/styled";

const FormRadio = styled.div`
    label {
       font-weight: 600;
       color: #333;
       margin-bottom: 0;
    }
    td {
      display: flex;
      align-items: center;
      input {
        margin-right: 8px;
      }
      label {
        font-weight: 400;
        color: #111;
      }
    }
  
`;

const Radio = ({
    label, name, className, options = [], value, onChange = () => {},
}) => {

    return <FormRadio className={className}>
        <label>{label}</label>
        <div className="row bg-light p-1 mx-0">
            {options?.length > 0 ?
                options.map((o) =>
                    <div className="col-md-6 col-lg-4 p-2">
                        <td>
                            <input
                                id={`${o.name}_${o.value}`}
                                type="radio"
                                name={name}
                                value={o.value}
                                checked={o.value===value}
                                onChange={() => onChange(o.value)}
                            />
                            <label htmlFor={`${o.name}_${o.value}`}>{o.label}</label>
                        </td>
                    </div>
                ) : null}
        </div>
    </FormRadio>

};

export default Radio;