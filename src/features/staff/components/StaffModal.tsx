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
import { toast } from 'sonner';
import { cn } from "@/lib/utils"
import Modal from '@/components/shadcn/modal'

export function StaffModal({ className, onStaffAdded }: { className?: string, onStaffAdded?: () => void }) {

    const [username, setUsername] = useState<string | ''>('');
    const [email, setEmail] = useState<string | ''>('');
    const [name, setName] = useState<string |''>('');
    const [password, setPassword] = useState<string | ''>('');
    const [confirmPassword, setConfirmPassword] = useState<string | ''>('');
    const {registerStaff, isLoading } = useContext(UserAuthContext);
    const [open, setOpen] = useState(false);

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await registerStaff({ name, email, username, password, confirmPassword });
            toast.success('Staff member added successfully! They can now access the system.');
            setOpen(false);
            onStaffAdded?.();
        } catch (e: any) {
            toast.error(e.response?.data?.error)
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
                <form className={cn("flex flex-col gap-4", className)} onSubmit={handleRegister}>
                    <div>
                        <Label className='mb-2' htmlFor="name">Full Name</Label>
                        <Input id="name" placeholder="Enter staff member's full name" value={name} onChange={(e) => setName(e.target.value)} disabled={isLoading} />
                    </div>
                    <div>
                        <Label className='mb-2' htmlFor="username">Username</Label>
                        <Input id="username" placeholder="Choose a username" value={username} onChange={(e) => setUsername(e.target.value)} disabled={isLoading} />
                    </div>
                    <div>
                        <Label className='mb-2' htmlFor="email">Email Address</Label>
                        <Input id="email" type="email" placeholder="Enter email address" value={email} onChange={(e) => setEmail(e.target.value)} disabled={isLoading} />
                    </div>
                    <div>
                        <Label className='mb-2' htmlFor="password">Password</Label>
                        <Input id="password" type="password" placeholder="Create a secure password" value={password} onChange={(e) => setPassword(e.target.value)} disabled={isLoading} />
                    </div>
                    <div>
                        <Label className='mb-2' htmlFor="confirmPassword">Confirm Password</Label>
                        <Input id="confirmPassword" type="password" placeholder="Confirm the password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} disabled={isLoading} />
                    </div>
                    <Button type="submit" className="w-full" disabled={isLoading}>
                        {isLoading ? "Adding staff member..." : "Add Staff Member"}
                    </Button>
                </form>
            </DialogContent>

        </Modal>
    )
}


