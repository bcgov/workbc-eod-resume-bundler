import React from 'react'

function LandingInternal() {
    return (
            <div>
                <div className="row">
                    <div className="col-md-6 mt-3" style={{display: "flex", justifyContent: "center"}}>
                        <button
                            href="/createJobOrder" 
                            className="btn btn-outline-primary btn-block" 
                            type="button"
                            style={{fontSize: "1.5rem"}}>
                            Create Job Order
                        </button>
                    </div>
                    <div className="col-md-6 mt-3" style={{display: "flex", justifyContent: "center"}}>
                        <button
                            href="/manageJobs" 
                            className="btn btn-outline-primary btn-block" 
                            type="button"
                            style={{fontSize: "1.5rem"}}>
                            Manage Jobs / Review Referrals
                        </button>
                    </div>
                </div>
            </div>
    )
}

export default LandingInternal;