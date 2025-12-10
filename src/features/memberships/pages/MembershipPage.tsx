import { useEffect, useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { getAllMemberships } from "../services/membershipService"
import { type RenewalData } from "@/features/memberships/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MembershipTable } from "@/features/memberships/components/MembershipTable"
import { MembershipRenewalModal } from "@/features/memberships/components/MembershipRenewalModal"
import type { Membership } from "@/features/memberships/types"
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "sonner";

import {
	CreditCard,
	Search,
	Users,
	DollarSign,
	CheckCircle
} from 'lucide-react'

const MembershipPage = () => {
	const navigate = useNavigate();

	const [memberships, setMemberships] = useState<Membership[]>([])
	const [open, setOpen] = useState(false)
	const [editing, setEditing] = useState<Membership | null>(null)
	const [query, setQuery] = useState("")
	const [statusFilter, setStatusFilter] = useState<string>("all")
	const [loading, setLoading] = useState(false);
	
	// Renewal modal state
	const [renewalOpen, setRenewalOpen] = useState(false)
	const [renewingMembership, setRenewingMembership] = useState<Membership | null>(null)

	const filtered = useMemo(() => {
		const byQuery = memberships.filter((m) =>
			[m.planName, m.clientName, m.statusName, m.startDate, m.endDate, String(m.planPrice)].some((v) =>
				v.toString().toLowerCase().includes(query.toLowerCase())
			)
		)
		return statusFilter === "all" ? byQuery : byQuery.filter((m) => m.statusName === statusFilter)
	}, [memberships, query, statusFilter])

	const stats = useMemo(() => {
		const active = memberships.filter(m => m.statusName === "Active").length
		const expired = memberships.filter(m => m.statusName === "Expired").length
		const revenue = memberships.filter(m => m.statusName === "Active").reduce((sum, m) => sum + m.planPrice, 0)
		return { active, expired, revenue }
	}, [memberships])

	function onEditClick(item: Membership) {
		setRenewingMembership(item)
		setRenewalOpen(true)
	}

	function onClose() {
		setOpen(false)
		setEditing(null)
	}

	function onRenewalClose() {
		setRenewalOpen(false)
		setRenewingMembership(null)
	}

	function onSave() {
		if (!editing) return
		setMemberships((prev) => prev.map((m) => (m.id === editing.id ? editing : m)))
		onClose()
	}

	function onRenewalSubmit(renewalData: RenewalData) {

		console.log(renewalData.clientId);
		console.log(renewalData.clientName);
		setRenewalOpen(false);
		setRenewingMembership(null);
		navigate('/stepper', { 
			state: { 
				isRenewal: true, 
				renewalData: renewalData
			} 
		});
		toast.success('Redirigiendo al proceso de pago...');
	}

	useEffect(() => {
		async function fetchData() {
			try {
				const data = await getAllMemberships();
				setMemberships(data);
			} catch (err) {
				console.error("Error cargando membresías", err)
			} finally {
				setLoading(false)
			}
		}

		fetchData();
	}, [])

	if (loading) {
		return (
			<div className="flex justify-center items-center h-[400px]">
				<p className="text-muted-foreground">Cargando membresías...</p>
			</div>
		)
	}
	return (
		<SidebarProvider
			style={{
				"--sidebar-width": "calc(var(--spacing) * 72)",
				"--header-height": "calc(var(--spacing) * 12)",
			} as React.CSSProperties}
		>
			<SidebarInset>
				<div className="flex justify-center">
					<div className="flex flex-col flex-1 px-4 py-8 gap-8 max-w-[1600px]">
						{/* Header Section */}
						<div className="text-center space-y-6 relative">
							{/* Background Elements */}
							<div className="absolute inset-0 -z-10">
								<div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-96 h-96 bg-primary/10 rounded-full blur-3xl"></div>
							</div>

							<div className="relative z-10">
								<div className="inline-flex items-center justify-center w-20 h-20 bg-primary rounded-full mb-6 shadow-lg">
									<CreditCard className="h-10 w-10 text-primary-foreground" />
								</div>
								<h1 className="text-5xl font-black text-foreground mb-4">
									Membership Management
								</h1>
								<p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
									Manage your gym memberships. Track active plans, monitor revenue, and handle membership lifecycle.
								</p>
							</div>
						</div>

						<AnimatePresence mode="wait">
							<motion.div
								initial={{ opacity: 0, y: 40 }}
								animate={{ opacity: 1, y: 0 }}
								exit={{ opacity: 0, y: -40 }}
								transition={{ duration: 1.2, ease: "easeInOut" }}
								className="space-y-6 relative" // slow motion
							>
								<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
									<Card>
										<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
											<CardTitle className="text-sm font-medium text-muted-foreground">
												Active Memberships
											</CardTitle>
											<CheckCircle className="h-4 w-4" />
										</CardHeader>
										<CardContent>
											<div className="text-2xl font-bold">{stats.active}</div>
											<p className="text-xs text-muted-foreground">
												Currently active
											</p>
										</CardContent>
									</Card>

									<Card>
										<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
											<CardTitle className="text-sm font-medium text-muted-foreground">
												Expired Memberships
											</CardTitle>
											<Users className="h-4 w-4" />
										</CardHeader>
										<CardContent>
											<div className="text-2xl font-bold">{stats.expired}</div>
											<p className="text-xs text-muted-foreground">
												Need renewal
											</p>
										</CardContent>
									</Card>

									<Card>
										<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
											<CardTitle className="text-sm font-medium text-muted-foreground">
												Monthly Revenue
											</CardTitle>
											<DollarSign className="h-4 w-4" />
										</CardHeader>
										<CardContent>
											<div className="text-2xl font-bold">${stats.revenue.toFixed(2)}</div>
											<p className="text-xs text-muted-foreground">
												From active memberships
											</p>
										</CardContent>
									</Card>
								</div>

								{/* Search and Filter Section */}
								<Card>
									<CardHeader>
										<div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
											<div>
												<CardTitle className="text-xl font-semibold">Memberships</CardTitle>
												<p className="text-muted-foreground text-sm">Manage and track all membership plans</p>
											</div>
											<div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
												<div className="flex items-center gap-2">
													<div className="relative">
														<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
														<Input
															placeholder="Search memberships..."
															value={query}
															onChange={(e) => setQuery(e.target.value)}
															className="pl-10"
														/>
													</div>
													<Select value={statusFilter} onValueChange={(v) => setStatusFilter(v)}>
														<SelectTrigger className="w-[160px]">
															<SelectValue placeholder="Status" />
														</SelectTrigger>
														<SelectContent>
															<SelectItem value="all">All Status</SelectItem>
															<SelectItem value="Active">Active</SelectItem>
															<SelectItem value="Suspended">Paused</SelectItem>
															<SelectItem value="Expired">Expired</SelectItem>
														</SelectContent>
													</Select>
												</div>

											</div>
										</div>
									</CardHeader>
									<CardContent>
										<div className="flex flex-col gap-4">
											<MembershipTable memberships={filtered} onEdit={onEditClick} />

											{filtered.length === 0 && (
												<div className="text-center py-12">
													<Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
													<h3 className="text-lg font-semibold text-foreground mb-2">No memberships found</h3>
													<p className="text-muted-foreground">
														{query || statusFilter !== "all"
															? "No memberships match your search criteria"
															: "No memberships available"}
													</p>
													{(query || statusFilter !== "all") && (
														<Button
															variant="outline"
															onClick={() => {
																setQuery('');
																setStatusFilter("all");
															}}
															className="mt-4"
														>
															Clear filters
														</Button>
													)}
												</div>
											)}
										</div>
									</CardContent>
								</Card>
							</motion.div>
						</AnimatePresence>

						{/* Statistics Cards */}

					</div>
				</div>
			</SidebarInset>

			{/* Membership Renewal Modal */}
			<MembershipRenewalModal
				open={renewalOpen}
				onOpenChange={onRenewalClose}
				membership={renewingMembership}
				onRenewalSubmit={onRenewalSubmit}
			/>

			{/* Edit Membership Dialog - keeping for backward compatibility */}
			<Dialog open={open} onOpenChange={(o) => (o ? setOpen(true) : onClose())}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Edit Membership</DialogTitle>
					</DialogHeader>
					<div className="grid gap-4 py-2">
						<div className="grid gap-2">
							<Label htmlFor="plan">Plan Name</Label>
							<Input id="plan" value={editing?.planName ?? ""} onChange={(e) => editing && setEditing({ ...editing, planName: e.target.value })} />
						</div>
						<div className="grid gap-2">
							<Label htmlFor="status">Status</Label>
							<Select value={editing?.statusName} onValueChange={(v) => editing && setEditing({ ...editing, statusName: v as Membership["statusName"] })}>
								<SelectTrigger id="status">
									<SelectValue placeholder="Select status" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="Active">Active</SelectItem>
									<SelectItem value="Suspended">Paused</SelectItem>
									<SelectItem value="Expired">Expired</SelectItem>
								</SelectContent>
							</Select>
						</div>
						<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
							<div className="grid gap-2">
								<Label htmlFor="start">Start Date</Label>
								<Input id="start" type="date" value={editing?.startDate ?? ""} onChange={(e) => editing && setEditing({ ...editing, startDate: e.target.value })} />
							</div>
							<div className="grid gap-2">
								<Label htmlFor="end">End Date</Label>
								<Input id="end" type="date" value={editing?.endDate ?? ""} onChange={(e) => editing && setEditing({ ...editing, endDate: e.target.value })} />
							</div>
						</div>
						<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
							<div className="grid gap-2">
								<Label htmlFor="price">Price</Label>
								<Input id="price" type="number" step="0.01" value={editing?.planPrice ?? 0} onChange={(e) => editing && setEditing({ ...editing, planPrice: Number(e.target.value) })} />
							</div>
							<div className="flex items-center gap-2 pt-6">
								<Checkbox id="auto" checked={editing?.autoRenew ?? false} onCheckedChange={(c) => editing && setEditing({ ...editing, autoRenew: Boolean(c) })} />
								<Label htmlFor="auto">Auto Renewal</Label>
							</div>
						</div>
					</div>
					<DialogFooter>
						<Button variant="outline" onClick={onClose}>Cancel</Button>
						<Button onClick={onSave}>Save</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</SidebarProvider>
	)
}

export default MembershipPage