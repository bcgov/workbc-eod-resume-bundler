import React, { useMemo } from 'react'
import { Formik, Form, Field, FastField, FieldArray, ErrorMessage } from 'formik';
import Dropzone from 'react-dropzone';
import { makeStyles } from '@material-ui/core/styles';

function ApplicantForm({ applicants, setApplicants, applicantsState, values, setFieldValue }) {
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
                                    <ErrorMessage
                                        name={`applicants[${index}].clientName`}
                                        className="field-error">
                                        { msg => <div style={{ color: 'red' }}>{msg}</div> }
                                    </ErrorMessage>
                                </div>
                                <div className="form-group col-md-6">
                                    <label className="control-label">Preferred Name</label>
                                    <Field
                                        name={`applicants[${index}].preferredName`}
                                        type="text"
                                        className="form-control"
                                    />
                                    <ErrorMessage
                                        name={`applicants[${index}].preferredName`}
                                        className="field-error">
                                        { msg => <div style={{ color: 'red' }}>{msg}</div> }
                                    </ErrorMessage>
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="form-group col-md-6">
                                    <label className="control-label">Client Case Number</label>
                                    <Field
                                        name={`applicants[${index}].clientCaseNumber`}
                                        type="text"
                                        className="form-control"
                                    />
                                    <ErrorMessage
                                        name={`applicants[${index}].clientCaseNumber`}
                                        className="field-error">
                                        { msg => <div style={{ color: 'red' }}>{msg}</div> }
                                    </ErrorMessage>
                                </div>
                            </div>
                            <div className="form-group">
                                <Dropzone 
                                    name={`applicants[${index}].resume`}
                                    accept="application/pdf"
                                    onDrop={acceptedFiles => {
                                        acceptedFiles.forEach(file => {
                                            const reader = new FileReader();
                                            reader.onabort = () => console.log('file reading was aborted')
                                            reader.onerror = () => console.log('file reading has failed')
                                            reader.onload = () => {
                                                const binaryStr = reader.result;
                                                const data = new FormData();
                                                data.append('file', binaryStr);
                                                setFieldValue(`applicants[${index}].resume.buffer`, binaryStr);
                                                setFieldValue(`applicants[${index}].resume.fileName`, file.name);
                                                setFieldValue(`applicants[${index}].resume.fileType`, file.type);
                                            }
                                            reader.readAsArrayBuffer(file);
                                        })
                                    }}
                                >
                                    {({ getRootProps, getInputProps, acceptedFiles }) => (
                                        <div>
                                            { acceptedFiles.length == 0 && 
                                                <div {...getRootProps({ style })}>
                                                    <input {...getInputProps()} />
                                                    <p style={{ margin: "auto", paddingTop: "30px", paddingBottom: "30px", textAlign: "center" }}>Click to upload or drag and drop the resume here (pdf only)</p>
                                                </div>
                                            }
                                            { acceptedFiles.length > 0 && 
                                                <div {...getRootProps({ style })}>
                                                    <input {...getInputProps()} />
                                                    <p style={{ margin: "auto", paddingTop: "30px", paddingBottom: "30px", textAlign: "center", backgroundColor: "#d9e7d8" }}>{acceptedFiles[0].name}</p>
                                                </div>
                                            }
                                        </div>
                                    )}
                                </Dropzone>
                                <ErrorMessage
                                    name={`applicants[${index}].resume`}
                                    className="field-error">
                                    { msg => <div style={{ color: 'red' }}>{msg}</div> }
                                </ErrorMessage>
                            </div>
                            <div className="form-group">
                                <label>
                                    <Field
                                        name={`applicants[${index}].consent`}
                                        type="checkbox"
                                        style={{marginRight: "5px"}}/>
                                    I confirm that I have received written consent from the client to disclose their information to the employer
                                </label>
                                <ErrorMessage
                                    name={`applicants[${index}].consent`}
                                    className="field-error">
                                    { msg => <div style={{ color: 'red' }}>{msg}</div> }
                                </ErrorMessage>
                            </div>
                            { applicants.length > 1 &&
                                <button 
                                    type="button" 
                                    className="btn btn-danger mb-5"
                                    style={{ marginBottom: "0.5rem" }}
                                    onClick={(e) => {
                                        let i = 0;
                                        values.applicants.forEach(a => {
                                            a.applicantID = i; // reset the applicant ids to 0,1,2,3...etc to allow filtering by index
                                            i++;
                                        });
                                        setFieldValue("applicants", values.applicants.filter(a => a.applicantID != index));
                                    }}>
                                    Remove
                                </button>
                            }
                        </div>
                    ))}
                </div>
            )}
            />
        </div>
    );
}

export default ApplicantForm;