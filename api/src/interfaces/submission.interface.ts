import { JobOrder } from "./job-order.interface";

export interface CreateSubmission {
    jobID: string,
    catchment: string,
    centre: string,
    applicants: Array<ClientApplication>,
    user: string
}

export interface ClientApplication {
    clientName: string,
    clientCaseNumber: string,
    consent: boolean,
    status: string
}

export interface Submission {
    submissionID: string,
    jobID: string,
    catchment: string,
    centre: string,
    applicants: Array<ClientApplication>,
    jobOrderInfo: JobOrder,
    createdDate: Date,
    createdBy: string
}