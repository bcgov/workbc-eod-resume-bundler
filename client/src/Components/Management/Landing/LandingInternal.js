import React from 'react'

function LandingInternal() {
    return (
            <div>
                <div className="row">
                    <div className="col-md-6" style={{display: "flex", justifyContent: "left"}}>
                        <a 
                            href="/createJobOrder" 
                            className="btn btn-outline-primary" 
                            type="button"
                            style={{fontSize: "1.5rem"}}>
                            Create Job Order
                        </a>
                    </div>
                    <div className="col-md-6" style={{display: "flex", justifyContent: "left"}}>
                        <a 
                            href="/manageJobs" 
                            className="btn btn-outline-primary" 
                            type="button"
                            style={{fontSize: "1.5rem"}}>
                            Manage Jobs / Review Referrals
                        </a>
                    </div>
                </div>
            </div>
    )
}

export default LandingInternal;