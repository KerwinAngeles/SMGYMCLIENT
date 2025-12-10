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
import { Link, useSearchParams, useNavigate } from "react-router-dom"


export const ResetPassword = () => {

    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const [password, setPassword] = useState<string | ''>('');
    const [confirmPassword, setConfirmPassword] = useState<string | ''>('');
    const [error, setError] = useState('');

    const email = searchParams.get("email");
    const token = searchParams.get("token");

    const handledSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (!email || !token) {
            setError('Datos de restablecimiento inválidos');
            toast.error(error, {
                id: "login",
                description: error,
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
            return;
        }
        try {
            const response = await authService.ResetPassword({ email, password, confirmPassword, token });
            if (response.hasError) {
                setError(response.error || 'Error al restablecer la contraseña');
            } else {
                toast.success(error, {
                    id: "login",
                    description: response.error,
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
                setTimeout(() => {
                    navigate('/login');
                }, 3000);
            }
        } catch (e: any) {
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
                        setPassword('');
                        setConfirmPassword('');
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
                        <div className="flex flex-col gap-6 mb-3">
                            <div className="grid gap-2">
                                <Label htmlFor="email">Email address</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="you@example.com"
                                    required
                                    value={email || ''}
                                />
                            </div>
                        </div>

                        <div className="flex flex-col gap-6 mb-3">
                            <div className="grid gap-2">
                                <Label htmlFor="password">Password</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder='Enter your new password'
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="flex flex-col gap-6 mb-3">
                            <div className="grid gap-2">
                                <Label htmlFor="confirmPassword">Confirm Password</Label>
                                <Input
                                    id="confirmPassword"
                                    type="password"
                                    placeholder="Repeat your password"
                                    required
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}

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
                        Reset Password
                    </Button>

                    <Link to={'/Login'} className="nderline underline-offset-4 cursor-pointer text-[13px] pt-3">
                        Login in to your account
                    </Link>
                </CardFooter>
            </Card>
        </div>

    )
}
