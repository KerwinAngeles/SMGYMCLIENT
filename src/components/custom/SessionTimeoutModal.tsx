import { Button } from "@/components/ui/button"
import { Clock, Shield } from "lucide-react"
import { useEffect } from "react"
import { createPortal } from "react-dom"

interface SessionTimeoutModalProps {
  open: boolean
  onExtend: () => void
  onLogout: () => void
  timeRemaining: number
}

export function SessionTimeoutModal({ 
  open, 
  onExtend, 
  onLogout, 
  timeRemaining 
}: SessionTimeoutModalProps) {
  const minutes = Math.floor(timeRemaining / 60)
  const seconds = timeRemaining % 60

  // Prevenir scroll del body cuando el modal está abierto
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = 'unset';
      };
    }
  }, [open]);

  // No renderizar si no está abierto
  if (!open) return null;

  const modalContent = (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        style={{ zIndex: 9998 }}
      />
      
      {/* Modal */}
      <div 
        className="relative bg-white dark:bg-gray-900 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 w-full max-w-md transform transition-all"
        style={{ zIndex: 9999 }}
      >
        <div className="p-6">
          {/* Header */}
          <div className="text-center pb-4">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20">
              <Clock className="h-8 w-8 text-amber-500" />
            </div>
            
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              Your session is about to expire
            </h2>
            
            <div className="text-gray-600 dark:text-gray-400 mt-2">
              <p className="mb-3">
                Your session will expire in:
              </p>
              
              <div className="text-2xl font-bold text-amber-600 dark:text-amber-400 mb-4">
                {minutes}:{seconds.toString().padStart(2, '0')}
              </div>
              
              <div className="flex items-start gap-2 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <Shield className="h-4 w-4 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-blue-800 dark:text-blue-200">
                  For security, your session will be closed automatically if there's no activity.
                </span>
              </div>
            </div>
          </div>
          
          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button 
              variant="outline" 
              onClick={onLogout}
              className="flex-1 h-11 border-gray-300 hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-800"
            >
              Sign out
            </Button>
            <Button 
              onClick={onExtend}
              className="flex-1 h-11 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <Shield className="h-4 w-4 mr-2" />
              Extend session
            </Button>
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
