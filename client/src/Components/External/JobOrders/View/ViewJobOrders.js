import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { FORM_URL } from '../../../../constants/form';
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
import SearchBar from '../../../../utils/SearchBar';
import ViewJobOrderModal from './ViewJobOrderModal';

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

function ViewJobOrders() {
  const classes = useStyles();
  const history = useHistory();

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

  const [jobOrders, setJobOrders] = useState([]);
  const [employers, setEmployers] = useState([]);
  const [employersToDisplay, setEmployersToDisplay] = useState([]);
  const [catchments, setCatchments] = useState([]);

  const handleUpdateEmployersToDisplay = (searchString) => {
    setEmployersToDisplay(employers.filter(e => e.location.toLowerCase().startsWith(searchString.toLowerCase())));
  }

  const [showView, setShowView] = useState({});
  const handleViewClose = jobID => () => {
    setShowView(showView => ({
      ...showView,
      [jobID] : false}))
  }
  const handleViewShow = jobID => () => {
    setShowView(showView => ({
      ...showView,
      [jobID] : true}));
  }

  useEffect(async () => {
    await getJobOrders();
    await getCatchments();

    async function getJobOrders() {
      const response = await fetch(FORM_URL.JobOrders);
      const data = await response.json();
      const jobOrders = data.jobs;
      setJobOrders(jobOrders);
      setJobEmployers(jobOrders);
    }

    function setJobEmployers(jobOrders) {
      let uniqueEmployers = [];
      jobOrders.map(jo => {
        let alreadyExists = uniqueEmployers.find(e => e == jo.employer);
        if (!alreadyExists)
          uniqueEmployers.push(jo);
      });
      setEmployers(uniqueEmployers);
      setEmployersToDisplay(uniqueEmployers);
    }

    async function getCatchments() {
      const response = await fetch(FORM_URL.System + "/Catchments");
      const data = await response.json();
      setCatchments(data);
    }

  }, [setJobOrders, setCatchments]);

  const getJobOrdersForEmployer = (employer) => {
    return jobOrders.filter(jo => jo.employer == employer);
  }

  const EmployerTable = () => {
    return (
        <TableContainer>
          <Table className={classes.table}>
            <TableHead className={classes.tableHeader}>
              <TableRow>
                <TableCell style={{width: "5%"}}></TableCell>
                <TableCell style={{fontWeight: "bold"}}>Employer</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              { employersToDisplay && (
                employersToDisplay?.map(employer => (
                  <EmployerRow 
                    employer={employer.employer}>
                  </EmployerRow>
                ))                
              )}
            </TableBody>
          </Table>
        </TableContainer>
    );
  }

  const EmployerRow = (props) => {
    const [open, setOpen] = React.useState(false);
    return (
    <React.Fragment>
      <TableRow style={{ backgroundColor: 'rgba(0,0,0,0.05)' }}>
          <TableCell className={classes.noBorder}>
            <IconButton aria-label="expand row" size="small" onClick={() => {
                setOpen(!open)
                handleRowToggle(props.employer)}
              }>
                {open || openRows.indexOf(props.employer) !== -1 ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </IconButton>
          </TableCell>
          <TableCell component="th" scope="row" className={classes.noBorder}>
              {props.employer}
          </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open || openRows.indexOf(props.employer) !== -1} timeout="auto" unmountOnExit>
            <JobTable jobOrders={getJobOrdersForEmployer(props.employer)}></JobTable>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
    );
  }

  const JobTable = (props) => {
    return (
        <TableContainer className={"mb-2"}>
          <Table className={classes.table} aria-label="simple table">
            <TableHead className={classes.tableHeader}>
              <TableRow>
                <TableCell style={{fontWeight: "bold"}}>Job ID</TableCell>
                <TableCell style={{fontWeight: "bold"}} align="left">Position</TableCell>
                <TableCell style={{fontWeight: "bold"}} align="left">Location</TableCell>
                <TableCell style={{fontWeight: "bold"}} align="left">Open Date</TableCell>
                <TableCell style={{fontWeight: "bold"}} align="left">Deadline</TableCell>
                <TableCell style={{fontWeight: "bold"}} align="left">Vacancies</TableCell>
                <TableCell style={{fontWeight: "bold"}} align="center">View</TableCell>
                <TableCell style={{fontWeight: "bold"}} align="center">Apply</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              { props.jobOrders && (
                props.jobOrders?.map(jobOrder => (
                  <JobRow jobOrder={jobOrder} />
                ))                
              )}
            </TableBody>
          </Table>
        </TableContainer>
    );
  }

  const JobRow = ({jobOrder}) => {
    return (
    <React.Fragment>
      <TableRow>
          <TableCell component="th" scope="row">
              {jobOrder.job_id}
          </TableCell>
          <TableCell align="left">{jobOrder.position}</TableCell>
          <TableCell align="left">{jobOrder.location}</TableCell>
          <TableCell align="left">{jobOrder.start_date.substring(0, 10)}</TableCell>
          <TableCell align="left">{jobOrder.deadline.substring(0, 10)}</TableCell>
          <TableCell align="left">{jobOrder.vacancies}</TableCell>
          <TableCell align="center">
              <button className="btn btn-primary btn-sm" type="button" onClick={handleViewShow(jobOrder.job_id)}> 
                  <VisibilityIcon style={{color: "white"}}></VisibilityIcon> 
              </button>
          </TableCell>
          <TableCell align="right">
              <div className="cold-md-6">
                  <a
                      type="button"
                      className="btn btn-block"
                      style={{ backgroundColor: "grey", color: "white"}}
                      onClick={() => history.push({
                                pathname: "/submitToJobOrder",
                                jobID: jobOrder.job_id,
                                employer: jobOrder.employer,
                                jobTitle: jobOrder.position
                              })}>
                  Submit
                  </a>
              </div>
          </TableCell>
      </TableRow>
      <ViewJobOrderModal 
        jobOrder={jobOrder} 
        catchments={catchments}
        show={showView} 
        handleClose={handleViewClose}>
      </ViewJobOrderModal>
    </React.Fragment>
    );
  }

  return (
    <div className="container">
        <div className="row">
            <div className="col-md-12">
              <h1>Resume Bundler - Available Job Orders</h1>  
              <p>View available job orders and submit resumes</p>  
              <SearchBar
                handleUpdate={handleUpdateEmployersToDisplay}
                paginationCount={employersToDisplay.length}
                label={"Search Jobs"}
              ></SearchBar>
              <EmployerTable></EmployerTable>
            </div>
        </div>
    </div>
  );
}

export default ViewJobOrders