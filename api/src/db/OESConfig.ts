import axios, { AxiosInstance } from "axios"

const oesBaseUrl = process.env.OES_URL || ""

const oesApi: AxiosInstance = axios.create({
    baseURL: oesBaseUrl
})

export default oesApi
