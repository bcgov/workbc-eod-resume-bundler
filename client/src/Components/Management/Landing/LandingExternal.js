import React from 'react'
import { useHistory } from 'react-router-dom';

function LandingExternal() {
    let history = useHistory();
    return (
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
}

export default LandingExternal;