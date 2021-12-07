import { JobOrder } from "./JobOrder.interface";

export interface CreateSubmission {
    jobID: string,
    catchmentID: number,
    centreID: number,
    applicants: Array<ClientApplication>,
    user: string,
    email: string
}

export interface ClientApplication {
    clientApplicationID: string,
    clientName: string,
    preferredName: string,
    clientCaseNumber: string,
    resume: Resume,
    consent: boolean,
    status: string,
    bundled: boolean,
    catchmentID: number,
    catchmentName: string,
    centreID: number,
    centreName: string
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
    createdBy: string,
    createdByEmail: string
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
    preferredName: string,
    clientCaseNumber: string,
    user: string
}

export interface BundleEmailParams {
    email: string,
    position: string,
    location: string,
    staffName: string
}

export interface NotifyParams {
    email: string,
    clientCaseNumber: string,
    position: string,
    location: string,
    status: string
}