import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { type Staff, type EditStaffModalProps } from "@/features/staff/types"
import { useState, useEffect } from "react"

export function EditStaffModal({ open, onClose, staff, onSave }: EditStaffModalProps) {
    const [formData, setFormData] = useState<Staff | null>(staff);
    useEffect(() => {
        setFormData(staff)
    }, [staff]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!formData) return;
        setFormData({ ...formData, [e.target.name]: e.target.value });
    }

    const handleSubmit = () => {
        if (formData) onSave(formData)
        onClose();
    }

    if (!formData) return null

    return (
        <Dialog open={open} onOpenChange={(next) => { if(!next) onClose(); }}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit Staff Profile</DialogTitle>
                    <DialogDescription>Keep the staff member’s information accurate by updating the fields below.</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                    <div>
                        <Label className="mb-2">Name</Label>
                        <Input name="name" value={formData.name} onChange={handleChange} />
                    </div>
                    <div>
                        <Label className="mb-2">Email</Label>
                        <Input name="email" value={formData.email} onChange={handleChange} />
                    </div>
                    <div>
                        <Label className="mb-2">Username</Label>
                        <Input name="userName" value={formData.userName} onChange={handleChange} />
                    </div>
                    <Button onClick={handleSubmit}>Update Staff</Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}