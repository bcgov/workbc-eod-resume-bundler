import React, { useState, useEffect } from 'react';
import { useKeycloak } from '@react-keycloak/web';
import LandingInternal from './Components/Management/Landing/LandingInternal';
import LandingExternal from './Components/Management/Landing/LandingExternal';
import { FORM_URL } from './constants/form';

function Home() {
    const { keycloak, initialized } = useKeycloak();
    const [permissions, setPermissions] = useState();

    useEffect(async () => {
        if (initialized && keycloak.tokenParsed)
            await getPermissions();
    
        async function getPermissions() {
            let response = await fetch(FORM_URL.System + "/UserPermissions", {
                method: "GET",
                credentials: 'include',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'KeycloakToken': keycloak.token,
                    'UserGUID': keycloak.tokenParsed.smgov_userguid,
                    'Authorization': "Bearer " + keycloak.token
                }
            });

            let permissions = await response.json();
            setPermissions(permissions);
        }

    }, [initialized]);



    const handleRoles = () => {
        if (permissions){
            console.log(permissions)
            if (permissions.hasAccess && keycloak.tokenParsed.identity_provider.includes("bceid"))
                return <LandingExternal />
            
            if (permissions.hasAccess && keycloak.tokenParsed.identity_provider.includes("idir"))
                return <LandingInternal />

            else
                return <p>You don't have any options. Unauthorized</p>
        }
    }

    return (
        <div className="container">
            <div className="row">
                <div className="col-md-12">
                    <h1>Resume Bundler</h1>
                </div>
            </div>
            {(initialized) ? (
                <div>
                    {console.log(keycloak)}
                    <div className="row">
                        <div className="col-md-12">
                            {!keycloak.authenticated ? 
                                <div>
                                    <p>Welcome to the Resume Bundler. This site is where referral bundling job opportunities are posted for you to conveniently upload WorkBC client resumes. EOD will forward qualified resumes to employers for their consideration. This process is designed to streamline the referral process in order to make it easier for large provincial footprint employers to hire WorkBC clients.
                                    If you have questions or encounter any difficulties with the process please contact the Employment Opportunities Development (EOD) branch at Employer.Support@workbc.ca
                                    </p>
                                    <p><a type="button" className="btn btn-lg btn-primary" href="/loginLanding">Login</a><br /></p>
                                </div>
                                :
                                <div>
                                    <p>Welcome {keycloak.tokenParsed.given_name ? keycloak.tokenParsed.given_name
                                         : keycloak.tokenParsed.preferred_username ? keycloak.tokenParsed.preferred_username.split("@")[0] : ""}</p>
                                    {handleRoles()}
                                </div>
                            }
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

export default Home;