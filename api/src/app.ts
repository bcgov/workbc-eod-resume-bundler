import bodyParser from "body-parser"
import cookieParser from "cookie-parser"
import cors from "cors"
import express from "express"
import fileUpload from "express-fileupload"
import helmet from "helmet"
import Keycloak from "keycloak-connect"
import jobOrderRouter from "./routes/JobOrder.route"
import submissionRouter from "./routes/Submission.route"
import systemRouter from "./routes/System.route"

const origin = process.env.ORIGIN_URL || process.env.OPENSHIFT_NODEJS_ORIGIN_URL || "http://localhost:3000"

const corsOptions = {
    origin,
    credentials: true,
    optionsSuccessStatus: 200
}

const kcConfig = {
    clientId: process.env.AUTH_KEYCLOAK_CLIENT,
    bearerOnly: process.env.AUTH_KEYCLOAK_BEARER_ONLY,
    serverUrl: process.env.AUTH_KEYCLOAK_SERVER_URL,
    realm: process.env.AUTH_KEYCLOAK_REALM
}

// Keycloak types are not in sync with codebase.
// keycloak-connect is also being deprecated, even if the library
// is not marked as such on npm: https://www.keycloak.org/2022/02/adapter-deprecation
const keycloak = new Keycloak({}, kcConfig as any)

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cors(corsOptions))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(cookieParser())
app.use(helmet())
app.use(fileUpload())
app.use(keycloak.middleware())

app.use("/JobOrders", keycloak.protect(), jobOrderRouter)
app.use("/Submissions", keycloak.protect(), submissionRouter)
app.use("/System", keycloak.protect(), systemRouter)

const port = process.env.PORT || "8000"
app.listen(port, () => {
    console.log(`server started at http://localhost:${port}`)
})
