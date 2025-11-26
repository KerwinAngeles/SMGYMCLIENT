export interface Client {
  fullName: string;
  email: string;
  phoneNumber: string;
  nationalId: string;
  birthday: Date;
}

export interface ClientEdit {
  id: number;
  fullName: string;
  email: string;
  phoneNumber: string;
  nationalId: string;
  birthDay: string;
  accessCode: string;
}


export interface EditClientModalProps {
  open: boolean
  onClose: () => void
  clientEdit: ClientEdit | null
  onSave: (data: ClientEdit) => void
}