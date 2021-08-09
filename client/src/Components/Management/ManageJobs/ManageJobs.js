import React, { useState, useEffect } from 'react';
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
import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import Checkbox from '@material-ui/core/Checkbox';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import EditJobFields from './EditJobFields';
import { Formik, Form, Field, ErrorMessage } from 'formik';

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
}));

//#region HELPER FUNCTIONS
function intersection(a, b) {
  return a.filter((value) => b.indexOf(value) !== -1);
}

function not(a, b) {
  return a.filter((value) => b.indexOf(value) === -1);
}

function union(a, b) {
  return [...a, ...not(b, a)];
}
//#endregion

function ManageJobs() {
  let history = useHistory();
  const classes = useStyles();

  const [jobOrders, setJobOrders] = useState([]);

  useEffect(() => {
    getJobOrders();

    async function getJobOrders() {
      console.log("get job orders!")
      const response = await fetch(FORM_URL.JobOrders);
      const data = await response.json();
      setJobOrders(data.result.rows);
    }
  }, [setJobOrders]);

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
      props: props
    });
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
      let editIcon =  <button className="btn btn-primary btn-sm" type="button" onClick={handleEditShow(props.jobID)}>
                          <EditIcon style={{color: "white"}}></EditIcon>
                      </button>

      let viewIcon =  <button className="btn btn-primary btn-sm" type="button"> 
                          <VisibilityIcon style={{color: "white"}}></VisibilityIcon> 
                      </button>
      
      let cancelIcon = <button className="btn btn-primary btn-sm" type="button"> 
                          <CancelIcon style={{color: "white"}}></CancelIcon> 
                      </button>

      let openIcon = <button className="btn btn-primary btn-sm" type="button"> 
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

  const DisplayCatchments = (catchments) => {
    return catchments.map(c => parseInt(c.substring(2)).toString()).join(", "); // TODO: currently throws a warning regarding keys for lists
  }

  const CatchmentSelector = (props) => {
    const [checked, setChecked] = React.useState([]);
    const [left, setLeft] = React.useState(props.catchments);
    const [right, setRight] = React.useState([]);

    const leftChecked = intersection(checked, left);
    const rightChecked = intersection(checked, right);

    const handleToggle = (value) => () => {
      const currentIndex = checked.indexOf(value);
      const newChecked = [...checked];

      if (currentIndex === -1) {
          newChecked.push(value);
      } else {
          newChecked.splice(currentIndex, 1);
      }

      setChecked(newChecked);
    };
    
    const numberOfChecked = (items) => intersection(checked, items).length;

    const handleToggleAll = (items) => () => {
      if (numberOfChecked(items) === items.length) {
          setChecked(not(checked, items));
      } else {
          setChecked(union(checked, items));
      }
    };

    const handleCheckedRight = () => {
      setRight(right.concat(leftChecked));
      setLeft(not(left, leftChecked));
      setChecked(not(checked, leftChecked));
    };

    const handleCheckedLeft = () => {
      setLeft(left.concat(rightChecked));
      setRight(not(right, rightChecked));
      setChecked(not(checked, rightChecked));
    };

    const CustomList = (props) => {
      return (
        <Card>
          <CardHeader
              className={classes.cardHeader}
              avatar={
                  <Checkbox
                      onClick={handleToggleAll(props.items)}
                      checked={numberOfChecked(props.items) === props.items.length && props.items.length !== 0}
                      indeterminate={numberOfChecked(props.items) !== props.items.length && numberOfChecked(props.items) !== 0}
                      disabled={props.items.length === 0}
                      inputProps={{ 'aria-label': 'all items selected' }}
                  />
              }
              title={props.title}
              subheader={`${numberOfChecked(props.items)}/${props.items.length} selected`}
          />
          <Divider />
          <List className={classes.list} dense component="div" role="list">
              {props.items.map((value) => {
                  const labelId = `transfer-list-all-item-${value}-label`;
  
                  return (
                      <ListItem key={value} role="listitem" button onClick={handleToggle(value)}>
                          <ListItemIcon>
                              <Checkbox
                                  checked={checked.indexOf(value) !== -1}
                                  tabIndex={-1}
                                  disableRipple
                                  inputProps={{ 'aria-labelledby': labelId }}
                              />
                          </ListItemIcon>
                          <ListItemText id={labelId} primary={`${value}`} />
                      </ListItem>
                  );
              })}
              <ListItem />
            </List>
          </Card>
      );
    }

    return (
      <Formik>
        <Form>
          <div className="ml-5">
            <Grid
              container
              spacing={2}
              alignItems="center">
              <Grid item>
                <CustomList title='Unselected' items={left}></CustomList>
              </Grid>
              <Grid item>
                  <Grid container direction="column" alignItems="center">
                      <Button
                          variant="outlined"
                          size="small"
                          className={classes.button}
                          onClick={handleCheckedRight}
                          disabled={leftChecked.length === 0}
                          aria-label="move selected right"
                      >
                          &gt;
                      </Button>
                      <Button
                          variant="outlined"
                          size="small"
                          className={classes.button}
                          onClick={handleCheckedLeft}
                          disabled={rightChecked.length === 0}
                          aria-label="move selected left"
                      >
                          &lt;
                      </Button>
                  </Grid>
              </Grid>
              <Grid item>
                <CustomList title='Selected' items={right}></CustomList>
              </Grid>
            </Grid>
          </div>
        </Form>
      </Formik>
    );
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
      <Modal show={showEdit[props.jobID]} onHide={handleEditClose(props.jobID)} size="lg">
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
            </Form>
          </Formik>
          <br></br>
          <h5>Catchments Job will be available to</h5>
        </Modal.Body>
        <CatchmentSelector catchments={props.catchments}></CatchmentSelector>
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
        <TableRow className={classes.root}>
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
          <TableCell align="left">{DisplayCatchments(row.catchments)}</TableCell>
          <TableCell align="left">{row.location}</TableCell>
          <TableCell align="left">{row.submissions}</TableCell>
          <TableCell className="d-flex flex-row">
              <ActionIcons jobID={row.id} catchments={row.catchments} status={row.status}></ActionIcons>
          </TableCell>
          <TableCell align="right">
            <div className="cold-md-6">
              <a  onClick={handleReviewReferral(row)}
                  type="button"
                  className="btn btn-block"
                  style={{ backgroundColor: "grey", color: "white"}}>
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
        <EditModal jobID={row.id} catchments={row.catchments} row={row}></EditModal>
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
                <TableCell>ID</TableCell>
                <TableCell align="left">Employer</TableCell>
                <TableCell align="left">Position</TableCell>
                <TableCell align="left">Status</TableCell>
                <TableCell align="left">Deadline</TableCell>
                <TableCell align="left">Catchments</TableCell>
                <TableCell align="left">Location</TableCell>
                <TableCell align="left">Submissions</TableCell>
                <TableCell align="left">Actions</TableCell>
                <TableCell align="left">Referrals</TableCell>
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
                      0,
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
                <h1>EOD Resume Bundler - Manage Jobs</h1>  
                <p>Manage all job orders</p>  
            </div>

            <CollapsibleTable></CollapsibleTable>
        </div>
    </div>
  )
}

export default ManageJobs