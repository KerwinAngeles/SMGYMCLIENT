import { useContext } from 'react'
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
import { useState } from 'react'
import { UserAuthContext } from '@/features/auth/context/AuthContext'
import { toast } from 'sonner';
import { cn } from "@/lib/utils"
import Modal from '@/components/shadcn/modal'
import { z } from "zod";
import { useForm, type SubmitHandler } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

const staffModalFormSchema = z.object({
    name: z.string().min(4),
    username: z.string().min(4),
    email: z.string().email(),
    password: z.string().min(8),
    confirmPassword: z.string().min(8),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Password do not match",
    path: ["confirmPassword"]
})

type StaffModalFormSchema = z.infer<typeof staffModalFormSchema>

export function StaffModal({ className, onStaffAdded }: { className?: string, onStaffAdded?: () => void }) {

    const { registerStaff } = useContext(UserAuthContext);
    const [open, setOpen] = useState(false);

    const { register, handleSubmit, setError, formState: { errors, isSubmitting } } = useForm<StaffModalFormSchema>({
        resolver: zodResolver(staffModalFormSchema)
    });

    const onSubmit: SubmitHandler<StaffModalFormSchema> = async (data) => {
        try {
            await registerStaff(data);
            toast.success('Staff member added successfully! They can now access the system.');
            setOpen(false);
            onStaffAdded?.();
        } catch (error: any) {
            setError("root", {
                message: error.error
            })
        }
    }

    return (
        <Modal open={open} setOpen={setOpen}>
            <DialogTrigger asChild>
                <Button onClick={() => setOpen(true)}>Add New Staff</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add New Staff Member</DialogTitle>
                    <DialogDescription>
                        Create an account for a new staff member to help manage your gym
                    </DialogDescription>
                </DialogHeader>
                <form className={cn("flex flex-col gap-4", className)} onSubmit={handleSubmit(onSubmit)}>
                    <div>
                        <Label className='mb-2' htmlFor="name">Full Name</Label>
                        <Input id="name" placeholder="Enter staff member's full name" {...register("name")} disabled={isSubmitting} />
                        {errors.name && (
                            <div className='text-red-500 text-start'>{errors.name.message}</div>
                        )}
                    </div>
                    <div>
                        <Label className='mb-2' htmlFor="username">Username</Label>
                        <Input id="username" placeholder="Choose a username" {...register("username")} disabled={isSubmitting} />
                        {errors.username && (
                            <div className='text-red-500 text-start'>{errors.username.message}</div>
                        )}
                    </div>
                    <div>
                        <Label className='mb-2' htmlFor="email">Email Address</Label>
                        <Input id="email" type="email" placeholder="Enter email address" {...register("email")} disabled={isSubmitting} />
                         {errors.email && (
                            <div className='text-red-500 text-start'>{errors.email.message}</div>
                        )}
                    </div>
                    <div>
                        <Label className='mb-2' htmlFor="password">Password</Label>
                        <Input id="password" type="password" placeholder="Create a secure password" {...register("password")} disabled={isSubmitting} />
                         {errors.password && (
                            <div className='text-red-500 text-start'>{errors.password.message}</div>
                        )}
                    </div>
                    <div>
                        <Label className='mb-2' htmlFor="confirmPassword">Confirm Password</Label>
                        <Input id="confirmPassword" type="password" placeholder="Confirm the password" {...register("confirmPassword")} disabled={isSubmitting} />
                         {errors.confirmPassword && (
                            <div className='text-red-500 text-start'>{errors.confirmPassword.message}</div>
                        )}
                    </div>
                    <Button type="submit" className="w-full" disabled={isSubmitting}>
                        {isSubmitting ? "Adding staff member..." : "Add Staff Member"}
                    </Button>
                </form>
            </DialogContent> 
        </Modal>
    )
}


