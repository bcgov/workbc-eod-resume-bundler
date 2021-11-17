import React, { useState } from 'react';
import CircularProgress from '@material-ui/core/CircularProgress'
import { FORM_URL } from '../../../../constants/form';
import { useHistory } from 'react-router-dom';
import { useKeycloak } from '@react-keycloak/web';

function Bundle({location}) {
    let history = useHistory();
    const { keycloak } = useKeycloak();
    const jobOrder = location.props.jobOrder;
    const submissions = location.props.submissions;
    const [bundling, setBundling] = React.useState(false);
    const [email, setEmail] = React.useState("");
    const [confirmEmail, setConfirmEmail] = React.useState("");
    const [staffName, setStaffName] = React.useState("");

    let applicants = [];
    submissions.forEach(s => {
      s.applicants.forEach(applicant => {
        if (applicant.status === "Approved" && !applicant.bundled)
          applicants.push(applicant);
      });
    });

    const handleBundleClicked = async () => {
        if ((email != confirmEmail) || (email === "")) // Must be an email entered and emails must match in order to send
            return;
            
        setBundling(true);

        // call api to bundle resumes and send emails for approved applicants //
        const applicantsToSend = {
            clientApplicationIDs: applicants.map(a => a.clientApplicationID),
            email: email,
            position: jobOrder.position,
            location: jobOrder.location,
            staffName: staffName
        };
        await fetch(FORM_URL.Submissions + "/bundleAndSend", 
        {
            method: "POST",
            credentials: 'include',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                "Authorization": "Bearer " + keycloak.token      
            },
            body:JSON.stringify(applicantsToSend)
        })
        .then(() => {
            setBundling(false);
            history.push({
                pathname: '/bundleSuccess'
              });
        });
    }

    return (
        <div className="container">
            <div>
              <div className="row">
                  <div className="col-md-12">
                    <h1>Resume Bundler - Bundler</h1>   
                    <p>Bundling the following resumes for Job {jobOrder.id}:</p> 
                    <div className="ml-5">
                        {applicants.map(a => {
                            return <li>{a.clientApplicationID}</li>
                        })}
                    </div>
                    <br/>
                    <p>Applications will be combined into a single PDF.</p>
                    <br></br>
                    <div class="form-group">
                        <label class="control-label" for="staffName">EOD Staff Name</label>
                        <input 
                            type="text" 
                            class="form-control" 
                            id="staffName" 
                            value={staffName}
                            onChange={(e) => {
                                setStaffName(e.target.value);
                            }}
                        />
                    </div>
                    <div class="form-group">
                        <label class="control-label" for="email">Employer Email</label>
                        <input 
                            type="text" 
                            class="form-control" 
                            id="email" 
                            value={email}
                            onChange={(e) => {
                                setEmail(e.target.value);
                            }}
                        />
                    </div>
                    <div class="form-group">
                        <label class="control-label" for="confirmEmail">Confirm Email</label>
                        {
                            email === confirmEmail || (confirmEmail === "")
                                ?   <input 
                                        type="text" 
                                        class="form-control" 
                                        id="confirmEmail" 
                                        value={confirmEmail}
                                        onChange={(e) => {
                                            setConfirmEmail(e.target.value);
                                        }}
                                    />
                                :   <input 
                                        type="text" 
                                        class="form-control is-invalid" 
                                        id="confirmEmail" 
                                        value={confirmEmail}
                                        onChange={(e) => {
                                            setConfirmEmail(e.target.value);
                                        }}
                                    />
                        }
                        <div className="invalid-feedback">
                            Emails must match
                        </div>
                    </div>

                    <div className="d-flex row justify-content-start mt-5">
                        {!bundling && 
                            <button className="btn btn-success mr-5" onClick={() => handleBundleClicked()}>
                                Bundle/Send
                            </button>
                        }
                        {bundling && // show spinner while bundling
                            <CircularProgress />
                        }
                    </div>
                  </div>
              </div>
            </div>
        </div>
    );
}


export default Bundle;