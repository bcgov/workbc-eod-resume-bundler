import React, { useState, useEffect } from 'react'
import { Formik, Form, Field, FastField, FieldArray, ErrorMessage } from 'formik'
import { FORM_URL } from '../../constants/form'
import ApplicantForm from './ApplicantForm';
import { useKeycloak } from '@react-keycloak/web';
import { useHistory } from 'react-router-dom';
import * as yup from 'yup';

function SubmitToJobOrder(props) {
  const { keycloak } = useKeycloak();
  const h = useHistory();

  let [applicants, setApplicants] = useState([
      { 
        applicantID: 0,
        clientName: "", 
        clientCaseNumber: "", 
        consent: false,
        resume: null
      }
  ]);

  let initialValues = {
    catchment: 1,
    centre: 1,
    applicants: applicants,
    jobID: props.location.jobID,
    user: keycloak.tokenParsed?.preferred_username
  }

  const SubmissionValidationSchema = yup.object().shape({
    catchment: yup.number().required("required"),
    centre: yup.number().required("required"),
    applicants: yup.array().of(
        yup.object({
            applicantID: yup.number(),
            clientName: yup.string().required("required"),
            clientCaseNumber: yup.string().required("required"),
            consent: yup.boolean().oneOf([true], "confirmation required"),
            resume: yup.object().required().typeError("please upload a resume")
        })
    )
  });

  const [catchments, setCatchments] = useState([]);
  const [centres, setCentres] = useState([]);
  
  useEffect(async () => {
    await getCatchments();
    await getCentres();

    async function getCatchments() {
      const response = await fetch(FORM_URL.System + "/Catchments");
      const data = await response.json();
      setCatchments(data);
    }

    async function getCentres() {
      const response = await fetch(FORM_URL.System + "/Centres");
      const data = await response.json();
      setCentres(data);
    }
  }, [setCatchments, setCentres]);

  const displayCentresForCatchment = (catchmentID) => {
    return centres
            .filter(c => c.catchment_id == catchmentID)
            .map(c => {
              return <option value={c.centre_id}>{c.name}</option>
            });
  }

  return (
      <div className="container">
        {props.location.jobID && catchments && centres &&
          <div className="row">
              <div className="col-md-12">
                <h1>Resume Bundler - Submitting to Job Order {props.location.jobID}</h1>  
                <p>Submit a Resume. Click on Add Another to add more than one resume at a time.</p>  
                <Formik
                  initialValues={initialValues}
                  enableReinitialize={true}
                  validationSchema={SubmissionValidationSchema}
                  onSubmit={(values, { resetForm, setErrors, setStatus, setSubmitting }) => {
                    let formData = new FormData();
                    formData.append("catchment", values.catchment);
                    formData.append("centre", values.centre);
                    formData.append("applicants", JSON.stringify(values.applicants));
                    formData.append("jobID", values.jobID);
                    formData.append("user", values.user);
                    values.applicants.forEach(applicant => {
                      let blob = new Blob([applicant.resume.buffer], { type: "application/pdf"});
                      formData.append(applicant.applicantID, blob);
                    });

                    fetch(FORM_URL.Submissions, {
                        method: "POST",
                        credentials: 'include',
                        body: formData
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
                              pathname: '/submitToJobOrderSuccess',
                              createdID: res.createdID,
                              jobID: props.location.jobID
                          });
                        },
                        (err) => {
                            setErrors(err);
                            setSubmitting(false);
                        }
                    );
                  }}
              >
                  {({ values, isSubmitting, setFieldValue, handleBlur, handleChange, errors, hasError }) => (
                      <div>
                          <a style={{ color: 'grey', fontWeight: 'lighter' }}>Job Fields</a>
                          <Form>
                              <div>
                                <div className="form-row">
                                    <div className="form-group col-md-6">
                                        <label className="control-label" htmlFor="catchment">Catchment</label>
                                        <Field
                                            as="select"
                                            name="catchment"
                                            className="form-control">
                                            { catchments.map(c => (
                                              <option value={c.catchment_id}>{c.name}</option>
                                            ))}
                                        </Field>
                                        <ErrorMessage
                                            name="catchment"
                                            component="div"
                                            className="field-error"
                                        />
                                    </div>
                                    <div className="form-group col-md-6">
                                        <label className="control-label" htmlFor="centre">WorkBC Centre</label>
                                        <Field
                                            as="select"
                                            name="centre"
                                            className="form-control">
                                            {displayCentresForCatchment(values.catchment)}
                                        </Field>
                                        <ErrorMessage
                                            name="centre"
                                            component="div"
                                            className="field-error"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <ApplicantForm applicants={values.applicants} setFieldValue={setFieldValue} />
                                </div>
                                <div>
                                  { applicants.length > 1 ? 
                                  <button 
                                    type="button" 
                                    className="btn btn-danger"
                                    style={{ marginBottom: "0.5rem" }}
                                    onClick={() => {    
                                      setApplicants(values.applicants.slice(0, -1));
                                    }}>
                                    Remove
                                  </button>
                                  : null }
                                </div>
                                <div>
                                  <button 
                                    type="button" 
                                    className="btn btn-primary"
                                    style={{ marginBottom: "0.5rem" }}
                                    onClick={() => {   
                                      setApplicants(values.applicants.concat(
                                        {
                                          applicantID: applicants.length,
                                          clientName: "", 
                                          clientCaseNumber: "",
                                          resume: null,
                                          consent: false
                                       }));
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
        }
        {!props.location.jobID && 
          <h2>
            Error loading page. Please go back and re-select the job order you wish to submit to.
          </h2>
        }
      </div>
    );
};

export default SubmitToJobOrder;