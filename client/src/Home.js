import React, { useState, useEffect } from 'react';
import { useKeycloak } from '@react-keycloak/web';
import LandingInternal from './Components/Management/Landing/LandingInternal';
import LandingExternal from './Components/Management/Landing/LandingExternal';
import { FORM_URL } from './constants/form';
import HelpIcon from '@material-ui/icons/HelpOutline';
import WorkBCLogo from './workbc-header-logo.svg';
import CircularProgress from '@material-ui/core/CircularProgress';
import { useHistory } from 'react-router-dom';

function Home() {
    const { keycloak, initialized } = useKeycloak();
    const [permissions, setPermissions] = useState();
    const h = useHistory();

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
                return  <div className="col-md-12">
                            <LandingExternal />
                        </div>
            
            else if (keycloak.hasResourceRole('eod-staff')) // ministry uses keycloak resource roles for auth
                return  <div className="col-md-12">
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
                <div className="col-md-12"  style={{display: "flex", justifyContent: "center"}}>
                    <CircularProgress />
                </div>)
        }
    }

    return (
        <div className="container">
            <div className="row">
                <div className="col">

                    {/* Header */}
                    <div className="col-md-12 mt-3">
                        {initialized && !keycloak.authenticated &&
                            <h1>WorkBC Resume Bundler</h1>
                        }
                        {initialized && keycloak.authenticated && keycloak.hasResourceRole('eod-staff') &&
                            <h1>WorkBC Resume Bundler - Ministry Staff Homepage</h1>
                        }
                        {initialized && keycloak.authenticated && keycloak.tokenParsed?.identity_provider.includes("bceid") &&
                            <h1>WorkBC Resume Bundler - Service Provider Homepage</h1>
                        }
                        {keycloak.authenticated 
                            ?   <h2>Welcome {keycloak.tokenParsed.given_name // sometimes given name isn't available, show preferred username instead
                                            ? keycloak.tokenParsed.given_name
                                            : keycloak.tokenParsed.preferred_username ? keycloak.tokenParsed.preferred_username.split("@")[0] : ""}
                                            . Please select an option below:
                                </h2>
                            :   <h2>Welcome to the WorkBC Resume Bundler!</h2>  
                        }
                    </div>
                    {initialized
                        ?  <div className="row" >
                                {/* RB blurb / action buttons section */}
                                {keycloak.authenticated
                                    ?   handleRoles()
                                    :   <div className="col-md-12">
                                            <p>
                                                This is where referral bundling job opportunities are posted for you to conveniently upload WorkBC client resumes. Employment Opportunities Development (EOD)
                                                    will forward the resumes of qualified clients to employers for their consideration. This process is designed to streamline the referral process in order to 
                                                    make it easier for large provincial footprint employers to hire WorkBC clients.
                                            </p>
                                        </div>
                                }

                            {/* Help section */}
                                <div className="col-md-12 mt-3">
                                     <div class="card card-secondary card-block">
                                        <div class="card-header">
                                            <h4 class="my-0"> <HelpIcon/> Support</h4>
                                        </div>
                                        <div class="card-body">
                                            <p class="card-text">If you have questions or encounter any difficulties with the process, please contact the EOD branch at <a href='mailto:Employer.Support@workbc.ca' data-toggle="tooltip" data-placement="bottom" title="Click to email Employer.Support@workbc.ca">Employer.Support@workbc.ca</a></p>
                                        </div>
                                    </div>
                                </div>


                            {/* Login button */}
                            {!keycloak.authenticated &&
                                <div className="col-md-12" >
                                    <div className="mt-5 mb-5"  style={{display: "flex", justifyContent: "center"}}>
                                        <button
                                            onClick={() => 
                                                h.push({
                                                    pathname: "/loginLanding"
                                                })
                                            }
                                            type="button"
                                            className="btn btn-primary btn-lg"
                                            style={{ fontSize: "1.5rem" }}
                                        >
                                            Login
                                        </button>
                                    </div>
                                </div>
                            }
                        </div>
                        : <div className="col-md-12"  style={{display: "flex", justifyContent: "center"}}>
                            <CircularProgress />
                         </div>
                        

                    
                    }
                </div>

                {/* Resources */}
                <div className="col-md-4 mt-3">
                    <div className="jumbotron" >
                        <div className="row mb-2 mr-2 ml-2" style={{ justifyContent: "center" }}>
                            <img
                                className="img-fluid d-md-block"
                                src={WorkBCLogo}
                                alt="WorkBC Logo"
                            />
                        </div>
                        <div className="row mb-2 mt-3 mr-2 ml-2" style={{ justifyContent: "center" }}>
                            <header>
                                <h1 style={{ fontSize: "1.8rem" }}>
                                    Resources
                                </h1>
                            </header>
                        </div>
                        <div className="row ml-2">
                            <p>
                                For more information on using the WorkBC Resume Bundler, including step-by-step instructions
                                and frequently asked questions, please review the user guide:
                            </p>
                        </div>
                        <div className="row mb-3 ml-2 mr-2">
                            <button className="btn btn-primary btn-lg btn-block">
                                Resume Bundler User Guide
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Home;