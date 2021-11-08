import { AxiosInstance } from "axios";

const axios = require('axios');

const oesBaseUrl = process.env.OES_URL|| '';

export const oesApi: AxiosInstance = axios.create(
  {
    baseURL: oesBaseUrl
  }
);