import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom'
import Keycloak from 'keycloak-js'
import { ReactKeycloakProvider } from '@react-keycloak/web'
import './App.scss';
import Header from './Header'
import Main from './Main'
import Footer from './Footer'

const keycloak = new Keycloak({
  realm: process.env.REACT_APP_KEYCLOAK_REALM,
  url: process.env.REACT_APP_KEYCLOAK_URL,
  clientId: process.env.REACT_APP_KEYCLOAK_CLIENT_ID,
})
const keycloakProviderInitConfig = {
  onLoad: 'check-sso',
}
/*
const onKeycloakEvent = (event, error) => {
  console.log('onKeycloakEvent', event, error)
}

const onKeycloakTokens = (tokens) => {
  console.log('onKeycloakTokens', tokens)
}
*/
function App() {



    return (
      <ReactKeycloakProvider
        authClient={keycloak}
        initConfig={keycloakProviderInitConfig}
      >
        <Router>
          <Header />
          <Main />
          <Footer />
        </Router>
      </ReactKeycloakProvider>
    );
}

export default App;
