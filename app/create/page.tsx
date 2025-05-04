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

const FACTORY = '0xA541a5a652D7CA0bFD45Df5c1352c3983E3D7bF7' as const

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

    /* 4️⃣ once both addresses are known → approve & initialise pool */
    useEffect(() => {
        if (!tokenAddr || !poolAddr || !walletClient) return

        (async () => {
            try {
                /* approve pool for full supply */
                const totalSupply = await publicClient?.readContract({
                    address: tokenAddr,
                    abi: TokenAbi,
                    functionName: 'totalSupply',
                }) as bigint

                const approveHash = await writeContractAsync({
                    address: tokenAddr,
                    abi: TokenAbi,
                    functionName: 'approve',
                    args: [poolAddr, totalSupply],
                })
                await publicClient?.waitForTransactionReceipt({ hash: approveHash })

                /* initialise pool with ETH liquidity */
                const initHash = await writeContractAsync({
                    address: poolAddr,
                    abi: PoolAbi,
                    functionName: 'initialize',
                    args: [tokenAddr, address as `0x${string}`],
                    value: parseEther(ethLiquidity || '0'),
                })
                await publicClient?.waitForTransactionReceipt({ hash: initHash })

                /* notify backend */
                await fetch('/api/tokens', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ txHash: initHash }),
                })

                alert('Token & pool created ✅')
                resetForm()
            } catch (err) {
                console.error(err)
                alert((err as Error).message)
            }
        })()
    }, [tokenAddr, poolAddr])                       // runs exactly once

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
                value: BigInt(0xsn),
            })
            setHash(txHash)                             // triggers wait hook
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
