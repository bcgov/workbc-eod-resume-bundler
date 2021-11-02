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

    let applicants = [];
    submissions.forEach(s => {
      s.applicants.forEach(applicant => {
        if (applicant.status === "Approved" && !applicant.bundled)
          applicants.push(applicant);
      });
    });

    const handleBundleClicked = async () => {
        setBundling(true);

        // call api to bundle resumes and send emails for approved applicants //
        const applicantsToSend = {
            clientApplicationIDs: applicants.map(a => a.clientApplicationID),
            email: email
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
                    <h5>Employers Email:</h5>
                    <input 
                        type="text" 
                        name="email" 
                        value={email} 
                        onChange={(e) => {
                            setEmail(e.target.value);
                        }}>
                    </input>
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