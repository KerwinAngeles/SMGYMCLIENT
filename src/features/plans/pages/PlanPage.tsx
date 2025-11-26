import {
    SidebarInset,
    SidebarProvider,
} from "@/components/ui/sidebar"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle
} from "@/components/ui/card"
import React, { useEffect, useState, useContext } from "react"
import { Button } from "@/components/ui/button"
import { type EditPlanRequest } from '@/features/plans/types'
import { planService } from '../services/planService'
import { CheckCircle2, Edit3, Trash2, Star } from 'lucide-react'
import { toast } from "sonner"
import { PlanModal } from '../components/PlanModal'
import DeleteModal from '../components/DeleteModal'
import { UserAuthContext } from '@/features/auth/context/AuthContext'
import { AnimatePresence, motion } from "framer-motion";


async function getData(): Promise<EditPlanRequest[]> {
    const response = await planService.getAllPlans();
    return response;
}

const PlanPage = () => {
    const [data, setData] = useState<EditPlanRequest[]>([])
    const { hasRole } = useContext(UserAuthContext)
    const [deleteModalOpen, setDeleteModalOpen] = useState(false)
    const [selectedPlanId, setSelectedPlanId] = useState<number | null>(null)

    useEffect(() => {
        loadData()
    }, [])

    const loadData = async () => {
        try {
            const plans = await getData()
            setData(plans)
        } catch (error) {
        }
    }


    const handleDeletePlan = async (planId: number) => {
        setDeleteModalOpen(false);
        try {
            await planService.DeletePlan(planId)
            setData((prev) => prev.filter((plan) => plan.id !== planId));
            toast.success('Plan deleted successfully!')
        } catch (error) {
            toast.error('Failed to delete plan')
        } finally {
            setSelectedPlanId(null)
        }
    }

    return (
        <SidebarProvider
            style={{
                "--sidebar-width": "calc(var(--spacing) * 72)",
                "--header-height": "calc(var(--spacing) * 12)",
            } as React.CSSProperties}
        >
            <SidebarInset>
                <div className="flex flex-col flex-1 px-4 py-8 gap-8">
                    {/* Header Section */}
                    <div className="text-center space-y-6 relative">
                        <div className="absolute inset-0 -z-10">
                            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-96 h-96 bg-primary/10 rounded-full blur-3xl"></div>
                        </div>

                        <div className="relative z-10">
                            <div className="inline-flex items-center justify-center w-20 h-20 bg-primary rounded-full mb-6 shadow-lg">
                                <CheckCircle2 className="h-10 w-10 text-primary-foreground" />
                            </div>
                            <h1 className="text-5xl font-black text-foreground mb-4">
                                Membership Plans
                            </h1>
                            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                                Transform your fitness journey with our membership options.
                                Choose the perfect plan that aligns with your goals and lifestyle.
                            </p>
                        </div>
                    </div>

                    {/* Management Actions */}
                    {hasRole('Administrator') && (
                        <div className="flex flex-wrap gap-4 justify-center">
                            <div className="flex items-center gap-2 px-4 py-2 bg-card rounded-lg shadow-md border border-border">
                                <span className="text-sm font-medium text-muted-foreground">Admin Tools:</span>
                                <PlanModal onPlanAdded={loadData} />
                            </div>
                        </div>
                    )}


                    <AnimatePresence mode="wait">
                        <motion.div
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -40 }}
                            transition={{ duration: 1.2, ease: "easeInOut" }} // slow motion
                        >
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full">
                                {data.map((item) => (
                                    <div key={item.id} className="relative group">
                                        {/* Admin Actions */}
                                        {hasRole("Administrator") && (
                                            <div className="absolute top-4 right-4 flex gap-2 z-10">
                                                <PlanModal
                                                    editPlan={item}
                                                    onPlanUpdated={loadData}
                                                    className="h-8 w-8 p-0 shadow-md"
                                                >
                                                    <Edit3 className="h-4 w-4" />
                                                </PlanModal>
                                                <Button
                                                    size="sm"
                                                    variant="destructive"
                                                    onClick={() => {
                                                        setSelectedPlanId(item.id)
                                                        setDeleteModalOpen(true)
                                                    }}
                                                    className="h-8 w-8 p-0 shadow-md"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        )}


                                        <Card className="h-full border-0 shadow-lg transition-transform duration-300 hover:shadow-2xl hover:-translate-y-2 relative overflow-hidden">
                                            <CardHeader className="relative z-10 pb-6 pt-8">
                                                <CardTitle className="text-3xl font-bold text-card-foreground">
                                                    {item.name}
                                                </CardTitle>
                                                <CardDescription className="mt-2 text-muted-foreground">
                                                    {item.description}
                                                </CardDescription>
                                            </CardHeader>

                                            <CardContent className="relative z-10 flex flex-col space-y-4">
                                                {/* Price */}
                                                <div className="text-5xl font-extrabold text-card-foreground">
                                                    ${item.price}
                                                </div>

                                                {/* Duration */}
                                                <div className="text-sm font-medium text-muted-foreground">
                                                    Duration: {item.duration} days
                                                </div>

                                                {/* Features */}

                                            </CardContent>

                                            <CardFooter className="relative z-10 pt-6">
                                                <div className="flex flex-wrap gap-2 mt-2">
                                                    {item.planFeatures && item.planFeatures.length > 0 ? (
                                                        item.planFeatures.map((feature, index) => (
                                                            <div className="flex items-center gap-2" key={index}>
                                                                <span>
                                                                    <Star className="h-4 w-4 text-muted-foreground" />
                                                                </span>
                                                                <span
                                                                    key={index}
                                                                    className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium"
                                                                >
                                                                    {feature}
                                                                </span>
                                                            </div>
                                                        ))
                                                    ) : (
                                                        <span className="text-muted-foreground text-sm">No features</span>
                                                    )}
                                                </div>
                                            </CardFooter>
                                        </Card>
                                    </div>
                                ))}
                            </div>

                        </motion.div>
                    </AnimatePresence>
                    {/* Plans Grid */}

                </div>

                <DeleteModal
                    open={deleteModalOpen}
                    onClose={() => setDeleteModalOpen(false)}
                    onConfirm={() => {
                        if (selectedPlanId != null) handleDeletePlan(selectedPlanId)
                    }}
                    planName={data.find(p => p.id === selectedPlanId)?.name ?? ""}
                />
            </SidebarInset>
        </SidebarProvider>
    )
}

export default PlanPage
