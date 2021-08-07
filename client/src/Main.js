import React from 'react'
import {Switch, Route} from 'react-router-dom'
import Home from './Home'
import Form from './Components/Form/Form'
import PrivateRoute from './routes/PrivateRoute'
import LoginLanding from './Components/Login/LoginLanding'
import CreateJobOrder from './Components/Management/CreateJobOrders/CreateJobOrder'
import CreateJobOrderSuccess from './Components/Management/CreateJobOrders/CreateJobOrderSuccess'
import ManageJobs from './Components/Management/ManageJobs/ManageJobs'
import ReviewReferral from './Components/Management/ManageJobs/ReviewReferral'


function Main() {
    return (
        
        <main role="main">
                <Switch>
                    <PrivateRoute component={CreateJobOrder} roles={['eod-staff']} path="/createJobOrder"   />
                    <PrivateRoute component={CreateJobOrderSuccess} roles={['eod-staff']} path="/createJobOrderSuccess" />
                    <PrivateRoute component={Form} roles={['elmsd-form']} path="/form"   />
                    <PrivateRoute component={ManageJobs} roles={['eod-staff']} path="/manageJobs"   />
                    <PrivateRoute component={ReviewReferral} roles={['eod-staff']} path="/reviewReferral"   />
                    <Route exact path="/loginLanding" component={LoginLanding} />
                    <Route exact path="/" component={Home} />
                </Switch>
        </main>
    )
    
}

export default Main