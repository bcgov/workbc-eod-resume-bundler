import React, { useState, useEffect } from 'react';
import { FORM_URL } from '../../../constants/form';
import { makeStyles } from '@material-ui/core/styles';
import VisibilityIcon from '@material-ui/icons/Visibility';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';
import Collapse from '@material-ui/core/Collapse';
import SearchBar from '../../../utils/SearchBar';
import ViewClientModal from './ViewClientModal';
import EditClientModal from './EditClientModal';

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

function ViewSubmissions() {
  const classes = useStyles();

  const [forceUpdate, setForceUpdate] = useState(0);
  const [catchments, setCatchments] = useState([]);
  const [centres, setCentres] = useState([]);
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

  const [submissions, setSubmissions] = useState([[]]);
  const [submissionsToDisplay, setSubmissionsToDisplay] = useState([]);
  const handleUpdateSubmissionsToDisplay = (searchString) => {
    setSubmissionsToDisplay(submissions.filter(s => s.jobOrderInfo.employer.toLowerCase().startsWith(searchString.toLowerCase())));
  }

  const [showView, setShowView] = useState({});
  const handleViewClose = clientID => () => {
    setShowView(showView => ({
      ...showView,
      [clientID] : false}))
  }
  const handleViewShow = clientID => () => {
    setShowView(showView => ({
      ...showView,
      [clientID] : true}));
  }

  const [showEdit, setShowEdit] = useState({});
  const handleEditClose = clientID => () => {
    setShowEdit(showEdit => ({
      ...showEdit,
      [clientID] : false}))
  }
  const handleEditShow = clientID => () => {
    setShowEdit(showEdit => ({
      ...showEdit,
      [clientID] : true}));
  }

  const handleResumeDownload = (applicantID, submissionID) => async () => {
    await fetch(FORM_URL.Submissions + "/" + submissionID + "/applications/" + applicantID + "/downloadResume")
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

  const handleViewSubmission = (submission, applicant) => {

  }

  useEffect(async () => {
    await getSubmissions();
    await getCatchments();
    await getCentres();

    async function getSubmissions() {
      const response = await fetch(FORM_URL.Submissions);
      const data = await response.json();
      const submissions = data.submissions.sort((a,b) => a.catchmentID > b.catchmentID ? 1 : -1);
      submissions.forEach(s => {
        s.applicants.sort((a,b) => a.clientApplicationID > b.clientApplicationID ? 1 : -1);       
      });
      setSubmissions(submissions);
      setSubmissionsToDisplay(submissions);
    }

    async function getCatchments() {
      const response = await fetch(FORM_URL.System + "/Catchments");
      const data = await response.json();
      setCatchments(data);
    }

    async function getCentres() {
      const response = await fetch(FORM_URL.System + "/Centres");
      const data = await response.json();
      setCentres(data);
    }
  }, [setSubmissions, setCatchments, setCentres, forceUpdate]);



  const SubmissionTable = () => {
    return (
        <TableContainer>
          <Table className={classes.table}>
            <TableHead className={classes.tableHeader}>
              <TableRow>
                <TableCell style={{width: "5%"}}></TableCell>
                <TableCell style={{fontWeight: "bold"}}>Submission ID</TableCell>
                <TableCell style={{fontWeight: "bold"}}>Job Order ID</TableCell>
                <TableCell style={{fontWeight: "bold"}}>Employer</TableCell>
                <TableCell style={{fontWeight: "bold"}}>Position Title</TableCell>
                <TableCell style={{fontWeight: "bold"}}>Location</TableCell>
                <TableCell style={{fontWeight: "bold"}}>Submitted</TableCell>
                <TableCell style={{fontWeight: "bold"}}>Candidates</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              { submissionsToDisplay && (
                submissionsToDisplay?.map(submission => (
                  <SubmissionRow submission={submission} />
                ))                
              )}
            </TableBody>
          </Table>
        </TableContainer>
    );
  }

  const SubmissionRow = (props) => {
    const [open, setOpen] = React.useState(false);

    return (
      <React.Fragment>
        <TableRow style={{ backgroundColor: 'rgba(0,0,0,0.05)' }}>
            <TableCell className={classes.noBorder}>
              <IconButton aria-label="expand row" size="small" onClick={() => {
                setOpen(!open)
                handleRowToggle(props.submission.submissionID)}
              }>
                {open || openRows.indexOf(props.submission.submissionID) !== -1 ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
              </IconButton>
            </TableCell>
            <TableCell component="th" scope="row" className={classes.noBorder}>
                {props.submission.submissionID}
            </TableCell>
            <TableCell component="th" scope="row" className={classes.noBorder}>
                {props.submission.jobID}
            </TableCell>
            <TableCell component="th" scope="row" className={classes.noBorder}>
                {props.submission.jobOrderInfo.employer}
            </TableCell>
            <TableCell component="th" scope="row" className={classes.noBorder}>
                {props.submission.jobOrderInfo.position}
            </TableCell>
            <TableCell component="th" scope="row" className={classes.noBorder}>
                {props.submission.jobOrderInfo.location}
            </TableCell>
            <TableCell component="th" scope="row" className={classes.noBorder}>
                {props.submission.createdDate.substring(0, 10)}
            </TableCell>
            <TableCell component="th" scope="row" className={classes.noBorder}>
                {props.submission.applicants.length}
            </TableCell>
        </TableRow>
        <TableRow>
          <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
            <Collapse in={open || openRows.indexOf(props.submission.submissionID) !== -1} timeout="auto" unmountOnExit>
              <ApplicantTable applicants={props.submission.applicants} submission={props.submission}/>
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
                <TableCell style={{fontWeight: "bold"}}>Client Case #</TableCell>
                <TableCell style={{fontWeight: "bold"}} align="left">Client Name</TableCell>
                <TableCell style={{fontWeight: "bold"}} align="left">Resume</TableCell>
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
      <React.Fragment>
        <TableRow>
          <TableCell component="th" scope="applicant">
              {applicant.clientCaseNumber}
          </TableCell>
          <TableCell align="left">{applicant.clientName}</TableCell>
          <TableCell align="left">
            <button 
              type="button" 
              className="btn btn-link" 
              onClick={handleResumeDownload(applicant.clientApplicationID, submission.submissionID)}>
                View 
              </button>
          </TableCell>
          <TableCell align="left">{applicant.status}</TableCell>
          <TableCell className="flex-row">
            <button className="btn btn-primary btn-sm" type="button" onClick={handleViewShow(applicant.clientApplicationID)}> 
                <VisibilityIcon style={{color: "white"}}></VisibilityIcon> 
            </button>
            <button className="btn btn-primary btn-sm" type="button" onClick={handleEditShow(applicant.clientApplicationID)}>
                <EditIcon style={{color: "white"}}></EditIcon>
            </button>
          </TableCell>
        </TableRow>
        <ViewClientModal 
          submission={submission} 
          applicant={applicant}
          show={showView} 
          handleClose={handleViewClose}>
        </ViewClientModal>
        <EditClientModal 
          submission={submission} 
          applicant={applicant}
          catchments={catchments}
          centres={centres}
          show={showEdit} 
          handleClose={handleEditClose}
          forceUpdate={forceUpdate}
          setForceUpdate={setForceUpdate}>
        </EditClientModal>
      </React.Fragment>
    );
  }

  return (
    <div className="container">
      {submissions && catchments && centres &&
        <div className="row">
            <div className="col-md-12">
              <h1>Resume Bundler - My Submissions</h1>  
              <p>View submitted candidates to job orders</p>  
              <SearchBar
                handleUpdate={handleUpdateSubmissionsToDisplay}
                paginationCount={submissionsToDisplay.length}
                label={"Find Submissions"}
              />
              <SubmissionTable/>
            </div>
        </div>
      }
      {(!submissions || !catchments || !centres) && 
        <h2>
          Error loading page. Please go back and re-select the job order you wish to submit to.
        </h2>
      }
    </div>
  )
}

export default ViewSubmissions;