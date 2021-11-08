import { Modal } from 'react-bootstrap';
import { useKeycloak } from '@react-keycloak/web';
import { Formik, Form, Field, FastField, FieldArray, ErrorMessage } from 'formik';
import { FORM_URL } from '../../../constants/form';
import * as yup from 'yup';

const EditClientModal = ({submission, applicant, catchments, centres, show, handleClose, forceUpdate, setForceUpdate}) => {
    const { keycloak } = useKeycloak();
    let initialValues = {
        catchment: applicant.catchmentID,
        centre: applicant.centreID,
        clientName: applicant.clientName,
        preferredName: applicant.preferredName,
        clientCaseNumber: applicant.clientCaseNumber,
        user: keycloak.tokenParsed?.preferred_username
      }

    const ApplicationValidationSchema = yup.object().shape({
        catchment: yup.number().required("required"),
        centre: yup.number().min(0, "required"),
        clientName: yup.string().required("required"),
        preferredName: yup.string(),
        clientCaseNumber: yup.string().required("required")
    });

    const displayCentresForCatchment = (catchmentID) => {
        return centres
            .filter(c => c.catchment_id == catchmentID)
            .map(c => {
                return <option value={c.centre_id}>{c.name}</option>
            });
    }

    const handleCatchmentChange = (event, setFieldValue) => {
        const catchmentID = event.currentTarget.value;
        const centreID = centres.filter(c => c.catchment_id == catchmentID)[0].centre_id; // Default to first centre in list
        setFieldValue("centre", centreID);
    }

    return (
        <Modal show={show[applicant.clientApplicationID]} onHide={handleClose(applicant.clientApplicationID)} size="xl">
            <Modal.Header>
                <div className="d-flex flex-row flex-fill">
                    <div className="mr-auto">
                        <Modal.Title>Editing Referral {submission.submissionID} - Client Case# {applicant.clientCaseNumber}</Modal.Title>
                    </div>
                </div>
            </Modal.Header>
            <Modal.Body>
                <Formik
                    initialValues={initialValues}
                    enableReinitialize={true}
                    validationSchema={ApplicationValidationSchema}
                    onSubmit={(values, { resetForm, setErrors, setStatus, setSubmitting }) => {
                        fetch(FORM_URL.Submissions + "/" + submission.submissionID + "/applications/" + applicant.clientApplicationID, {
                            method: "PUT",
                            headers: {
                                'Accept': 'application/json',
                                'Content-Type': 'application/json',
                                "Authorization": "Bearer " + keycloak.token
                            },
                            body: JSON.stringify(values)
                        })
                        .then(
                            (res) => {
                                if (res.ok){
                                    handleClose(applicant.clientApplicationID)();
                                    setForceUpdate(forceUpdate + 1); // force new values to show up
                                    setSubmitting(false);
                                }
                                else{
                                    throw new Error("server responded with error!")
                                }
                        });
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
                                                className="form-control"
                                                onChange={e => {
                                                    handleChange(e);
                                                    handleCatchmentChange(e, setFieldValue);
                                                    setFieldValue("centre", -1); // reset centre on new catchment select
                                                }}>
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
                                    <div className="form-row">
                                        <div className="form-group col-md-6">
                                            <label className="control-label">Client Name</label>
                                            <Field
                                                name="clientName"
                                                type="text"
                                                className="form-control"
                                            />
                                            <ErrorMessage
                                                name="clientName"
                                                className="field-error">
                                                { msg => <div style={{ color: 'red', weight: 'bold' }}>{msg.toUpperCase()}</div> }
                                            </ErrorMessage>
                                        </div>
                                        <div className="form-group col-md-6">
                                            <label className="control-label">Preferred Name</label>
                                            <Field
                                                name="preferredName"
                                                type="text"
                                                className="form-control"
                                            />
                                            <ErrorMessage
                                                name="preferredName"
                                                className="field-error">
                                                { msg => <div style={{ color: 'red', weight: 'bold' }}>{msg.toUpperCase()}</div> }
                                            </ErrorMessage>
                                        </div>
                                    </div>

                                    <div className="form-row">
                                        <div className="form-group col-md-6">
                                            <label className="control-label">Client Case Number</label>
                                            <Field
                                                name="clientCaseNumber"
                                                type="text"
                                                className="form-control"
                                            />
                                            <ErrorMessage
                                                name="clientCaseNumber"
                                                className="field-error">
                                                { msg => <div style={{ color: 'red', weight: 'bold' }}>{msg.toUpperCase()}</div> }
                                            </ErrorMessage>
                                        </div>
                                    </div>
                                    <div className="form-row">
                                        <h5 style={{ fontWeight: 'bold' }}>Resume File Name: <a style={{ fontWeight: 'normal'}}>{applicant.resume.fileName}</a></h5>
                                    </div>
                                    <div className="form-row">
                                        <h5 style={{ fontWeight: 'bold' }}>Status: <a style={{ fontWeight: 'normal'}}>{applicant.status}</a></h5>
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
            </Modal.Body>
            <Modal.Footer>
                <button className="btn btn-outline-primary" type="button" onClick={handleClose(applicant.clientApplicationID)}> 
                    Close
                </button>
            </Modal.Footer>
        </Modal>
    )
}

export default EditClientModal;