import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import type { ClientEdit } from "@/features/clients/types"
import { clientService } from "@/features/clients/services/clientService"
import { ClientModal } from "../components/ClientModal"
import { EditClientModal } from "../components/EditClientModal"
import { toast } from 'sonner'
import { DataTable } from "@/components/shadcn/data-table"
import { columns } from "@/features/clients/dataTable/columns"
import React, { useEffect, useState } from "react"
import { AnimatePresence, motion } from "framer-motion";
import { getAge } from "@/lib/utils"

import {
  Users,
  UserPlus,
  Search,
  Loader2,
  User,
  Cake
} from 'lucide-react'

async function getData(): Promise<ClientEdit[]> {
  const response = await clientService.getAllClients();
  return response;
}

const ClientPage = () => {
  const [data, setData] = useState<ClientEdit[]>([])
  const [filteredData, setFilteredData] = useState<ClientEdit[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedClient, setSelectedClient] = useState<ClientEdit | null>(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)

  useEffect(() => {
    loadClientData()
  }, [])

  useEffect(() => {
    filterClients()
  }, [data, searchTerm])

  const loadClientData = async () => {
    setLoading(true)
    try {
      const clientData = await getData()
      setData(clientData)
    } catch (error) {
      toast.error('Failed to load client data')
    } finally {
      setLoading(false)
    }
  }

  const filterClients = () => {
    if (!searchTerm.trim()) {
      setFilteredData(data)
    } else {
      const filtered = data.filter(client =>
        client.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.phoneNumber.includes(searchTerm) ||
        client.nationalId.includes(searchTerm)
      )
      setFilteredData(filtered)
    }
  }

  const handleClientUpdate = (updatedClient: ClientEdit) => {
    setData((prevData) =>
      prevData.map((client) =>
        client.id === updatedClient.id ? updatedClient : client
      )
    );
  };

  const handleEditClick = (client: ClientEdit) => {
    setSelectedClient(client);
    setIsEditModalOpen(true);
  };

  const handleEditClient = async (updateClient: ClientEdit) => {
    try {
      await clientService.updateClient(updateClient, updateClient.id);
      handleClientUpdate(updateClient);
      toast.success('Client updated successfully');
      setIsEditModalOpen(false);
      setSelectedClient(null);
    } catch (e: any) {
      toast.error(e.response?.data?.error || 'Error updating client');
    }
  };


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
              <span className="ml-2 text-muted-foreground">Loading client data...</span>
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
                  Client Management
                </h1>
                <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                  Manage your gym members. Add new clients, update their information, and track their membership details.
                </p>
              </div>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -40 }}
                transition={{ duration: 1.2, ease: "easeInOut" }} // slow motion
              >
                {/* Statistics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium text-muted-foreground">
                        Total Clients
                      </CardTitle>
                      <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-foreground">{data.length}</div>
                      <p className="text-xs text-muted-foreground">
                        All registered members
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium text-muted-foreground">
                        New This Month
                      </CardTitle>
                      <UserPlus className="h-4 w-4" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {data.filter(client => {
                          try {
                            const clientDate = new Date(client.birthDay)
                            const now = new Date()
                            return clientDate.getMonth() === now.getMonth() && clientDate.getFullYear() === now.getFullYear()
                          } catch {
                            return false
                          }
                        }).length}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Recent registrations
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium text-muted-foreground">
                        Average Age
                      </CardTitle>
                      <Cake className="h-4 w-4" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {data.length > 0 ? Math.round(
                          data.reduce((sum, client) => {
                            const age = getAge(client.birthDay)
                            return sum + (typeof age === 'number' ? age : 0)
                          }, 0) / data.length
                        ) : 0}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Years old
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium text-muted-foreground">
                        Active Members
                      </CardTitle>
                      <User className="h-4 w-4" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{data.length}</div>
                      <p className="text-xs text-muted-foreground">
                        Currently enrolled
                      </p>
                    </CardContent>
                  </Card>
                </div>

                {/* Client Grid */}
                <div>
                  <DataTable
                    modalComponent={ClientModal}
                    columns={columns(handleEditClick)}
                    data={filteredData}
                    value="email"
                  />
                </div>
              </motion.div>
            </AnimatePresence>



            {/* Empty State */}
            {filteredData.length === 0 && searchTerm && (
              <Card>
                <CardContent className="text-center py-12">
                  <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">No clients found</h3>
                  <p className="text-muted-foreground">
                    No clients match your search for "{searchTerm}"
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
            {selectedClient && (
              <EditClientModal
                open={isEditModalOpen}
                onClose={() => {
                  setIsEditModalOpen(false);
                  setSelectedClient(null);
                }}
                clientEdit={selectedClient}
                onSave={handleEditClient}
              />
            )}
          </div>
        </div>

      </SidebarInset>
    </SidebarProvider>
  )
}

export default ClientPage