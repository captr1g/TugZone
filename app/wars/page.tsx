'use client'

import { useEffect, useMemo, useState } from 'react'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Users, Clock, ArrowUpRight, Zap } from 'lucide-react'
import Link from 'next/link'

/* -------------------------------------------------------------------------- */
/*  Types                                                                     */
/* -------------------------------------------------------------------------- */

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

/* -------------------------------------------------------------------------- */
/*  Helpers                                                                   */
/* -------------------------------------------------------------------------- */

const fmtCountdown = (endISO: string) => {
  const diff = new Date(endISO).getTime() - Date.now()
  if (diff <= 0) return 'Ended'
  const d = Math.floor(diff / 86_400_000)
  const h = Math.floor((diff % 86_400_000) / 3_600_000)
  const m = Math.floor((diff % 3_600_000) / 60_000)

  return [d && `${d}d`, h && `${h}h`, `${m}m`].filter(Boolean).join(' ')
}

/* -------------------------------------------------------------------------- */
/*  Component                                                                 */
/* -------------------------------------------------------------------------- */

export default function WarsPage() {
  const [wars, setWars] = useState<War[]>([])
  const [loading, setLoading] = useState(true)

  /* fetch wars once on mount */
  useEffect(() => {
    ; (async () => {
      try {
        const res = await fetch('/api/wars')
        if (!res.ok) throw new Error('Failed to load wars')
        const json = await res.json()
        setWars(Array.isArray(json.data) ? (json.data as War[]) : [])
      } catch (err) {
        console.error(err)
        setWars([])
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  /* put ended wars last */
  const orderedWars = useMemo(() => {
    const now = Date.now()
    return [...wars].sort(
      (a, b) =>
        Number(new Date(a.endTime).getTime() <= now) -
        Number(new Date(b.endTime).getTime() <= now),
    )
  }, [wars])

  /* ---------------------------------------------------------------------- */
  return (
    <div className="space-y-8">
      {/* header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <h1 className="text-3xl font-bold tracking-tight text-primary glow-text">
          Active Token Wars
        </h1>

        <Link href="/create" prefetch>
          <Button className="cyber-button gap-2">
            <Zap className="h-4 w-4" />
            Create New Token
          </Button>
        </Link>
      </div>

      {/* grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {loading && (
          <p className="col-span-full text-muted-foreground">Loading wars…</p>
        )}

        {!loading && orderedWars.length === 0 && (
          <p className="col-span-full text-muted-foreground">
            No active wars yet – be the first to start one!
          </p>
        )}

        {orderedWars.map(war => {
          const isEnded = Date.now() > new Date(war.endTime).getTime()

          return (
            <Card
              key={war._id}
              className="cyber-gradient border-primary/20 rounded-2xl p-6 shadow-md flex flex-col justify-between min-h-[18rem]"
            >
              {/* ——— Title ——— */}
              <CardHeader className="p-0 mb-4">
                <CardTitle className="text-2xl font-extrabold text-primary tracking-tight glow-text leading-tight">
                  {war.name || `${war.tokenA.symbol} vs ${war.tokenB.symbol}`}
                </CardTitle>

                {war.description && (
                  <p className="text-muted-foreground text-sm mt-1">
                    {war.description}
                  </p>
                )}
              </CardHeader>

              {/* ——— Metrics ——— */}
              <CardContent className="p-0 space-y-5 flex-1">
                {/* participants + countdown */}
                <div className="flex flex-col gap-3 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Users className="w-4 h-4 shrink-0" />
                    <span className="whitespace-nowrap">
                      {war.totalParticipants.toLocaleString()} participants
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Clock className="w-4 h-4 shrink-0" />
                    <span
                      className={`whitespace-nowrap ${isEnded ? 'text-destructive' : ''
                        }`}
                    >
                      {fmtCountdown(war.endTime)}
                    </span>
                  </div>
                </div>

                {/* volume */}
                <div className="border border-primary/10 rounded-lg p-4 bg-background/60">
                  <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1">
                    Total Volume
                  </p>
                  <p className="text-xl font-bold text-primary glow-text">
                    ${war.totalVolume.toLocaleString()}
                  </p>
                </div>
              </CardContent>

              {/* ——— CTA ——— */}
              <Link href={`/wars/${war._id}`} prefetch className="mt-6 block">
                <Button
                  className="w-full cyber-button gap-1 h-10 text-sm tracking-wider"
                  variant="outline"
                >
                  Enter Battle
                  <ArrowUpRight className="h-4 w-4" />
                </Button>
              </Link>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
