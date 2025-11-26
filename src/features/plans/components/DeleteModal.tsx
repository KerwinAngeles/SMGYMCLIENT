import React from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

interface DeleteModalProps {
  open: boolean
  onClose: () => void
  onConfirm: () => void
  planName?: string
}

const DeleteModal: React.FC<DeleteModalProps> = ({
  open,
  onClose,
  onConfirm,
  planName,
}) => {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Are you sure?</DialogTitle>
          <DialogDescription>
            {`Do you really want to delete the plan ${
              planName ? `"${planName}"` : ""
            }? This action cannot be undone.`}
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="flex gap-2 justify-end">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={onConfirm}>
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default DeleteModal
