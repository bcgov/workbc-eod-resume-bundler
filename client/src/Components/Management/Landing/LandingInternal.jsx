import React from "react"
import { useHistory } from "react-router-dom"

function LandingInternal() {
    const h = useHistory()

    return (
        <div>
            <div className="row mb-5">
                <div className="col-md-6 mt-3" style={{ display: "flex", justifyContent: "center" }}>
                    <button
                        onClick={() =>
                            h.push({
                                pathname: "/createJobOrder"
                            })
                        }
                        className="btn btn-outline-primary btn-block"
                        type="button"
                        style={{ fontSize: "1.5rem" }}
                    >
                        Create Job Order
                    </button>
                </div>
                <div className="col-md-6 mt-3" style={{ display: "flex", justifyContent: "center" }}>
                    <button
                        onClick={() =>
                            h.push({
                                pathname: "/manageJobs"
                            })
                        }
                        className="btn btn-outline-primary btn-block"
                        type="button"
                        style={{ fontSize: "1.5rem" }}
                    >
                        Manage Jobs / Review Referrals
                    </button>
                </div>
            </div>
        </div>
    )
}

export default LandingInternal
