var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var helmet = require('helmet');
var csrf = require('csurf')
var bodyParser = require('body-parser')
var cors = require('cors')
const formidable = require('express-formidable');
const fileUpload = require('express-fileupload');
var Keycloak = require('keycloak-connect');

var origin = process.env.ORIGIN_URL || process.env.OPENSHIFT_NODEJS_ORIGIN_URL || "http://localhost:3000"

const corsOptions = {
    origin: origin,
    credentials: true,
    optionsSuccessStatus: 200,
};

const kcConfig = {
  clientId: process.env.AUTH_KEYCLOAK_CLIENT,
  bearerOnly: process.env.AUTH_KEYCLOAK_BEARER_ONLY,
  serverUrl: process.env.AUTH_KEYCLOAK_SERVER_URL,
  realm: process.env.AUTH_KEYCLOAK_REALM,
  clientSecret: process.env.AUTH_KEYCLOAK_SECRET
};

console.log(kcConfig)

var keycloak = new Keycloak({}, kcConfig)

var jobOrderRouter = require("./routes/JobOrder.route");
var submissionRouter = require("./routes/Submission.route");
var systemRouter = require("./routes/System.route");
var app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors(corsOptions));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(helmet());
app.use(fileUpload());
app.use(keycloak.middleware());

app.use("/JobOrders", keycloak.protect(), jobOrderRouter);
app.use("/Submissions", keycloak.protect(), submissionRouter);
app.use("/System", keycloak.protect(), systemRouter);

var port = process.env.PORT || '8000';
app.listen( port, () => {
  console.log( `server started at http://localhost:${ port }` );
} );

module.exports = app;
