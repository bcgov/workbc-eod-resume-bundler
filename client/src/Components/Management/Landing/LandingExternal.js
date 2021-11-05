import React from 'react'
import { useHistory } from 'react-router-dom';

function LandingExternal() {
    let history = useHistory();
    return (
            <div>
                <div className="row">
                    <div className="col-md-6" style={{display: "flex", justifyContent: "right"}}>
                        <a 
                            href="/jobOrdersExternal" 
                            className="btn btn-outline-primary" 
                            type="button"
                            style={{fontSize: "2rem"}}>
                            View Job Orders
                        </a>
                    </div>
                    <div className="col-md-6">
                        <a 
                            href="/submissionsExternal" 
                            className="btn btn-outline-primary" 
                            type="button"
                            style={{fontSize: "2rem"}}>
                            My Submissions
                        </a>
                    </div>
                </div>

            </div>
    )
}

export default LandingExternal;