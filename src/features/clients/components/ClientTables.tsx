import { useState } from "react";
import { clientService } from "../services/clientService";
import { toast } from "sonner";
import { columns } from "@/features/clients/dataTable/columns";
import { DataTable } from "@/components/shadcn/data-table"; 
import { EditClientModal } from "../components/EditClientModal";
import type { ClientEdit } from "@/features/clients/types";

export function ClientsTable({ data }: { data: ClientEdit[] }) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<ClientEdit | null>(null);

  const handleEditClick = (client: ClientEdit) => {
    setSelectedClient(client);
    setIsOpen(true);
  };

  const handledEditClient = async (updateClient: ClientEdit) => {
    try {
      await clientService.updateClient(updateClient, updateClient.id);
      toast.success("Client edit successfully");
      setIsOpen(false);
    } catch (e: any) {
      toast.error(e.response?.data?.error);
    }
  };

  return (
    <>
      <DataTable columns={columns(handleEditClick)} data={data} value="client" />

      {selectedClient && (
        <EditClientModal
          open={isOpen}
          onClose={() => {
            setIsOpen(false);
            setSelectedClient(null);
          }}
          clientEdit={selectedClient}
          onSave={handledEditClient}
        />
      )}
    </>
  );
}
