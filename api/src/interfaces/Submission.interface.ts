import { JobOrder } from "./JobOrder.interface";

export interface CreateSubmission {
    jobID: string,
    catchmentID: number,
    centreID: number,
    applicants: Array<ClientApplication>,
    user: string
}

export interface ClientApplication {
    clientApplicationID: string,
    clientName: string,
    clientCaseNumber: string,
    resume: Resume,
    consent: boolean,
    status: string,
    bundled: boolean
}

export interface Submission {
    submissionID: string,
    jobID: string,
    catchmentID: number,
    catchmentName: string,
    centreID: number,
    centreName: string,
    applicants: Array<ClientApplication>,
    jobOrderInfo: JobOrder,
    createdDate: Date,
    createdBy: string
}

export interface Resume {
    fileName: string,
    fileType: string,
    buffer?: ArrayBuffer
}

export interface UpdateClientApplication {
    catchmentID: number,
    centreID: number,
    clientName: string,
    clientCaseNumber: string,
    user: string
}
