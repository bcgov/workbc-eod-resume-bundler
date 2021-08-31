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
    consent: boolean
}