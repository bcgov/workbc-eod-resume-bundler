/* eslint-disable react/no-unstable-nested-components */
import Box from "@material-ui/core/Box"
import CircularProgress from "@material-ui/core/CircularProgress"
import Collapse from "@material-ui/core/Collapse"
import IconButton from "@material-ui/core/IconButton"
import Paper from "@material-ui/core/Paper"
import Table from "@material-ui/core/Table"
import TableBody from "@material-ui/core/TableBody"
import TableCell from "@material-ui/core/TableCell"
import TableContainer from "@material-ui/core/TableContainer"
import TableHead from "@material-ui/core/TableHead"
import TableRow from "@material-ui/core/TableRow"
import CancelIcon from "@material-ui/icons/Cancel"
import EditIcon from "@material-ui/icons/Edit"
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown"
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp"
import MeetingRoomIcon from "@material-ui/icons/MeetingRoom"
import VisibilityIcon from "@material-ui/icons/Visibility"
import { useKeycloak } from "@react-keycloak/web"
import React, { useEffect, useState } from "react"
import { useHistory } from "react-router-dom"
import FORM_URL from "../../../constants/form"
import EditJobModal from "./Edit/EditJobModal"
import ViewJobModal from "./View/ViewJobModal"

function ManageJobs() {
    const history = useHistory()
    const { keycloak, initialized } = useKeycloak()
    const MAX_CATCHMENTS = 3 // max catchments to display

    const [jobOrders, setJobOrders] = useState([])
    const [jobOrdersLoading, setJobOrdersLoading] = useState(true)
    const [catchments, setCatchments] = useState([])
    const [forceUpdate, setForceUpdate] = useState(0)

    useEffect(() => {
        async function getCatchments() {
            const response = await fetch(`${FORM_URL.System}/Catchments`, {
                headers: {
                    Authorization: `Bearer ${keycloak.token}`
                }
            })
            const data = await response.json()
            setCatchments(
                data.map((c) => ({
                    key: c.catchment_id,
                    value: c
                }))
            )
        }

        if (initialized) {
            getCatchments().catch(console.error)
        }
    }, [forceUpdate])

    useEffect(() => {
        async function getJobOrders() {
            const response = await fetch(FORM_URL.JobOrders, {
                headers: {
                    Authorization: `Bearer ${keycloak.token}`
                }
            })
            const data = await response.json()
            const { jobs } = data

            jobs.forEach((job) => {
                // eslint-disable-next-line no-param-reassign
                job.catchments = job.catchments.map((catchment) => catchments.find((c) => c.key === catchment))
            })

            setJobOrders(jobs.sort((a, b) => (a.created_date < b.created_date ? 1 : -1)))
            setJobOrdersLoading(false)
        }

        if (catchments.length > 0 && initialized) {
            // only load job orders once catchments are loaded (dependance)
            getJobOrders().catch(console.error)
        }
    }, [catchments])

    const [showEdit, setShowEdit] = useState({})

    const handleEditClose = (jobID, edited) => () => {
        setShowEdit((showEdit) => ({
            ...showEdit,
            [jobID]: false
        }))
        if (edited)
            // re-render if data was edited
            setForceUpdate(forceUpdate + 1)
    }

    const handleEditShow = (jobID) => () => {
        setShowEdit((showEdit) => ({
            ...showEdit,
            [jobID]: true
        }))
    }

    const [showView, setShowView] = useState({})

    const handleViewClose = (jobID) => () => {
        setShowView((showView) => ({
            ...showView,
            [jobID]: false
        }))
    }

    const handleViewShow = (jobID) => () => {
        setShowView((showView) => ({
            ...showView,
            [jobID]: true
        }))
    }

    const handleReviewReferral = (props) => () => {
        history.push({
            pathname: "/reviewReferral",
            props
        })
    }

    const setStatusClosed = (jobID) => async () => {
        await fetch(`${FORM_URL.JobOrders}/${jobID}/setClosed`, {
            method: "PUT",
            credentials: "include",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                Authorization: `Bearer ${keycloak.token}`
            }
        }).catch((err) => {
            console.log(err)
        })
        setForceUpdate(forceUpdate + 1) // force re-render
    }

    const setStatusOpen = (jobID) => async () => {
        await fetch(`${FORM_URL.JobOrders}/${jobID}/setOpen`, {
            method: "PUT",
            credentials: "include",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                Authorization: `Bearer ${keycloak.token}`
            }
        }).catch((err) => {
            console.log(err)
        })
        setForceUpdate(forceUpdate + 1) // force re-render
    }

    const createData = (
        id,
        employer,
        position,
        status,
        startDate,
        deadline,
        catchments,
        location,
        submissions,
        vacancies,
        minimumRequirements,
        otherInformation,
        createdBy,
        created,
        lastEdit,
        editedBy
    ) => ({
        id,
        employer,
        position,
        status,
        startDate,
        deadline,
        catchments,
        location,
        submissions,
        vacancies,
        minimumRequirements,
        otherInformation,
        createdBy,
        created,
        lastEdit,
        editedBy
    })

    // #region UI FUNCTIONS
    const ActionIcons = (props) => {
        const editIcon = (
            <button
                key="editIcon"
                className="btn btn-primary btn-sm"
                type="button"
                onClick={handleEditShow(props.jobID)}
                style={{ minWidth: "10px", paddingTop: "0.5rem", paddingBottom: "0.5rem" }}
            >
                <EditIcon style={{ color: "white" }} />
            </button>
        )

        const viewIcon = (
            <button
                key="viewIcon"
                className="btn btn-primary btn-sm"
                type="button"
                onClick={handleViewShow(props.jobID)}
                style={{ minWidth: "10px", paddingTop: "0.5rem", paddingBottom: "0.5rem" }}
            >
                <VisibilityIcon style={{ color: "white" }} />
            </button>
        )

        const cancelIcon = (
            <button
                key="cancelIcon"
                className="btn btn-primary btn-sm"
                type="button"
                onClick={setStatusClosed(props.jobID)}
                style={{ minWidth: "10px", paddingTop: "0.5rem", paddingBottom: "0.5rem" }}
            >
                <CancelIcon style={{ color: "white" }} />
            </button>
        )

        const openIcon = (
            <button
                key="openIcon"
                className="btn btn-primary btn-sm"
                type="button"
                onClick={setStatusOpen(props.jobID)}
                style={{ minWidth: "10px", paddingTop: "0.5rem", paddingBottom: "0.5rem" }}
            >
                <MeetingRoomIcon style={{ color: "white" }} />
            </button>
        )

        const { status } = props
        const iconsToShow = [editIcon, viewIcon] // edit and view are always available actions

        if (status.toLowerCase() === "open" || status.toLowerCase() === "upcoming") iconsToShow.push(cancelIcon)
        if (status.toLowerCase() === "closed") iconsToShow.push(openIcon)

        return iconsToShow
    }

    const DisplayCatchments = (catchmentIDs) => {
        if (catchments.length === 0) return ""

        return catchmentIDs.map((id) => catchments.find((x) => x.key === id).value.name).join(", ")
    }

    const Row = React.forwardRef((props, ref) => {
        const { row } = props
        const [open, setOpen] = React.useState(false)

        return (
            <>
                <TableRow style={{ backgroundColor: "rgba(0,0,0,0.05)" }}>
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
                    <TableCell align="left" style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: "10px" }}>
                        {row.catchments.map((c) => c.key).join(", ")}
                    </TableCell>
                    <TableCell align="left">{row.location}</TableCell>
                    <TableCell align="left">{row.submissions}</TableCell>
                    <TableCell className="d-flex flex-row">
                        <ActionIcons jobID={row.id} catchments={row.catchments} status={row.status} />
                    </TableCell>
                    <TableCell align="right">
                        <div className="cold-md-6">
                            <a
                                onClick={handleReviewReferral(row)}
                                type="button"
                                className="btn btn-block"
                                style={{ backgroundColor: "grey", color: "white" }}
                            >
                                Review
                            </a>
                        </div>
                    </TableCell>
                </TableRow>
                <TableRow ref={ref}>
                    <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                        <Collapse in={open} timeout="auto" unmountOnExit>
                            <Box margin={1}>
                                <div className="row justify-content-between">
                                    <div className="column" style={{ textAlign: "left", marginLeft: "7px" }}>
                                        <div>
                                            <b>Job ID:</b> {row.id}
                                        </div>
                                        <div>
                                            <b>Employer:</b> {row.employer}
                                        </div>
                                        <div>
                                            <b>Position:</b> {row.position}
                                        </div>
                                        <div>
                                            <b>Created:</b> {row.created}
                                        </div>
                                        {row.catchments.length <= MAX_CATCHMENTS && (
                                            <div>
                                                <b>Catchments:</b> {DisplayCatchments(row.catchments.map((c) => c.key))}
                                            </div>
                                        )}
                                        {row.catchments.length === catchments.length && (
                                            <div>
                                                <b>Catchments:</b> All
                                            </div>
                                        )}
                                    </div>
                                    <div className="column" style={{ textAlign: "left", marginRight: "7px" }}>
                                        <div>
                                            <b>Location:</b> {row.location}
                                        </div>
                                        <div>
                                            <b>Submissions:</b> {row.submissions}
                                        </div>
                                        <div>
                                            <b>Last Edit:</b> {row.lastEdit}
                                        </div>
                                        <div>
                                            <b>Edited By:</b> {row.editedBy}
                                        </div>
                                        <div>
                                            <b>Deadline:</b> {row.deadline}
                                        </div>
                                    </div>
                                </div>
                                <div className="row mt-2">
                                    {row.catchments.length > MAX_CATCHMENTS && row.catchments.length !== catchments.length && (
                                        <div>
                                            <b>Catchments:</b> {DisplayCatchments(row.catchments.map((c) => c.key))}
                                        </div>
                                    )}
                                </div>
                            </Box>
                        </Collapse>
                    </TableCell>
                </TableRow>
                <EditJobModal job={row} catchments={catchments} show={showEdit} handleShow={handleEditShow} handleClose={handleEditClose} />
                <ViewJobModal job={row} show={showView} handleClose={handleViewClose} token={keycloak.token} />
            </>
        )
    })
    Row.displayName = "Row"

    const CollapsibleTable = () => (
        <TableContainer component={Paper}>
            <Table aria-label="collapsible table">
                <TableHead>
                    <TableRow>
                        <TableCell />
                        <TableCell style={{ fontWeight: "bold" }}>ID</TableCell>
                        <TableCell align="left" style={{ fontWeight: "bold" }}>
                            Employer
                        </TableCell>
                        <TableCell align="left" style={{ fontWeight: "bold" }}>
                            Position
                        </TableCell>
                        <TableCell align="left" style={{ fontWeight: "bold" }}>
                            Status
                        </TableCell>
                        <TableCell align="left" style={{ fontWeight: "bold" }}>
                            Deadline
                        </TableCell>
                        <TableCell align="left" style={{ fontWeight: "bold" }}>
                            Catchments
                        </TableCell>
                        <TableCell align="left" style={{ fontWeight: "bold" }}>
                            Location
                        </TableCell>
                        <TableCell align="left" style={{ fontWeight: "bold" }}>
                            Submissions
                        </TableCell>
                        <TableCell align="left" style={{ fontWeight: "bold" }}>
                            Actions
                        </TableCell>
                        <TableCell align="left" style={{ fontWeight: "bold" }}>
                            Referrals
                        </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {jobOrders &&
                        jobOrders?.map((jobOrder) => {
                            const ref = React.createRef()
                            return (
                                <Row
                                    ref={ref}
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
                                        jobOrder.vacancies,
                                        jobOrder.minimum_requirements,
                                        jobOrder.other_information,
                                        jobOrder.created_by,
                                        jobOrder.created_date.substring(0, 10),
                                        jobOrder.edited_date?.substring(0, 10),
                                        jobOrder.edited_by
                                    )}
                                />
                            )
                        })}
                </TableBody>
            </Table>
        </TableContainer>
    )
    // #endregion

    return (
        <div className="container mt-5">
            <div className="row">
                <div className="col-md-12">
                    <h1>Resume Bundler - Manage Jobs</h1>
                    <p>
                        All created job orders are listed below. You can edit, view, or close/reopen a job order under ‘Actions’. Please click
                        ‘Review’ to view resumes that have been submitted to a specific job order.{" "}
                    </p>
                </div>
                {jobOrders.length > 0 && catchments.length > 0 && <CollapsibleTable />}

                {(jobOrdersLoading || catchments.length === 0) && ( // show spinner while fetching data
                    <CircularProgress />
                )}
            </div>
        </div>
    )
}

export default ManageJobs
