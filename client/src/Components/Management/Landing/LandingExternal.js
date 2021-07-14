import React from 'react'
import { useKeycloak } from '@react-keycloak/web'

function LandingExternal() {
    const { keycloak, initialized } = useKeycloak()
    return (
        <div>
            {initialized ? (
                <div>
                    <div className="row">
                        <div className="col-md-6">
                            <a href="/jobOrdersExternal" className="btn btn-lg BC-Gov-SecondaryButton">View Job Orders</a><br /><br />
                        </div>
                        <div className="cold-md-6">
                            <a href="/submissionsExternal" className="btn btn-lg BC-Gov-SecondaryButton">My Submissions</a><br /><br />
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

export default LandingExternal;