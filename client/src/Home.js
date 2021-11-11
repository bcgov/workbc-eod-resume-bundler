import React, { useState, useEffect } from 'react';
import { useKeycloak } from '@react-keycloak/web';
import LandingInternal from './Components/Management/Landing/LandingInternal';
import LandingExternal from './Components/Management/Landing/LandingExternal';
import { FORM_URL } from './constants/form';
import HelpIcon from '@material-ui/icons/HelpOutline';
import { Container } from "react-bootstrap";
import WorkBCLogo from './workbc-header-logo.svg';
import CircularProgress from '@material-ui/core/CircularProgress';

function Home() {
    const { keycloak, initialized } = useKeycloak();
    const [permissions, setPermissions] = useState();

    useEffect(async () => {
        if (initialized && keycloak.tokenParsed){
            console.log(keycloak);
            await getPermissions();
        }
    
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
            if (permissions.hasAccess && keycloak.tokenParsed.identity_provider.includes("bceid")) // service providers use OES auth
                return  <div className="mb-5">
                            <LandingExternal />
                        </div>
            
            else if (keycloak.hasResourceRole('eod-staff')) // ministry uses keycloak resource roles for auth
                return  <div className="mb-5">
                            <LandingInternal />
                        </div>

            else
                return  (<div class="card card-danger mb-5">
                            <div class="card-header">
                            <h4 class="my-0">Error</h4>
                            </div>
                            <div class="card-body">
                            <p class="card-text">You don't have any options. Unauthorized</p>
                            </div>
                        </div>)
        }
        else{
            return (
                <div style={{display: "flex", justifyContent: "center"}}>
                    <CircularProgress />
                </div>)
        }
    }

    return (
        <Container fluid style={{height: "100%", minHeight: "100%", display: "flex", marginLeft: "1vw", position: "absolute"}}>
            <div className="row">
                <div className="col">

                    {/* Header */}
                    <div className="row mb-5">
                        <div className="col-md-12">
                            <header>
                                <h1 style={{fontSize: "7vh"}}>WorkBC Resume Bundler</h1>
                                {keycloak.authenticated 
                                    ?   <h2 style={{fontWeight: 200}}>Welcome {keycloak.tokenParsed.given_name // sometimes given name isn't available, show preferred username instead
                                                    ? keycloak.tokenParsed.given_name
                                                    : keycloak.tokenParsed.preferred_username ? keycloak.tokenParsed.preferred_username.split("@")[0] : ""}
                                        </h2>
                                    :   <h2 style={{fontWeight: 200}}>Welcome to the WorkBC Resume Bundler!</h2>  
                                }
                            </header>
                        </div>
                    </div>
                    {initialized
                        ?   <div>
                                {/* RB blurb / action buttons section */}
                                {keycloak.authenticated 
                                    ?   handleRoles()
                                    :   <div className="row mb-5">
                                            <p style={{fontSize: "1.75rem", lineHeight: "1.3"}}>
                                                This is where referral bundling job opportunities are posted for you to conveniently upload WorkBC client resumes. Employment Opportunities Development (EOD)
                                                    will forward the resumes of qualified clients to employers for their consideration. This process is designed to streamline the referral process in order to 
                                                    make it easier for large provincial footprint employers to hire WorkBC clients.
                                            </p>
                                        </div>
                                }

                                {/* Help section */}
                                <div className="row justify-content-center">
                                    <div className="col-2" style={{display: "flex", justifyContent: "end"}}>
                                        <HelpIcon style={{fontSize: "9rem", justifyContent: "right"}}/>
                                    </div>
                                    <div className="col-6">
                                        <p style={{fontSize: "1.65rem", overflowWrap: "normal", lineHeight: "1.5"}}>
                                            If you have questions or encounter any difficulties with the process, please contact the EOD branch at <b>Employer.Support@workbc.ca</b>
                                        </p>
                                    </div>
                                    <div className="col-2">
                                    </div>
                                </div>

                                {/* Login button */}
                                {!keycloak.authenticated &&
                                    <div className="row justify-content-center">
                                        <div className="mt-5 mb-5" align="center">
                                            <a 
                                                type="button" 
                                                className="btn btn-lg btn-primary" 
                                                style={{fontSize: "2.25rem"}}
                                                href="/loginLanding">
                                                Login
                                            </a>
                                        </div>            
                                    </div>
                                }
                            </div>
                        :   <div style={{display: "flex", justifyContent: "center"}}>
                                <CircularProgress />
                            </div>
                    }
                </div>

                {/* Resources */}
                <div className="col-4" style={{backgroundColor: "DarkGrey"}}>
                    <div className="row mb-5 mt-3" style={{justifyContent: "center"}}>
                        <img
                            className="img-fluid d-none d-md-block"
                            src={WorkBCLogo}
                            style={{height: "50"}}
                            alt="WorkBC Logo" 
                        />
                    </div>
                    <div className="row mb-2" style={{justifyContent: "center"}}>
                        <header>
                            <h1 style={{color: "white", fontSize: "7vh"}}>
                                Resources
                            </h1>
                        </header>
                    </div>
                    <div className="row ml-2">
                        <p style={{fontSize: "1.65rem", overflowWrap: "normal", color: "white"}}>
                            For more information on using the WorkBC Resume Bundler, including step-by-step instructions
                            and frequently asked questions, please review the following user manuals:
                        </p>
                    </div>
                    <div className="row mb-3" style={{justifyContent: "center"}}>
                        <button className="btn btn-primary btn-lg" style={{fontSize: "2rem"}}>
                            For Service Providers
                        </button>
                    </div>
                    <div className="row mb-5" style={{justifyContent: "center"}}>
                        <button className="btn btn-secondary btn-lg" style={{fontSize: "2rem"}}>
                            For Ministry Staff
                        </button>
                    </div>

                </div>
            </div>
        </Container>
    )
}

export default Home;