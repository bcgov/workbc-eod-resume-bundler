function SubmitToJobOrder(props) {
    console.log(props.location.jobID);
    return (
        <div className="container">
            <div className="row">
                <div className="col-md-12">
                  <h1>EOD Resume Bundler - Submitting to Job Order {props.location.jobID}</h1>  
                  <p>Submit a Resume. Click on Add Another to add more than one resume at a time.</p>  
                </div>
            </div>
        </div>
      );
};

export default SubmitToJobOrder;