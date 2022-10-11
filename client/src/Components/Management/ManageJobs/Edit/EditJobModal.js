import React, { useState } from 'react';
import EditJobFields from './EditJobFields';
import { Formik, Form, Field, ErrorMessage, FastField } from 'formik';
import { useKeycloak } from '@react-keycloak/web';
import CatchmentSelector from '../../../../utils/CatchmentSelector';
import { Modal } from 'react-bootstrap';
import { FORM_URL } from '../../../../constants/form';

const EditJobModal = ({ job, catchments, show, handleShow, handleClose, setStatusDeleted }) => {
    const { keycloak } = useKeycloak();
    const [showMarkForDelete, setShowMarkForDelete] = useState(false);

    const handleMarkForDeleteClose = jobID => () => {
      setShowMarkForDelete(false);
      handleClose(jobID, false)();
    } 
    const handleMarkForDeleteShow = () => {
      setShowMarkForDelete(true);
    }

    const handleMarkForDelete = jobID => () => {
      setStatusDeleted(jobID)();
      setShowMarkForDelete(false);
      handleClose(jobID, false)();
    }

    let initialValues = {
      id: job.id,
      employer: job.employer,
      position: job.position,
      location: job.location,
      startDate: job.startDate,
      deadline: job.deadline,
      catchments: job.catchments.map(c => c.value),
      user: keycloak.tokenParsed?.preferred_username
    }

    const MarkForDeleteModal = (props) => {
      return (
        <Modal show={showMarkForDelete} onHide={handleMarkForDeleteClose(props.jobID)}>
          <Modal.Header>
            <div className="d-flex flex-row flex-fill">
              <div className="mr-auto">
                <Modal.Title>Confirm Mark Delete</Modal.Title>
              </div>
            </div>
          </Modal.Header>
          <Modal.Body>
            <h5 style={{ color: 'grey', fontWeight: 'lighter' }}>
              Type the ID of the application to confirm mark for deletion:
            </h5>
            <Formik
              initialValues={props}
              enableReinitialize={true}>
              <Form>
                <div>
                  <div className="form-group col-md-6">
                    <label className="control-label" htmlFor="app-id">Confirm ID</label>
                    <Field
                        name="app-id"
                        type="text"
                        className="form-control"
                    />
                    <ErrorMessage
                        name="app-id"
                        component="div"
                        className="field-error"
                    />
                  </div>
                </div>
              </Form>
            </Formik>
          </Modal.Body>
          <Modal.Footer>
            <button className="btn btn-danger" type="button" onClick={handleMarkForDelete(props.jobID)}> 
              Mark for Delete
            </button>
            <button className="btn btn-outline-primary" type="button" onClick={handleMarkForDeleteClose(props.jobID)}> 
              Cancel
            </button>
          </Modal.Footer>
        </Modal>
      );
    }

    return (
      <Modal show={show[job.id]} onHide={handleClose(job.id, false)} size="xl">
        <Modal.Header>
          <div className="d-flex flex-row flex-fill">
            <div className="mr-auto">
              <Modal.Title>Editing Job {job.id}</Modal.Title>
            </div>
            <div className="ml-auto">
              <button className="btn btn-danger" type="button" onClick={handleMarkForDeleteShow}> 
                Mark for Delete
              </button>
            </div>
          </div>
        </Modal.Header>
        <Modal.Body>
          <h5 style={{ color: 'grey', fontWeight: 'lighter' }}>Job Fields</h5>
          <Formik
            initialValues={initialValues}
            enableReinitialize={true}
            onSubmit={(values, { resetForm, setErrors, setStatus, setSubmitting }) => {
              setSubmitting(true);
              fetch(FORM_URL.JobOrders + "/" + values.id, {
                  method: "PUT",
                  credentials: 'include',
                  headers: {
                      'Accept': 'application/json',
                      'Content-Type': 'application/json',
                      "Authorization": "Bearer " + keycloak.token
                  },
                  body: JSON.stringify(values)
              })
              .then(
                  (res) => {   
                    setSubmitting(false);
                    if (res.ok){
                        handleClose(job.id, true)();
                    }
                    else{
                        throw new Error("server responded with error!")
                    }
              });
          }}
          >
          {({ values, isSubmitting, setFieldValue, handleBlur, handleChange, errors, hasError }) => (
            <Form>
              <EditJobFields />
              <br></br>
              <h5>Catchments Job will be available to</h5>
              {catchments.length > 0 && 
                <FastField 
                  name="catchments"
                  component={CatchmentSelector} 
                  catchments={catchments} 
                  initialSelected={job.catchments}
                />
              }
              <div className="d-flex flex-row justify-content-end">
                <div>
                  <button className="btn btn-primary" type="submit"> 
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
                </div>
                <div className="ml-2">
                  <button className="btn btn-outline-primary" type="button" onClick={handleClose(job.id, false)}> 
                    Cancel
                  </button>
                </div>
              </div>
            </Form>
          )}
          </Formik>
        </Modal.Body>
        <Modal.Footer>

        </Modal.Footer>
        <MarkForDeleteModal jobID={job.id}></MarkForDeleteModal>
      </Modal>
    );
  }

  export default EditJobModal;