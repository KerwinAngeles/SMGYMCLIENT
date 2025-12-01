export type Membership = {
	id: string
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
    membershipId: string;
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
