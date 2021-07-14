import React from 'react'
import { useKeycloak } from '@react-keycloak/web'

function LandingInternal() {
    const { keycloak, initialized } = useKeycloak()
    return (
        <div>
            {initialized ? (
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
                :
                <div className="spinner-border" role="status">
                    <span className="sr-only">Loading...</span>
                </div>
            }
        </div>
    )
}

export default LandingInternal;