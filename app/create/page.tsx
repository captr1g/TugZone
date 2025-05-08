'use client'

import { useState, useEffect } from 'react'
import {
    useAccount,
    useWriteContract,
    usePublicClient,
    useWaitForTransactionReceipt,
    useWatchContractEvent,
    useWalletClient,
} from 'wagmi'
import { parseEventLogs, parseEther } from 'viem'
import FactoryAbi from '@/abis/TokenFactory.json'
import TokenAbi from '@/abis/PumpToken.json'
import PoolAbi from '@/abis/PumpPool.json'

const FACTORY = '0xEbCbB6FFA5cfeE323ddD57Cf05e13391aFaF24F1' as const
// const PUMPPOOL = '0x28Fe0b07410d9Aee3A94B4C72fBDaBdF15dea416' as const
// const PUMPTOKEN = '0x6a656A0C6E7B0845a53B2c350e838828daf64DBe' as const

export default function CreateTokenForm() {
    /* ────────────────────────── ui state ───────────────────────── */
    const [name, setName] = useState('')
    const [symbol, setSymbol] = useState('')
    const [metadata, setMetadata] = useState('')
    const [ethLiquidity, setLiquidity] = useState('')
    const [loading, setLoading] = useState(false)

    const [hash, setHash] = useState<`0x${string}` | undefined>()
    const [tokenAddr, setTokenAddr] = useState<`0x${string}`>()
    const [poolAddr, setPoolAddr] = useState<`0x${string}`>()

    /* ───────────────── wagmi / viem hooks ──────────────────────── */
    const { address, isConnected } = useAccount()
    const { writeContractAsync } = useWriteContract()
    const publicClient = usePublicClient()
    const { data: walletClient } = useWalletClient()          // signer-like

    /* 1️⃣ watch all future TokenCreated events (optional) */
    useWatchContractEvent({
        address: FACTORY,
        abi: FactoryAbi,
        eventName: 'TokenCreated',
        onLogs: (logs) => {
            const [{ args }] = parseEventLogs({
                abi: FactoryAbi,
                logs,
                eventName: 'TokenCreated',
            })
            console.log('🔔 live event → new token at', args[0])
        },
    })

    /* 2️⃣ wait for factory tx to be mined */
    const { data: receipt } = useWaitForTransactionReceipt({
        hash,
        enabled: !!hash,
        confirmations: 1,
    })

    /* 3️⃣ once we have a receipt → decode factory logs */
    useEffect(() => {
        if (!receipt) return
        const decoded = parseEventLogs({ abi: FactoryAbi, logs: receipt.logs })

        const tokenLog = decoded.find((l) => l.eventName === 'TokenCreated')
        const poolLog = decoded.find((l) => l.eventName === 'PoolCreated')

        if (tokenLog && poolLog) {
            setTokenAddr(tokenLog.args[0] as `0x${string}`)
            setPoolAddr(poolLog.args[1] as `0x${string}`)
        }
    }, [receipt])

    /* ───────────────────── submit handler ─────────────────────── */
    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        if (!isConnected || loading) return
        setLoading(true)

        try {
            const txHash = await writeContractAsync({
                address: FACTORY,
                abi: FactoryAbi,
                functionName: 'createToken',
                args: [name, symbol, metadata],
                value: parseEther(ethLiquidity),
            })
            setHash(txHash);                              // triggers wait hook
        } catch (err) {
            console.error(err)
            alert((err as Error).message)
            setLoading(false)
        }
    }

    function resetForm() {
        setName(''); setSymbol(''); setMetadata(''); setLiquidity('')
        setLoading(false); setHash(undefined); setTokenAddr(undefined); setPoolAddr(undefined)
    }

    /* ────────────────────────── ui ────────────────────────────── */
    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-3 max-w-sm">
            <input className="input input-bordered" placeholder="Token Name"
                value={name} onChange={e => setName(e.target.value)} required />
            <input className="input input-bordered" placeholder="Symbol"
                value={symbol} onChange={e => setSymbol(e.target.value)} required />
            <input className="input input-bordered" placeholder="Metadata URL"
                value={metadata} onChange={e => setMetadata(e.target.value)} required />
            <input className="input input-bordered" placeholder="ETH Liquidity (e.g. 0.01)"
                value={ethLiquidity} onChange={e => setLiquidity(e.target.value)} required />
            <button className="btn btn-primary" disabled={loading || !isConnected}>
                {loading ? 'Creating…' : 'Create Token'}
            </button>
        </form>
    )
}
