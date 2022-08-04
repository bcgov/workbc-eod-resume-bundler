import React from "react"
import { Modal } from "react-bootstrap"
import FORM_URL from "../../../../constants/form"
import b64toBlob from "../../../../utils/FileFunctions"

const ViewJobOrderModal = ({ jobOrder, catchments, show, handleClose, token }) => {
    const getCatchmentNames = (catchmentIDs) => catchmentIDs.map((id) => catchments[id - 1].name).join(", ")

    const handleFileDescriptionDownload = (jobID) => async () => {
        await fetch(`${FORM_URL.JobOrders}/${jobID}/downloadJobDescription`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then(async (response) => {
                const json = await response.json()
                return json
            })
            .then((data) => {
                const blob = b64toBlob(data.buffer, data.fileType)

                // Create link to blob
                const url = URL.createObjectURL(blob)
                const link = document.createElement("a")
                link.href = url
                link.setAttribute("download", data.fileName)

                // Append to html link element page
                document.body.appendChild(link)

                // Start download
                link.click()

                // Clean up and remove the link
                link.parentNode.removeChild(link)
            })
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
                <h5 style={{ fontWeight: "bold" }}>
                    Employer: <a style={{ fontWeight: "normal" }}>{jobOrder.employer}</a>
                </h5>
                <h5 style={{ fontWeight: "bold" }}>
                    Position: <a style={{ fontWeight: "normal" }}>{jobOrder.position}</a>
                </h5>
                <h5 style={{ fontWeight: "bold" }}>
                    Start Date: <a style={{ fontWeight: "normal" }}>{jobOrder.start_date.substring(0, 10)}</a>
                </h5>
                <h5 style={{ fontWeight: "bold" }}>
                    Deadline: <a style={{ fontWeight: "normal" }}>{jobOrder.deadline.substring(0, 10)}</a>
                </h5>
                <h5 style={{ fontWeight: "bold" }}>
                    Location: <a style={{ fontWeight: "normal" }}>{jobOrder.location}</a>
                </h5>
                <h5 style={{ fontWeight: "bold" }}>
                    Vacancies: <a style={{ fontWeight: "normal" }}>{jobOrder.vacancies}</a>
                </h5>
                <h5 style={{ fontWeight: "bold" }}>
                    Minimum Requirements: <a style={{ fontWeight: "normal" }}>{jobOrder.minimum_requirements}</a>
                </h5>
                <h5 style={{ fontWeight: "bold" }}>
                    Other Information: <a style={{ fontWeight: "normal" }}>{jobOrder.other_information}</a>
                </h5>
                <h5 style={{ fontWeight: "bold" }}>
                    Status: <a style={{ fontWeight: "normal" }}>{jobOrder.status}</a>
                </h5>
                <h5 style={{ fontWeight: "bold" }}>
                    Created By: <a style={{ fontWeight: "normal" }}>{jobOrder.created_by}</a>
                </h5>
                <h5 style={{ fontWeight: "bold" }}>
                    Created Date: <a style={{ fontWeight: "normal" }}>{jobOrder.created_date.substring(0, 10)}</a>
                </h5>
                {jobOrder.catchments.length === catchments.length ? (
                    <h5 style={{ fontWeight: "bold" }}>
                        Catchments: <a style={{ fontWeight: "normal" }}>All</a>
                    </h5>
                ) : (
                    <h5 style={{ fontWeight: "bold" }}>
                        Catchments: <a style={{ fontWeight: "normal" }}>{getCatchmentNames(jobOrder.catchments)}</a>
                    </h5>
                )}
                <h5 style={{ fontWeight: "bold" }}>
                    Job Description:
                    <button type="button" className="btn btn-link" onClick={handleFileDescriptionDownload(jobOrder.job_id)}>
                        Download
                    </button>
                </h5>
            </Modal.Body>
            <Modal.Footer>
                <button className="btn btn-outline-primary" type="button" onClick={handleClose(jobOrder.job_id)}>
                    Close
                </button>
            </Modal.Footer>
        </Modal>
    )
}

export default ViewJobOrderModal
