
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import type { Staff } from "@/features/staff/types"
import { staffService } from "@/features/staff/services/staffService"
import { StaffModal } from "../components/StaffModal"
import { EditStaffModal } from "../components/StaffEditModal"
import { UserAuthContext } from '@/features/auth/context/AuthContext'
import { toast } from 'sonner'
import React, { useEffect, useState, useContext } from "react"
import { AnimatePresence, motion } from "framer-motion";

import {
  Users,
  Search,
  MoreVertical,
  Edit,
  UserCheck,
  UserX,
  Mail,
  Loader2,
  RefreshCw,
  Download,
} from 'lucide-react'

async function getData(): Promise<Staff[]> {
  const response = await staffService.getAllStaff();
  return response;
}

const StaffPage = () => {
  const [data, setData] = useState<Staff[]>([])
  const [filteredData, setFilteredData] = useState<Staff[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const { hasRole } = useContext(UserAuthContext)

  useEffect(() => {
    loadStaffData()
  }, [])

  useEffect(() => {
    filterStaff()
  }, [data, searchTerm])

  const loadStaffData = async () => {
    setLoading(true)
    try {
      const staffData = await getData()
      setData(staffData)
    } catch (error) {
      toast.error('Failed to load staff data')
    } finally {
      setLoading(false)
    }
  }

  const handleRefresh = async () => {
    setRefreshing(true)
    try {
      const staffData = await getData()
      setData(staffData)
      toast.success('Staff data refreshed')
    } catch (error) {
      toast.error('Failed to refresh staff data')
    } finally {
      setRefreshing(false)
    }
  }

  const filterStaff = () => {
    if (!searchTerm.trim()) {
      setFilteredData(data)
    } else {
      const filtered = data.filter(staff =>
        staff.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        staff.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        staff.userName.toLowerCase().includes(searchTerm.toLowerCase())
      )
      setFilteredData(filtered)
    }
  }

  const handleStaffUpdate = (updatedStaff: Staff) => {
    setData((prevData) =>
      prevData.map((staff) =>
        staff.id === updatedStaff.id ? updatedStaff : staff
      )
    );
  };

  const handleEditClick = (staff: Staff) => {
    setSelectedStaff(staff);
    setIsEditModalOpen(true);
  };

  const handleEditStaff = async (updateStaff: Staff) => {
    try {
      await staffService.EditStaff(updateStaff);
      handleStaffUpdate(updateStaff);
      toast.success('Staff member updated successfully');
      setIsEditModalOpen(false);
      setSelectedStaff(null);
    } catch (e: any) {
      toast.error(e.response?.data?.error || 'Error updating staff member');
    }
  };

  const handleToggle = async (staff: Staff) => {
    try {
      const updatedStaff = { ...staff, isActive: !staff.isActive };
      await staffService.changeStatusStaff({ id: staff.id, isActive: updatedStaff.isActive });
      setData((prev) =>
        prev.map((s) => (s.id === staff.id ? updatedStaff : s))
      );
    } catch (error) {
      console.error("Error al cambiar estado:", error);
    }
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase()
  }

  const activeStaff = data.filter(staff => staff.isActive).length
  const inactiveStaff = data.filter(staff => !staff.isActive).length

  if (loading) {
    return (
      <SidebarProvider
        style={{
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties}
      >
        <SidebarInset>
          <div className="flex flex-col flex-1 px-4 py-8 gap-8 max-w-7xl mx-auto">
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              <span className="ml-2 text-muted-foreground">Loading staff data...</span>
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    )
  }

  return (
    <SidebarProvider
      style={{
        "--sidebar-width": "calc(var(--spacing) * 72)",
        "--header-height": "calc(var(--spacing) * 12)",
      } as React.CSSProperties}
    >
      <SidebarInset>
        <div className="flex justify-center">
          <div className="flex flex-col flex-1 px-4 py-8 gap-8 max-w-[1600px]">
            {/* Header Section */}
            <div className="text-center space-y-6 relative">
              {/* Background Elements */}
              <div className="absolute inset-0 -z-10">
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-96 h-96 bg-primary/10 rounded-full blur-3xl"></div>
              </div>

              <div className="relative z-10">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-primary rounded-full mb-6 shadow-lg">
                  <Users className="h-10 w-10 text-primary-foreground" />
                </div>
                <h1 className="text-5xl font-black text-foreground mb-4">
                  Staff Management
                </h1>
                <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                  Manage your gym staff members. Add new team members, update information, and monitor their status.
                </p>
              </div>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -40 }}
                transition={{ duration: 1.2, ease: "easeInOut" }}
                className="space-y-5 relative" // slow motion
              >
                {/* Statistics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium text-muted-foreground">
                        Total Staff Members
                      </CardTitle>
                      <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-foreground">{data.length}</div>
                      <p className="text-xs text-muted-foreground">
                        All team members
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium text-muted-foreground">
                        Active Staff
                      </CardTitle>
                      <UserCheck className="h-4 w-4" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{activeStaff}</div>
                      <p className="text-xs text-muted-foreground">
                        Currently working
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium text-muted-foreground">
                        Inactive Staff
                      </CardTitle>
                      <UserX className="h-4 w-4" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{inactiveStaff}</div>
                      <p className="text-xs text-muted-foreground">
                        Not currently active
                      </p>
                    </CardContent>
                  </Card>
                </div>

                {/* Action Bar */}
                <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                  <div className="flex items-center gap-2 px-4 py-2 bg-card rounded-lg shadow-md border border-border">
                    <span className="text-sm font-medium text-muted-foreground">Quick Actions:</span>
                    <StaffModal onStaffAdded={loadStaffData} />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleRefresh}
                      disabled={refreshing}
                      className="gap-2"
                    >
                      <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
                      Refresh
                    </Button>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search staff members..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 w-64"
                      />
                    </div>
                    {hasRole('Administrator') && (
                      <Button variant="outline" size="sm" className="gap-2">
                        <Download className="h-4 w-4" />
                        Export
                      </Button>
                    )}
                  </div>
                </div>

                {/* Staff Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredData.map((staff) => (
                    <Card key={staff.id} className="hover:shadow-lg transition-all duration-300">
                      <CardHeader className="pb-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <Avatar className="h-12 w-12">
                              <AvatarImage src="" alt={staff.name} />
                              <AvatarFallback className="bg-primary text-primary-foreground">
                                {getInitials(staff.name)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <CardTitle className="text-lg">{staff.name}</CardTitle>
                              <CardDescription className="text-sm">@{staff.userName}</CardDescription>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              variant={staff.isActive ? "default" : "outline"}
                              className="px-2 py-1"
                              onClick={() => handleToggle(staff)}
                            >
                              {staff.isActive ? "Activo" : "Inactivo"}
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEditClick(staff)}
                              className="h-8 w-8 p-0"
                            >
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Mail className="h-4 w-4" />
                          <span className="truncate">{staff.email}</span>
                        </div>
                        <div className="flex items-center justify-end gap-3 pt-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditClick(staff)}
                            className="gap-2"
                          >
                            <Edit className="h-4 w-4" />
                            Edit
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>



            {/* Empty State */}
            {filteredData.length === 0 && searchTerm && (
              <Card>
                <CardContent className="text-center py-12">
                  <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">No staff found</h3>
                  <p className="text-muted-foreground">
                    No staff members match your search for "{searchTerm}"
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => setSearchTerm('')}
                    className="mt-4"
                  >
                    Clear search
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Edit Modal */}
            {selectedStaff && (
              <EditStaffModal
                open={isEditModalOpen}
                onClose={() => {
                  setIsEditModalOpen(false);
                  setSelectedStaff(null);
                }}
                staff={selectedStaff}
                onSave={handleEditStaff}
              />
            )}
          </div>
        </div>

      </SidebarInset>
    </SidebarProvider>
  )
}

export default StaffPage