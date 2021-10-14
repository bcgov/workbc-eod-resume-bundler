import { useHistory } from 'react-router-dom'

function LogoutSuccess(props) {
    let history = useHistory();
    
    return(
        <div className="container">
            <div className="col-md-12">
                <div className="row">
                    <h1>You've successfully logged out.</h1>   
                </div>
                <div className="row">
                    <button 
                        className="btn btn-outline-primary mr-5"
                        type="button"
                        onClick={
                            () => {
                                history.push("/");
                            }
                        }> 
                        Back to Home Page
                    </button>
                </div>
            </div>
        </div>
    );
}

export default LogoutSuccess