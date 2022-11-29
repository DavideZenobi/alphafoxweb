import { Autocomplete, TextField } from "@mui/material"
import { useEffect, useState } from "react";
import { getAllPlaces } from "../api/api";


export const AutocompleteComp = (props: any) => {

    const [autocompleteOptions, setAutocompleteOptions] = useState<String[]>([]);

    useEffect(() => {
        getAllPlaces().then(response => {
            const options = response.map((option: any) => {
                return option.name;
            });
            
            options.sort();
            setAutocompleteOptions(options);
        });
    }, [])

    return (
        <Autocomplete
            disablePortal
            onChange={props.onValueChange}
            options={autocompleteOptions}
            sx={{ width: 300, marginTop: 3 }}
            renderInput={(params) => <TextField {...params} label="Place" />}
        />

    )
}