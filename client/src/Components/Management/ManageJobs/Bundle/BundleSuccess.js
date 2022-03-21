import { useHistory } from 'react-router-dom';

function BundleSuccess(props) {
    let history = useHistory();

    return(
        <div className="container ml-3 mt-5">
            <div className="row">
                <h1>Success! Applications bundled.</h1>   
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
                    Return to Home Page
                </button>
            </div>
        </div>
    );
}

export default BundleSuccess