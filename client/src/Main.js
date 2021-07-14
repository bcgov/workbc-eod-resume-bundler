import React from 'react'
import {Switch, Route} from 'react-router-dom'
import Home from './Home'
import Form from './Components/Form/Form'
import PrivateRoute from './routes/PrivateRoute'
import LoginLanding from './Components/Login/LoginLanding'
import CreateJobOrder from './Components/Management/CreateJobOrders/CreateJobOrder'



function Main() {
    return (
        
        <main role="main">
                <Switch>
                    <PrivateRoute component={CreateJobOrder} roles={['eod-staff']} path="/createJobOrder"   />
                    <PrivateRoute component={Form} roles={['elmsd-form']} path="/form"   />
                    <Route exact path="/loginLanding" component={LoginLanding} />
                    <Route exact path="/" component={Home} />
                </Switch>
        </main>
    )
    
}

export default Main