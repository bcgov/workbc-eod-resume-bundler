import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { FORM_URL } from '../../../../constants/form';
import { makeStyles } from '@material-ui/core/styles';
import SearchBar from '../../../../utils/SearchBar';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import IconButton from '@material-ui/core/IconButton';
import VisibilityIcon from '@material-ui/icons/Visibility';
import EditIcon from '@material-ui/icons/Edit';
import FlagIcon from '@material-ui/icons/Flag';
import CheckIcon from '@material-ui/icons/Check';
import Collapse from '@material-ui/core/Collapse';
import Checkbox from "@material-ui/core/Checkbox";
import { useKeycloak } from '@react-keycloak/web';

const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      borderBottom: 'unset',
    },
    margin: 'auto'
  },
  cardHeader: {
    padding: theme.spacing(1, 2),
  },
  list: {
      width: 300, // TODO: don't hardcore size
      height: 200, // TODO: don't hardcore size
      backgroundColor: theme.palette.background.paper,
      overflow: 'auto',
      paddingLeft: 0
  },
  button: {
      margin: theme.spacing(0.5, 0),
  },
  table: {
    minWidth: 650
  },
  tableHeader: {
    borderTopWidth: 2,
    borderBottomWidth: 2,
    borderRightWidth: 0,
    borderLeftWidth: 0,
    borderColor: 'black',
    borderStyle: 'solid'
  },
  noBorder: {
    borderTopWidth: 0,
    borderBottomWidth: 0
  },
  searchBox: {
    height: 100,
    width: 300
  }
}));

const b64toBlob = (b64Data, contentType='', sliceSize=512) => {
  const buffer = Buffer.from(b64Data, "base64");
  const blob = new Blob([buffer.buffer], {type: contentType});
  return blob;
}


