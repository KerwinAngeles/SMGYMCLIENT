import React, { useContext, useEffect, useState } from 'react'
import {
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogContent,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { UserAuthContext } from '@/features/auth/context/AuthContext'
import { planService } from "@/features/plans/services/planService"
import { toast } from 'sonner'
import { cn } from "@/lib/utils"
import Modal from '@/components/shadcn/modal'
import { type EditPlanRequest } from '@/features/types/auth'
import { Plus, Edit3, X } from 'lucide-react'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"


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
    const [name, setName] = useState<string>('')
    const [price, setPrice] = useState<string>('')
    const [duration, setDuration] = useState<string>('')
    const [description, setDescription] = useState<string>('')
    const [features, setFeatures] = useState<string[]>([])
    const [current, setCurrent] = useState("")
    const { isLoading } = useContext(UserAuthContext)
    const [open, setOpen] = useState(false)


    const addFeature = () => {
        if (current.trim() !== "" && !features.includes(current.trim())) {
            setFeatures([...features, current.trim()])
            setCurrent("")
        }
    }

    const removeFeature = (feature: string) => {
        setFeatures(features.filter((f) => f !== feature))
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" || e.key === ",") {
            e.preventDefault()
            addFeature()
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!name || !price || !duration || !description || !features) {
            toast.error('Please fill in all required fields')
            return
        }

        try {
            const planData = {
                id: editPlan?.id || 0,
                name: name,
                price: parseFloat(price),
                duration: parseInt(duration),
                description: description,
                planFeatures: features
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
        } catch (e: any) {
            toast.error(e.response?.data?.error)

        }
    }

    useEffect(() => {
        if (editPlan) {
            setName(editPlan.name || '')
            setPrice(editPlan.price?.toString() || '')
            setDuration(editPlan.duration?.toString() || '')
            setDescription(editPlan.description || '')
            setFeatures(editPlan.planFeatures || [])
        } else {
            resetForm()
        }
    }, [editPlan, open])

    const resetForm = () => {
        setName('')
        setPrice('')
        setDuration('')
        setDescription('')
        setFeatures([])
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

                <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
                    {/* Name */}
                    <div className="space-y-2">
                        <Label htmlFor="name" className="text-sm font-medium">Plan Name</Label>
                        <Select 
                            value={name}
                            onValueChange={(value) => {
                                setName(value)
                                if (value === "Basic") setDuration("30")
                                if (value === "Plus") setDuration("90")
                                if (value === "Pro") setDuration("360")
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
                    </div>

                    {/* Price & Duration */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="price" className="text-sm font-medium">Price ($)</Label>
                            <Input
                                id="price"
                                type="number"
                                step="0.01"
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                                disabled={isLoading}
                                className="h-11"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="duration" className="text-sm font-medium">Duration (days)</Label>
                            <Input
                                id="duration"
                                type="number"
                                value={duration}
                                onChange={(e) => setDuration(e.target.value)}
                                disabled={isLoading}
                                className="h-11"
                            />
                        </div>
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                        <Label htmlFor="description" className="text-sm font-medium">Description</Label>
                        <Input
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            disabled={isLoading}
                            className="h-11"
                        />
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
                        </div>
                    </div>

                    {/* Submit */}
                    <Button
                        type="submit"
                        className="w-full h-11 font-semibold shadow-md hover:shadow-lg"
                        disabled={isLoading}
                    >
                        {isLoading
                            ? (editPlan ? "Updating..." : "Creating...")
                            : (editPlan ? "Update Plan" : "Create Plan")}
                    </Button>
                </form>
            </DialogContent>

        </Modal >
    )
}
