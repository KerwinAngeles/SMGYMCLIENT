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
import { clientService } from "@/features/clients/services/clientService";
import { toast } from 'sonner';
import { cn } from "@/lib/utils"
import Modal from '@/components/shadcn/modal'
import { z } from "zod";
import { useForm, type SubmitHandler } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

const clientFormSchema = z.object({
    fullName: z.string().min(4),
    email: z.string().email(),
    phoneNumber: z.string().min(8),
    nationalId: z.string().min(8),
    birthday: z.date().refine(
        (date) => date <= new Date(),
        "Date can not be bigger than today"
    )
        .refine(
            (date) => {
                const age = new Date().getFullYear() - date.getFullYear();
                return age >= 18;
            },
            "Must be 18 older"
        ),
})

type ClientFormSchema = z.infer<typeof clientFormSchema>

export function ClientModal({ className, onClientAdded }: { className?: string, onClientAdded?: () => void }) {
    const [open, setOpen] = useState(false);

    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ClientFormSchema>({
        resolver: zodResolver(clientFormSchema)
    })

    const onSubmit: SubmitHandler<ClientFormSchema> = async (data) => {
        try {
            await clientService.createClient(data)
            toast.success('Client added successfully! You can now track their progress.');
            setOpen(false);
            onClientAdded?.();

        } catch (e: any) {
            setOpen(true);
            toast.error(e.response?.data?.error, {
                id: "login",
                duration: 5000,
            });
        }
    }

    return (
        <Modal open={open} setOpen={setOpen}>
            <DialogTrigger asChild>
                <Button onClick={() => setOpen(true)}>Add New Client</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add New Client</DialogTitle>
                    <DialogDescription>
                        Enter client information to start tracking their membership and progress
                    </DialogDescription>
                </DialogHeader>
                <form className={cn("flex flex-col gap-4", className)} onSubmit={handleSubmit(onSubmit)}>
                    <div>
                        <Label className='mb-2' htmlFor="fullName">Full Name</Label>
                        <Input id="fullName" placeholder="Enter client's full name" {...register("fullName")} disabled={isSubmitting} />
                        {errors.fullName && (
                            <div className='text-red-500 text-start'>{errors.fullName.message}</div>
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
                        <Label className='mb-2' htmlFor="phoneNumber">Phone Number</Label>
                        <Input id="phoneNumber" type="tel" placeholder="Enter phone number" {...register("phoneNumber")} disabled={isSubmitting} />
                        {errors.phoneNumber && (
                            <div className='text-red-500 text-start'>{errors.phoneNumber.message}</div>
                        )}
                    </div>
                    <div>
                        <Label className='mb-2' htmlFor="nationalId">National ID</Label>
                        <Input id="nationalId" type="text" placeholder="Enter national ID" {...register("nationalId")} disabled={isSubmitting} />
                         {errors.nationalId && (
                            <div className='text-red-500 text-start'>{errors.nationalId.message}</div>
                        )}
                    </div>
                    <div>
                        <Label className='mb-2' htmlFor="birthday">Date of Birth</Label>
                        <Input id="birthday" type="date" {...register("birthday")} disabled={isSubmitting} />
                         {errors.birthday && (
                            <div className='text-red-500 text-start'>{errors.birthday.message}</div>
                        )}
                    </div>
                    <Button type="submit" className="w-full" disabled={isSubmitting}>
                        {isSubmitting ? "Adding client..." : "Add Client"}
                    </Button>
                </form>
            </DialogContent>

        </Modal>
    )
}


