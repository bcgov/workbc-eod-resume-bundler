import React from 'react'
import {Switch, Route} from 'react-router-dom'
import Home from './Home'
import Form from './Components/Form/Form'
import PrivateRoute from './routes/PrivateRoute'
import LoginLanding from './Components/Login/LoginLanding'
import CreateJobOrder from './Components/Management/CreateJobOrders/CreateJobOrder'
import ManageJobs from './Components/Management/ManageJobs/ManageJobs'



function Main() {
    return (
        
        <main role="main">
                <Switch>
                    <PrivateRoute component={CreateJobOrder} roles={['eod-staff']} path="/createJobOrder"   />
                    <PrivateRoute component={Form} roles={['elmsd-form']} path="/form"   />
                    <PrivateRoute component={ManageJobs} roles={['eod-staff']} path="/manageJobs"   />
                    <Route exact path="/loginLanding" component={LoginLanding} />
                    <Route exact path="/" component={Home} />
                </Switch>
        </main>
    )
    
}

export default Main