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
  const [clientCases, setClientCases] = useState([]);


  const handleUpdateSubmissionsToDisplay = (searchString) => {
    setSubmissionsToDisplay(submissions.filter(s => s.employer.startsWith(searchString)));
  }

  useEffect(async () => {
    await getSubmissions();

    async function getSubmissions() {
      const response = await fetch(FORM_URL.Submissions);
      const data = await response.json();
      const jobOrders = data.result.rows;
      setSubmissions(submissions);
    }
  }, [setSubmissions]);

//   const createJobData = (id, position, location, openDate, deadline, vacancies) => {
//       return {
//           id,
//           position,
//           location,
//           openDate,
//           deadline,
//           vacancies
//       };
//   }
  
  const ActionIcons = (props) => {
      let viewIcon =  <button className="btn btn-primary btn-sm" type="button"> 
                          <VisibilityIcon style={{color: "white"}}></VisibilityIcon> 
                      </button>
      
      return viewIcon;
  }

//   const SubmissionTable = () => {
//     return (
//         <TableContainer>
//           <Table className={classes.table}>
//             <TableHead className={classes.tableHeader}>
//               <TableRow>
//                 <TableCell style={{width: "5%"}}></TableCell>
//                 <TableCell style={{fontWeight: "bold"}}>Employer</TableCell>
//               </TableRow>
//             </TableHead>
//             <TableBody>
//               { employersToDisplay && (
//                 employersToDisplay?.map(employer => (
//                   <EmployerRow 
//                     employer={employer}>
//                   </EmployerRow>
//                 ))                
//               )}
//             </TableBody>
//           </Table>
//         </TableContainer>
//     );
//   }

//   const EmployerRow = (props) => {
//     const [open, setOpen] = React.useState(false);
//     return (
//     <React.Fragment>
//       <TableRow>
//           <TableCell className={classes.noBorder}>
//             <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
//               {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
//             </IconButton>
//           </TableCell>
//           <TableCell component="th" scope="row" className={classes.noBorder}>
//               {props.employer}
//           </TableCell>
//       </TableRow>
//       <TableRow>
//         <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
//           <Collapse in={open} timeout="auto" unmountOnExit>
//             <JobTable jobOrders={getJobOrdersForEmployer(props.employer)}></JobTable>
//           </Collapse>
//         </TableCell>
//       </TableRow>
//     </React.Fragment>
//     );
//   }

//   const JobTable = (props) => {
//     return (
//         <TableContainer className={"mb-2"}>
//           <Table className={classes.table} aria-label="simple table">
//             <TableHead className={classes.tableHeader}>
//               <TableRow>
//                 <TableCell style={{fontWeight: "bold"}}>Job ID</TableCell>
//                 <TableCell style={{fontWeight: "bold"}} align="left">Position</TableCell>
//                 <TableCell style={{fontWeight: "bold"}} align="left">Location</TableCell>
//                 <TableCell style={{fontWeight: "bold"}} align="left">Open Date</TableCell>
//                 <TableCell style={{fontWeight: "bold"}} align="left">Deadline</TableCell>
//                 <TableCell style={{fontWeight: "bold"}} align="left">Vacancies</TableCell>
//                 <TableCell style={{fontWeight: "bold"}} align="center">View</TableCell>
//                 <TableCell style={{fontWeight: "bold"}} align="center">Apply</TableCell>
//               </TableRow>
//             </TableHead>
//             <TableBody>
//               { props.jobOrders && (
//                 props.jobOrders?.map(jobOrder => (
//                   <JobRow 
//                     key={jobOrder.job_id} 
//                     row={createJobData(
//                       jobOrder.job_id,
//                       jobOrder.position,
//                       jobOrder.location,
//                       jobOrder.start_date.substring(0, 10),
//                       jobOrder.deadline.substring(0, 10),
//                       jobOrder.vacancies
//                       )}>
//                   </JobRow>
//                 ))                
//               )}
//             </TableBody>
//           </Table>
//         </TableContainer>
//     );
//   }

//   const JobRow = (props) => {
//     const { row } = props;

//     return (
//     <TableRow>
//         <TableCell component="th" scope="row">
//             {row.id}
//         </TableCell>
//         <TableCell align="left">{row.position}</TableCell>
//         <TableCell align="left">{row.location}</TableCell>
//         <TableCell align="left">{row.openDate}</TableCell>
//         <TableCell align="left">{row.deadline}</TableCell>
//         <TableCell align="left">{row.vacancies}</TableCell>
//         <TableCell align="center">
//             <button className="btn btn-primary btn-sm" type="button"> 
//                 <VisibilityIcon style={{color: "white"}}></VisibilityIcon> 
//             </button>
//         </TableCell>
//         <TableCell align="right">
//             <div className="cold-md-6">
//                 <a
//                     type="button"
//                     className="btn btn-block"
//                     style={{ backgroundColor: "grey", color: "white"}}>
//                 Submit
//                 </a>
//             </div>
//         </TableCell>
//     </TableRow>
//     );
//   }

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
              ></SearchBar>
              {/* <SubmissionTable></SubmissionTable> */}
            </div>
        </div>
    </div>
  )
}

export default ViewSubmissions;