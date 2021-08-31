import React, { useMemo } from 'react'
import { Formik, Form, Field, FastField, FieldArray, ErrorMessage } from 'formik';
import Dropzone from 'react-dropzone';
import { makeStyles } from '@material-ui/core/styles';

function SubmitToJobOrder({ candidate }) {
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
            <a style={{ color: 'grey', fontWeight: 'lighter' }}>Candidate {candidate.candidateID}</a>
            <div className="form-row">
                <div className="form-group col-md-6">
                    <label className="control-label" htmlFor="employer">Client Name</label>
                    <Field
                        name={`client${candidate.candidateID}Name`}
                        type="text"
                        className="form-control"
                    />
                    <ErrorMessage
                        name={`client${candidate.candidateID}Name`}
                        component="div"
                        className="field-error"
                    />
                </div>
                <div className="form-group col-md-6">
                    <label className="control-label" htmlFor="position">Client Case Number</label>
                    <Field
                        name={`client${candidate.candidateID}CaseNumber`}
                        type="text"
                        className="form-control"
                    />
                    <ErrorMessage
                        name={`client${candidate.candidateID}CaseNumber`}
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
                <label>
                    <Field
                        name="confirmation"
                        type="checkbox"
                        style={{marginRight: "5px"}}/>
                    I confirm that I have received written consent from the client to disclose their information to the employer
                </label>
            </div>
        </div>
    );
}

export default SubmitToJobOrder;