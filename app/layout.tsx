import { GoogleOAuthProvider } from '@react-oauth/google'
import type { Metadata } from 'next'
import '../styles/globals.css'

export const metadata: Metadata = {
    title: 'Animal Predic - Image Classification',
    description: 'Predict animal species from images using AI',
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || ''

    return (
        <html lang="en">
            <body>
                <GoogleOAuthProvider clientId={googleClientId}>
                    {children}
                </GoogleOAuthProvider>
            </body>
        </html>
    )
}