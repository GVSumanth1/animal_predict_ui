import { NextAuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'

export const authOptions: NextAuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
            authorization: {
                params: {
                    prompt: 'consent',
                    access_type: 'offline',
                    response_type: 'code',
                },
            },
        }),
    ],
    session: {
        strategy: 'jwt',
    },
    callbacks: {
        async jwt({ token, account, profile }) {
            if (account && profile) {
                token.accessToken = account.access_token
                token.email = profile.email
                token.name = profile.name
                token.picture = profile.picture
            }
            return token
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.email = token.email as string
                session.user.name = token.name as string
                session.user.image = token.picture as string
                    ; (session as any).accessToken = token.accessToken
            }
            return session
        },
    },
    pages: {
        signIn: '/login',
    },
}