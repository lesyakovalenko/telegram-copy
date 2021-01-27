import React, {useEffect, useState} from 'react';
import {
    Grid,
    Button,
} from '@material-ui/core';
import {Formik, Form, FormikProps} from 'formik';
import * as Yup from 'yup'
import {IFormStatus, IFormStatusProps} from "../interfaces/status.interface";
import {useStyles} from "./createStyles"
import axios from "axios";
import {inputForm} from "./inputForm";
import {ILogin} from "../interfaces/login.interface";
import {useHistory} from "react-router-dom";

const API_SERVER = 'http://localhost:5000/auth/login'
const formStatusProps: IFormStatusProps = {
    success: {
        message: 'Signed up successfully.',
        type: 'success',
    },
    duplicate: {
        message: 'Email-id already exist. Please use different email-id.',
        type: 'error',
    },
    error: {
        message: 'Something went wrong. Please try again.',
        type: 'error',
    },
}

export const Login: React.FunctionComponent = () => {
    const classes = useStyles()
    const [displayFormStatus, setDisplayFormStatus] = useState(false)
    const [formStatus, setFormStatus] = useState<IFormStatus>({
        message: '',
        type: '',
    })
    const [token, setToken] = useState('')
    const [user, setUser] = useState({
        _id: '',
        nickName: '',
        email: ''
    })
    const history = useHistory()
    useEffect(() => {
        console.log('token', token)
        if (token.length) {
            localStorage.setItem('token', token);

        }
        if( user._id.length){
            console.log(user);
            history.push('/profile', {
                _id: user._id,
                nickName: user.nickName,
                email: user.email
            })
        }
    }, [token, user])

    const loginUser = async (data: ILogin, resetForm: Function) => {
        if (data) {
            axios.post(API_SERVER, data)
                .then(res => {
                    setToken(res.data.token);
                    console.log('user=>',res.data.user)
                    setUser(res.data.user);
                    console.log('login', res)
                    setDisplayFormStatus(true)
                }).catch((e) => {
                console.log(e)
                setFormStatus(formStatusProps.error)
            })
            console.log(data)
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
                    // setTimeout(() => {
                    //     console.log('setTimeout', token)
                    //     if (token.length) {
                    //         localStorage.setItem('token', token);
                    //         history.push('/profile')
                    //     }
                    //
                    // }, 0)
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
