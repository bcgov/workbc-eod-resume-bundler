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
import ViewJobOrders from './Components/External/JobOrders/View/ViewJobOrders'
import ViewSubmissions from './Components/External/Submissions/ViewSubmissions'
import SubmitToJobOrder from './Components/External/JobOrders/Submit/SubmitToJobOrder'
import SubmitToJobOrderSuccess from './Components/External/JobOrders/Submit/SubmitToJobOrderSuccess'
import Bundle from './Components/Management/ManageJobs/Bundle/Bundle'
import BundleSuccess from './Components/Management/ManageJobs/Bundle/BundleSuccess'
import LogoutSuccess from './Components/Login/LogoutSuccess'


function Main() {
    return (     
        <main role="main" style={{paddingTop: "0", paddingBottom: "0", overflowX: "hidden", position: "relative", width: "100%"}}>
                <Switch>
                    {/* internal */}
                    <PrivateRoute component={CreateJobOrder} roles={['eod-staff']} path="/createJobOrder"   />
                    <PrivateRoute component={CreateJobOrderSuccess} roles={['eod-staff']} path="/createJobOrderSuccess" />
                    <PrivateRoute component={Form} roles={['elmsd-form']} path="/form"   />
                    <PrivateRoute component={ManageJobs} roles={['eod-staff']} path="/manageJobs"   />
                    <PrivateRoute component={ReviewReferral} roles={['eod-staff']} path="/reviewReferral"   />
                    <PrivateRoute component={Bundle} roles={['eod-staff', 'eod-contractor']} path="/bundle" />
                    <PrivateRoute component={BundleSuccess} roles={['eod-staff', 'eod-contractor']} path="/bundleSuccess" />

                    {/* external */}
                    <Route exact component={ViewJobOrders} path="/jobOrdersExternal" />
                    <Route exact component={ViewSubmissions} path="/submissionsExternal" />
                    <Route exact component={SubmitToJobOrder} path="/submitToJobOrder" />
                    <Route exact component={SubmitToJobOrderSuccess} path="/submitToJobOrderSuccess" />

                    {/* general */}
                    <Route exact path="/loginLanding" component={LoginLanding} />
                    <Route exact path="/logoutSuccess" component={LogoutSuccess} />
                    <Route exact path="/" component={Home} />
                </Switch>
        </main>
    )
}

export default Main