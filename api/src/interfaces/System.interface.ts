export interface Catchment {
    catchmentID: number,
    name: string,
    serviceProvider: string
}

export interface OESAccessDefinition {
    Application: string,
    Catchment: string,
    CatchmentDescription: string,
    Group: string,
    Permission: number,
    PermissionsCode: string,
    Role: string
}