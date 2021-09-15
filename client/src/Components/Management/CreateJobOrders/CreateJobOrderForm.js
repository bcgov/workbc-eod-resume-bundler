import React, { useMemo, useState, useCallback, useEffect } from 'react'
import { withRouter, useHistory } from 'react-router-dom'
import { makeStyles } from '@material-ui/core/styles';
import { useKeycloak } from '@react-keycloak/web'
import { Formik, Form, Field, FastField, FieldArray, ErrorMessage } from 'formik'
import { FORM_URL } from '../../../constants/form'
import JobFields from './JobFields'
import CatchmentSelector from './CatchmentSelector';
import Dropzone from 'react-dropzone';
import * as yup from 'yup';

const CreateJobOrderForm = () => {
    const h = useHistory();
    const { keycloak, initialized } = useKeycloak();

    const [catchments, setCatchments] = React.useState([]);

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

    useEffect(async () => {
        await getCatchments();
    
        async function getCatchments() {
          const response = await fetch(FORM_URL.System + "/Catchments");
          const data = await response.json();
          setCatchments(data);
        }
      }, [setCatchments]);

    let initialValues = {
        employer: "",
        position: "",
        startDate: null,
        deadline: null,
        location: "",
        vacancies: 1,
        catchments: [],
        jobDescriptionFile: {},
        otherInformation: "",
        status: "Open",
        user: keycloak.tokenParsed.preferred_username
    }

    const catchmentsList = 
    [
        'CA01', 'CA02', 'CA03', 'CA04', 'CA05', 'CA06', 'CA07', 'CA08', 'CA09',
        'CA10', 'CA11', 'CA12', 'CA13', 'CA14', 'CA15', 'CA16', 'CA17', 'CA18', 'CA19',
        'CA20', 'CA21', 'CA22', 'CA23', 'CA24', 'CA25', 'CA26', 'CA27', 'CA28', 'CA29',
        'CA30', 'CA31', 'CA32', 'CA33', 'CA34', 'CA35', 'CA36', 'CA37', 'CA38', 'CA39',
        'CA40', 'CA41', 'CA42', 'CA43', 'CA44', 'CA45',
    ];

    const CreateJobOrderValidationSchema = yup.object().shape({
        employer: yup.string().required("employer is required field"),
        position: yup.string().required("position is a required field"),
        startDate: yup.date().typeError("a start date must be selected"),
        deadline: yup.date().typeError("a deadline must be selected"),
        location: yup.string().required("location is a required field"),
        catchments: yup.array().min(1, "please select a catchment"),
        otherInformation: yup.string().max(1000, "over 1000 characters")
    });

    const showErrors = () => {
        return (
            <div>
                <div className="alert alert-dismissible alert-danger">
                <button type="button" className="close" data-dismiss="alert">×</button>
                <strong>Please enter required information and try again</strong>
                </div>
            </div>
        );
    }

    return (
        <Formik
            initialValues={initialValues}
            enableReinitialize={false}
            validationSchema={CreateJobOrderValidationSchema}
            onSubmit={(values, { resetForm, setErrors, setFieldError, setStatus, setSubmitting }) => {
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
                    async (res) => {
                        if (res.ok){
                            setSubmitting(false);
                            return res.json();
                        }
                        else{
                            let err = await res.json();
                            setErrors(err);
                            throw new Error();
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
                        setSubmitting(false);
                    }
                );
            }}
        >
        {({ values, isSubmitting, setFieldValue, handleBlur, handleChange, errors, hasError }) => (
            <div>
                <Form>
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
                    {catchments.length > 0 && <FastField 
                        name="catchments"
                        component={CatchmentSelector} 
                        catchments={catchments} 
                    />}
                    <ErrorMessage
                        name="catchments"
                        className="field-error">
                        { msg => <div style={{ color: 'red' }}>{msg}</div> }
                    </ErrorMessage>
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
                    <div className="form-group">
                        {(Object.keys(errors).length >= 1 && errors.constructor === Object) && showErrors()} 
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
    </Formik>);
}

export default CreateJobOrderForm;