import React, { useMemo, useState, useCallback } from 'react'
import Dropzone from 'react-dropzone'
import { withRouter, useHistory } from 'react-router-dom'
import { useKeycloak } from '@react-keycloak/web'
import { Formik, Form, Field, FieldArray, ErrorMessage } from 'formik'
import { FORM_URL } from '../../../constants/form'
import Thumb from '../../../utils/Thumb'
import JobFields from './JobFields'
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import Checkbox from '@material-ui/core/Checkbox';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
//import 'react-accessible-shuttle/css/shuttle.css';

const useStyles = makeStyles((theme) => ({
    root: {
        margin: 'auto',
    },
    cardHeader: {
        padding: theme.spacing(1, 2),
    },
    list: {
        width: 350,
        height: 230,
        backgroundColor: theme.palette.background.paper,
        overflow: 'auto',
        paddingLeft: 0
    },
    button: {
        margin: theme.spacing(0.5, 0),
    },
}));

function not(a, b) {
    return a.filter((value) => b.indexOf(value) === -1);
}

function intersection(a, b) {
    return a.filter((value) => b.indexOf(value) !== -1);
}

function union(a, b) {
    return [...a, ...not(b, a)];
}







function CreateJobOrder() {
    const h = useHistory()
    const { keycloak, initialized } = useKeycloak()

    const classes = useStyles();
    const [checked, setChecked] = React.useState([]);
    const [left, setLeft] = React.useState(
        [
            'CA01', 'CA02', 'CA03', 'CA04', 'CA05', 'CA06', 'CA07', 'CA08', 'CA09',
            'CA10', 'CA11', 'CA12', 'CA13', 'CA14', 'CA15', 'CA16', 'CA17', 'CA18', 'CA19',
            'CA20', 'CA21', 'CA22', 'CA23', 'CA24', 'CA25', 'CA26', 'CA27', 'CA28', 'CA29',
            'CA30', 'CA31', 'CA32', 'CA33', 'CA34', 'CA35', 'CA36', 'CA37', 'CA38', 'CA39',
            'CA40', 'CA41', 'CA42', 'CA43', 'CA44', 'CA45',
        ]
    );
    const [right, setRight] = React.useState([]);

    const leftChecked = intersection(checked, left);
    const rightChecked = intersection(checked, right);

    const handleToggle = (value) => () => {
        const currentIndex = checked.indexOf(value);
        const newChecked = [...checked];

        if (currentIndex === -1) {
            newChecked.push(value);
        } else {
            newChecked.splice(currentIndex, 1);
        }

        setChecked(newChecked);
    };


    const numberOfChecked = (items) => intersection(checked, items).length;

    const handleToggleAll = (items) => () => {
        if (numberOfChecked(items) === items.length) {
            setChecked(not(checked, items));
        } else {
            setChecked(union(checked, items));
        }
    };

    const handleCheckedRight = () => {
        setRight(right.concat(leftChecked));
        setLeft(not(left, leftChecked));
        setChecked(not(checked, leftChecked));
    };

    const handleCheckedLeft = () => {
        setLeft(left.concat(rightChecked));
        setRight(not(right, rightChecked));
        setChecked(not(checked, rightChecked));
    };

    const customList = (title, items) => (
        <Card>
            <CardHeader
                className={classes.cardHeader}
                avatar={
                    <Checkbox
                        onClick={handleToggleAll(items)}
                        checked={numberOfChecked(items) === items.length && items.length !== 0}
                        indeterminate={numberOfChecked(items) !== items.length && numberOfChecked(items) !== 0}
                        disabled={items.length === 0}
                        inputProps={{ 'aria-label': 'all items selected' }}
                    />
                }
                title={title}
                subheader={`${numberOfChecked(items)}/${items.length} selected`}
            />
            <Divider />
            <List className={classes.list} dense component="div" role="list">
                {items.map((value) => {
                    const labelId = `transfer-list-all-item-${value}-label`;

                    return (
                        <ListItem key={value} role="listitem" button onClick={handleToggle(value)}>
                            <ListItemIcon>
                                <Checkbox
                                    checked={checked.indexOf(value) !== -1}
                                    tabIndex={-1}
                                    disableRipple
                                    inputProps={{ 'aria-labelledby': labelId }}
                                />
                            </ListItemIcon>
                            <ListItemText id={labelId} primary={`${value}`} />
                        </ListItem>
                    );
                })}
                <ListItem />
            </List>
        </Card>
    );


    let initialValues = {
        employer: "",
        position: "",
        startDate: new Date(),
        deadline: new Date(),
        location: "",
        vacancies: 1,
        catchments: right,
        jobDescriptionFile: {},
        otherInformation: "",
        status: "Open",
        user: keycloak.tokenParsed.name //TODO: user id instead?
    }

    const dropzoneStyle = {
        width: "100%",
        height: "auto",
        borderWidth: 2,
        borderColor: "rgb(102, 102, 102)",
        borderStyle: "dashed",
        borderRadius: 5,
    }


    const style = useMemo(() => ({
        ...dropzoneStyle
    }))


    return (
        <div className="container">
            <div className="row">
                <div className="col-md-12">
                    <h1>EOD Resume Bundler - Create Job Order</h1>
                    <Formik
                        initialValues={initialValues}
                        enableReinitialize={true}
                        onSubmit={(values, { resetForm, setErrors, setStatus, setSubmitting }) => {
                            fetch(FORM_URL.JobOrders, {
                                method: "POST",
                                credentials: 'include',
                                headers: {
                                    'Accept': 'application/json',
                                    'Content-Type': 'application/json',
                                },
                                body: JSON.stringify(values),
                            })
                            .then(
                                (res) => {
                                    if (res.ok){
                                        setSubmitting(false);
                                        return res.json();
                                    }
                                    else{
                                        throw new Error("server responded with error!")
                                    }
                            })
                            .then(
                                (res) => {
                                    setSubmitting(false);
                                    h.push({
                                        pathname: '/createJobOrderSuccess',
                                        createdID: res.createdID
                                    });
                                },
                                (err) => {
                                    setErrors(err);
                                    setSubmitting(false);
                                }
                            );
                        }}
                    //validationSchema={FormValidationSchema}
                    >
                        {({ values, isSubmitting, setFieldValue, handleBlur, handleChange, errors, hasError }) => (
                            <div>
                                <Form>
                                    {/* {console.log(values)} */}
                                    <p>Create a position for WorkBC Centres to drop resumes</p>
                                    <div className="form-group">
                                        <legend>Job Fields</legend>
                                    </div>
                                    <JobFields />
                                    <div className="form-group">
                                        <p className="col-form-label control-label">Upload Job Description (PDF or Word, max 4MB)</p>
                                    </div>
                                    <div className="form-group">
                                        <Dropzone onDrop={acceptedFiles => {
                                            // do nothing if no files
                                            console.log(acceptedFiles)
                                            //if (acceptedFiles.length === 0) { return; }

                                            // on drop we add to the existing files
                                            //setFieldValue("jobDescriptionFile", values.jobDescriptionFile.concat(acceptedFiles));
                                        }}
                                        >
                                            {({ getRootProps, getInputProps }) => (
                                                <div {...getRootProps({ style })}>
                                                    <input {...getInputProps()} />
                                                    <p style={{ margin: "auto", paddingTop: "30px", paddingBottom: "30px", textAlign: "center" }}>Drag and drop the file here, or Add Files</p>
                                                </div>
                                                /*                                          
                                                if (isDragActive) {
                                                    <div {...getRootProps({style})}>
                                                    <   input {...getInputProps()} />
                                                        <p className="align-center">Adding</p>
                                                     </div>
                                                }
     
                                                if (isDragReject) {
                                                    <div {...getRootProps({style})}>
                                                        <input {...getInputProps()} />
                                                        <p className="align-center">Invalid file, please try another file.</p>
                                                    </div>
                                                }
     
                                                if (values.jobDescriptionFile.length === 0) {
                                                    return (
                                                        <div {...getRootProps({style})}>
                                                            <input {...getInputProps()} />
                                                            <p className="align-center">Drag and drop the file here, or Add Files</p>
                                                        </div>
                                                    )
                                                }
                                                */

                                                //return values.jobDescriptionFile.map((file, i) => (<Thumb key={i} file={file} />));
                                            )}
                                        </Dropzone>
                                    </div>
                                    <div className="form-group">
                                        <p className="col-form-label control-label">Catchments Job will be available to</p>
                                    </div>
                                    <Grid
                                        container
                                        spacing={2}
                                        //justifyContent="center"
                                        alignItems="center"
                                        className={classes.root}
                                    >
                                        <Grid item>{customList('Choices', left)}</Grid>
                                        <Grid item>
                                            <Grid container direction="column" alignItems="center">
                                                <Button
                                                    variant="outlined"
                                                    size="small"
                                                    className={classes.button}
                                                    onClick={handleCheckedRight}
                                                    disabled={leftChecked.length === 0}
                                                    aria-label="move selected right"
                                                >
                                                    &gt;
                                                </Button>
                                                <Button
                                                    variant="outlined"
                                                    size="small"
                                                    className={classes.button}
                                                    onClick={handleCheckedLeft}
                                                    disabled={rightChecked.length === 0}
                                                    aria-label="move selected left"
                                                >
                                                    &lt;
                                                </Button>
                                            </Grid>
                                        </Grid>
                                        <Grid item>{customList('Chosen', right)}</Grid>
                                    </Grid>
                                    <div className="form-group">
                                        <label className="col-form-label control-label" htmlFor="otherInformation">Other information
                                        </label>
                                        <small className="text-muted" id="otherInformation"> (1000 characters max.)</small>
                                        <Field
                                            as="textarea"
                                            className="form-control"
                                            id="otherInformation"
                                            name="otherInformation"
                                            rows="4"
                                            maxLength="1000"
                                        />
                                        <small>{values.otherInformation.length}/1000</small>
                                    </div>
                                    <button
                                        className="btn btn-success btn-block"
                                        type="submit"
                                        style={{ marginBottom: "2rem" }}
                                        disabled={isSubmitting || hasError}
                                    >
                                        {
                                            isSubmitting ?
                                                <div>
                                                    <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                                    Submitting...
                                                </div>
                                                :
                                                "Submit"

                                        }

                                    </button>
                                </Form>
                            </div>
                        )}
                    </Formik>
                </div>
            </div>
        </div>
    )
}

export default withRouter(CreateJobOrder)
