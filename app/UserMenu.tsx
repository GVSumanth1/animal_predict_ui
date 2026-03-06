'use client'

import { signOut, useSession } from 'next-auth/react'

export default function UserMenu() {
    const { data: session } = useSession()

    if (!session) return null

    return (
        <div className="flex items-center gap-3">
            <img
                src={session.user?.image || ''}
                className="w-8 h-8 rounded-full"
            />
            <span>{session.user?.name}</span>
            <button
                onClick={() => signOut({ callbackUrl: '/login' })}
                className="text-red-500"
            >
                Logout
            </button>
        </div>
    )
}