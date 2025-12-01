import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import type { Membership } from "@/features/memberships/types"

export type MembershipTableProps = {
	memberships: Membership[]
	onEdit: (m: Membership) => void
}


export function MembershipTable(props: MembershipTableProps) {
	const { memberships, onEdit } = props
	return (
		<div className="rounded-lg border bg-background">
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead>Plan</TableHead>
						<TableHead>Client</TableHead>
						<TableHead>Status</TableHead>
						<TableHead>StartDate</TableHead>
						<TableHead>EndDate</TableHead>
						<TableHead>Price</TableHead>
						{/* <TableHead>Renew</TableHead> */}
						<TableHead className="text-right">Actions</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{memberships.map((m) => (
						<TableRow key={m.id}>
							<TableCell className="font-medium">{m.planName}</TableCell>
							<TableCell className="font-medium">{m.clientName}</TableCell>
							<TableCell className="font-medium">{m.statusName}</TableCell>
							<TableCell>{new Date(m.startDate).toLocaleDateString()}</TableCell>
							<TableCell>{new Date(m.endDate).toLocaleDateString()}</TableCell>
							<TableCell>{new Intl.NumberFormat(undefined, { style: "currency", currency: "USD" }).format(m.planPrice)}</TableCell>
							{/* <TableCell>{m.autoRenew ? "Sí" : "No"}</TableCell> */}
							<TableCell className="text-right">
								<Button 
									size="sm" 
									variant="default" 
									onClick={() => onEdit(m)}
									className="bg-primary hover:bg-primary/90 text-primary-foreground"
								>
									Renovar
								</Button>
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</div>
	)
}
