import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useContext } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { UserAuthContext } from "@/features/auth/context/AuthContext"
import { Link } from "react-router-dom"
import { toast } from "sonner"
import { Loader2, UserPlus } from "lucide-react"
import { z } from "zod";
import { useForm, type SubmitHandler } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"


const registerFormSchema = z.object({
  name: z.string().min(4),
  username: z.string().min(4),
  email: z.string().email(),
  password: z.string().min(8),
  confirmPassword: z.string().min(8),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Password do not match",
  path: ["confirmPassword"]
})


type RegisterFormSchema = z.infer<typeof registerFormSchema>

export function RegisterForm({ className, ...props }: React.ComponentProps<"form">) {
  const { registerAccount } = useContext(UserAuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as any)?.from?.pathname || '/login';

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<RegisterFormSchema>({
    resolver: zodResolver(registerFormSchema)
  });

  const onSubmit: SubmitHandler<RegisterFormSchema> = async (data) => {
    try {
      await registerAccount(data)
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

    <form onSubmit={handleSubmit(onSubmit)} className={cn("flex flex-col gap-6", className)} {...props}>
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Join SMGYM</h1>
        <p className="text-muted-foreground text-sm text-balance">
          Create your account to start managing your gym
        </p>
      </div>

      <div className="grid gap-6">
        <div className="grid gap-3">
          <Label htmlFor="name">Full Name</Label>
          <Input id="name" type="text" placeholder="Enter your full name" {...register("name")} disabled={isSubmitting} />
          {errors.name && (
            <div className='text-red-500 text-start'>{errors.name.message}</div>
          )}
        </div>
        <div className="grid gap-3">
          <Label htmlFor="username">Username</Label>
          <Input id="username" type="text" placeholder="Choose a username" {...register("username")} disabled={isSubmitting} />
          {errors.username && (
            <div className='text-red-500 text-start'>{errors.username.message}</div>
          )}
        </div>
        <div className="grid gap-3">
          <Label htmlFor="email">Email Address</Label>
          <Input id="email" type="email" placeholder="Enter your email address" {...register("email")} disabled={isSubmitting} />
          {errors.email && (
            <div className='text-red-500 text-start'>{errors.email.message}</div>
          )}
        </div>
        <div className="grid gap-3">
          <div className="flex items-center">
            <Label htmlFor="password">Password</Label>
          </div>
          <Input id="password" type="password" placeholder="Create a secure password" {...register("password")} disabled={isSubmitting} />
          {errors.password && (
            <div className='text-red-500 text-start'>{errors.password.message}</div>
          )}
        </div>
        <div className="grid gap-3">
          <Label htmlFor="password">Confirm Password</Label>
          <Input id="confirmpassword" type="password" placeholder="Confirm your password" {...register("confirmPassword")} disabled={isSubmitting} />
          {errors.confirmPassword && (
            <div className='text-red-500 text-start'>{errors.confirmPassword.message}</div>
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