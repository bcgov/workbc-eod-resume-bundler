import React from 'react'

function LandingInternal() {
    return (
            <div>
                <div className="row">
                    <div className="col-md-6">
                        <a href="/createJobOrder" className="btn BC-Gov-SecondaryButton">Create Job Order</a><br /><br />
                    </div>
                    <div className="cold-md-6">
                        <a href="/manageJobs" className="btn BC-Gov-SecondaryButton">Manage Jobs / Review Referrals</a><br /><br />
                    </div>
                </div>
            </div>
    )
}

export default LandingInternal;