import React from 'react'

function LandingInternal() {
    return (
            <div>
                <div className="row">
                    <div className="col-md-6" style={{display: "flex", justifyContent: "right"}}>
                        <a 
                            href="/createJobOrder" 
                            className="btn btn-outline-primary" 
                            type="button"
                            style={{fontSize: "2rem"}}>
                            Create Job Order
                        </a>
                    </div>
                    <div className="col-md-6">
                        <a 
                            href="/manageJobs" 
                            className="btn btn-outline-primary" 
                            type="button"
                            style={{fontSize: "2rem"}}>
                            Manage Jobs / Review Referrals
                        </a>
                    </div>
                </div>
            </div>
    )
}

export default LandingInternal;