'use client'

import { GoogleLogin } from '@react-oauth/google'
import { jwtDecode } from 'jwt-decode'

interface GoogleLoginProps {
    onSuccess: (userData: any) => void
    onError: (error: any) => void
}

export default function GoogleLoginComponent({
    onSuccess,
    onError,
}: GoogleLoginProps) {
    const handleSuccess = (credentialResponse: any) => {
        try {
            const decoded = jwtDecode<any>(credentialResponse.credential)
            const userData = {
                id: decoded.sub,
                name: decoded.name,
                email: decoded.email,
                picture: decoded.picture,
                credential: credentialResponse.credential,
            }
            onSuccess(userData)
        } catch (error) {
            onError(error)
        }
    }

    return (
        <div className="login-container">
            <div className="login-box">
                <h2>Sign in to continue</h2>
                <GoogleLogin
                    onSuccess={handleSuccess}
                    onError={() => onError('Login failed')}
                    theme="outline"
                    size="large"
                />
            </div>
        </div>
    )
}