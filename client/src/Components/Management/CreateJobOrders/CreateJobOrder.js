import React, { useMemo, useState, useCallback } from 'react'
import { withRouter, useHistory } from 'react-router-dom'
import { makeStyles } from '@material-ui/core/styles';
import CreateJobOrberForm from './CreateJobOrderForm';

const useStyles = makeStyles((theme) => ({
    root: {
        margin: 'auto',
    },
    cardHeader: {
        padding: theme.spacing(1, 2),
    },
    list: {
        width: 350,
        height: 230,
        backgroundColor: theme.palette.background.paper,
        overflow: 'auto',
        paddingLeft: 0
    },
    button: {
        margin: theme.spacing(0.5, 0),
    },
}));

function CreateJobOrder() {
    return (
        <div className="container">
            <div className="row">
                <div className="col-md-12">
                    <h1>Resume Bundler - Create Job Order</h1>
                    <CreateJobOrberForm />
                </div>
            </div>
        </div>
    )
}

export default withRouter(CreateJobOrder)
