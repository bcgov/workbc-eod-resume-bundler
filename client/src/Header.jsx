import { useKeycloak } from "@react-keycloak/web"
import React, { useEffect, useState } from "react"
import logo from "./bcid-logo-rev-en.svg"
import logoSmall from "./bcid-symbol-rev.svg"
import FORM_URL from "./constants/form"

function Header() {
    const { keycloak, initialized } = useKeycloak()

    const [permissions, setPermissions] = useState()

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
            getPermissions().catch(console.error)
        }
    }, [initialized])

    return (
        <header>
            <nav className="navbar navbar-expand-lg navbar-dark">
                <div className="container">
                    <a className="navbar-brand" href="https://www2.gov.bc.ca">
                        <img className="img-fluid d-none d-md-block" src={logo} width="177" height="44" alt="B.C. Government Logo" />
                        <img className="img-fluid d-md-none" src={logoSmall} width="63" height="44" alt="B.C. Government Logo" />
                    </a>
                    <div className="navbar-brand">Resume Bundler</div>
                    <button
                        className="navbar-toggler"
                        type="button"
                        data-toggle="collapse"
                        data-target="#navbarNavAltMarkup"
                        aria-controls="navbarNavAltMarkup"
                        aria-expanded="false"
                        aria-label="Toggle navigation"
                    >
                        <span className="navbar-toggler-icon" />
                    </button>
                    <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
                        <div className="navbar-nav">
                            <a className="nav-item nav-link" href="/">
                                Home
                            </a>
                        </div>
                        {keycloak.hasResourceRole("eod-staff") && (
                            <>
                                <div className="navbar-nav">
                                    <a className="nav-item nav-link" href="/createJobOrder">
                                        Create Job Order
                                    </a>
                                </div>
                                <div className="navbar-nav">
                                    <a className="nav-item nav-link" href="/manageJobs">
                                        Manage Jobs
                                    </a>
                                </div>
                            </>
                        )}
                        {initialized && permissions?.hasAccess && keycloak.tokenParsed.identity_provider.includes("bceid") && console.log(keycloak) && (
                            <>
                                <div className="navbar-nav">
                                    <a className="nav-item nav-link" href="/jobOrdersExternal">
                                        View Job Orders
                                    </a>
                                </div>
                                <div className="navbar-nav">
                                    <a className="nav-item nav-link" href="/submissionsExternal">
                                        My Submissions
                                    </a>
                                </div>
                            </>
                        )}
                    </div>
                    <ul className="nav navbar-nav ml-auto">
                        <li className="nav-item">
                            {initialized && (
                                <div>
                                    {!keycloak.authenticated && initialized ? (
                                        <a className="btn btn-bcgold" href="/loginLanding">
                                            Login
                                        </a>
                                    ) : (
                                        <a
                                            className="btn btn-bcgold"
                                            href={`https://logontest7.gov.bc.ca/clp-cgi/logoff.cgi?retnow=1&returl=${keycloak.createLogoutUrl({
                                                redirectUri: `${window.location.origin}/logoutSuccess`
                                            })}`}
                                        >
                                            Logout
                                        </a>
                                    )}
                                </div>
                            )}
                        </li>
                    </ul>
                </div>
            </nav>
        </header>
    )
}

export default Header
