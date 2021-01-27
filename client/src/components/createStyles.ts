import {createStyles, makeStyles, Theme} from "@material-ui/core";

export const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            maxWidth: '450px',
            display: 'block',
            margin: '0 auto',
        },
        textField: {
            '& > *': {
                width: '100%',
            },
        },
        submitButton: {
            marginTop: '4px',
        },
        title: { textAlign: 'center' },
        successMessage: { color: 'green' },
        errorMessage: { color: 'red' },
    })
)