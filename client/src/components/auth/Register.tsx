import React, {useState} from 'react';
import {
    Grid,
    Button,
} from '@material-ui/core';
import {Formik, Form, FormikProps} from 'formik';
import * as Yup from 'yup'
import {IFormStatus, IRegister} from "./types";
import {useStyles} from "./createStyles"
import {IUser} from "../../interfaces/user.interface";
import {inputForm} from "./inputForm";
import {useHistory} from "react-router-dom";
import * as authActions from '../../actions/auth';
import {formStatusProps} from "./status.error";
import {Nav} from "react-bootstrap";

export const Register: React.FunctionComponent = () => {
    const classes = useStyles()
    const [displayFormStatus, setDisplayFormStatus] = useState(false)
    const [formStatus, setFormStatus] = useState<IFormStatus>({
        message: '',
        type: '',
    })

    const history = useHistory();

    const createNewUser = async (data: IRegister, resetForm: Function) => {
        if (data) {
            try {
                await authActions.register(data);
                setDisplayFormStatus(true)
                history.push('/login')
            } catch (e) {
                setFormStatus(formStatusProps.error)
                setDisplayFormStatus(true)
            }
        }
    }

    return (
        <div className={classes.root}>
            <Formik
                initialValues={{
                    nickName: '',
                    password: '',
                    confirmPassword: '',
                    email: '',
                }}
                onSubmit={(values: IRegister, actions) => {
                    createNewUser(values, actions.resetForm).then(r => console.log(`User register ${r}`));
                    setTimeout(() => {
                        history.push('/login')
                    }, 0)
                }}
                validationSchema={Yup.object().shape({
                    email: Yup.string().email().required('Enter valid email-id'),
                    nickName: Yup.string().required('Please enter full name'),
                    password: Yup.string()
                        // .matches(
                        //     /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%^&*()]).{8,20}\S$/
                        // )
                        .min(8)
                        .required(
                            'Please valid password'
                        ),
                    confirmPassword: Yup.string().required('Required')
                        .test(
                            'password-match',
                            'Password musth match',
                            function (value) {
                                return this.parent.password === value
                            }
                        ),
                })}
            >
                {(props: FormikProps<IRegister>) => {
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
                            <h1 className={classes.title}>Register</h1>
                            <Grid
                                container
                                justify="space-around"
                                direction="row"
                            >
                                {inputForm({
                                    className: classes["textField"],
                                    nameField: "nickName",
                                    label: "NickName",
                                    value: values.nickName,
                                    handleChange: handleChange,
                                    handleBlur: handleBlur,
                                    helperText: errors.nickName && touched.nickName
                                        ? errors.nickName
                                        : 'Enter your nickName.',
                                    error: !!(errors.nickName && touched.nickName)
                                })}
                                {inputForm({
                                    className: classes["textField"],
                                    nameField: "password",
                                    label: "Password",
                                    value: values.password,
                                    handleChange: handleChange,
                                    handleBlur: handleBlur,
                                    helperText: errors.password && touched.password
                                        ? 'Please valid password. One uppercase, one lowercase, one special character and no spaces'
                                        : 'One uppercase, one lowercase, one special character and no spaces',
                                    error: !!(errors.password && touched.password)
                                })}
                                {inputForm({
                                    className: classes["textField"],
                                    nameField: "confirmPassword",
                                    label: "ConfirmPassword",
                                    value: values.confirmPassword,
                                    handleChange: handleChange,
                                    handleBlur: handleBlur,
                                    helperText: errors.confirmPassword && touched.confirmPassword ?
                                        errors.confirmPassword : 'Re-enter password to confirm',
                                    error: !!(errors.confirmPassword && touched.confirmPassword)
                                })}
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
                                <Grid item lg={10} md={10} sm={10} xs={10}>
                                    <Nav>
                                        <Nav.Link href="/login">Login</Nav.Link>
                                    </Nav>
                                </Grid>
                            </Grid>
                        </Form>
                    )
                }}
            </Formik>
        </div>
    )


}
