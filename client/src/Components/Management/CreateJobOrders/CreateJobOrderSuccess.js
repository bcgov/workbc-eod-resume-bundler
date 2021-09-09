import { useHistory } from 'react-router-dom'

function CreateJobOrderSuccess(props) {
    let history = useHistory();
    
    return(
        <div className="container">
            <div className="row">
                <h1>Success! Job Order Created.</h1>   
            </div>
            <div className="row">
                <h1>ID: {props.location.createdID}</h1>
            </div>
            <div className="row">
                <h5 style={{ color: 'grey', fontWeight: 'lighter' }}>
                    Job order successfully created.
                </h5>
            </div>
            <div className="row">
                <button 
                    className="btn btn-outline-primary mr-5"
                    type="button"
                    onClick={
                        () => {
                            history.push('/createJobOrder');
                        }
                    }> 
                    Create Another
                </button>
                <button 
                    className="btn btn-outline-primary" 
                    type="button"
                    onClick={
                        () => {
                            history.push('/manageJobs');
                        }
                    }> 
                    Manage Jobs
                </button>
            </div>
        </div>
    );
}

export default CreateJobOrderSuccess