function ReviewReferral({location}) {
    const classes = useStyles();
    let history = useHistory();
    const { keycloak, initialized } = useKeycloak();
    const MAX_CATCHMENTS = 4; // max catchments to display

    let jobOrder = location.props;

    const [referrals, setReferrals] = useState([[]]);
    const [referralsToDisplay, setReferralsToDisplay] = useState([]);
    const [catchments, setCatchments] = useState();
    const [centres, setCentres] = useState();
    const [checkedClients, setCheckedClients] = useState([]);
    const [forceUpdate, setForceUpdate] = useState(0);

    const [openRows, setOpenRows] = React.useState([]);
    const handleRowToggle = (rowID) => {
      const currentIndex = openRows.indexOf(rowID);
      const newOpenRows = [...openRows];

      if (currentIndex === -1) {
        newOpenRows.push(rowID);
      } else {
        newOpenRows.splice(currentIndex, 1);
      }

      setOpenRows(newOpenRows);
    };

    useEffect(async () => {
      if (initialized) {
        await getReferrals();
        await getCatchments();
        await getCentres();
      }

      async function getReferrals() {
        const response = await fetch(FORM_URL.Submissions, {
          headers: {
            "Authorization": "Bearer " + keycloak.token
          }
        });
        const data = await response.json();
        const referrals = data.submissions
          .filter(s => s.jobID == jobOrder.id)
          .sort((a,b) => a.catchmentID > b.catchmentID ? 1 : -1);
        referrals.forEach(r => {
          r.applicants.sort((a,b) => a.clientApplicationID > b.clientApplicationID ? 1 : -1);       
        });
        setReferrals(referrals);
        setReferralsToDisplay(referrals);
      }

      async function getCatchments() {
        const response = await fetch(FORM_URL.System + "/Catchments", {
          headers: {
            "Authorization": "Bearer " + keycloak.token
          }
        });
        const data = await response.json();
        setCatchments(data);
      }

      async function getCentres() {
        const response = await fetch(FORM_URL.System + "/Centres", {
          headers: {
            "Authorization": "Bearer " + keycloak.token
          }
        });
        const data = await response.json();
        setCentres(data);
      }
    }, [setReferrals, setCatchments, setCentres, forceUpdate]);

    const DisplayCatchments = (catchmentIDs) => {
      if(catchments.length == 0)
        return "";
  
      return catchmentIDs
        .map(id => catchments.find(x => x.catchment_id == id).name)
        .join(", "); 
    }

    const GetServiceProvider = (catchmentID) => {
      if(catchments.length == 0)
        return "";    
        
      return catchments.find(c => c.catchment_id == catchmentID).service_provider;  
    }

    const handleResumeDownload = (applicantID, submissionID) => async () => {
      await fetch(FORM_URL.Submissions + "/" + submissionID + "/applications/" + applicantID + "/downloadResume", {
        headers: {
          "Authorization": "Bearer " + keycloak.token
        }
      })
      .then(async (response) => await response.json())
      .then((data) => {
        const blob = b64toBlob(data.buffer, "application/pdf");

        // Create link to blob
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute(
          "download",
          data.fileName,
        );
    
        // Append to html link element page
        document.body.appendChild(link);
    
        // Start download
        link.click();
    
        // Clean up and remove the link
        link.parentNode.removeChild(link);
      });
    }

    const handleCheckboxChange = (event, clientApplicationID) => {
      if (event.target.checked){
        checkedClients.push(clientApplicationID);
      }
      else{
        checkedClients.splice(checkedClients.indexOf(clientApplicationID));
      }
    }

    const handleApproveSelectedClicked = () => async () => {
      await fetch(FORM_URL.Submissions + "/setClientsToApproved", {
        method: "POST",
        credentials: 'include',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            "Authorization": "Bearer " + keycloak.token
        },
        body: JSON.stringify(checkedClients) // send all checked rows
      })
      .then(() => {
        setCheckedClients([]);
        setForceUpdate(forceUpdate + 1); // force re-render
      })
      .catch(err => {
        console.log(err);
      });
    }

    const handleFlagSelectedClicked = () => async () => {
      await fetch(FORM_URL.Submissions + "/setClientsToFlagged", {
        method: "POST",
        credentials: 'include',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            "Authorization": "Bearer " + keycloak.token
        },
        body: JSON.stringify(checkedClients) // send all checked rows
      })
      .then(() => {
        setCheckedClients([]);
        setForceUpdate(forceUpdate + 1); // force re-render
      })
      .catch(err => {
        console.log(err);
      });
    }

    const handleApproveButtonClicked = (clientID) => async () => {
      await fetch(FORM_URL.Submissions + "/setClientsToApproved", {
        method: "POST",
        credentials: 'include',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            "Authorization": "Bearer " + keycloak.token
        },
        body: JSON.stringify([clientID]) // send client ID
      })
      .then(() => {
        setForceUpdate(forceUpdate + 1); // force re-render
      })
      .catch(err => {
        console.log(err);
      });
    }

    const handleFlagButtonClicked = (clientID) => async () => {
      await fetch(FORM_URL.Submissions + "/setClientsToFlagged", {
        method: "POST",
        credentials: 'include',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            "Authorization": "Bearer " + keycloak.token
        },
        body: JSON.stringify([clientID]) // send client ID
      })
      .then(() => {
        setForceUpdate(forceUpdate + 1); // force re-render
      })
      .catch(err => {
        console.log(err);
      });
    }

    const handleBundleClicked = () => () => {
      history.push({
        pathname: '/bundle',
        props: { 
          submissions: referrals,
          jobOrder: jobOrder
        }
      });
    }

    const handleUpdateReferralsToDisplay = () => {

    }

    const ReferralTable = () => {

        return (
            <TableContainer>
              <Table className={classes.table}>
                <TableHead className={classes.tableHeader}>
                  <TableRow>
                    <TableCell style={{width: "5%"}}></TableCell>
                    <TableCell style={{fontWeight: "bold"}}>Service Provider</TableCell>
                    <TableCell style={{fontWeight: "bold"}}>Catchment</TableCell>
                    <TableCell style={{fontWeight: "bold"}}>Centre</TableCell>
                    <TableCell style={{fontWeight: "bold"}}>Submissions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  { referralsToDisplay && (
                    referralsToDisplay?.map(referral => (
                      <ReferralRow 
                        referral={referral}>
                      </ReferralRow>
                    ))                
                  )}
                </TableBody>
              </Table>
            </TableContainer>
        );
      }

      const ReferralRow = (props) => {
        const [open, setOpen] = React.useState(false);

        return (
          <React.Fragment>
            <TableRow>
                <TableCell className={classes.noBorder}>
                  <IconButton aria-label="expand row" size="small" onClick={() => {
                    setOpen(!open)
                    handleRowToggle(props.referral.submissionID)}
                  }>
                    {open || openRows.indexOf(props.referral.submissionID) !== -1 ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                  </IconButton>
                </TableCell>
                <TableCell component="th" scope="row" className={classes.noBorder}>
                    {GetServiceProvider(props.referral.catchmentID)}
                </TableCell>
                <TableCell component="th" scope="row" className={classes.noBorder}>
                    {catchments.find(c => c.catchment_id == props.referral.catchmentID).name}
                </TableCell>
                <TableCell component="th" scope="row" className={classes.noBorder}>
                    {centres.find(c => c.centre_id == props.referral.centreID).name}
                </TableCell>
                <TableCell component="th" scope="row" className={classes.noBorder}>
                    {props.referral.applicants.length}
                </TableCell>
            </TableRow>
            <TableRow>
              <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                <Collapse in={open || openRows.indexOf(props.referral.submissionID) !== -1} timeout="auto">
                  <ApplicantTable applicants={props.referral.applicants} submission={props.referral}/>
                </Collapse>
              </TableCell>
            </TableRow>
          </React.Fragment>
        );
      }

      const ApplicantTable = (props) => {
        return (
            <TableContainer className={"mb-2"}>
              <Table className={classes.table} aria-label="simple table">
                <TableHead className={classes.tableHeader}>
                  <TableRow>
                    <TableCell></TableCell> {/* empty column for checkbox */}
                    <TableCell style={{fontWeight: "bold"}}>ID</TableCell>
                    <TableCell style={{fontWeight: "bold"}} align="left">Client Name</TableCell>
                    <TableCell style={{fontWeight: "bold"}} align="left">Client Case #</TableCell>
                    <TableCell style={{fontWeight: "bold"}} align="left">Submitted</TableCell>
                    <TableCell style={{fontWeight: "bold"}} align="left">Resume</TableCell>
                    <TableCell style={{fontWeight: "bold"}} align="left">Actions</TableCell>
                    <TableCell style={{fontWeight: "bold"}} align="left">Notify</TableCell>
                    <TableCell style={{fontWeight: "bold"}} align="left">Bundled</TableCell>
                    <TableCell style={{fontWeight: "bold"}} align="left">Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  { props.applicants && (
                    props.applicants?.map(a => (
                      <ApplicantRow 
                        applicant={a}
                        submission={props.submission}
                      />
                    ))                
                  )}
                </TableBody>
              </Table>
            </TableContainer>
        );
      }
    
      const ApplicantRow = ({ applicant, submission }) => {
        return (
          <TableRow>
            <TableCell padding="checkbox">
              <Checkbox
                onChange={event => handleCheckboxChange(event, applicant.clientApplicationID)}
              />
            </TableCell>
            <TableCell component="th" scope="applicant">
                {applicant.clientApplicationID}
            </TableCell>
            <TableCell align="left">{applicant.clientName}</TableCell>
            <TableCell align="left">{applicant.clientCaseNumber}</TableCell>
            <TableCell align="left">{submission.createdDate.substring(0, 10)}</TableCell> {/* substring to remove timestamp */}
            <TableCell align="left">
              <button 
                type="button" 
                class="btn btn-link" 
                onClick={handleResumeDownload(applicant.clientApplicationID, submission.submissionID)}>
                  View 
                </button>
            </TableCell>
            <TableCell className="flex-row">
              <button className="btn btn-primary btn-sm" type="button">
                  <EditIcon style={{color: "white"}}></EditIcon>
              </button>
              <button className="btn btn-primary btn-sm" type="button"> 
                  <VisibilityIcon style={{color: "white"}}></VisibilityIcon> 
              </button>
              <button className="btn btn-primary btn-sm" type="button" onClick={handleFlagButtonClicked(applicant.clientApplicationID)}>
                  <FlagIcon style={{color: "white"}}></FlagIcon>
              </button>
              <button className="btn btn-primary btn-sm" type="button" onClick={handleApproveButtonClicked(applicant.clientApplicationID)}>
                  <CheckIcon style={{color: "white"}}></CheckIcon>
              </button>
            </TableCell>
            <TableCell align="left">
              <button 
                type="button" 
                class="btn btn-secondary">
                  Notify
                </button>
            </TableCell>
            <TableCell align="left">{applicant.bundled ? "Yes" : "No"}</TableCell>
            <TableCell align="left">{applicant.status}</TableCell>
          </TableRow>
        );
      }


    return(
        <div className="container">
          {jobOrder && catchments && centres &&
            <div>
              <div className="row">
                  <div className="col-md-12">
                      <h1>Resume Bundler - Reviewing Referral for Job {jobOrder.id}</h1>   
                  </div>
              </div>
              <div className="row">
                  <div className="column" style= {{ textAlign: "left", marginLeft: "7px", marginRight: "20px" }}>
                      <div>
                          <b>Job ID:</b> {jobOrder.id}
                      </div>
                      <div>
                          <b>Employer:</b> {jobOrder.employer}
                      </div>
                      <div>
                          <b>Position:</b> {jobOrder.position}
                      </div>
                      <div>
                          <b>Created:</b> {jobOrder.created}
                      </div>
                      <div>
                          <b>Deadline:</b> {jobOrder.deadline}
                      </div>
                  </div>
                  <div className="column" style= {{ textAlign: "left", marginRight: "7px", marginLeft: "20px" }}>
                      <div>
                          <b>Location:</b> {jobOrder.location}
                      </div>
                      <div>
                          <b>Referrals:</b> {referrals.length}
                      </div>
                      <div>
                          <b>Last Edit:</b> {jobOrder.lastEdit ? jobOrder.lastEdit : "N/A"}
                      </div>
                      <div>
                          <b>Edited By:</b> {jobOrder.editedBy ? jobOrder.editedBy : "N/A"}
                      </div>
                      { jobOrder.catchments.length <= MAX_CATCHMENTS && 
                        <div>
                          <b>Catchments:</b> { DisplayCatchments(jobOrder.catchments.map(c => c.key)) }
                        </div>
                      }
                      { jobOrder.catchments.length == catchments.length && 
                        <div>
                          <b>Catchments:</b> All
                        </div>
                      }
                  </div>
              </div>
              { jobOrder.catchments.length > MAX_CATCHMENTS && jobOrder.catchments.length != catchments.length && // Put catchments in a separate row if there's more than 4 of them
                  <div className="row mt-2">
                    <b>Catchments:</b> { DisplayCatchments(jobOrder.catchments.map(c => c.key)) }
                  </div>
              }
              <div className="row">
                  <div className="col-md-12 mt-3"> 
                      <SearchBar
                          handleUpdate={handleUpdateReferralsToDisplay}
                          paginationCount={referralsToDisplay.length}
                          label={"Find Referral"}
                      />
                      <ReferralTable/>
                      <div className="d-flex row justify-content-end mt-5">
                        <button className="btn btn-success mr-5" onClick={handleFlagSelectedClicked()}>
                          Flag Selected
                        </button>
                        <button className="btn btn-success mr-5" onClick={handleApproveSelectedClicked()}>
                          Approve Selected
                        </button>
                        <button className="btn btn-success mr-5" onClick={handleBundleClicked()}>
                          Bundle/Send Approved
                        </button>
                      </div>
                  </div>
              </div>
            </div>
          }
          {!jobOrder && 
            <h2>
              Error loading page. Please go back to the job orders screen and re-select the job order you wish to review.
            </h2>
          }
        </div>
    );
}

export default ReviewReferral