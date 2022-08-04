import { useKeycloak } from "@react-keycloak/web"
import React from "react"

function Landing() {
    const { keycloak, initialized } = useKeycloak()
    return (
        <div className="container">
            <div className="row">
                <div className="col-md-12">
                    <h1>Resume Bundler</h1>
                </div>
            </div>
            {initialized ? (
                <div>
                    <div className="row">
                        <div className="col-md-12">
                            {!keycloak.authenticated ? (
                                <div>
                                    <p>You are not logged in</p>
                                    <p>
                                        <button
                                            type="button"
                                            className="btn btn-lg btn-primary"
                                            onClick={() => keycloak.login({ idpHint: "bceid-basic-and-business" })}
                                        >
                                            BCeID Login
                                        </button>
                                        <br />
                                    </p>
                                </div>
                            ) : (
                                <div>
                                    <p>Welcome {keycloak.tokenParsed.given_name}</p>
                                    {keycloak.hasResourceRole("eod-contractor") ? (
                                        <div className="row">
                                            <div className="col-md-6">
                                                <a href="/jobOrdersExternal" className="btn btn-lg btn-dark">
                                                    View Job Orders
                                                </a>
                                                <br />
                                                <br />
                                            </div>
                                            <div className="cold-md-6">
                                                <a href="/submissionsExternal" className="btn btn-lg btn-dark">
                                                    My Submissions
                                                </a>
                                                <br />
                                                <br />
                                            </div>
                                        </div>
                                    ) : (
                                        <p>You {`don't`} have any options. Unauthorized</p>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            ) : (
                <div className="spinner-border" role="status">
                    <span className="sr-only">Loading...</span>
                </div>
            )}
        </div>
    )
}

export default Landing
