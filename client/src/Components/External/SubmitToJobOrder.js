import React, { useMemo, useState, useCallback } from 'react'
import { Formik, Form, Field, FastField, FieldArray, ErrorMessage } from 'formik'
import { FORM_URL } from '../../constants/form'
import Dropzone from 'react-dropzone';
import CandidateForm from './CandidateForm';

function SubmitToJobOrder(props) {

  const [candidates, setCandidates] = useState([{ candidateID: 1, clientName: "", clientCaseNumber: ""}]);

  let initialValues = {
    catchment: "",
    centre: "",
    candidates: candidates
  }

  const catchments =
    [
        'CA01', 'CA02', 'CA03', 'CA04', 'CA05', 'CA06', 'CA07', 'CA08', 'CA09',
        'CA10', 'CA11', 'CA12', 'CA13', 'CA14', 'CA15', 'CA16', 'CA17', 'CA18', 'CA19',
        'CA20', 'CA21', 'CA22', 'CA23', 'CA24', 'CA25', 'CA26', 'CA27', 'CA28', 'CA29',
        'CA30', 'CA31', 'CA32', 'CA33', 'CA34', 'CA35', 'CA36', 'CA37', 'CA38', 'CA39',
        'CA40', 'CA41', 'CA42', 'CA43', 'CA44', 'CA45',
    ];

  return (
      <div className="container">
          <div className="row">
              <div className="col-md-12">
                <h1>EOD Resume Bundler - Submitting to Job Order {props.location.jobID}</h1>  
                <p>Submit a Resume. Click on Add Another to add more than one resume at a time.</p>  
                <Formik
                  initialValues={initialValues}
                  enableReinitialize={true}
                  onSubmit={(values, { resetForm, setErrors, setStatus, setSubmitting }) => {
                      console.log(values);
                      fetch(FORM_URL.Submissions, {
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
                          <a style={{ color: 'grey', fontWeight: 'lighter' }}>Job Fields</a>
                          <Form>
                              <div>
                                <div className="form-row">
                                    <div className="form-group col-md-6">
                                        <label className="control-label" htmlFor="employer">Catchment</label>
                                        <Field
                                            as="select"
                                            name="catchment"
                                            className="form-control">
                                            { catchments.map(c => (
                                              <option value={c}>{c}</option>
                                            ))}
                                        </Field>
                                        <ErrorMessage
                                            name="catchment"
                                            component="div"
                                            className="field-error"
                                        />
                                    </div>
                                    <div className="form-group col-md-6">
                                        <label className="control-label" htmlFor="position">WorkBC Centre</label>
                                        <Field
                                            as="select"
                                            name="centre"
                                            className="form-control">
                                            <option value="Centre A">Centre A</option>
                                            <option value="Centre B">Centre B</option>
                                            <option value="Centre C">Centre C</option>
                                        </Field>
                                        <ErrorMessage
                                            name="centre"
                                            component="div"
                                            className="field-error"
                                        />
                                    </div>
                                </div>
                                <div>
                                  { values.candidates.map(c => (
                                    <CandidateForm candidate={c} />
                                  ))}
                                </div>
                                <div>
                                  { candidates.length > 1 ? 
                                  <button 
                                    type="button" 
                                    class="btn btn-danger"
                                    style={{ marginBottom: "0.5rem" }}
                                    onClick={() => {    
                                      setCandidates(candidates.slice(0, -1));
                                    }}>
                                    Remove
                                  </button>
                                  : null }
                                </div>
                                <div>
                                  <button 
                                    type="button" 
                                    class="btn btn-primary"
                                    style={{ marginBottom: "0.5rem" }}
                                    onClick={() => {    
                                      setCandidates(candidates.concat({candidateID: candidates.length + 1, clientName: "", clientCaseNumber: "" }));
                                    }}>
                                    Add Another
                                  </button>
                                </div>
                            </div>
                              <button
                                  className="btn btn-success btn-block"
                                  type="submit"
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
    );
};

export default SubmitToJobOrder;