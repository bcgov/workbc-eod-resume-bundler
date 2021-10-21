import { Modal } from 'react-bootstrap';

const ViewClientModal = ({submission, applicant, show, handleClose}) => {
    return (
        <Modal show={show[applicant.clientApplicationID]} onHide={handleClose(submission.jobID)} size="xl">
            <Modal.Header>
                <div className="d-flex flex-row flex-fill">
                    <div className="mr-auto">
                        <Modal.Title>Viewing Referral {submission.submissionID} - Client Case# {applicant.clientCaseNumber}</Modal.Title>
                    </div>
                </div>
            </Modal.Header>
            <Modal.Body>
                <p>The following information was submitted.</p>
                <br/>
                <h5 style={{ textDecoration: 'underline', fontWeight: 'lighter' }}>Job Fields</h5>
                <h5 style={{ fontWeight: 'bold' }}>Catchment: <a style={{ fontWeight: 'normal'}}>{applicant.catchmentName}</a></h5>
                <h5 style={{ fontWeight: 'bold' }}>WorkBC Centre: <a style={{ fontWeight: 'normal'}}>{applicant.centreName}</a></h5>
                <br/>
                <h5 style={{ textDecoration: 'underline', fontWeight: 'lighter' }}>Candidate Information</h5>
                <h5 style={{ fontWeight: 'bold' }}>Client Name: <a style={{ fontWeight: 'normal'}}>{applicant.clientName}</a></h5>
                <h5 style={{ fontWeight: 'bold' }}>Preferred Name: <a style={{ fontWeight: 'normal'}}>{applicant.preferredName}</a></h5>
                <h5 style={{ fontWeight: 'bold' }}>Client Case Number: <a style={{ fontWeight: 'normal'}}>{applicant.clientCaseNumber}</a></h5>
                <h5 style={{ fontWeight: 'bold' }}>Resume File Name: <a style={{ fontWeight: 'normal'}}>{applicant.resume.fileName}</a></h5>
                <h5 style={{ fontWeight: 'bold' }}>Status: <a style={{ fontWeight: 'normal'}}>{applicant.status}</a></h5>
            </Modal.Body>
            <Modal.Footer>
                <button className="btn btn-outline-primary" type="button" onClick={handleClose(applicant.clientApplicationID)}> 
                    Close
                </button>
            </Modal.Footer>
        </Modal>
    )
}

export default ViewClientModal;