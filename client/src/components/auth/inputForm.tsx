import {Grid, TextField} from "@material-ui/core";
import {Form} from "formik";
import React from "react";

export const inputForm = (inputData: { className: any; nameField: any; label: any; value: any; handleChange: any; handleBlur: any; helperText: any; error: any; })=> {
    const  {  className, nameField, label, value,
        handleChange, handleBlur, helperText, error} = inputData;
    return (

        <Grid item lg={10} md={10} sm={10} xs={10} className={className}>
            <TextField
                name={nameField}
                id={nameField}
                label={label}
                value={value}
                type="text"
                helperText={helperText}
                error={error}
                onChange={handleChange}
                onBlur={handleBlur}
            />
        </Grid>
    )
}