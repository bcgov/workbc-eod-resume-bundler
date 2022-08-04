import React from "react"
import { useHistory } from "react-router-dom"

function LandingExternal() {
    const h = useHistory()
    return (
        <div>
            <div className="row">
                <div className="col-md-6 mt-3" style={{ display: "flex", justifyContent: "center" }}>
                    <button
                        onClick={() =>
                            h.push({
                                pathname: "/jobOrdersExternal"
                            })
                        }
                        className="btn btn-outline-primary btn-block"
                        type="button"
                        style={{ fontSize: "1.5rem" }}
                    >
                        View Job Orders
                    </button>
                </div>
                <div className="col-md-6 mt-3" style={{ display: "flex", justifyContent: "center" }}>
                    <button
                        onClick={() =>
                            h.push({
                                pathname: "/submissionsExternal"
                            })
                        }
                        className="btn btn-outline-primary btn-block"
                        type="button"
                        style={{ fontSize: "1.5rem" }}
                    >
                        My Submissions
                    </button>
                </div>
            </div>
        </div>
    )
}

export default LandingExternal
