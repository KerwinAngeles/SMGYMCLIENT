import React, { useState } from 'react'
import { authService } from '../services/authService'
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Link } from "react-router-dom"


export const ForgotPassword = () => {
    const [email, setEmail] = useState<string | ''>('');
    const [error, setError] = useState('');

    const handledSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (!email.trim()) {
            toast.error("Validation Error", {
                description: "Please fill in all required fields",
                duration: 4000
            });
            return;
        }

        try {
            const response = await authService.forgotPassword({ email });
            console.log(response)
            toast.success(error, {
                    id: "forgotPassword",
                    description: response.error,
                    duration: 5000,
                    action: {
                        label: "Retry",
                        onClick: () => {
                            setError('');
                            setEmail('');

                        }
                    }
                });

            if (response.hasError) {
                toast.error(error, {
                    id: "forgotPassword",
                    description: response.error,
                    duration: 5000,
                    action: {
                        label: "Retry",
                        onClick: () => {
                            setError('');
                            setEmail('');

                        }
                    }
                });
            }

        } catch (e: any) {
            const errorMessage = e.response?.error;
            setError(errorMessage);
            console.log(error)
            toast.error(error, {
                id: "forgotPassword",
                description: errorMessage,
                duration: 5000,
                action: {
                    label: "Retry",
                    onClick: () => {
                        setError('');
                        setEmail('');

                    }
                }
            });
        }
    }

    return (
        <div className='flex flex-1 min-h-screen items-center justify-center text-center '>
            <Card className="w-full max-w-sm">
                <CardHeader>
                    <CardTitle>Having trouble logging in?</CardTitle>
                    <CardDescription>
                        Enter your email address and we’ll send you a link to get back into your account.
                    </CardDescription>
                </CardHeader>

                <CardContent>
                    <form>
                        <div className="flex flex-col gap-6">
                            <div className="grid gap-2">
                                <Label htmlFor="email">Email address</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="you@example.com"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                        </div>
                    </form>
                </CardContent>

                <CardFooter className="flex-col gap-2">
                    <Button
                        type="submit"
                        className="w-full"
                        onClick={handledSubmit}
                    >
                        Send reset link
                    </Button>

                    <Link to={'/Login'} className="nderline underline-offset-4 cursor-pointer text-[13px] pt-3">
                        Login in to your account
                    </Link>
                </CardFooter>
            </Card>
        </div>

    )
}
