import CircularProgress from "@material-ui/core/CircularProgress"
import HelpIcon from "@material-ui/icons/HelpOutline"
import { useKeycloak } from "@react-keycloak/web"
import React, { useEffect, useState } from "react"
import { useHistory } from "react-router-dom"
import LandingExternal from "./Components/Management/Landing/LandingExternal"
import LandingInternal from "./Components/Management/Landing/LandingInternal"
import FORM_URL from "./constants/form"
import WorkBCLogo from "./workbc-header-logo.svg"

function Home() {
    const { keycloak, initialized } = useKeycloak()
    const [permissions, setPermissions] = useState()
    const h = useHistory()

    useEffect(() => {
        async function getPermissions() {
            const response = await fetch(`${FORM_URL.System}/UserPermissions`, {
                method: "GET",
                credentials: "include",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    KeycloakToken: keycloak.token,
                    UserGUID: keycloak.tokenParsed.smgov_userguid,
                    Authorization: `Bearer ${keycloak.token}`
                }
            })

            const perms = await response.json()
            setPermissions(perms)
        }

        if (initialized && keycloak.tokenParsed) {
            console.log(keycloak)
            getPermissions().catch(console.error)
        }
    }, [initialized])

    const handleRoles = () => {
        if (permissions) {
            if (permissions.hasAccess && keycloak.tokenParsed.identity_provider.includes("bceid"))
                // service providers use OES auth
                return (
                    <div className="col-md-12">
                        <LandingExternal />
                    </div>
                )

            if (keycloak.hasResourceRole("eod-staff"))
                // ministry uses keycloak resource roles for auth
                return (
                    <div className="col-md-12">
                        <LandingInternal />
                    </div>
                )

            return (
                <div className="card card-danger mb-5">
                    <div className="card-header">
                        <h4 className="my-0">Error</h4>
                    </div>
                    <div className="card-body">
                        <p className="card-text">You {`don't`} have any options. Unauthorized</p>
                    </div>
                </div>
            )
        }

        return (
            <div className="col-md-12" style={{ display: "flex", justifyContent: "center" }}>
                <CircularProgress />
            </div>
        )
    }

    const getNameFromKeycloak = (() => {
        const { tokenParsed } = keycloak

        if (tokenParsed) {
            // eslint-disable-next-line camelcase
            const { given_name, preferred_username } = tokenParsed
            // eslint-disable-next-line camelcase
            if (given_name) return given_name
            // eslint-disable-next-line camelcase
            if (preferred_username) return preferred_username.split("@")[0]
        }

        return ""
    })()

    return (
        <div className="container">
            <div className="row">
                <div className="col">
                    {/* Header */}
                    <div className="mt-5">
                        {initialized && !keycloak.authenticated && <h1>WorkBC Resume Bundler</h1>}
                        {initialized && keycloak.authenticated && keycloak.hasResourceRole("eod-staff") && (
                            <h1>WorkBC Resume Bundler - Ministry Staff Homepage</h1>
                        )}
                        {initialized && keycloak.authenticated && keycloak.tokenParsed?.identity_provider.includes("bceid") && (
                            <h1>WorkBC Resume Bundler - Service Provider Homepage</h1>
                        )}
                        {keycloak.authenticated ? (
                            <h2>Welcome {getNameFromKeycloak}. Please select an option below:</h2>
                        ) : (
                            <h2 className="mt-5">Welcome to the WorkBC Resume Bundler!</h2>
                        )}
                    </div>
                    {initialized ? (
                        <div className="row">
                            {/* RB blurb / action buttons section */}
                            {keycloak.authenticated ? (
                                handleRoles()
                            ) : (
                                <div className="col-md-12">
                                    <p>
                                        This is where referral bundling job opportunities are posted for you to conveniently upload WorkBC client
                                        resumes. Employment Opportunities Development (EOD) will forward the resumes of qualified clients to employers
                                        for their consideration. This process is designed to streamline the referral process in order to make it
                                        easier for large, provincial footprint employers to hire WorkBC clients.
                                    </p>
                                </div>
                            )}

                            {/* Login button */}
                            {!keycloak.authenticated && (
                                <div className="col-md-12 mt-5 mb-5">
                                    <div style={{ display: "flex", justifyContent: "center" }}>
                                        <button
                                            onClick={() =>
                                                h.push({
                                                    pathname: "/loginLanding"
                                                })
                                            }
                                            type="button"
                                            className="btn btn-primary btn-lg"
                                            style={{ fontSize: "1.5rem", width: "10vw" }}
                                        >
                                            Login
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Help section */}
                            <div className="col-md-12 mt-5">
                                <div className="card card-secondary card-block">
                                    <div className="card-header">
                                        <h4 className="my-0">
                                            {" "}
                                            <HelpIcon /> Support
                                        </h4>
                                    </div>
                                    <div className="card-body">
                                        <p className="card-text">
                                            If you have questions or encounter any difficulties with the process, please contact the EOD branch at{" "}
                                            <a
                                                href="mailto:Employer.Support@workbc.ca"
                                                data-toggle="tooltip"
                                                data-placement="bottom"
                                                title="Click to email Employer.Support@workbc.ca"
                                            >
                                                Employer.Support@workbc.ca
                                            </a>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="col-md-12" style={{ display: "flex", justifyContent: "center" }}>
                            <CircularProgress />
                        </div>
                    )}
                </div>

                {/* Resources */}
                <div className="col-md-4 mt-5">
                    <div className="jumbotron">
                        <div className="row mb-2 mr-2 ml-2" style={{ justifyContent: "center" }}>
                            <img className="img-fluid d-md-block" src={WorkBCLogo} alt="WorkBC Logo" />
                        </div>
                        <div className="row mb-2 mt-3 mr-2 ml-2" style={{ justifyContent: "center" }}>
                            <header>
                                <h1 style={{ fontSize: "1.8rem" }}>Resources</h1>
                            </header>
                        </div>
                        <div className="row ml-2">
                            <p>
                                For more information on using the WorkBC Resume Bundler, including step-by-step instructions and frequently asked
                                questions, please review the user guide:
                            </p>
                        </div>
                        <div className="row mb-3 ml-2 mr-2">
                            <button type="button" className="btn btn-primary btn-lg btn-block">
                                Resume Bundler User Guide
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Home
