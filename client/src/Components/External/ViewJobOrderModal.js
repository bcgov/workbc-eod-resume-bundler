import { Modal } from 'react-bootstrap';

const ViewJobOrderModal = ({jobOrder, catchments, show, handleClose}) => {

    const getCatchmentNames = (catchmentIDs) => {
        return catchmentIDs.map(id => catchments[id].name).join(", ");
    }
    return (
        <Modal show={show[jobOrder.job_id]} onHide={handleClose(jobOrder.job_id)} size="xl">
            <Modal.Header>
                <div className="d-flex flex-row flex-fill">
                    <div className="mr-auto">
                        <Modal.Title>Viewing Job Order {jobOrder.job_id}</Modal.Title>
                    </div>
                </div>
            </Modal.Header>
            <Modal.Body>
                <h5 style={{ fontWeight: 'bold' }}>Catchments: <a style={{ fontWeight: 'normal'}}>{getCatchmentNames(jobOrder.catchments)}</a></h5>
                <h5 style={{ fontWeight: 'bold' }}>Other Information: <a style={{ fontWeight: 'normal'}}>{jobOrder.other_information}</a></h5>
                <h5 style={{ fontWeight: 'bold' }}>Status: <a style={{ fontWeight: 'normal'}}>{jobOrder.status}</a></h5>
                <h5 style={{ fontWeight: 'bold' }}>Created By: <a style={{ fontWeight: 'normal'}}>{jobOrder.created_by}</a></h5>
                <h5 style={{ fontWeight: 'bold' }}>Created Date: <a style={{ fontWeight: 'normal'}}>{jobOrder.created_date.substring(0, 10)}</a></h5>
            </Modal.Body>
            <Modal.Footer>
                <button className="btn btn-outline-primary" type="button" onClick={handleClose(jobOrder.job_id)}> 
                    Close
                </button>
            </Modal.Footer>
        </Modal>
    )
}

export default ViewJobOrderModal;