import { FORM_URL } from '../../../constants/form';
import { useHistory } from 'react-router-dom';

function Bundle({location}) {
    let history = useHistory();
    const jobOrder = location.props.jobOrder;
    const submissions = location.props.submissions;

    let applicants = [];
    submissions.forEach(s => {
      s.applicants.forEach(applicant => {
        if (applicant.status === "Approved")
          applicants.push(applicant);
      });
    });

    const handleBundleClicked = async () => {
        // call api to bundle resumes and send emails for approved applicants //
        const applicantsToSend = {
            clientApplicationIDs: applicants.map(a => a.clientApplicationID)
        };

        await fetch(FORM_URL.Submissions + "/bundleAndSend", 
        {
            method: "POST",
            credentials: 'include',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body:JSON.stringify(applicantsToSend)
        })
        .then(() => {
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
                    <div className="d-flex row justify-content-start mt-5">
                        <button className="btn btn-success mr-5" onClick={() => handleBundleClicked()}>
                          Bundle/Send
                        </button>
                    </div>
                  </div>
              </div>
            </div>
        </div>
    );
}


export default Bundle;