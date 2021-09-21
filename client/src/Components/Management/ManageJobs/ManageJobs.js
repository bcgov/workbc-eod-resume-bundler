import React, { useState, useEffect, useReducer } from 'react';
import { Modal } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import { FORM_URL } from '../../../constants/form';
import { makeStyles } from '@material-ui/core/styles';
import EditIcon from '@material-ui/icons/Edit';
import VisibilityIcon from '@material-ui/icons/Visibility';
import CancelIcon from '@material-ui/icons/Cancel';
import MeetingRoomIcon from '@material-ui/icons/MeetingRoom';
import Box from '@material-ui/core/Box';
import Collapse from '@material-ui/core/Collapse';
import IconButton from '@material-ui/core/IconButton';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import CatchmentSelector from '../../../utils/CatchmentSelector';
import CircularProgress from '@material-ui/core/CircularProgress'
import EditJobFields from './EditJobFields';
import { Formik, Form, Field, ErrorMessage, FastField } from 'formik';

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
  }
}));

//#region HELPER FUNCTIONS

function not(a, b) {
  return a.filter((value) => b.indexOf(value) === -1);
}
//#endregion

function ManageJobs() {
  let history = useHistory();
  const classes = useStyles();

  const [jobOrders, setJobOrders] = useState([]);
  const [jobOrdersLoading, setJobOrdersLoading] = useState(true);
  const [catchments, setCatchments] = useState([]);
  const [forceUpdate, setForceUpdate] = useState(0);

  useEffect(async () => {
    await getJobOrders();
    await getCatchments();

    async function getJobOrders() {
      const response = await fetch(FORM_URL.JobOrders);
      const data = await response.json();
      const jobs = data.jobs;
      setJobOrders(jobs.sort((a,b) => a.created_date < b.created_date ? 1 : -1));
      setJobOrdersLoading(false);
    }

    async function getCatchments() {
      const response = await fetch(FORM_URL.System + "/Catchments");
      const data = await response.json();
      setCatchments(data);
    }
  }, [setJobOrders, setCatchments, forceUpdate]);

  //#region EDIT MODAL STATE
  const [showEdit, setShowEdit] = useState({});

  const handleEditClose = jobID => () => {
    setShowEdit(showEdit => ({
      ...showEdit,
      [jobID] : false}))
  }
  const handleEditShow = jobID => () => {
    setShowEdit(showEdit => ({
      ...showEdit,
      [jobID] : true}));
  }
  //#endregion

  const handleReviewReferral = (props) => () => {
    history.push({
      pathname: '/reviewReferral',
      props
    });
  }

  const setStatusClosed = jobID => async () => {
    await fetch(FORM_URL.JobOrders + "/" + jobID + "/setClosed", {
      method: "POST",
      credentials: 'include',
      headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
      }
    })
    .catch(err => {
      console.log(err);
    });
    setForceUpdate(forceUpdate + 1);
  }

  const createData = (id, employer, position, status, startDate, deadline, catchments, location, submissions, created, lastEdit, editedBy) => {
      return {
          id,
          employer,
          position,
          status,
          startDate,
          deadline,
          catchments,
          location,
          submissions,
          created,
          lastEdit,
          editedBy
      };
  }

  //#region UI FUNCTIONS
  const ActionIcons = (props) => {
      let editIcon =  <button className="btn btn-primary btn-sm" type="button" onClick={handleEditShow(props.jobID)} style={{minWidth: "10px", paddingTop: "0.5rem", paddingBottom: "0.5rem"}}>
                          <EditIcon style={{color: "white"}}></EditIcon>
                      </button>

      let viewIcon =  <button className="btn btn-primary btn-sm" type="button" style={{minWidth: "10px", paddingTop: "0.5rem", paddingBottom: "0.5rem"}}> 
                          <VisibilityIcon style={{color: "white"}}></VisibilityIcon> 
                      </button>
      
      let cancelIcon = <button className="btn btn-primary btn-sm" type="button" onClick={setStatusClosed(props.jobID)} style={{minWidth: "10px", paddingTop: "0.5rem", paddingBottom: "0.5rem"}}> 
                          <CancelIcon style={{color: "white"}}></CancelIcon> 
                      </button>

      let openIcon = <button className="btn btn-primary btn-sm" type="button" style={{minWidth: "10px", paddingTop: "0.5rem", paddingBottom: "0.5rem"}}> 
                          <MeetingRoomIcon style={{color: "white"}}></MeetingRoomIcon> 
                      </button>
      
      let status = props.status;
      let iconsToShow = [editIcon, viewIcon]; // edit and view are always available actions

      if (status.toLowerCase() == "open")
          iconsToShow.push(cancelIcon);
      if (status.toLowerCase() == "closed")
          iconsToShow.push(openIcon);

      return iconsToShow;
  }

  const DisplayCatchments = (catchmentIDs) => {
    if(catchments.length == 0)
      return "";

    return catchmentIDs
      .map(id => catchments.find(x => x.catchment_id == id).name)
      .join(", "); 
  }

  const EditModal = (props) => {
    //#region MARK FOR DELETE MODAL STATE
    const [showMarkForDelete, setShowMarkForDelete] = useState(false);

    const handleMarkForDeleteClose = jobID => () => {
      setShowMarkForDelete(false);
      handleEditClose(jobID)();
    } 
    const handleMarkForDeleteShow = () => {
      setShowMarkForDelete(true);
    }
    //#endregion

    const MarkForDeleteModal = (props) => {
      return (
        <Modal show={showMarkForDelete} onHide={handleMarkForDeleteClose(props.jobID)}>
          <Modal.Header>
            <div className="d-flex flex-row flex-fill">
              <div className="mr-auto">
                <Modal.Title>Confirm Mark Delete</Modal.Title>
              </div>
            </div>
          </Modal.Header>
          <Modal.Body>
            <h5 style={{ color: 'grey', fontWeight: 'lighter' }}>
              Type the ID of the application to confirm mark for deletion:
            </h5>
            <Formik
              initialValues={props}
              enableReinitialize={true}>
              <Form>
                <div>
                  <div className="form-group col-md-6">
                    <label className="control-label" htmlFor="app-id">Confirm ID</label>
                    <Field
                        name="app-id"
                        type="text"
                        className="form-control"
                    />
                    <ErrorMessage
                        name="app-id"
                        component="div"
                        className="field-error"
                    />
                  </div>
                </div>
              </Form>
            </Formik>
          </Modal.Body>
          <Modal.Footer>
            <button className="btn btn-danger" type="button" onClick={handleMarkForDeleteClose(props.jobID)}> 
              Mark for Delete
            </button>
            <button className="btn btn-outline-primary" type="button" onClick={handleMarkForDeleteClose(props.jobID)}> 
              Cancel
            </button>
          </Modal.Footer>
        </Modal>
      );
    }

    return (
      <Modal show={showEdit[props.jobID]} onHide={handleEditClose(props.jobID)} size="xl">
        <Modal.Header>
          <div className="d-flex flex-row flex-fill">
            <div className="mr-auto">
              <Modal.Title>Editing Job {props.jobID}</Modal.Title>
            </div>
            <div className="ml-auto">
              <button className="btn btn-danger" type="button" onClick={handleMarkForDeleteShow}> 
                Mark for Delete
              </button>
            </div>
          </div>
        </Modal.Header>
        <Modal.Body>
          <h5 style={{ color: 'grey', fontWeight: 'lighter' }}>Job Fields</h5>
          <Formik
            initialValues={props.row}
            enableReinitialize={true}>
            <Form>
              <EditJobFields />
              <br></br>
              <h5>Catchments Job will be available to</h5>
              {catchments.length > 0 && <FastField 
                name="catchments"
                component={CatchmentSelector} 
                catchments={props.catchments} />
              }
            </Form>
          </Formik>
        </Modal.Body>
        <Modal.Footer>
          <button className="btn btn-primary" type="button" onClick={handleEditClose(props.jobID)}> 
            Submit
          </button>
          <button className="btn btn-outline-primary" type="button" onClick={handleEditClose(props.jobID)}> 
            Cancel
          </button>
        </Modal.Footer>
        <MarkForDeleteModal jobID={props.jobID}></MarkForDeleteModal>
      </Modal>
    );
  }

  const Row = (props) => {
    const { row } = props;
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
            {row.id}
          </TableCell>
          <TableCell align="left">{row.employer}</TableCell>
          <TableCell align="left">{row.position}</TableCell>
          <TableCell align="left">{row.status}</TableCell>
          <TableCell align="left">{row.deadline}</TableCell>
          <TableCell align="left" style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: "10px"}}>
            {row.catchments.join(", ")}
          </TableCell>
          <TableCell align="left">{row.location}</TableCell>
          <TableCell align="left">{row.submissions}</TableCell>
          <TableCell className={"d-flex flex-row"}>
              <ActionIcons jobID={row.id} catchments={row.catchments} status={row.status}></ActionIcons>
          </TableCell>
          <TableCell align="right">
            <div className="cold-md-6">
              <a  onClick={handleReviewReferral(row)}
                  type="button"
                  className="btn btn-block"
                  style={{ backgroundColor: "grey", color: "white" }}>
                Review
              </a>
            </div>
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
            <Collapse in={open} timeout="auto" unmountOnExit>
              <Box margin={1}>
                <div className="row justify-content-between">
                  <div className="column" style= {{ textAlign: "left", marginLeft: "7px" }}>
                    <div>
                        Job ID: {row.id}
                    </div>
                    <div>
                        Employer: {row.employer}
                    </div>
                    <div>
                        Position: {row.position}
                    </div>
                    <div>
                        Created: {row.created}
                    </div>
                    <div>
                        Deadline: {row.deadline}
                    </div>
                  </div>
                  <div className="column" style= {{ textAlign: "left", marginRight: "7px" }}>
                    <div>
                        Catchments: {DisplayCatchments(row.catchments)}
                    </div>
                    <div>
                        Location: {row.location}
                    </div>
                    <div>
                        Submissions: {row.submissions}
                    </div>
                    <div>
                        Last Edit: {row.lastEdit}
                    </div>
                    <div>
                        Edited By: {row.editedBy}
                    </div>
                  </div>
                </div>
              </Box>
            </Collapse>
          </TableCell>
        </TableRow>
        <EditModal 
          jobID={row.id} 
          catchments={catchments}
          selectedCatchments={row.catchments} 
          row={row}>
        </EditModal>
      </React.Fragment>
    );
  }
  
  const CollapsibleTable = () => {
    return (
      <>
        <TableContainer component={Paper}>
          <Table aria-label="collapsible table">
            <TableHead>
              <TableRow>
                <TableCell />
                <TableCell style={{fontWeight: "bold"}}>ID</TableCell>
                <TableCell align="left" style={{fontWeight: "bold"}}>Employer</TableCell>
                <TableCell align="left" style={{fontWeight: "bold"}}>Position</TableCell>
                <TableCell align="left" style={{fontWeight: "bold"}}>Status</TableCell>
                <TableCell align="left" style={{fontWeight: "bold"}}>Deadline</TableCell>
                <TableCell align="left" style={{fontWeight: "bold"}}>Catchments</TableCell>
                <TableCell align="left" style={{fontWeight: "bold"}}>Location</TableCell>
                <TableCell align="left" style={{fontWeight: "bold"}}>Submissions</TableCell>
                <TableCell align="left" style={{fontWeight: "bold"}}>Actions</TableCell>
                <TableCell align="left" style={{fontWeight: "bold"}}>Referrals</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              { jobOrders && (
                jobOrders?.map(jobOrder => (
                  <Row 
                    key={jobOrder.job_id} 
                    row={createData(
                      jobOrder.job_id,
                      jobOrder.employer,
                      jobOrder.position,
                      jobOrder.status,
                      jobOrder.start_date.substring(0, 10),
                      jobOrder.deadline.substring(0, 10),
                      jobOrder.catchments,
                      jobOrder.location,
                      jobOrder.submissions,
                      jobOrder.created_date.substring(0, 10)
                      )}>
                  </Row>
                ))                
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </>
    );
  }
  //#endregion

  return (
    <div className="container">
        <div className="row">
            <div className="col-md-12">
                <h1>Resume Bundler - Manage Jobs</h1>  
                <p>Manage all job orders</p>  
            </div>
            {jobOrders.length > 0 && catchments.length > 0 &&
              <CollapsibleTable></CollapsibleTable>
            }

            {(jobOrdersLoading || catchments.length == 0) && // show spinner while fetching data
              <CircularProgress />
            }
        </div>
    </div>
  )
}

export default ManageJobs