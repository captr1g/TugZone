"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Zap, Sword, Trophy } from "lucide-react"
import Link from "next/link"
import { useEffect, useState, useMemo } from "react"

type War = {
    _id: string
    name: string
    description: string
    tokenA: { symbol: string }
    tokenB: { symbol: string }
    endTime: string
    totalParticipants: number
    totalVolume: number
}

export default function Dashboard() {
    const [wars, setWars] = useState<War[]>([])
    const [loading, setLoading] = useState(true)

    const { activeWars, topWars } = useMemo(() => {
        const now = Date.now()
        const active = wars.filter(w => new Date(w.endTime).getTime() > 0)
        return {
            activeWars: active,
            topWars: [...active]
                .sort((a, b) => new Date(a.endTime).getTime() -
                    new Date(b.endTime).getTime())
                .slice(0, 3)
        }
    }, [wars])

    useEffect(() => {
        async function fetchWars() {
            try {
                const res = await fetch("/api/wars")
                if (!res.ok) {
                    throw new Error('Failed to fetch wars')
                }
                const json = await res.json()
                if (json.data && Array.isArray(json.data)) {
                    setWars(json.data as War[])
                } else {
                    setWars([])
                }
            } catch (err) {
                console.error('Error fetching wars:', err)
                setWars([])
            } finally {
                setLoading(false)
            }
        }
        fetchWars()
    }, [])

    return (
        <div className="space-y-10">
            {/* ── Hero ─────────────────────────────────────────────────────────── */}
            <header className="flex justify-center">
                <div className="text-center">
                    <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-primary glow-text">
                        Welcome to the Arena
                    </h1>
                    <p className="mt-2 text-lg md:text-xl text-muted-foreground">
                        Choose your battles. Trade to victory.
                    </p>
                </div>
            </header>

            {/* ── Stat cards ───────────────────────────────────────────────────── */}
            <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {/* Active battles */}
                <Card className="cyber-gradient border-primary/20 rounded-2xl p-6 text-center">
                    <Sword className="mx-auto mb-4 h-6 w-6 text-primary" />
                    <CardTitle className="text-lg font-semibold text-primary">
                        Active Battles
                    </CardTitle>
                    <CardDescription className="mb-6">
                        Currently ongoing token wars
                    </CardDescription>
                    <div className="text-5xl font-extrabold text-primary glow-text">
                        {loading ? "—" : activeWars.length}
                    </div>
                </Card>

                {/* Your rank */}
                <Card className="cyber-gradient border-primary/20 rounded-2xl p-6 text-center">
                    <Trophy className="mx-auto mb-4 h-6 w-6 text-primary" />
                    <CardTitle className="text-lg font-semibold text-primary">
                        Your Rank
                    </CardTitle>
                    <CardDescription className="mb-6">
                        Global leaderboard position
                    </CardDescription>
                    <div className="text-5xl font-extrabold text-primary glow-text">#42</div>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Top&nbsp;1% of all warriors
                    </p>
                </Card>

                {/* Battle stats */}
                <Card className="cyber-gradient border-primary/20 rounded-2xl p-6 text-center">
                    <Zap className="mx-auto mb-4 h-6 w-6 text-primary" />

                    <CardTitle className="text-lg font-semibold text-primary">
                        Battle Stats
                    </CardTitle>
                    <CardDescription className="mb-6">
                        Your performance metrics
                    </CardDescription>
                    <div className="text-5xl font-extrabold text-primary glow-text">23</div>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Battles Won
                    </p>
                </Card>

            </section>

            {/* ── Active battlegrounds list ───────────────────────────────────── */}
            <Card className="cyber-gradient border-primary/20">
                <CardHeader>
                    <CardTitle className="text-primary">Active Battlegrounds</CardTitle>
                    <CardDescription>Current token wars in progress</CardDescription>
                </CardHeader>

                <CardContent>
                    {loading ? (
                        <p className="text-muted-foreground">Loading wars…</p>
                    ) : topWars.length === 0 ? (
                        <p className="text-muted-foreground">No active battles right now.</p>
                    ) : (
                        <div className="space-y-4">
                            {topWars.map(w => (
                                <div
                                    key={w._id}
                                    className="flex items-center justify-between rounded-lg border
                                             border-primary/20 p-4 bg-secondary/50
                                             hover:bg-secondary/70 transition-colors"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="h-12 w-12 rounded-lg bg-primary/20 border
                                                      border-primary/30 flex items-center justify-center">
                                            <Zap className="h-6 w-6 text-primary" />
                                        </div>
                                        <div>
                                            <div className="font-medium text-primary">
                                                {w.tokenA.symbol} vs {w.tokenB.symbol}
                                            </div>
                                            <div className="text-sm text-muted-foreground">
                                                {w.totalParticipants} warriors engaged
                                            </div>
                                        </div>
                                    </div>
                                    <Link href={`/wars/${w._id}`}>
                                        <Button variant="outline" className="cyber-button text-xs h-8">
                                            Join Battle
                                        </Button>
                                    </Link>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
} 