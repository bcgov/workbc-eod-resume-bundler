export interface JobOrder {
    jobOrderID: string
    employer: string
    position: string
    location: string
    catchmentName?: string
    startDate: Date
    deadline: Date
}

export interface UpdateJobOrder {
    employer: string
    position: string
    location: string
    startDate: Date
    deadline: Date
    catchments: string[]
    user: string
}

export interface JobDescription {
    fileName: string
    fileType: string
    buffer?: ArrayBuffer
}
