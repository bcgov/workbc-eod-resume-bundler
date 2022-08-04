export interface Catchment {
    catchmentID: number
    name: string
    serviceProvider: string
}

export interface OESAccessDefinition {
    Application: string
    Catchment: string
    CatchmentDescription: string
    Group: string
    Permission: number
    PermissionsCode: string
    Role: string
}

export interface OESProfile {
    BCSC_ACTIVE_IND?: string
    BCSC_DID?: string
    BCSC_LINK_CD?: string
    BCSC_REG_DTS?: string
    BCeID?: string
    BirthDate?: string
    ClientIP?: string
    Email?: string
    FirstName?: string
    GuID?: string
    ID?: number
    IsLinked?: boolean
    LOGIN_AGENT?: string
    LastLoginDate?: string
    LastName?: string
    LinkStatus?: string
    LinkedSRs?: Array<any>
    MiddleName?: string
    ProgramType?: string
    Sin?: string
    UpdateLockNumber?: number
    ApplicationCode?: string
    CatchmentCode?: string
    GenderCode?: string
    IsEmailNotificationExpired?: boolean
    IsEmailVerified?: boolean
    IsMobileNotificationExpired?: boolean
    IsMobileVerified?: boolean
    KmlID?: string
    PerferredLanguageCode?: string
    Phn?: string
    PhoneNumbers?: Array<any>
    PortalRequestCreateDateTime?: string
    PreferredNotificationMethodCode?: 0
    StorefrontID?: string
}
