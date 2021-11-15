import { useHistory } from 'react-router-dom'

function SubmitToJobOrderSuccess(props) {
    let history = useHistory();
    
    return(
        <div className="container ml-3">
            <div className="row">
                <h1>Success! Applicants Submitted.</h1>   
            </div>
            <div className="row">
                <h1>ID: {props.location.createdID}</h1>
            </div>
            <div className="row">
                <h5 style={{ color: 'grey', fontWeight: 'lighter' }}>
                Applicant information has been successfully submitted.
                 Please make note of this Submission ID for future reference.
                </h5>
            </div>
            <div className="row">
                <button 
                    className="btn btn-outline-primary mr-5"
                    type="button"
                    onClick={
                        () => {
                            history.push({
                                pathname: "/submitToJobOrder",
                                jobID: props.location.jobID
                            })
                        }
                    }> 
                    Submit Another
                </button>
                <button 
                    className="btn btn-outline-primary" 
                    type="button"
                    onClick={
                        () => {
                            history.push('/submissionsExternal');
                        }
                    }> 
                    My Submissions
                </button>
            </div>
        </div>
    );
}

export default SubmitToJobOrderSuccess