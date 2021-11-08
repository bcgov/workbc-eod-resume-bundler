import { useHistory } from 'react-router-dom';
import CircularProgress from '@material-ui/core/CircularProgress';
import { useKeycloak } from '@react-keycloak/web';

function LogoutSuccess(props) {
    let history = useHistory();
    const { keycloak } = useKeycloak();
    
    return(
        <div className="container">
            { !keycloak.authenticated &&
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
            }
            { keycloak.authenticated &&
                <div style={{display: "flex", justifyContent: "center"}}>
                <CircularProgress />
                </div>
            }
        </div>
    );
}

export default LogoutSuccess