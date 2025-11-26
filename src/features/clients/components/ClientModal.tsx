import React, { useContext } from 'react'
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
import { clientService } from "@/features/clients/services/clientService";
import { toast } from 'sonner';
import { cn } from "@/lib/utils"
import Modal from '@/components/shadcn/modal'

export function ClientModal({ className, onClientAdded }: { className?: string, onClientAdded?: () => void }) {

    const [fullName, setFullName] = useState<string | ''>('');
    const [email, setEmail] = useState<string | ''>('');
    const [phoneNumber, setPhoneNumber] = useState<string | ''>('');
    const [nationalId, setNationalId] = useState<string | ''>('');
    const [birthday, setBirthday] = useState<Date>(new Date());
    const { isLoading } = useContext(UserAuthContext);

    const [open, setOpen] = useState(false);

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await clientService.createClient({ fullName, email, phoneNumber, nationalId, birthday });
            toast.success('Client added successfully! You can now track their progress.');
            setOpen(false);
            onClientAdded?.();
        } catch (e: any) {
            setOpen(true);
            toast.error(e.response?.data?.error)
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
                <form className={cn("flex flex-col gap-4", className)} onSubmit={handleRegister}>
                    <div>
                        <Label className='mb-2' htmlFor="fullName">Full Name</Label>
                        <Input id="fullName" placeholder="Enter client's full name" value={fullName} onChange={(e) => setFullName(e.target.value)} disabled={isLoading} />
                    </div>
                    <div>
                        <Label className='mb-2' htmlFor="email">Email Address</Label>
                        <Input id="email" type="email" placeholder="Enter email address" value={email} onChange={(e) => setEmail(e.target.value)} disabled={isLoading} />
                    </div>
                    <div>
                        <Label className='mb-2' htmlFor="phoneNumber">Phone Number</Label>
                        <Input id="phoneNumber" type="tel" placeholder="Enter phone number" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} disabled={isLoading} />
                    </div>
                     <div>
                        <Label className='mb-2' htmlFor="nationalId">National ID</Label>
                        <Input id="nationalId" type="text" placeholder="Enter national ID" value={nationalId} onChange={(e) => setNationalId(e.target.value)} disabled={isLoading} />
                    </div>
                     <div>
                        <Label className='mb-2' htmlFor="birthday">Date of Birth</Label>
                        <Input id="birthday" type="date" value={birthday ? birthday.toISOString().split("T")[0] : ""} onChange={(e) => setBirthday(new Date(e.target.value))} disabled={isLoading} />
                    </div>
                    <Button type="submit" className="w-full" disabled={isLoading}>
                        {isLoading ? "Adding client..." : "Add Client"}
                    </Button>
                </form>
            </DialogContent>

        </Modal>
    )
}


