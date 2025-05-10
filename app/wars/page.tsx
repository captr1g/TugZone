'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Users, Clock, ArrowUpRight, Zap } from 'lucide-react'
import Link from 'next/link'

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

export default function WarsPage() {
  const [wars, setWars] = useState<War[]>([])
  const [loading, setLoading] = useState(true)

  /* grab wars once on mount */
  useEffect(() => {
    ; (async () => {
      try {
        const res = await fetch('/api/wars')
        const json = await res.json()
        setWars(json.data as War[])
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  /* helper: format “Xd Xh Xm” */
  function timeRemaining(end: string) {
    const diff = new Date(end).getTime() - Date.now()
    if (diff <= 0) return 'Ended'

    const m = Math.floor(diff / 6e4)
    const d = Math.floor(m / 1440)
    const h = Math.floor((m % 1440) / 60)
    const mm = m % 60
    return [
      d ? `${d}d` : null,
      h ? `${h}h` : null,
      `${mm}m`
    ]
      .filter(Boolean)
      .join(' ')
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight text-primary glow-text">
          Active Token Wars
        </h1>
        <Link href="/create">
          <Button className="cyber-button">
            <Zap className="mr-2 h-4 w-4" />
            Create New Token
          </Button>
        </Link>
      </div>

      {/* grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">

        {loading && (
          <div className="col-span-full text-muted-foreground">Loading wars…</div>
        )}

        {!loading && wars.length === 0 && (
          <div className="col-span-full text-muted-foreground">
            No active wars yet – be the first to start one!
          </div>
        )}

        {wars.map((war) => (
          <Card key={war._id} className="cyber-gradient border-primary/20">
            <CardHeader>
              <CardTitle className="text-primary text-xl glow-text">
                {war.name || `${war.tokenA.symbol} vs ${war.tokenB.symbol}`}
              </CardTitle>
            </CardHeader>

            <CardContent>
              {war.description && (
                <p className="text-muted-foreground mb-4">{war.description}</p>
              )}

              <div className="flex justify-between items-center text-sm mb-4">
                <div className="flex items-center">
                  <Users className="mr-2 h-4 w-4" />
                  <span>{war.totalParticipants} participants</span>
                </div>

                <div className="flex items-center">
                  <Clock className="mr-2 h-4 w-4" />
                  <span>{timeRemaining(war.endTime)} left</span>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <div>
                  <div className="text-sm text-muted-foreground">Total Volume</div>
                  <div className="font-bold text-primary">
                    ${war.totalVolume.toLocaleString()}
                  </div>
                </div>

                <Link href={`/wars/${war._id}`}>
                  <Button variant="outline" className="cyber-button">
                    Enter Battle
                    <ArrowUpRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
