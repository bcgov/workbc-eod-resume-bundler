import React, { useState } from 'react';
import { Modal } from 'react-bootstrap';
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


function ManageJobs() {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const useStyles = makeStyles((theme) => ({
    root: {
      '& > *': {
        borderBottom: 'unset',
      },
    },
  }));

  const createData = (id, employer, position, status, deadline, catchments, location, submissions, created, lastEdit, editedBy) => {
      return {
          id,
          employer,
          position,
          status,
          deadline,
          catchments,
          location,
          submissions,
          created,
          lastEdit,
          editedBy
      };
  }

  const rows = [
    createData('FFFFFFFF', 'Employer 1', 'Position 1', 'Open', '02/02/0000', [{id: 1, value: 1}, {id: 2, value: 7}, {id: 3, value: 45}], 'City A', 22, '01/01/2021', '02/02/2021', 'Tess Tester'),
    createData('AAAAAAA', 'Employer 2', 'Position 2', 'Closed', '01/01/0000', [{id: 1, value: 45}, {id: 2, value: 44}, {id: 3, value: 29}], 'City B', 25, '03/03/2021', '05/05/2021', 'Timmy Twotests'),
    createData('BBBBBBB', 'Employer 3', 'Position 3', 'Cancelled', '03/03/0000', [{id: 1, value: 10}, {id: 2, value: 15}, {id: 3, value: 17}], 'City C', 9, '04/04/2021', '06/06/2021', 'Bilbo Baggins')
  ];

  const ActionIcons = (props) => {
      let editIcon =  <button className="btn btn-primary btn-sm" type="button" onClick={handleShow}> 
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
    return catchments.map(c => c.value).join(", "); // TODO: currently throws an error regarding keys for lists
    // return (
    //   catchments.map((catchment, index) => (
    //     <span key={index}>
    //       <span>{catchment.value}, </span>
    //     </span>
    //   ))
    // )
  }

  const Row = (props) => {
    const { row } = props;
    const [open, setOpen] = React.useState(false);
    const classes = useStyles();
  
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
          <TableCell>
              <ActionIcons status={row.status}></ActionIcons>
          </TableCell>
          <TableCell align="right">
            <button
                className="btn btn-block"
                type="button"
                style={{ backgroundColor: "grey", color: "white"}}
            >
                Review
            </button>
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
            <Collapse in={open} timeout="auto" unmountOnExit>
              <Box margin={1}>
                <div className="d-flex flex-column">
                    <div className="d-flex flex-row">
                        <div className="mr-auto">
                            Job ID: {row.id}
                        </div>
                        <div className="ml-auto">
                            Catchments: {DisplayCatchments(row.catchments)}
                        </div>
                    </div>
                    <div className="d-flex flex-row">
                        <div className="mr-auto">
                            Employer: {row.employer}
                        </div>
                        <div className="ml-auto">
                            Location: {row.location}
                        </div>
                    </div>
                    <div className="d-flex flex-row">
                        <div className="mr-auto">
                            Position: {row.position}
                        </div>
                        <div className="ml-auto">
                            Submissions: {row.submissions}
                        </div>
                    </div>
                    <div className="d-flex flex-row">
                        <div className="mr-auto">
                            Created: {row.created}
                        </div>
                        <div className="ml-auto">
                            Last Edit: {row.lastEdit}
                        </div>
                    </div>
                    <div className="d-flex flex-row">
                        <div className="mr-auto">
                            Deadline: {row.deadline}
                        </div>
                        <div className="ml-auto">
                            Edited by: {row.editedBy}
                        </div>
                    </div>
                </div>
              </Box>
            </Collapse>
          </TableCell>
        </TableRow>
        <Modal show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <div className="d-flex flex-row flex-fill">
              <div className="mr-auto">
                <Modal.Title>Editing Job {row.id}</Modal.Title>
              </div>
              <div className="ml-auto">
                <button className="btn btn-primary" type="button"> 
                  Mark for Delete
                </button>
              </div>
            </div>
          </Modal.Header>
          <Modal.Body>Woohoo, you're reading this text in a modal!</Modal.Body>
          <Modal.Footer>
            <button className="btn btn-primary" type="button" onClick={handleClose}> 
              Cancel
            </button>
            <button className="btn btn-primary" type="button" onClick={handleClose}> 
              Submit
            </button>
          </Modal.Footer>
        </Modal>
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
              {rows.map((row) => (
                <Row key={row.name} row={row} />
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </>
    );
  }

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