'use client'

import { useState, useEffect, useCallback } from 'react'
import { getAccessToken, usePrivy } from '@privy-io/react-auth'
import { useRouter } from 'next/navigation'
import { useCall } from 'wagmi'

interface AuthState {
    isLoading: boolean,
    isAuthenticated: boolean,
    user: any | null
    getToken: () => Promise<string | undefined>
    logout: () => Promise<void>
}

export function useAuth(): AuthState {
    const { ready, authenticated, getAccessToken, logout } = usePrivy()
    const [isLoading, setIsLoading] = useState(true)
    const [appToken, setAppToken] = useState<string | undefined>()
    const [user, setUser] = useState<any | null>(null)
    const router = useRouter()


    const bootstrap = useCallback(async () => {
        try {
            setIsLoading(true);

            const privyToken = await getAccessToken()
            if (!privyToken) {
                throw new Error('No Privy token found')
            }

            const res = await fetch('/api/me', {
                headers: { Authorization: `Bearer ${privyToken}` },
            })

            if (res.status === 200) {
                const { user, appToken } = await res.json()
                setUser(user)
                setAppToken(appToken)
            } else if (res.status === 404) {
                router.replace('/signup')
            } else {
                console.error(await res.text())
            }

        } catch (err) {
            console.error('Error bootstrapping auth:', err)
        }
    }, [getAccessToken, router])

    useEffect(() => {
        if (!ready) return
        if (authenticated) bootstrap()
        else {
            setUser(null)
            setAppToken(undefined)
            setIsLoading(false)
        }
    }, [ready, authenticated, bootstrap])

    const getToken = useCallback(
        async () => appToken,
        [appToken],
    )

    return {
        isLoading,
        isAuthenticated: !!appToken,
        user,
        getToken,
        logout,
    }
}