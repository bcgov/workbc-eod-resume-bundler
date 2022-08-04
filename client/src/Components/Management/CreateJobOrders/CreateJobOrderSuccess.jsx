import React from "react"
import { useHistory } from "react-router-dom"

function CreateJobOrderSuccess(props) {
    const history = useHistory()
    const { location } = props

    return (
        <div className="container ml-3 mt-5">
            <div className="row">
                <h1>Success! Job Order Created.</h1>
            </div>
            <div className="row">
                <h1>ID: {location.createdID}</h1>
            </div>
            <div className="row">
                <h5 style={{ color: "grey", fontWeight: "lighter" }}>
                    Job order has been successfully created. Please make note of this job order ID for future reference.
                </h5>
            </div>
            <div className="row">
                <button
                    className="btn btn-outline-primary mr-5"
                    type="button"
                    onClick={() => {
                        history.push("/createJobOrder")
                    }}
                >
                    Create Another
                </button>
                <button
                    className="btn btn-outline-primary"
                    type="button"
                    onClick={() => {
                        history.push("/manageJobs")
                    }}
                >
                    Manage Jobs
                </button>
            </div>
        </div>
    )
}

export default CreateJobOrderSuccess
