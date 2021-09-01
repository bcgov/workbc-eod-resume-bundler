import React, { useState, useEffect } from 'react';
import { FORM_URL } from '../../constants/form';
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
import Collapse from '@material-ui/core/Collapse';
import SearchBar from '../../utils/SearchBar';

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

function ViewSubmissions() {
  const classes = useStyles();

  const [submissions, setSubmissions] = useState([[]]);
  const [submissionsToDisplay, setSubmissionsToDisplay] = useState([]);

  const handleUpdateSubmissionsToDisplay = (searchString) => {
    setSubmissionsToDisplay(submissions.filter(s => s.jobOrderInfo.employer.toLowerCase().startsWith(searchString.toLowerCase())));
  }

  useEffect(async () => {
    await getSubmissions();

    async function getSubmissions() {
      const response = await fetch(FORM_URL.Submissions);
      const data = await response.json();
      const submissions = data.submissions;
      setSubmissions(submissions);
      setSubmissionsToDisplay(submissions);
    }
  }, [setSubmissions]);
  
  const ActionIcons = (props) => {
      let viewIcon =  <button className="btn btn-primary btn-sm" type="button"> 
                          <VisibilityIcon style={{color: "white"}}></VisibilityIcon> 
                      </button>
      
      return viewIcon;
  }

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
                  <SubmissionRow 
                    submission={submission}>
                  </SubmissionRow>
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
        <TableRow>
            <TableCell className={classes.noBorder}>
              <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
                {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
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
                {props.submission.createdDate}
            </TableCell>
            <TableCell component="th" scope="row" className={classes.noBorder}>
                {props.submission.applicants.length}
            </TableCell>
        </TableRow>
        <TableRow>
          <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
            <Collapse in={open} timeout="auto" unmountOnExit>
              <ApplicantTable applicants={props.submission.applicants} />
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
                  />
                ))                
              )}
            </TableBody>
          </Table>
        </TableContainer>
    );
  }

  const ApplicantRow = ({ applicant }) => {
    return (
    <TableRow>
        <TableCell component="th" scope="applicant">
            {applicant.clientCaseNumber}
        </TableCell>
        <TableCell align="left">{applicant.clientName}</TableCell>
        <TableCell align="left"></TableCell>
        <TableCell align="left">{applicant.status}</TableCell>
        <TableCell align="center">
            <button className="btn btn-primary btn-sm" type="button"> 
                <VisibilityIcon style={{color: "white"}}></VisibilityIcon> 
            </button>
        </TableCell>
    </TableRow>
    );
  }

  return (
    <div className="container">
        <div className="row">
            <div className="col-md-12">
              <h1>EOD Resume Bundler - My Submissions</h1>  
              <p>View submitted candidates to job orders</p>  
              <SearchBar
                handleUpdate={handleUpdateSubmissionsToDisplay}
                paginationCount={submissions.length}
                label={"Find Submissions"}
              />
              <SubmissionTable/>
            </div>
        </div>
    </div>
  )
}

export default ViewSubmissions;