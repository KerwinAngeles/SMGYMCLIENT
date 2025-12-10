export interface ClientStatistics {
    currentClients: number,
    previousClients: number,
    growthRateClient: number,
    totalClient: number,
    activeClients: number,
    inactiveClients: number,
    suspendedClients: number
}

export interface MembershipStatistics {
    membershipActive: number,
    membershipInactive: number,
    membershipSuspended: number,
    membershipCancelled: number,
}