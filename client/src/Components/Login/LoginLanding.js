import React from 'react'
import { withRouter, useHistory } from 'react-router-dom'
import { useKeycloak } from '@react-keycloak/web'

function LoginLanding() {
    const { keycloak, initialized } = useKeycloak()
    const h = useHistory()
    return (
        <div className="container">
            {console.log(initialized)}
            <div className="row">
                <div className="col-md-12">
                    <h1>Resume Bundler</h1>
                </div>
            </div>
            <div>
                <div className="row">
                    <div className="col-md-12">
                    {(keycloak.authenticated && initialized) ?
                        <div>
                            <p>Logged In... Loading</p>
                            {h.push('/')}
                        </div>
                        :
                        <div>
                            <p><button type="button" className="btn btn-lg btn-primary" onClick={() => keycloak.login({ idpHint: 'idir' })}>IDIR Login</button><br /><br /><br /></p>
                            <p><button type="button" className="btn btn-lg btn-primary" onClick={() => keycloak.login({ idpHint: 'bceid-basic-and-business' })}>BCeID Login</button><br /></p>
                        </div>
                    }
                    </div>
                </div>
            </div>
        </div>
    )
}

export default withRouter(LoginLanding);