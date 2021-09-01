import React, { useMemo } from 'react'
import { Formik, Form, Field, FastField, FieldArray, ErrorMessage } from 'formik';
import Dropzone from 'react-dropzone';
import { makeStyles } from '@material-ui/core/styles';

function SubmitToJobOrder({ applicants }) {
    //console.log(props.values.applicants);
    const useStyles = makeStyles((theme) => ({
        root: {
          '& > *': {
            borderBottom: 'unset',
          },
          marginTop: '2.5rem'
        },
      }));

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

    const classes = useStyles();

    return (
        <div className={classes.root}>
            <FieldArray
                name="applicants"
                render={arrayHelpers => (
                <div>
                    {applicants.map((applicant, index) => (
                        <div key={index}>
                            <a style={{ color: 'grey', fontWeight: 'lighter' }}>Candidate {index + 1}</a>
                            <div className="form-row">
                                <div className="form-group col-md-6">
                                    <label className="control-label">Client Name</label>
                                    <Field
                                        name={`applicants[${index}].clientName`}
                                        type="text"
                                        className="form-control"
                                    />
                                </div>
                                <div className="form-group col-md-6">
                                    <label className="control-label">Client Case Number</label>
                                    <Field
                                        name={`applicants[${index}].clientCaseNumber`}
                                        type="text"
                                        className="form-control"
                                    />
                                </div>
                            </div>
                            <div className="form-group">
                                <Dropzone onDrop={acceptedFiles => {
                                }}
                                >
                                    {({ getRootProps, getInputProps }) => (
                                        <div {...getRootProps({ style })}>
                                            <input {...getInputProps()} />
                                            <p style={{ margin: "auto", paddingTop: "30px", paddingBottom: "30px", textAlign: "center" }}>Drag and drop the file here, or Add Files</p>
                                        </div>
                                    )}
                                </Dropzone>
                            </div>
                            <div className="form-group">
                                <label>
                                    <Field
                                        name={`applicants[${index}].consent`}
                                        //name={`client${applicant.applicantID}Consent`}
                                        type="checkbox"
                                        style={{marginRight: "5px"}}/>
                                    I confirm that I have received written consent from the client to disclose their information to the employer
                                </label>
                            </div>
                        </div>
                    ))}
                </div>
            )}
            />
            {/* <FieldArray
                name="applicants"
                render= {() => 
                (
                <div>
                    <a style={{ color: 'grey', fontWeight: 'lighter' }}>Candidate {applicant.applicantID + 1}</a>
                    <div className="form-row">
                        <div className="form-group col-md-6">
                            <label className="control-label" htmlFor={`clientName`}>Client Name</label>
                            <Field
                                name={`clientName`}
                                type="text"
                                className="form-control"
                            />
                            <ErrorMessage
                                name={`client${applicant.applicantID}Name`}
                                component="div"
                                className="field-error"
                            />
                        </div>
                        <div className="form-group col-md-6">
                            <label className="control-label" htmlFor="clientCaseNumber">Client Case Number</label>
                            <Field
                                name={`client${applicant.applicantID}CaseNumber`}
                                type="text"
                                className="form-control"
                            />
                            <ErrorMessage
                                name={`client${applicant.applicantID}CaseNumber`}
                                component="div"
                                className="field-error"
                            />
                        </div>
                    </div>
                    <div className="form-group">
                        <Dropzone onDrop={acceptedFiles => {
                        }}
                        >
                            {({ getRootProps, getInputProps }) => (
                                <div {...getRootProps({ style })}>
                                    <input {...getInputProps()} />
                                    <p style={{ margin: "auto", paddingTop: "30px", paddingBottom: "30px", textAlign: "center" }}>Drag and drop the file here, or Add Files</p>
                                </div>
                            )}
                        </Dropzone>
                    </div>
                    <div className="form-group">
                        <label htmlFor="consent">
                            <Field
                                name={"candidates.consent"}
                                //name={`client${applicant.applicantID}Consent`}
                                type="checkbox"
                                style={{marginRight: "5px"}}/>
                            I confirm that I have received written consent from the client to disclose their information to the employer
                        </label>
                    </div>
                </div>)
                }
            /> */}
        </div>
    );
}

export default SubmitToJobOrder;