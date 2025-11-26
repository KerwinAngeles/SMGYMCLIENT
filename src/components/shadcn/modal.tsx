import { type ReactNode } from "react";
import {
    Dialog,

} from "@/components/ui/dialog"
interface ModalProps{
    children: ReactNode
    open: boolean;
    setOpen: (open: boolean) => void;
}

const Modal: React.FC<ModalProps> = ({open, setOpen, children})=> {

    return (
        <Dialog open={open} onOpenChange={setOpen}>
               {children}
        </Dialog>
    )
}

export default Modal;