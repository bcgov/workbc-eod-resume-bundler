import React from 'react';
import { Modal } from 'react-bootstrap';

const ConfirmSubmissionModal = ({applicants, catchment, centre, show, handleClose, values, setErrors, setSubmitting}) => {
    return (
        <Modal show={show} size="xl">
            <Modal.Header>
                <div className="d-flex flex-row flex-fill">
                    <div className="mr-auto">
                        <Modal.Title>Confirm Submission</Modal.Title>
                    </div>
                </div>
            </Modal.Header>
            <Modal.Body>
                <p>The following information is being submitted: Please confirm.</p>
                <br/>
                <h5 style={{ textDecoration: 'underline', fontWeight: 'lighter' }}>Job Fields</h5>
                <h5 style={{ fontWeight: 'bold' }}>Catchment: <a style={{ fontWeight: 'normal'}}>{catchment?.name}</a></h5>
                <h5 style={{ fontWeight: 'bold' }}>WorkBC Centre: <a style={{ fontWeight: 'normal'}}>{centre?.name}</a></h5>
                { applicants.map((a, index) =>
                    <React.Fragment>
                        <br/>
                        <h5 style={{ textDecoration: 'underline', fontWeight: 'lighter' }}>Candidate {index + 1}</h5>
                        <h5 style={{ fontWeight: 'bold' }}>Client Name: <a style={{ fontWeight: 'normal'}}>{a.clientName}</a></h5>
                        <h5 style={{ fontWeight: 'bold' }}>Client Case Number: <a style={{ fontWeight: 'normal'}}>{a.clientCaseNumber}</a></h5>
                        <h5 style={{ fontWeight: 'bold' }}>Resume Name: <a style={{ fontWeight: 'normal'}}>{a.resume?.fileName}</a></h5> 
                    </React.Fragment>
                )}
            </Modal.Body>
            <Modal.Footer>
                <button className="btn btn-primary" type="button" onClick={() => handleClose(true, values, setErrors, setSubmitting)}> 
                    Confirm
                </button>
                <button className="btn btn-outline-primary" type="button" onClick={() => handleClose(false, values, setErrors, setSubmitting)}> 
                    Cancel
                </button>
            </Modal.Footer>
        </Modal>
    )
}

export default ConfirmSubmissionModal;