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
    minWidth: 650,
  },
}));

function ViewJobOrders() {
  let history = useHistory();
  const classes = useStyles();

  const [jobOrders, setJobOrders] = useState([]);

  useEffect(() => {
    getJobOrders();

    async function getJobOrders() {
      const response = await fetch(FORM_URL.JobOrders);
      const data = await response.json();
      setJobOrders(data.result.rows);
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

  const Row = (props) => {
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
  
  const CollapsibleTable = () => {
    return (
        <TableContainer component={Paper}>
          <Table className={classes.table} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Job ID</TableCell>
                <TableCell align="left">Position</TableCell>
                <TableCell align="left">Location</TableCell>
                <TableCell align="left">Open Date</TableCell>
                <TableCell align="left">Deadline</TableCell>
                <TableCell align="left">Vacancies</TableCell>
                <TableCell align="left">View</TableCell>
                <TableCell align="left">Apply</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              { jobOrders && (
                jobOrders?.map(jobOrder => (
                  <Row 
                    key={jobOrder.job_id} 
                    row={createJobData(
                      jobOrder.job_id,
                      jobOrder.position,
                      jobOrder.location,
                      jobOrder.start_date.substring(0, 10),
                      jobOrder.deadline.substring(0, 10),
                      0, //TODO: Vacancies
                      )}>
                  </Row>
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
            </div>

            <CollapsibleTable></CollapsibleTable>
        </div>
    </div>
  )
}

export default ViewJobOrders