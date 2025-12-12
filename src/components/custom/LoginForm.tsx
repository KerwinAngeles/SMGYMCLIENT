import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useContext } from "react"
import { useNavigate } from "react-router-dom"
import { UserAuthContext } from "@/features/auth/context/AuthContext"
import { Link } from "react-router-dom"
import { toast } from "sonner"
import { CheckCircle, Loader2 } from "lucide-react"
import { z } from "zod";
import { useForm, type SubmitHandler } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

const loginFormSchema = z.object({
  userName: z.string().min(8),
  password: z.string().min(8)
});

type LoginFormSchema = z.infer<typeof loginFormSchema>

export function LoginForm({ className, ...props }: React.ComponentProps<"form">) {
  const { login } = useContext(UserAuthContext);
  const navigate = useNavigate();
  const from = '/dashboard';

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginFormSchema>({
    resolver: zodResolver(loginFormSchema)
  });

  const onSubmit: SubmitHandler<LoginFormSchema> = async ({ userName, password }) => {
    try {
      await login({ userName, password })
      setTimeout(() => {
        navigate(from, { replace: true })
      }, 2000);
    } catch (e: any) {
      console.log(e)
      toast.error(e.response?.data?.error, {
        id: "login",
        duration: 5000,
      });
    }
  }

  return (
    <form className={cn("flex flex-col gap-6", className)} {...props} onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Welcome back</h1>
        <p className="text-muted-foreground text-sm text-balance">
          Sign in to access your gym management dashboard</p>
      </div>

      <div className="grid gap-6">
        <div className="grid gap-3">
          <Label htmlFor="username">Username</Label>
          <Input id="username" type="text" placeholder="Enter your username" {...register("userName")} disabled={isSubmitting} />
          {errors.userName && (
            <div className='text-red-500 text-start'>{errors.userName.message}</div>
          )}
        </div>
        <div className="grid gap-3">
          <div className="flex items-center">
            <Label htmlFor="password">Password</Label>
            <Link to={'/forgotPassword'} className="ml-auto text-sm underline-offset-4 hover:underline">
              Forgot Password?
            </Link>
          </div>
          <Input id="password" type="password" placeholder="Enter your password" {...register("password")} disabled={isSubmitting} />
          {errors.password && (
            <div className='text-red-500 text-start'>{errors.password.message}</div>
          )}
        </div>

        <Button
          type="submit"
          className="w-full h-11 bg-white cursor-pointer shadow-lg hover:shadow-xl transition-all duration-200"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
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