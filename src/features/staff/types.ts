export interface Staff {
  id: string
  name: string
  email: string
  userName: string
  isActive: boolean
}

export interface StatusStaff {
  id: string,
  isActive: boolean
}

export interface EditStaffModalProps {
  open: boolean
  onClose: () => void
  staff: Staff | null
  onSave: (data: Staff) => void
}
