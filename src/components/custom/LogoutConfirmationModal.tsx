import { Button } from "@/components/ui/button"
import { LogOut, X, Loader2, AlertTriangle } from "lucide-react"
import { useEffect} from "react"
import { createPortal } from "react-dom"

interface LogoutConfirmationModalProps {
  open: boolean
  onClose: () => void
  onConfirm: () => void
  isLoading?: boolean
}

export function LogoutConfirmationModal({ 
  open, 
  onClose, 
  onConfirm, 
  isLoading = false 
}: LogoutConfirmationModalProps) {

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && open && !isLoading) {
        onClose();
      }
    };

    if (open) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [open, isLoading, onClose]);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = 'unset';
      };
    }
  }, [open]);


  if (!open) return null;

  const modalContent = (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={isLoading ? undefined : onClose}
        style={{ zIndex: 9998 }}
      />
      
      {/* Modal */}
      <div 
        className="relative bg-white dark:bg-black rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 w-full max-w-md transform transition-all"
        style={{ zIndex: 9999 }}
      >
        <div className="p-6">
          {/* Header */}
          <div className="text-center pb-4">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-950/20 dark:to-orange-950/20 transition-all duration-200">
              {isLoading ? (
                <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />
              ) : (
                <LogOut className="h-8 w-8 text-red-500" />
              )}
            </div>
            
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              {isLoading ? "Signing out..." : "Sign out?"}
            </h2>
            
            <div className="text-gray-600 dark:text-gray-400 mt-2">
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
                  <span>Finalizing your session securely...</span>
                </div>
              ) : (
                <div>
                  <p className="mb-3">
                    Are you sure you want to sign out?
                  </p>
                  <div className="flex items-start gap-2 p-3 bg-amber-50 dark:bg-amber-950/20 rounded-lg border border-amber-200 dark:border-amber-800">
                    <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-amber-800 dark:text-amber-200">
                      You'll need to sign in again to access your dashboard.
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Actions */}
          {!isLoading && (
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Button 
                variant="outline" 
                onClick={onClose}
                className="flex-1 h-11 border-gray-300 hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-800 transition-colors"
              >
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
              <Button 
                variant="destructive" 
                onClick={onConfirm}
                className="flex-1 h-11 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 shadow-lg hover:shadow-xl transition-all duration-200"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign out
              </Button>
            </div>
          )}
        
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
