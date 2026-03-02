import React from 'react';
import { Select, MenuItem } from "@mui/material";
import { genItemListSelectBoxSxProps, genItemListSelectBoxSxValue } from "../../helpers/styleHelper"

const SelectInputComponent = (props) => {
    console.log(props, " props")
    return (

        <Select onChange={props.onChange} displayEmpty
            value={props.defaultValue}
            inputProps={genItemListSelectBoxSxProps()}
            sx={genItemListSelectBoxSxValue(props.width)}
            disabled={props.disabled}

        >
            {props?.OptionsItemList?.data ? props.OptionsItemList.data.map((v, k) => (
                <MenuItem value={v.value} key={k}>{v.label}</MenuItem>
            )
            ) : <MenuItem></MenuItem>}
        </Select>
    )
}

export default SelectInputComponent;
