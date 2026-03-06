'use client'

import { signIn } from 'next-auth/react'
import { useState } from 'react'

interface GoogleLoginProps {
    onSuccess: (userData: any) => void
    onError: (error: any) => void
}
export default function GoogleLoginComponent({
    onSuccess,
    onError,
}: GoogleLoginProps) {
    const [isLoading, setIsLoading] = useState(false)

    const handleGoogleSignIn = async () => {
        setIsLoading(true)
        try {
            const result = await signIn('google', {
                redirect: false,
                callbackUrl: '/',
            })

            if (result?.error) {
                onError(result.error)
            } else if (result?.ok) {
                // Session will be automatically managed by NextAuth
                onSuccess({})
            }
        } catch (error) {
            onError(error)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="login-container">
            <div className="login-box">
                <h2>Sign in to continue</h2>
                <button
                    onClick={handleGoogleSignIn}
                    disabled={isLoading}
                    className="google-signin-button"
                >
                    {isLoading ? 'Signing in...' : '🔐 Sign in with Google'}
                </button>
            </div>
        </div>
    )