import React, {useEffect, useState} from 'react';
import GooglePlacesAutocomplete from "react-google-places-autocomplete";

const PlacePicker = ({
    label, placeholder, city, state, country, onChange = () => {},
}) => {

    const [place, setPlace] = useState(
        country ?
        {
            label: `${city}, ${state}, ${country}`,
            value: {
                description: `${city}, ${state}, ${country}`
            },
            isPreset: true,
        } : null
    );

    useEffect(() => {
        if(!place?.isPreset){
            onChange({
                city: place?.value?.terms[0].value,
                state: place?.value?.terms.length > 2 ? place?.value?.terms[1].value : null,
                country: place?.value?.terms[place?.value?.terms.length - 1].value
            })
        }
    }, [place]);

    const customStyles = {
        control: (provided, state) => ({
            ...provided,
            borderRadius: 0,
            border: '1px solid #AF0C3E'
        }),
    };

    return <div>
        <label style={{ fontWeight: 600 }} className="px-1 mb-1 text-dark">{label}</label>
        <GooglePlacesAutocomplete
            apiKey="AIzaSyDgv-EZdSfVUJViYdrcbaxGOdHWsX5AaN8"
            autocompletionRequest={{ types:  ['(cities)'] }}
            selectProps={{
                value: place,
                onChange: setPlace,
                placeholder: placeholder,
                styles: customStyles
            }}
        />
    </div>

};

export default PlacePicker;