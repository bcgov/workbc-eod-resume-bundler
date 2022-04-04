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
import { useKeycloak } from '@react-keycloak/web';
import CircularProgress from '@material-ui/core/CircularProgress';

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
  const { keycloak, initialized } = useKeycloak();

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
  const [jobOrdersToDisplay, setJobOrdersToDisplay] = useState([]);
  const [jobOrdersLoaded, setJobOrdersLoaded] = useState(false);
  const [employers, setEmployers] = useState([]);
  const [employersToDisplay, setEmployersToDisplay] = useState([]);
  const [catchments, setCatchments] = useState([]);
  const [userCatchments, setUserCatchments] = useState([]);

  const handleUpdateEmployersToDisplay = (searchString) => {
    // Search for employer name, job order location, and job order position //
    const searchTerm = searchString.toLowerCase();
    setEmployersToDisplay(employers.filter(emp => 
      {
        let includedEmployers = [];
        let jobsToDisplay = [];
        jobOrders.forEach(jo => {
          if (jo.location.toLowerCase().startsWith(searchTerm) 
              || jo.position.toLowerCase().startsWith(searchTerm)
              || jo.employer.toLowerCase().startsWith(searchTerm)
          ) {
            jobsToDisplay.push(jo);
            if (!includedEmployers.find(e => e.employer === jo.employer)) // ensure uniqueness
              includedEmployers.push(jo.employer)
          }
        });
        setJobOrdersToDisplay(jobsToDisplay);
        return includedEmployers.includes(emp.employer);
      }
    ));
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
    if (initialized && keycloak.tokenParsed) {
      await getUserCatchments();
    }

    async function getUserCatchments() {
      let response = await fetch(FORM_URL.System + "/UserPermissions", {
          method: "GET",
          credentials: 'include',
          headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
              'KeycloakToken': keycloak.token,
              'UserGUID': keycloak.tokenParsed.smgov_userguid,
              'Authorization': "Bearer " + keycloak.token
          }
      });

      let permissions = await response.json();
      setUserCatchments(permissions.catchments);
    }

  }, [initialized]);

  useEffect(async () => {
    if (userCatchments.length > 0 && initialized) { // only fetch job orders & catchments once user catchments have been fetched (dependance)
      await getJobOrders();
      await getCatchments();
    }

    async function getJobOrders() {
      const response = await fetch(FORM_URL.JobOrders, {
        headers: {
          "Authorization": "Bearer " + keycloak.token
        }
      });

      const data = await response.json();
      let jobOrders = data.jobs;
      jobOrders = jobOrders.filter(j => j.status.toLowerCase() !== "closed" && j.status.toLowerCase() !== "upcoming"); // filter out closed and upcoming job orders
      jobOrders = jobOrders.filter(j => j.catchments.some(c => userCatchments.indexOf(parseInt(c)) > -1)); // filter for jobs in catchments the user has access to
      setJobOrders(jobOrders);
      setJobOrdersToDisplay(jobOrders);
      setJobEmployers(jobOrders);
      setJobOrdersLoaded(true);
    }

    function setJobEmployers(jobOrders) {
      let uniqueEmployers = [];
      jobOrders.map(jo => {
        let alreadyExists = uniqueEmployers.find(e => e.employer == jo.employer);
        if (!alreadyExists)
          uniqueEmployers.push(jo);
      });
      setEmployers(uniqueEmployers);
      setEmployersToDisplay(uniqueEmployers);
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
  }, [userCatchments]);

  const getJobOrdersForEmployer = (employer) => {
    return jobOrdersToDisplay.filter(jo => jo.employer === employer);
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
                                jobTitle: jobOrder.position,
                                userCatchments: userCatchments
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
        handleClose={handleViewClose}
        token={keycloak.token}>
      </ViewJobOrderModal>
    </React.Fragment>
    );
  }

  return (
    <div className="container ml-3 mt-5">
        <div className="row">
            <div className="col-md-12">
              <h1>Resume Bundler - Available Job Orders</h1>  
              <p>Available job orders are listed below. 
                Click on the arrow beside an employer’s name to 
                expand the list of job orders for this employer. 
                To submit client resumes to a job order, please 
                click on ‘Submit’.
              </p>  
              <p>Use the search box below to search jobs by employer name,
                 position title or location.
              </p>
              {(jobOrdersLoaded && catchments.length > 0) && 
                <div>
                  <SearchBar
                    handleUpdate={handleUpdateEmployersToDisplay}
                    paginationCount={employersToDisplay.length}
                    label={"Search Jobs"}>
                  </SearchBar>         
                  <EmployerTable />
                </div>
              }

              {(!jobOrdersLoaded || catchments.length == 0) && // show spinner while fetching data
                <CircularProgress />
              }
            </div>
        </div>
    </div>
  );
}

export default ViewJobOrders

// Helper functions //
var contains = function(needle) {
  // Per spec, the way to identify NaN is that it is not equal to itself
  var findNaN = needle !== needle;
  var indexOf;

  if(!findNaN && typeof Array.prototype.indexOf === 'function') {
      indexOf = Array.prototype.indexOf;
  } else {
      indexOf = function(needle) {
          var i = -1, index = -1;

          for(i = 0; i < this.length; i++) {
              var item = this[i];

              if((findNaN && item !== item) || item === needle) {
                  index = i;
                  break;
              }
          }

          return index;
      };
  }

  return indexOf.call(this, needle) > -1;
};