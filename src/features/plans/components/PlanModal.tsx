import React, { useContext, useEffect, useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { UserAuthContext } from '@/features/auth/context/AuthContext'
import { planService } from "@/features/plans/services/planService"
import { toast } from 'sonner'
import { cn } from "@/lib/utils"
import Modal from '@/components/shadcn/modal'
import { type EditPlanRequest } from '@/features/plans/types'
import { Plus, Edit3, X } from 'lucide-react'
import { z } from "zod";
import { useForm, type SubmitHandler } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogContent,
} from "@/components/ui/dialog"

const planModalFormSchema = z.object({
    name: z.string().min(2),
    price: z.string().min(1),
    duration: z.string().min(1),
    description: z.string().min(8),
    features: z.array(z.string())
});

type PlanModalFormSchema = z.infer<typeof planModalFormSchema>

interface PlanModalProps {
    className?: string
    onPlanAdded?: () => void
    editPlan?: EditPlanRequest | null
    onPlanUpdated?: () => void,
    children?: React.ReactNode
}

export function PlanModal({
    className,
    onPlanAdded,
    editPlan = null,
    onPlanUpdated,
    children

}: PlanModalProps) {
    const [current, setCurrent] = useState("")
    const { isLoading } = useContext(UserAuthContext)
    const [open, setOpen] = useState(false)
    const { register, handleSubmit, setError, setValue, watch, reset, formState: { errors, isSubmitting } } = useForm<PlanModalFormSchema>({
        resolver: zodResolver(planModalFormSchema)
    });

    const features = watch("features") || []
    const addFeature = () => {
        if (current.trim() !== "" && !features.includes(current.trim())) {
            setValue("features", [...features, current.trim()])
            setCurrent("")
        }
    }

    const removeFeature = (feature: string) => {
        setValue("features", features.filter((f) => f !== feature))
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" || e.key === ",") {
            e.preventDefault()
            addFeature()
        }
    }

    const onSubmit: SubmitHandler<PlanModalFormSchema> = async (data) => {
        try {
            const planData = {
                id: editPlan?.id || 0,
                name: data.name,
                price: parseFloat(data.price),
                duration: parseInt(data.duration),
                description: data.description,
                planFeatures: data.features
            }
            if (editPlan) {
                await planService.EditPlan(planData.id, planData)
                toast.success('Plan updated successfully!')
                onPlanUpdated?.()
            } else {
                await planService.CreatePlan(planData)
                toast.success('Plan created successfully!')
                onPlanAdded?.()
            }

            setOpen(false)
            resetForm()
        } catch (error: any) {
            toast.error(error.response?.data?.error)
            setError("root", {
                message: error.error
            })
        }
    }


    useEffect(() => {
        if (editPlan) {
            reset({
                name: editPlan.name ?? "",
                price: editPlan.price?.toString() ?? "",
                duration: editPlan.duration?.toString() ?? "",
                description: editPlan.description ?? "",
                features: editPlan.planFeatures ?? []
            })
        } else {
            resetForm()
        }
    }, [editPlan, open])

    const resetForm = () => {
        reset({
            name: "",
            price: "",
            duration: "",
            description: "",
            features: []
        })
    }


    return (
        <Modal open={open} setOpen={setOpen}>
            <DialogTrigger asChild>
                {children ? (
                    <Button
                        onClick={() => setOpen(true)}
                        className={cn("gap-2 font-semibold shadow-md hover:shadow-lg transition-all duration-300", className)}
                        variant={editPlan ? "outline" : "default"}
                    >
                        {children}
                    </Button>
                ) : (
                    <Button
                        onClick={() => setOpen(true)}
                        className={cn("gap-2 font-semibold shadow-md hover:shadow-lg transition-all duration-300", className)}
                        variant={editPlan ? "outline" : "default"}
                    >
                        {editPlan ? (
                            <>
                                <Edit3 className="h-4 w-4" />
                                Edit Plan
                            </>
                        ) : (
                            <>
                                <Plus className="h-4 w-4" />
                                Add New Plan
                            </>
                        )}
                    </Button>
                )}
            </DialogTrigger>

            <DialogContent className="sm:max-w-lg rounded-2xl shadow-xl">
                <DialogHeader className="space-y-2 text-center">
                    <DialogTitle className="text-2xl font-bold tracking-tight">
                        {editPlan ? "Edit Membership Plan" : "Create New Plan"}
                    </DialogTitle>
                    <DialogDescription className="text-muted-foreground">
                        {editPlan
                            ? "Update the details of this membership plan."
                            : "Fill out the form below to create a new plan."}
                    </DialogDescription>
                </DialogHeader>

                <form className="flex flex-col gap-6" onSubmit={handleSubmit(onSubmit)}>
                    {/* Name */}
                    <div className="space-y-2">
                        <Label htmlFor="name" className="text-sm font-medium">Plan Name</Label>
                        <Select
                            {...register("name")}
                            onValueChange={(value) => {
                                setValue("name", value)
                                if (value === "Basic") setValue("duration", "30")
                                if (value === "Plus") setValue("duration", "90")
                                if (value === "Pro") setValue("duration", "360")
                            }}
                            disabled={isLoading}
                        >
                            <SelectTrigger className="h-11 w-full">
                                <SelectValue placeholder="Select a plan" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Basic">Basic</SelectItem>
                                <SelectItem value="Plus">Plus</SelectItem>
                                <SelectItem value="Pro">Pro</SelectItem>
                            </SelectContent>
                        </Select>
                        {errors.name && (
                            <div className='text-red-500 text-start'>{errors.name.message}</div>
                        )}

                    </div>

                    {/* Price & Duration */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="price" className="text-sm font-medium">Price ($)</Label>
                            <Input
                                id="price"
                                type="number"
                                step="0.01"
                                {...register("price")}
                                disabled={isLoading}
                                className="h-11"
                            />
                            {errors.price && (
                                <div className='text-red-500 text-start'>{errors.price.message}</div>
                            )}

                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="duration" className="text-sm font-medium">Duration (days)</Label>
                            <Input
                                id="duration"
                                type="number"
                                {...register("duration")}
                                disabled={isLoading}
                                className="h-11"
                            />
                            {errors.duration && (
                                <div className='text-red-500 text-start'>{errors.duration.message}</div>
                            )}
                        </div>
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                        <Label htmlFor="description" className="text-sm font-medium">Description</Label>
                        <Input
                            id="description"
                            {...register("description")}
                            disabled={isLoading}
                            className="h-11"
                        />
                        {errors.description && (
                            <div className='text-red-500 text-start'>{errors.description.message}</div>
                        )}
                    </div>

                    {/* Features */}
                    <div className="space-y-2">
                        <Label className="text-sm font-medium">Features</Label>
                        <div className="flex flex-wrap gap-2 rounded-lg border bg-muted/30 p-3">
                            {features.map((feature, index) => (
                                <div
                                    key={index}
                                    className="flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
                                >
                                    <span>{feature}</span>
                                    <button
                                        type="button"
                                        className="text-primary/70 hover:text-red-500 transition"
                                        onClick={() => removeFeature(feature)}
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}
                            <Input
                                id="features"
                                placeholder="Type and press Enter"
                                value={current}
                                onChange={(e) => setCurrent(e.target.value)}
                                onKeyDown={handleKeyDown}
                                className="flex-1 min-w-[120px] border-none bg-transparent shadow-none focus-visible:ring-0"
                            />
                            {errors.features && (
                                <div className='text-red-500 text-start'>{errors.features.message}</div>
                            )}
                        </div>
                    </div>

                    {/* Submit */}
                    <Button
                        type="submit"
                        className="w-full h-11 font-semibold shadow-md hover:shadow-lg"
                        disabled={isSubmitting}
                    >
                        {isSubmitting
                            ? (editPlan ? "Updating..." : "Creating...")
                            : (editPlan ? "Update Plan" : "Create Plan")}
                    </Button>
                </form>
            </DialogContent>

        </Modal >
    )
}
