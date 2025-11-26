import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState, useEffect, useContext } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { UserAuthContext } from "@/features/auth/context/AuthContext"
import { Link } from "react-router-dom"
import { toast } from "sonner"
import { Loader2, UserPlus } from "lucide-react"

export function RegisterForm({ className, ...props }: React.ComponentProps<"form">) {
  const {register, isLoading } = useContext(UserAuthContext);
  const [username, setUsername] = useState<string | ''>('');
  const [email, setEmail] = useState<string | ''>('');
  const [name, setName] = useState<string | ''>('');
  const [password, setPassword] = useState<string | ''>('');
  const [confirmPassword, setConfirmPassword] = useState<string | ''>('');
  const [error, setError] = useState<string | ''>('');
  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state as any)?.from?.pathname || '/login';

  useEffect(()=>{
    if(error){
        toast.error(error)
    }
  }, [error])

  const handledRegister = async(event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    
    // Validaciones básicas
    if (!name.trim() || !email.trim() || !username.trim() || !password.trim() || !confirmPassword.trim()) {
      toast.error("Validation Error", {
        description: "Please fill in all required fields",
        duration: 4000
      });
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Validation Error", {
        description: "Passwords do not match",
        duration: 4000
      });
      return;
    }

    if (password.length < 6) {
      toast.error("Validation Error", {
        description: "Password must be at least 6 characters long",
        duration: 4000
      });
      return;
    }

    try {
      // Mostrar toast de carga
      toast.loading("Creating account...", {
        id: "register",
        description: "Registering your information"
      });

      await register({name, email, username, password, confirmPassword });
      
      // Toast de éxito
      toast.success("Account created successfully!", {
        id: "register",
        description: `Welcome to SMGYM, ${name}! Redirecting to login...`,
        duration: 3000,
        action: {
          label: "Go to login",
          onClick: () => navigate(from, { replace: true })
        }
      });

      setTimeout(() => {
        navigate(from, { replace: true });
      }, 2000);
      
    } catch (e: any) {
      const errorMessage = e.response?.data?.error || 'Unable to create account. Please check your information and try again.';
      setError(errorMessage);
      
      // Toast de error
      toast.error("Error creating account", {
        id: "register",
        description: errorMessage,
        duration: 5000,
        action: {
          label: "Retry",
          onClick: () => {
            setError('');
            setPassword('');
            setConfirmPassword('');
          }
        }
      });
    }
  }

  return (

    <form onSubmit={handledRegister} className={cn("flex flex-col gap-6", className)} {...props}>
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Join SMGYM</h1>
        <p className="text-muted-foreground text-sm text-balance">
            Create your account to start managing your gym
        </p>
      </div>

      <div className="grid gap-6">
          <div className="grid gap-3">
            <Label htmlFor="name">Full Name</Label>
            <Input id="name" type="text" placeholder="Enter your full name" required value={name} onChange={(e) => setName(e.target.value)} disabled={isLoading} />
          </div>
        <div className="grid gap-3">
          <Label htmlFor="username">Username</Label>
          <Input id="username" type="text" placeholder="Choose a username" required value={username} onChange={(e) => setUsername(e.target.value)} disabled={isLoading} />
        </div>
          <div className="grid gap-3">
            <Label htmlFor="email">Email Address</Label>
            <Input id="email" type="email" placeholder="Enter your email address" required value={email} onChange={(e) => setEmail(e.target.value)} disabled={isLoading} />
          </div>
        <div className="grid gap-3">
          <div className="flex items-center">
            <Label htmlFor="password">Password</Label>
          </div>
          <Input id="password" type="password" placeholder="Create a secure password" required value={password} onChange={(e) => setPassword(e.target.value)} disabled={isLoading} />
        </div>
          <div className="grid gap-3">
            <Label htmlFor="password">Confirm Password</Label>
            <Input id="confirmpassword" type="password" placeholder="Confirm your password" required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} disabled={isLoading} />
          </div>
        
        <Button 
          type="submit" 
          className="w-full h-11 bg-white cursor-pointer shadow-lg hover:shadow-xl transition-all duration-200" 
          disabled={isLoading}
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Creating account...</span>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <UserPlus className="h-4 w-4" />
              <span>Create account</span>
            </div>
          )}
        </Button> 
        
        <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
          <span className="bg-background text-muted-foreground relative z-10 px-2">
            Already a member?
          </span>
        </div>
      </div>

      <div className="text-center text-sm">
          <>
            Already have an account?{" "}
            <Link to={'/login'} className="underline underline-offset-4 cursor-pointer">Sign in</Link>
          </>
      </div>
    </form>
  )
}