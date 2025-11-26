import React, { useState, useContext } from 'react'
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { UserAuthContext } from '@/features/auth/context/AuthContext'
import { attendanceService } from "@/features/attendance/services/attendanceService"
import { clientService } from "@/features/clients/services/clientService"
import { toast } from 'sonner'
import { cn } from "@/lib/utils"
import Modal from '@/components/shadcn/modal'
import {type AttendanceRequest } from '@/features/attendance/types'
import {type ClientEdit } from "@/features/clients/types"
import { Clock, UserCheck, Search, Loader2 } from 'lucide-react'

interface AttendanceCheckInProps {
    className?: string
    onAttendanceRecorded?: () => void
}

export function AttendanceCheckIn({
    className,
    onAttendanceRecorded
}: AttendanceCheckInProps) {
    const [selectedClientId, setSelectedClientId] = useState<string>('')
    const [searchTerm, setSearchTerm] = useState<string>('')
    const [clients, setClients] = useState<ClientEdit[]>([])
    const [filteredClients, setFilteredClients] = useState<ClientEdit[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [isSearching, setIsSearching] = useState(false)
    const [open, setOpen] = useState(false)
    const { } = useContext(UserAuthContext)

    const loadClients = async () => {
        setIsSearching(true)
        try {
            const clientsData = await clientService.getAllClients()
            setClients(clientsData)
            setFilteredClients(clientsData)
        } catch (error) {
            toast.error('Failed to load clients')
        } finally {
            setIsSearching(false)
        }
    }

    const handleSearch = (term: string) => {
        setSearchTerm(term)
        if (term.trim() === '') {
            setFilteredClients(clients)
        } else {
            const filtered = clients.filter(client =>
                client.fullName.toLowerCase().includes(term.toLowerCase()) ||
                client.email.toLowerCase().includes(term.toLowerCase()) ||
                client.nationalId.includes(term)
            )
            setFilteredClients(filtered)
        }
    }

    const handleCheckIn = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!selectedClientId) {
            toast.error('Please select a client')
            return
        }

        const accessCode = clients.find(c => c.id === parseInt(selectedClientId))?.accessCode || '';

        setIsLoading(true)
        try {
            const attendanceRequest: AttendanceRequest = {
                clientId: parseInt(selectedClientId),
                checkInTime: new Date(),
                accessCode: accessCode
            }

            await attendanceService.checkInClient(attendanceRequest)
            toast.success('Client checked in successfully!')
            setTimeout(() => {
                setOpen(false)
                resetForm()
                onAttendanceRecorded?.()
            }, 500)
        } catch (e: any) {
            toast.error(e.response?.data?.error || 'Unable to check in client. Please try again.')
        } finally {
            setIsLoading(false)
        }
    }

    const resetForm = () => {
        setSelectedClientId('')
        setSearchTerm('')
        setFilteredClients([])
    }


    return (
        <Modal open={open} setOpen={setOpen}>
            <DialogTrigger asChild>
                <Button
                    onClick={() => {
                        setOpen(true)
                        loadClients()
                    }}
                    className={cn("gap-2 font-semibold shadow-md hover:shadow-lg transition-all duration-300", className)}
                >
                    <UserCheck className="h-4 w-4" />
                    Check In Client
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Clock className="h-5 w-5 text-primary" />
                        Check In Client
                    </DialogTitle>
                    <DialogDescription>
                        Register a client's arrival at the gym. This will record their check-in time and any notes.
                    </DialogDescription>
                </DialogHeader>
                <form className={cn("flex flex-col gap-4", className)} onSubmit={handleCheckIn}>
                    {/* Client Search */}
                    <div>
                        <Label className='mb-2' htmlFor="search">Search Client</Label>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                id="search"
                                placeholder="Search by name, email, or ID..."
                                value={searchTerm}
                                onChange={(e) => handleSearch(e.target.value)}
                                disabled={isSearching}
                                className="pl-10"
                            />
                            {isSearching && (
                                <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 animate-spin text-muted-foreground" />
                            )}
                        </div>
                    </div>

                    {/* Client Selection */}
                    <div>
                        <Label className='mb-2' htmlFor="client">Select Client</Label>
                        <Select value={selectedClientId} onValueChange={setSelectedClientId} disabled={isLoading}>
                            <SelectTrigger>
                                <SelectValue placeholder="Choose a client to check in" />
                            </SelectTrigger>
                            <SelectContent className="max-h-60">
                                {filteredClients.length === 0 && searchTerm ? (
                                    <div className="p-2 text-sm text-muted-foreground text-center">
                                        No clients found matching "{searchTerm}"
                                    </div>
                                ) : filteredClients.length === 0 ? (
                                    <div className="p-2 text-sm text-muted-foreground text-center">
                                        No clients available
                                    </div>
                                ) : (
                                    filteredClients.map((client) => (
                                        <SelectItem key={client.id} value={client.id.toString()}>
                                            <div className="flex flex-col">
                                                <span className="font-medium">{client.fullName}</span>
                                                <span className="text-xs text-muted-foreground">{client.email}</span>
                                            </div>
                                        </SelectItem>
                                    ))
                                )}
                            </SelectContent>
                        </Select>
                    </div>

                    <Button type="submit" className="w-full" disabled={isLoading || !selectedClientId}>
                        {isLoading ? (
                            <>
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                Checking in...
                            </>
                        ) : (
                            <>
                                <UserCheck className="h-4 w-4 mr-2" />
                                Check In Client
                            </>
                        )}
                    </Button>
                </form>
            </DialogContent>
        </Modal>
    )
}
