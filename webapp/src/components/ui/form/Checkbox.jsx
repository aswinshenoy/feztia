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

const Checkbox = ({
    label, name, maxSelections = null, className, options = [], value = [], onChange = () => {},
}) => {

    const processValue = (v) => {
        if(value?.length > 0 && value.some((c) => c === v)) {
            return value.filter((c) => c !== v);
        }
        if(value?.length > 0) {
            if(maxSelections === null || maxSelections > value.length)
                return [...value, v];
            return value;
        }
        return [v,];
    };

    return <FormRadio className={className}>
        <label>{label}</label>
        <div className="row bg-light p-1 mx-0">
            {options?.length > 0 ?
                options.map((o) =>
                    <div className="col-md-6 col-lg-4 p-2">
                        <td>
                            <input
                                id={`${o.name}_${o.value}`}
                                type="checkbox"
                                name={name}
                                value={o.value}
                                disabled={value && maxSelections===value.length && !(value && value.length > 0 && value.includes(o.value))}
                                checked={value && value.length > 0 && value.includes(o.value)}
                                onChange={() => onChange(JSON.stringify(processValue(o.value)))}
                            />
                            <label htmlFor={`${o.name}_${o.value}`}>{o.label}</label>
                        </td>
                    </div>
                ) : null}
        </div>
    </FormRadio>

};

export default Checkbox;