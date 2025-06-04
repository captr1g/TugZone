'use client'

import { useState, useEffect } from 'react'
import {
    useAccount,
    useWriteContract,
    useWaitForTransactionReceipt,
} from 'wagmi'
import { parseEventLogs, parseEther } from 'viem'
import FactoryAbi from '@/abis/TokenFactory.json'


const FACTORY = '0xEbCbB6FFA5cfeE323ddD57Cf05e13391aFaF24F1' as const
const POOL = '0x856f236a946dcd30379579f0bA37253D895d3548' as const

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


    /* 2️⃣ wait for factory tx to be mined */
    const { data: receipt } = useWaitForTransactionReceipt({
        hash,
        enabled: !!hash,
        confirmations: 1,
    })

    /* 3️⃣ once we have a receipt → decode factory logs */
    useEffect(() => {
        if (!receipt) return

        const events = parseEventLogs({ abi: FactoryAbi, logs: receipt.logs })

        for (const ev of events) {
            if (ev.eventName === 'TokenCreated') {
                const { tokenAddress } = ev.args as { tokenAddress: `0x${string}` }
                setTokenAddr(tokenAddress)
            }
            if (ev.eventName === 'PoolCreated') {
                const { poolAddress } = ev.args as { poolAddress: `0x${string}` }
                setPoolAddr(poolAddress)
            }
        }

        setLoading(false);
        console.log(tokenAddr);
        console.log(poolAddr);
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

            console.log('calling backend');
            const response = await fetch('/api/tokens/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ txHash }),
            });
            const backendData = await response.json();
            console.log(backendData);

        } catch (err) {
            console.error(err)
            alert((err as Error).message)
            setLoading(false)
        }
    }

    function resetForm() {
        setName(''); setSymbol(''); setMetadata(''); setLiquidity('')
        setLoading(false); setHash(undefined);
    }

    /* ────────────────────────── ui ────────────────────────────── */
    return (
        <main className="flex flex-col items-center p-6 space-y-6">

            {/* ───── create-token form ───── */}
            <div className="card w-full max-w-md shadow-xl bg-base-200">
                <div className="card-body space-y-4">
                    <h2 className="card-title">Launch a new mem-token</h2>

                    <form onSubmit={handleSubmit} className="space-y-3">

                        <label className="form-control w-full">
                            <span className="label-text">Token name</span>
                            <input
                                className="input input-bordered w-full"
                                value={name}
                                onChange={e => setName(e.target.value)}
                                placeholder="e.g. Assesino Cappuccino"
                                required
                            />
                        </label>

                        <label className="form-control w-full">
                            <span className="label-text">Symbol</span>
                            <input
                                className="input input-bordered w-full"
                                value={symbol}
                                onChange={e => setSymbol(e.target.value)}
                                placeholder="e.g. ASH"
                                required
                            />
                        </label>

                        <label className="form-control w-full">
                            <span className="label-text">Metadata URL</span>
                            <input
                                className="input input-bordered w-full"
                                value={metadata}
                                onChange={e => setMetadata(e.target.value)}
                                placeholder="ipfs://… or https://…"
                                required
                            />
                        </label>

                        <label className="form-control w-full">
                            <span className="label-text">Initial ETH liquidity</span>
                            <input
                                className="input input-bordered w-full"
                                value={ethLiquidity}
                                onChange={e => setLiquidity(e.target.value)}
                                placeholder="0.01"
                                required
                            />
                            <span className="label-text-alt">min 0.001 ETH</span>
                        </label>

                        <button
                            className="btn btn-primary w-full"
                            disabled={loading || !isConnected}
                        >
                            {loading ? (
                                <span className="loading loading-spinner loading-sm mr-2" />
                            ) : null}
                            {loading ? 'Creating…' : 'Create token'}
                        </button>
                    </form>
                </div>
            </div>

            {/* ───── results card ───── */}
            {tokenAddr && (
                <div className="card w-full max-w-md shadow-lg border">
                    <div className="card-body space-y-2">
                        <h2 className="card-title">🎉 Token launched!</h2>

                        <div className="grid grid-cols-[120px_1fr] gap-x-2 text-sm">
                            <span className="font-medium">Token</span>
                            <a
                                href={`https://base-sepolia.blockscout.com/address/${tokenAddr}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="link break-all"
                            >
                                {tokenAddr}
                            </a>

                            <span className="font-medium">Pool</span>
                            <a
                                href={`https://base-sepolia.blockscout.com/address/${poolAddr}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="link break-all"
                            >
                                {poolAddr}
                            </a>
                        </div>

                        <div className="card-actions justify-end pt-3">
                            <button
                                onClick={resetForm}
                                className="btn btn-outline btn-sm"
                            >
                                New token
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </main>
    )
}  