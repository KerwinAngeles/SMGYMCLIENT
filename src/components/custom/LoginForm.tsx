import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState, useContext } from "react"
import { useNavigate } from "react-router-dom"
import { UserAuthContext } from "@/features/auth/context/AuthContext"
import { Link } from "react-router-dom"
import { toast } from "sonner"
import { CheckCircle, Loader2 } from "lucide-react"

export function LoginForm({ className, ...props }: React.ComponentProps<"form">) {
  const { login, isLoading } = useContext(UserAuthContext);
  const [username, setUsername] = useState<string | ''>('');
  const [password, setPassword] = useState<string | ''>('');
  const [error, setError] = useState<string | ''>('');
  const navigate = useNavigate();
  const from = '/dashboard';

  const handledLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!username.trim() || !password.trim()) {
      toast.error("Validation Error", {
        description: "Please fill in all required fields",
        duration: 4000
      });
      return;
    }

    try {
      await login({ username, password });

      setTimeout(() => {
        navigate(from, { replace: true });
      }, 2000);

    } catch (e: any) {
      console.log(e.response?.data?.error);
      const errorMessage = e.response?.data?.error;
      setError(errorMessage);

      toast.error(error, {
        id: "login",
        description: errorMessage,
        duration: 5000,
        action: {
          label: "Retry",
          onClick: () => {
            setError('');
            setUsername('');
            setPassword('');
          }
        }
      });
    }
  }

  return (
    <form className={cn("flex flex-col gap-6", className)} {...props}>
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Welcome back</h1>
        <p className="text-muted-foreground text-sm text-balance">
          Sign in to access your gym management dashboard</p>
      </div>

      <div className="grid gap-6">
        <div className="grid gap-3">
          <Label htmlFor="username">Username</Label>
          <Input id="username" type="text" placeholder="Enter your username" required value={username} onChange={(e) => setUsername(e.target.value)} disabled={isLoading} />
        </div>
        <div className="grid gap-3">
          <div className="flex items-center">
            <Label htmlFor="password">Password</Label>
            <Link to={'/forgotPassword'} className="ml-auto text-sm underline-offset-4 hover:underline">
              Forgot Password?
            </Link>
          </div>
          <Input id="password" type="password" placeholder="Enter your password" required value={password} onChange={(e) => setPassword(e.target.value)} disabled={isLoading} />
        </div>

        <Button
          type="submit"
          className="w-full h-11 bg-white cursor-pointer shadow-lg hover:shadow-xl transition-all duration-200"
          onClick={handledLogin}
          disabled={isLoading}
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Signing in...</span>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              <span>Sign in</span>
            </div>
          )}
        </Button>

        <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
          <span className="bg-background text-muted-foreground relative z-10 px-2">
            New to SMGYM?
          </span>
        </div>
      </div>

      <div className="text-center text-sm">
        <>
          Don&apos;t have an account?{" "}
          <Link to={'/register'} className="underline underline-offset-4 cursor-pointer">
            Create account
          </Link>
        </>
      </div>
    </form>
  )
}