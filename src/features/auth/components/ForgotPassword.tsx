import { authService } from '../services/authService'
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from "react-router-dom";
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


const forgotPasswordSchema = z.object({
    email: z.string().email(),
})

type ForgotPasswordSchema = z.infer<typeof forgotPasswordSchema>

export const ForgotPassword = () => {

    const { register, handleSubmit, setError, formState: { errors, isSubmitting } } = useForm<ForgotPasswordSchema>({
        resolver: zodResolver(forgotPasswordSchema)
    });

    const onSubmit: SubmitHandler<ForgotPasswordSchema> = async (data) => {
        try {
            const response = await authService.forgotPassword(data)
            toast.success(response.success, {
                id: "forgotPassword",
                duration: 5000,
            });
        } catch (error: any) {
            setError("root", {
                message: error.error
            })
        }
    }

    return (
        <div className='flex flex-1 min-h-screen items-center justify-center text-center'>
            <Card className="w-full max-w-sm">
                <CardHeader>
                    <CardTitle>Having trouble logging in?</CardTitle>
                    <CardDescription>
                        Enter your email address and we’ll send you a link to get back into your account.
                    </CardDescription>
                </CardHeader>

                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="flex flex-col gap-6">
                            <div className="grid gap-2">
                                <Label htmlFor="email">Email address</Label>
                                <Input id="email" type="email" placeholder="you@example.com" {...register("email")}
                                />
                                {errors.email && (
                                    <div className='text-red-500 text-start'>{errors.email.message}</div>
                                )}
                            </div>
                        </div>
                        <Button

                            type="submit"
                            className="w-full mt-3"
                            disabled={isSubmitting}

                        >
                            Send reset link
                        </Button>
                    </form>
                </CardContent>

                <CardFooter className='flex-1 flex justify-center'>
                    <Link to={'/Login'} className="underline underline-offset-4 cursor-pointer text-[13px]">
                        Login in to your account
                    </Link>
                </CardFooter>
            </Card>
        </div>
    )
}
