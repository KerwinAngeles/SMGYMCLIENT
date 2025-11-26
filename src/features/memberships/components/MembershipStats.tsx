import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BadgeCheck, PauseCircle, XCircle, DollarSign } from "lucide-react"

export type MembershipStatsProps = {
	active: number
	paused: number
	expired: number
	revenue: number
}

export function MembershipStats(props: MembershipStatsProps) {
	const { active, paused, expired, revenue } = props
	return (
		<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
			<Card>
				<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
					<CardTitle className="text-sm font-medium text-muted-foreground">Activas</CardTitle>
					<BadgeCheck className="h-4 w-4 text-primary" />
				</CardHeader>
				<CardContent>
					<div className="text-2xl font-bold text-primary">{active}</div>
					<p className="text-xs text-muted-foreground">Membresías activas</p>
				</CardContent>
			</Card>

			<Card>
				<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
					<CardTitle className="text-sm font-medium text-muted-foreground">Pausadas</CardTitle>
					<PauseCircle className="h-4 w-4 text-secondary-foreground" />
				</CardHeader>
				<CardContent>
					<div className="text-2xl font-bold text-secondary-foreground">{paused}</div>
					<p className="text-xs text-muted-foreground">Temporalmente detenidas</p>
				</CardContent>
			</Card>

			<Card>
				<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
					<CardTitle className="text-sm font-medium text-muted-foreground">Vencidas</CardTitle>
					<XCircle className="h-4 w-4 text-destructive" />
				</CardHeader>
				<CardContent>
					<div className="text-2xl font-bold text-destructive">{expired}</div>
					<p className="text-xs text-muted-foreground">Necesitan renovación</p>
				</CardContent>
			</Card>

			<Card>
				<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
					<CardTitle className="text-sm font-medium text-muted-foreground">Ingreso estimado</CardTitle>
					<DollarSign className="h-4 w-4 text-primary" />
				</CardHeader>
				<CardContent>
					<div className="text-2xl font-bold text-foreground">
						{new Intl.NumberFormat(undefined, { style: "currency", currency: "USD" }).format(revenue)}
					</div>
					<p className="text-xs text-muted-foreground">Solo activas</p>
				</CardContent>
			</Card>
		</div>
	)
}
