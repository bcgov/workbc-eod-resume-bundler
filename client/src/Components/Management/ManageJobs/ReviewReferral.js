function ReviewReferral({location}) {
    console.log(location.props);
    let jobOrder = location.props;

    const DisplayCatchments = (catchments) => {
        return catchments.map(c => parseInt(c.substring(2)).toString()).join(", "); // TODO: currently throws a warning regarding keys for lists
      }

    return(
        <div>
            <div className="container">
                <div className="row">
                    <div className="col-md-12">
                        <h1>EOD Resume Bundler - Reviewing Referral for Job {jobOrder.id}</h1>   
                    </div>
                </div>
            </div>
            <div className="row justify-content-between">
                <div className="column" style= {{ textAlign: "left", marginLeft: "7px" }}>
                    <div>
                        Job ID: {jobOrder.id}
                    </div>
                    <div>
                        Employer: {jobOrder.employer}
                    </div>
                    <div>
                        Position: {jobOrder.position}
                    </div>
                    <div>
                        Created: {jobOrder.created}
                    </div>
                    <div>
                        Deadline: {jobOrder.deadline}
                    </div>
                </div>
                <div className="column" style= {{ textAlign: "left", marginRight: "7px" }}>
                    <div>
                        Catchments: {DisplayCatchments(jobOrder.catchments)}
                    </div>
                    <div>
                        Location: {jobOrder.location}
                    </div>
                    <div>
                        Submissions: {jobOrder.submissions}
                    </div>
                    <div>
                        Last Edit: {jobOrder.lastEdit}
                    </div>
                    <div>
                        Edited By: {jobOrder.editedBy}
                    </div>
                </div>
            </div>
      </div>
    );
}

export default ReviewReferral