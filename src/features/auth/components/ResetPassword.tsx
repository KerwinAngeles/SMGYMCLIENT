import { authService } from '../services/authService'
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Link, useSearchParams, useNavigate } from "react-router-dom"
import { z } from "zod";
import { useForm, type SubmitHandler } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"


const resetPasswordSchema = z.object({
    password: z.string().min(8),
    confirmPassword: z.string().min(1),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Password do not match",
    path: ["confirmPassword"]
})

type ResetPasswordForm = z.infer<typeof resetPasswordSchema>

export const ResetPassword = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const email = searchParams.get("email");
    const token = searchParams.get("token");
    if (!email || !token) {
        toast.error("Invalid or expired reset link", {
            id: "resetPassword",
            description: "Invalid or expired reset link",
            duration: 5000,
        });
        return
    }
    const { register, handleSubmit, setError, formState: { errors, isSubmitting } } = useForm<ResetPasswordForm>({
        resolver: zodResolver(resetPasswordSchema)
    });
    const onSubmit: SubmitHandler<ResetPasswordForm> = async ({ password, confirmPassword }) => {
        try {
            const response = await authService.ResetPassword({ email, password, confirmPassword, token })
            toast.success(response.success, {
                id: "resetPassword",
                duration: 5000,
            });
            setTimeout(() => {
                navigate('/login')
            }, 2000);
        } catch (error: any) {
            setError("root", {
                message: error.error
            })
        }
    }

    return (
        <div className='flex flex-1 min-h-screen items-center justify-center text-center '>
            <Card className="w-full max-w-sm">
                <CardHeader>
                    <CardTitle>Reset Password</CardTitle>
                    <CardDescription>
                        Please enter your new password to complete the reset process.
                    </CardDescription>
                </CardHeader>

                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="flex flex-col gap-6 mb-3">
                            <div className="grid gap-2">
                                <Label htmlFor="email">Email address</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={email || ''}
                                />
                            </div>
                        </div>

                        <div className="flex flex-col gap-6 mb-3">
                            <div className="grid gap-2">
                                <Label htmlFor="password">Password</Label>
                                <Input id="password" type="password" {...register("password")}
                                />
                                {errors.password && (
                                    <div className='text-red-500 text-start'>{errors.password.message}</div>
                                )}
                            </div>
                        </div>

                        <div className="flex flex-col gap-6 mb-3">
                            <div className="grid gap-2">
                                <Label htmlFor="confirmPassword">Confirm Password</Label>
                                <Input id="confirmPassword" type="password" {...register("confirmPassword")}
                                />
                                {errors.confirmPassword && (
                                    <div className='text-red-500 text-start'>{errors.confirmPassword.message}</div>
                                )}
                            </div>
                        </div>
                        <Button
                            type="submit"
                            className="w-full"
                            disabled={isSubmitting}
                        >
                            Reset Password
                        </Button>
                    </form>
                </CardContent>

                <CardFooter className="flex-col gap-2">
                    <Link to={'/Login'} className="nderline underline-offset-4 cursor-pointer text-[13px] pt-3">
                        Login in to your account
                    </Link>
                </CardFooter>
            </Card>
        </div>

    )
}
