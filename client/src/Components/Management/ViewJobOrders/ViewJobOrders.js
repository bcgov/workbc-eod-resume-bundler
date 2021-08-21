import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { FORM_URL } from '../../../constants/form';
import { makeStyles } from '@material-ui/core/styles';
import VisibilityIcon from '@material-ui/icons/Visibility';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import IconButton from '@material-ui/core/IconButton';
import Collapse from '@material-ui/core/Collapse';
import { TextField } from '@material-ui/core';
import { TablePagination } from '@material-ui/core';

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
    borderRightWidth: 1,
    borderLeftWidth: 1,
    borderColor: 'black',
    borderStyle: 'solid'
  },
  searchBox: {
    height: 100,
    width: 300
  }
}));

function ViewJobOrders() {
  let history = useHistory();
  const classes = useStyles();

  const [jobOrders, setJobOrders] = useState([]);
  const [employers, setEmployers] = useState([]);

  useEffect(async () => {
    await getJobOrders();

    async function getJobOrders() {
      const response = await fetch(FORM_URL.JobOrders);
      const data = await response.json();
      const jobOrders = data.result.rows;
      setJobOrders(jobOrders);
      setJobEmployers(jobOrders);
    }

    function setJobEmployers(jobOrders) {
      let uniqueEmployers = [];
      jobOrders.map(jo => {
        let alreadyExists = uniqueEmployers.find(e => e == jo.employer);
        if (!alreadyExists)
          uniqueEmployers.push(jo.employer);
      });
      setEmployers(uniqueEmployers);
    }

  }, [setJobOrders]);



  const createJobData = (id, position, location, openDate, deadline, vacancies) => {
      return {
          id,
          position,
          location,
          openDate,
          deadline,
          vacancies
      };
  }

  //#region UI FUNCTIONS
  const ActionIcons = (props) => {
      let viewIcon =  <button className="btn btn-primary btn-sm" type="button"> 
                          <VisibilityIcon style={{color: "white"}}></VisibilityIcon> 
                      </button>
      
      return viewIcon;
  }

  const DisplayCatchments = (catchments) => {
    return catchments.map(c => parseInt(c.substring(2)).toString()).join(", "); // TODO: currently throws a warning regarding keys for lists
  }

  const JobSearchBar = (props) => {
    return (
    <React.Fragment>
      <div className="column">
        <b>Find jobs</b>
        <div className="row justify-content-between">
          <TextField style={{float:"left"}} size="small" id="outlined-basic" variant="outlined" placeholder="..." />
          <TablePagination
            style={{float:"right"}}
            component="div"
            count={jobOrders.length}
            page={0}
            onPageChange={console.log("page change!")}
            rowsPerPage={20}
            rowsPerPageOptions={[]}
          />
        </div>
      </div>
    </React.Fragment>
    );
  }

  const getJobOrdersForEmployer = (employer) => {
    return jobOrders.filter(jo => jo.employer == employer);
  }

  const EmployerRow = (props) => {
    const [open, setOpen] = React.useState(false);
    return (
    <React.Fragment>
      <TableRow>
          <TableCell>
            <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
              {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </IconButton>
          </TableCell>
          <TableCell component="th" scope="row">
              {props.employer}
          </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <JobTable jobOrders={getJobOrdersForEmployer(props.employer)}></JobTable>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
    );
  }

  const JobRow = (props) => {
    const { row } = props;
    const [open, setOpen] = React.useState(false);
  
    return (
    <TableRow>
        <TableCell component="th" scope="row">
            {row.id}
        </TableCell>
        <TableCell align="left">{row.position}</TableCell>
        <TableCell align="left">{row.location}</TableCell>
        <TableCell align="left">{row.openDate}</TableCell>
        <TableCell align="left">{row.deadline}</TableCell>
        <TableCell align="left">{row.vacancies}</TableCell>
        <TableCell>
            <button className="btn btn-primary btn-sm" type="button"> 
                <VisibilityIcon style={{color: "white"}}></VisibilityIcon> 
            </button>
        </TableCell>
        <TableCell align="right">
            <div className="cold-md-6">
                <a
                    type="button"
                    className="btn btn-block"
                    style={{ backgroundColor: "grey", color: "white"}}>
                Submit
                </a>
            </div>
        </TableCell>
    </TableRow>
    );
  }
  
  const JobTable = (props) => {
    return (
        <TableContainer component={Paper}>
          <Table className={classes.table} aria-label="simple table">
            <TableHead className={classes.tableHeader}>
              <TableRow>
                <TableCell style={{fontWeight: "bold"}}>Job ID</TableCell>
                <TableCell style={{fontWeight: "bold"}} align="left">Position</TableCell>
                <TableCell style={{fontWeight: "bold"}} align="left">Location</TableCell>
                <TableCell style={{fontWeight: "bold"}} align="left">Open Date</TableCell>
                <TableCell style={{fontWeight: "bold"}} align="left">Deadline</TableCell>
                <TableCell style={{fontWeight: "bold"}} align="left">Vacancies</TableCell>
                <TableCell style={{fontWeight: "bold"}} align="left">View</TableCell>
                <TableCell style={{fontWeight: "bold"}} align="center">Apply</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              { props.jobOrders && (
                props.jobOrders?.map(jobOrder => (
                  <JobRow 
                    key={jobOrder.job_id} 
                    row={createJobData(
                      jobOrder.job_id,
                      jobOrder.position,
                      jobOrder.location,
                      jobOrder.start_date.substring(0, 10),
                      jobOrder.deadline.substring(0, 10),
                      0, //TODO: Vacancies
                      )}>
                  </JobRow>
                ))                
              )}
            </TableBody>
          </Table>
        </TableContainer>
    );
  }

  const EmployerTable = () => {
    return (
        <TableContainer component={Paper}>
          <Table className={classes.table} aria-label="simple table">
            <TableHead className={classes.tableHeader}>
              <TableRow>
                <TableCell style={{width: "5%"}}></TableCell>
                <TableCell style={{fontWeight: "bold"}}>Employer</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              { employers && (
                employers?.map(employer => (
                  <EmployerRow 
                    employer={employer}>
                  </EmployerRow>
                ))                
              )}
            </TableBody>
          </Table>
        </TableContainer>
    );
  }
  //#endregion

  return (
    <div className="container">
        <div className="row">
            <div className="col-md-12">
              <h1>EOD Resume Bundler - Available Job Orders</h1>  
              <p>View available job orders and submit resumes</p>  
              <JobSearchBar></JobSearchBar>
              <EmployerTable></EmployerTable>
            </div>
        </div>
    </div>
  )
}

export default ViewJobOrders