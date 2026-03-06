import ClientSessionProvider from '@/components/ClientSessionProvider'
import type { Metadata } from 'next'
import '../styles/globals.css'

export const metadata: Metadata = {
    title: 'Animal Predictor',
    description: 'Identify animals from images using AI',
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en">
            <body>
                <ClientSessionProvider>
                    {children}
                </ClientSessionProvider>
            </body>
        </html>
    )
}