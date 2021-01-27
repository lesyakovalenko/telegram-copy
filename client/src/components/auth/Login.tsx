import React, {useState} from 'react';
import {
    Grid,
    Button,
} from '@material-ui/core';
import {Formik, Form, FormikProps} from 'formik';
import * as Yup from 'yup'
import {IFormStatus, ILogin} from "./types";
import {useStyles} from "./createStyles"
import {inputForm} from "./inputForm";
import {useHistory} from "react-router-dom";
import * as authActions from '../../actions/auth'
import {formStatusProps} from "./status.error";



export const Login: React.FunctionComponent = () => {
    const classes = useStyles()
    const [displayFormStatus, setDisplayFormStatus] = useState(false)
    const [formStatus, setFormStatus] = useState<IFormStatus>({
        message: '',
        type: '',
    })
    const history = useHistory()

    const loginUser = async (data: ILogin, resetForm: Function) => {
        if (data) {
            try {
                await authActions.login(data)
                history.push('/profile')
            } catch (e) {
                setFormStatus(formStatusProps.error)
                resetForm({})
            }
        }
    }

    return (
        <div className={classes.root}>
            <Formik
                initialValues={{
                    password: '',
                    email: '',
                }}
                onSubmit={(values: ILogin, actions) => {
                    loginUser(values, actions.resetForm)
                }}
                validationSchema={Yup.object().shape({
                    email: Yup.string().email().required('Enter valid email-id'),
                    password: Yup.string().min(8).required('Please valid password'),
                })}
            >
                {(props: FormikProps<ILogin>) => {
                    const {
                        values,
                        touched,
                        errors,
                        handleBlur,
                        handleChange,
                        isSubmitting,
                    } = props
                    return (
                        <Form>
                            <h1 className={classes.title}>Login</h1>
                            <Grid
                                container
                                justify="space-around"
                                direction="row"
                            >
                                {inputForm({
                                    className: classes["textField"],
                                    nameField: "email",
                                    label: "Email",
                                    value: values.email,
                                    handleChange: handleChange,
                                    handleBlur: handleBlur,
                                    helperText: errors.email && touched.email ? errors.email : 'Enter email',
                                    error: !!(errors.email && touched.email)
                                })}
                                {inputForm({
                                    className: classes["textField"],
                                    nameField: "password",
                                    label: "Password",
                                    value: values.password,
                                    handleChange: handleChange,
                                    handleBlur: handleBlur,
                                    helperText: 'Please valid password',
                                    error: !!(errors.password && touched.password)
                                })}


                                <Grid item lg={10} md={10} sm={10} xs={10} className={classes.textField}>
                                    <Button type="submit" variant="contained" color="primary" disabled={isSubmitting}>
                                        Submit
                                    </Button>
                                    {displayFormStatus && (
                                        <div className="formStatus">
                                            {formStatus.type === 'error' ? (
                                                <p className={classes.errorMessage}>
                                                    {formStatus.message}
                                                </p>
                                            ) : formStatus.type === 'success' ? (
                                                <p className={classes.successMessage}>
                                                    {formStatus.message}
                                                </p>
                                            ) : null}
                                        </div>
                                    )}
                                </Grid>
                            </Grid>
                        </Form>
                    )
                }}
            </Formik>
        </div>
    )
}
