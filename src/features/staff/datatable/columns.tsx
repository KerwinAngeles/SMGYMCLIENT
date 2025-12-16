import type { ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal } from "lucide-react"
import { ArrowUpDown } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import { staffService } from "../services/staffService"
import { Button } from "@/components/ui/button"
import { EditStaffModal } from "../components/StaffEditModal"
import {type Staff } from "@/features/staff/types"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useState } from "react"

export const columns = (onStaffUpdated: (updatedStaff: Staff)=> void ): ColumnDef<Staff>[] => [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "email",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Email
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  {
    accessorKey: "userName",
    header: "Username",
  },
  {
    accessorKey: "status",
    header: "Estado",
    cell: ({ row }) => {
      const status = row.original.isActive;
      const [statusStaff, setStatusStaff] = useState(status);
      const isActive = statusStaff;
      const handleToggle = async () => {

        try {
          setStatusStaff(!statusStaff);
          await staffService.changeStatusStaff({ id: row.original.id, isActive: !isActive });
        } catch (error) {
          console.error("Error al cambiar estado:", error);
        }
      };

      return (
        <Button
          variant={isActive ? "default" : "outline"}
          className="px-2 py-1"
          onClick={handleToggle}
        >
          {isActive ? "Activo" : "Inactivo"}
        </Button>
      );
    },
  },
  {
    id: "actions",
    header: "actions",
    cell: ({ row }) => {

      const [isOpen, setIsOpen] = useState(false);
      const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null);

      const handleEditClick = (staff: Staff) => {
        setSelectedStaff(staff);
        setIsOpen(true);
      };

      const handledEditStaff = async (updateStaff: Staff) => {
        try {
          await staffService.EditStaff(updateStaff);
          onStaffUpdated(updateStaff);
        } catch (e) {
          console.error("Error al editar el usuario:", e);
        }
      }

      return (
        <>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => handleEditClick(row.original)}>
                Edit
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <EditStaffModal open={isOpen} onClose={() => setIsOpen(false)} staff={selectedStaff} onSave={handledEditStaff}/>
        </>

      )
    },
  },
]