import { Modal } from 'react-bootstrap';
import { FORM_URL } from '../../../../constants/form';
import { b64toBlob } from '../../../../utils/FileFunctions';

const ViewJobModal = ({job, show, handleClose, token}) => {
    const handleFileDescriptionDownload = (jobID) => async () => {
        await fetch(`${FORM_URL.JobOrders}/${jobID}/downloadJobDescription`, {
          headers: {
            "Authorization": "Bearer " + token
          }
        })
        .then(async (response) => await response.json())
        .then((data) => {
          const blob = b64toBlob(data.buffer, data.fileType);
  
          // Create link to blob
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute(
            "download",
            data.fileName,
          );
      
          // Append to html link element page
          document.body.appendChild(link);
      
          // Start download
          link.click();
      
          // Clean up and remove the link
          link.parentNode.removeChild(link);
        });
    }

    return (
        <Modal show={show[job.id]} onHide={handleClose(job.id)} size="xl">
            <Modal.Header>
                <div className="d-flex flex-row flex-fill">
                    <div className="mr-auto">
                        <Modal.Title>Viewing Job Order {job.id}</Modal.Title>
                    </div>
                </div>
            </Modal.Header>
            <Modal.Body>
                <h5 style={{ fontWeight: 'bold' }}>Employer: <a style={{ fontWeight: 'normal'}}>{job.employer}</a></h5>
                <h5 style={{ fontWeight: 'bold' }}>Position: <a style={{ fontWeight: 'normal'}}>{job.position}</a></h5>
                <h5 style={{ fontWeight: 'bold' }}>Status: <a style={{ fontWeight: 'normal'}}>{job.status}</a></h5>
                <h5 style={{ fontWeight: 'bold' }}>Start Date: <a style={{ fontWeight: 'normal'}}>{job.startDate}</a></h5>
                <h5 style={{ fontWeight: 'bold' }}>Deadline: <a style={{ fontWeight: 'normal'}}>{job.deadline}</a></h5>
                <h5 style={{ fontWeight: 'bold' }}>Location: <a style={{ fontWeight: 'normal'}}>{job.location}</a></h5>
                <h5 style={{ fontWeight: 'bold' }}>Vacancies: <a style={{ fontWeight: 'normal'}}>{job.vacancies}</a></h5>
                <h5 style={{ fontWeight: 'bold' }}>Minimum Requirements: <a style={{ fontWeight: 'normal'}}>{job.minimumRequirements}</a></h5>
                <h5 style={{ fontWeight: 'bold' }}>Other Information: <a style={{ fontWeight: 'normal'}}>{job.otherInformation}</a></h5>
                <h5 style={{ fontWeight: 'bold' }}>Created By: <a style={{ fontWeight: 'normal'}}>{job.createdBy}</a></h5>
                <h5 style={{ fontWeight: 'bold' }}>Created Date: <a style={{ fontWeight: 'normal'}}>{job.created}</a></h5>
                <h5 style={{ fontWeight: 'bold' }}>Edited By: <a style={{ fontWeight: 'normal'}}>{job.editedBy ? job.editedBy : "N/A"}</a></h5>
                <h5 style={{ fontWeight: 'bold' }}>Edited Date: <a style={{ fontWeight: 'normal'}}>{job.lastEdit ? job.lastEdit : "N/A"}</a></h5>
                <h5 style={{ fontWeight: 'bold' }}>Job Description: 
                    <button 
                        type="button" 
                        class="btn btn-link" 
                        onClick={handleFileDescriptionDownload(job.id)}>
                        Download 
                    </button>
                </h5>
            </Modal.Body>
            <Modal.Footer>
                <button className="btn btn-outline-primary" type="button" onClick={handleClose(job.id)}> 
                    Close
                </button>
            </Modal.Footer>
        </Modal>
    )
}

export default ViewJobModal;