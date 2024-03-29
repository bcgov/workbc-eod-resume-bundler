import React, { useState, useEffect } from 'react'
import { Formik, Form, Field, FastField, FieldArray, ErrorMessage } from 'formik'
import { FORM_URL } from '../../../../constants/form'
import ApplicantForm from './ApplicantForm';
import ConfirmSubmissionModal from './ConfirmSubmissionModal';
import { useKeycloak } from '@react-keycloak/web';
import { useHistory } from 'react-router-dom';
import * as yup from 'yup';

function SubmitToJobOrder(props) {
  const { keycloak, initialized } = useKeycloak();
  const h = useHistory();

  const [catchment, setCatchment] = useState(-1);
  const [centre, setCentre] = useState(-1);

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  let [applicants, setApplicants] = useState([
      { 
        applicantID: 0,
        clientName: "", 
        preferredName: "",
        clientCaseNumber: "", 
        consent: false,
        resume: null
      }
  ]);

  let initialValues = {
    catchment: catchment,
    centre: centre,
    applicants: applicants,
    jobID: props.location.jobID,
    user: `${keycloak.tokenParsed?.idir_username || keycloak.tokenParsed?.bceid_username}@${keycloak.tokenParsed?.identity_provider}`,
    email: keycloak.tokenParsed?.email
  }

  const SubmissionValidationSchema = yup.object().shape({
    catchment: yup.number().min(0, "required"),
    centre: yup.number().min(0, "required"),
    applicants: yup.array().of(
        yup.object({
            applicantID: yup.number(),
            clientName: yup.string().required("required"),
            clientCaseNumber: yup.string().required("required"),
            consent: yup.boolean().oneOf([true], "required"),
            resume: yup.object().required().typeError("required")
        })
    )
  });

  const [catchments, setCatchments] = useState(null);
  const [centres, setCentres] = useState(null);
  
  useEffect(async () => {
    if (initialized) {
      await getCatchments();
      await getCentres();
    }

    async function getCatchments() {
      const response = await fetch(FORM_URL.System + "/Catchments", {
        headers: {
          "Authorization": "Bearer " + keycloak.token
        }
      });
      const catchments = await response.json();
      setCatchments(catchments.filter(c => props.location.userCatchments.indexOf(c.catchment_id) > -1)); // only show users catchments
    }

    async function getCentres() {
      const response = await fetch(FORM_URL.System + "/Centres", {
        headers: {
          "Authorization": "Bearer " + keycloak.token
        }
      });
      const data = await response.json();
      setCentres(data);
    }
  }, [initialized]);

  const displayCentresForCatchment = (catchmentID) => {
    return centres
            .filter(c => c.catchment_id == catchmentID)
            .map(c => {
              return <option value={c.centre_id}>{c.name}</option>
            });
  }

  const handleSubmit = (values, setErrors, setSubmitting) => {
    setSubmitting(true);
    let formData = new FormData(); // use form data to be able to send resume buffers to API
    formData.append("catchment", values.catchment);
    formData.append("centre", values.centre);
    formData.append("applicants", JSON.stringify(values.applicants));
    formData.append("jobID", values.jobID);
    formData.append("user", values.user);
    formData.append("email", values.email);
    values.applicants.forEach((applicant, index) => {
      let blob = new Blob([applicant.resume.buffer], { type: "application/pdf" });
      formData.append(index, blob);
    });

    fetch(FORM_URL.Submissions, {
        method: "POST",
        credentials: 'include',
        headers: {
          "Authorization": "Bearer " + keycloak.token
        },
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
              jobID: props.location.jobID,
              userCatchments: props.location.userCatchments
          });
        },
        (err) => {
            setErrors(err);
            setSubmitting(false);
        }
    );
  }

  const handleConfirmModalClose = (confirmed, values, setErrors, setSubmitting) => {
    if (confirmed === true){
      setShowConfirmModal(false);
      setConfirmed(true);
      handleSubmit(values, setErrors, setSubmitting)
    } 
    else {
      setShowConfirmModal(false);
      setSubmitting(false);
    }
  }

  return (
      <div className="container mt-5 mb-5">
        {props.location.jobID && catchments != null && centres != null &&
          <div className="row">
              <div className="col-md-12">
                <h1>Resume Bundler - Submitting to {props.location.employer} Job Order {props.location.jobID} - {props.location.jobTitle}</h1>  
                <p>Please fill in the fields below to submit a client’s resume for consideration.
                   Click on ‘Add Another’ to submit more than one resume at a time. Click on ‘Remove’
                    to remove a candidate.
                </p>  
                <Formik
                  initialValues={initialValues}
                  enableReinitialize={false}
                  validationSchema={SubmissionValidationSchema}
                  onSubmit={(values, { setErrors, setSubmitting }) =>
                   {
                      /* On submission show a confirmation modal, if user confirms then the modal  
                        will set confirmed to true and re-trigger onSubmit */
                      if (!confirmed) {
                        setShowConfirmModal(true);
                        return;
                      }

                      handleSubmit(values, setErrors, setSubmitting);
                    }
                  }
                >
                  {({ values, isSubmitting, hasError, setFieldValue, setErrors, setSubmitting, handleChange }) => (
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
                                            placeholder="Select One"
                                            onChange={e => {
                                              handleChange(e);
                                              setFieldValue("centre", -1); // reset centre on new catchment select
                                            }}
                                            className="form-control">
                                            <option defaultValue>Select One</option>
                                            { catchments.map(c => (
                                              <option value={c.catchment_id}>{c.name}</option>
                                            ))}
                                        </Field>
                                        <ErrorMessage
                                            name="catchment"
                                            component="div"
                                            className="field-error">
                                            { msg => <div style={{ color: 'red', weight: 'bold' }}>{msg.toUpperCase()}</div> }
                                        </ErrorMessage>
                                    </div>
                                    <div className="form-group col-md-6">
                                        <label className="control-label" htmlFor="centre">WorkBC Centre</label>
                                        <Field
                                            as="select"
                                            name="centre"
                                            placeholder="Select One"
                                            onChange={e => {
                                              handleChange(e);
                                            }}
                                            className="form-control">
                                            <option defaultValue>Select One</option>
                                            {displayCentresForCatchment(values.catchment)}
                                        </Field>
                                        <ErrorMessage
                                            name="centre"
                                            component="div"
                                            className="field-error">
                                            { msg => <div style={{ color: 'red', weight: 'bold' }}>{msg.toUpperCase()}</div> }
                                        </ErrorMessage>
                                    </div>
                                </div>
                                <div>
                                    <ApplicantForm 
                                      applicants={values.applicants} 
                                      applicantsState={applicants}
                                      setApplicants={setApplicants}
                                      values={values}
                                      setFieldValue={setFieldValue} 
                                    />
                                </div>
                                <div>
                                  <button 
                                    type="button" 
                                    className="btn btn-primary"
                                    style={{ marginBottom: "0.5rem" }}
                                    onClick={() => {  
                                      setFieldValue("applicants", values.applicants.concat(
                                        {
                                          applicantID: applicants.length,
                                          clientName: "", 
                                          preferredName: "",
                                          clientCaseNumber: "",
                                          resume: null,
                                          consent: false
                                       }));
                                    }}>
                                    Add Another
                                  </button>
                                </div>
                                <ConfirmSubmissionModal 
                                  applicants={values.applicants}
                                  catchment={catchments.find(c => c.catchment_id == values.catchment)}
                                  centre={centres.find(c => c.centre_id == values.centre)}
                                  show={showConfirmModal} 
                                  handleClose={handleConfirmModalClose}
                                  values={values}
                                  setErrors={setErrors}
                                  setSubmitting={setSubmitting} 
                                />
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