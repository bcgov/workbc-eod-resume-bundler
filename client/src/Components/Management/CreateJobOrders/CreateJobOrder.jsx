import React from "react"
import { withRouter } from "react-router-dom"
import CreateJobOrberForm from "./CreateJobOrderForm"

function CreateJobOrder() {
    return (
        <div className="container mt-5">
            <div className="row">
                <div className="col-md-12">
                    <h1>Resume Bundler - Create Job Order</h1>
                    <CreateJobOrberForm />
                </div>
            </div>
        </div>
    )
}

export default withRouter(CreateJobOrder)
