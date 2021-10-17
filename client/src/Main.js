import React from 'react'
import {Switch, Route} from 'react-router-dom'
import Home from './Home'
import Form from './Components/Form/Form'
import PrivateRoute from './routes/PrivateRoute'
import LoginLanding from './Components/Login/LoginLanding'
import CreateJobOrder from './Components/Management/CreateJobOrders/CreateJobOrder'
import CreateJobOrderSuccess from './Components/Management/CreateJobOrders/CreateJobOrderSuccess'
import ManageJobs from './Components/Management/ManageJobs/ManageJobs'
import ReviewReferral from './Components/Management/ManageJobs/Bundle/ReviewReferral'
import ViewJobOrders from './Components/External/ViewJobOrders'
import ViewSubmissions from './Components/External/ViewSubmissions'
import SubmitToJobOrder from './Components/External/SubmitToJobOrder'
import SubmitToJobOrderSuccess from './Components/External/SubmitToJobOrderSuccess'
import Bundle from './Components/Management/ManageJobs/Bundle/Bundle'
import BundleSuccess from './Components/Management/ManageJobs/Bundle/BundleSuccess'
import LogoutSuccess from './Components/Login/LogoutSuccess'


function Main() {
    return (     
        <main role="main">
                <Switch>
                    <PrivateRoute component={CreateJobOrder} roles={['eod-staff']} path="/createJobOrder"   />
                    <PrivateRoute component={CreateJobOrderSuccess} roles={['eod-staff']} path="/createJobOrderSuccess" />
                    <PrivateRoute component={Form} roles={['elmsd-form']} path="/form"   />
                    <PrivateRoute component={ManageJobs} roles={['eod-staff']} path="/manageJobs"   />
                    <PrivateRoute component={ReviewReferral} roles={['eod-staff']} path="/reviewReferral"   />
                    <PrivateRoute component={ViewJobOrders} roles={['eod-staff', 'eod-contractor']} path="/jobOrdersExternal" />
                    <PrivateRoute component={ViewSubmissions} roles={['eod-staff', 'eod-contractor']} path="/submissionsExternal" />
                    <PrivateRoute component={SubmitToJobOrder} roles={['eod-staff', 'eod-contractor']} path="/submitToJobOrder" />
                    <PrivateRoute component={SubmitToJobOrderSuccess} roles={['eod-staff', 'eod-contractor']} path="/submitToJobOrderSuccess" />
                    <PrivateRoute component={Bundle} roles={['eod-staff', 'eod-contractor']} path="/bundle" />
                    <PrivateRoute component={BundleSuccess} roles={['eod-staff', 'eod-contractor']} path="/bundleSuccess" />
                    <Route exact path="/loginLanding" component={LoginLanding} />
                    <Route exact path="/logoutSuccess" component={LogoutSuccess} />
                    <Route exact path="/" component={Home} />
                </Switch>
        </main>
    )
}

export default Main