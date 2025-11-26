import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { type ClientEdit, type EditClientModalProps } from "@/features/clients/types"
import { useState, useEffect } from "react"

export function EditClientModal({ open, onClose, clientEdit, onSave }: EditClientModalProps) {
    const [formData, setFormData] = useState<ClientEdit | null>(null)

    useEffect(() => {
        if (clientEdit) {
            setFormData({
                ...clientEdit,
                birthDay: clientEdit.birthDay.split("T")[0],
            })
        }
    }, [clientEdit])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!formData) return
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleSubmit = () => {
        if (formData) {
            onSave(formData)
        }
    }

    return (
        <Dialog open={open} onOpenChange={(isOpen) => {
            if (!isOpen) {
                onClose()
            }
        }}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit Client</DialogTitle>
                    <DialogDescription>
                        Update the fields below to keep the client’s data accurate and up to date.
                    </DialogDescription>
                </DialogHeader>

                {formData ? (
                    <div className="space-y-4">
                        <div>
                            <Label className="mb-2">FullName</Label>
                            <Input name="fullName" value={formData.fullName} onChange={handleChange} />
                        </div>
                        <div>
                            <Label className="mb-2">Email</Label>
                            <Input name="email" value={formData.email} onChange={handleChange} />
                        </div>
                        <div>
                            <Label className="mb-2">PhoneNumber</Label>
                            <Input name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} />
                        </div>
                        <div>
                            <Label className="mb-2">NationalId</Label>
                            <Input name="nationalId" value={formData.nationalId} onChange={handleChange} />
                        </div>
                        <div>
                            <Label className="mb-2">Birthday</Label>
                            <Input
                                type="date"
                                name="birthDay"
                                value={formData?.birthDay ?? ""}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="flex justify-end space-x-2">
                            <Button variant="outline" onClick={onClose}>
                                Cancel
                            </Button>
                            <Button onClick={handleSubmit}>Update Client</Button>
                        </div>
                    </div>
                ) : (
                    <p>Loading client data...</p>
                )}
            </DialogContent>
        </Dialog>
    )
}
