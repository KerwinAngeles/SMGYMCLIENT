export type Membership = {
	id: number
	clientId: number
	planName: string
	clientName: string
	statusName: string
	startDate: string
	endDate: string
	planPrice: number
	autoRenew: boolean
}

export interface RenewalData {
    membershipId: number;
    clientId: number;
    clientName: string;
    planId: number;
    planName: string;
    planPrice: number;
    startDate: string;
    endDate: string;
    duration: number;
    features: string[];
}
