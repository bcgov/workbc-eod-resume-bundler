import React from 'react'
import { useHistory } from 'react-router-dom';

function LandingExternal() {
    let history = useHistory();
    return (
            <div>
                <div className="row">
                    <div className="col-md-6" style={{display: "flex", justifyContent: "center"}}>
                        <a 
                            href="/jobOrdersExternal" 
                            className="btn btn-outline-primary" 
                            type="button"
                            style={{fontSize: "1.5rem"}}>
                            View Job Orders
                        </a>
                    </div>
                    <div className="col-md-6" style={{display: "flex", justifyContent: "left"}}>
                        <a 
                            href="/submissionsExternal" 
                            className="btn btn-outline-primary" 
                            type="button"
                            style={{fontSize: "1.5rem"}}>
                            My Submissions
                        </a>
                    </div>
                </div>

            </div>
    )
}

export default LandingExternal;