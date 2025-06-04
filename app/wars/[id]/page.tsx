'use client'
import { useState, useEffect } from "react"
import { useParams } from 'next/navigation'
import { usePublicClient } from 'wagmi'            // viem under the hood
import { formatEther } from 'viem'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Users, Clock, TrendingUp, TrendingDown } from "lucide-react"
import TokenChart from "@/app/components/TokenChart"
import BuySellActions from "./components/BuySellActions"
import Leaderboard from "./components/Leaderboard"

type War = {
  _id: string
  name: string
  description: string
  tokenA: { name: string; symbol: string; tokenAddress: `0x${string}` }
  tokenB: { name: string; symbol: string; tokenAddress: `0x${string}` }
  endTime: string
  startTime: string
  totalParticipants: number
  totalVolume: number
}

const dummyHistory = [
  { t: '0h', a: 0.12, b: 0.15 },
  { t: '1h', a: 0.18, b: 0.14 },
  { t: '2h', a: 0.21, b: 0.17 },
  { t: '3h', a: 0.25, b: 0.19 },
]

const dummyLeaders = [
  { wallet: '0xF5…D3', size: 2.5 },
  { wallet: '0x9A…4C', size: 1.1 },
  { wallet: '0x12…EE', size: 0.8 },
]

/* ––––– helpers ––––– */
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

export default function WarDetailPage() {

  const { id } = useParams() as { id: string }

  const [war, setWar] = useState<War | null>(null)
  const [priceA, setPriceA] = useState<number | null>(null)
  const [priceB, setPriceB] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)

  const client = usePublicClient()
  /* ───── fetch war details ───── */
  useEffect(() => {
    ; (async () => {
      try {
        const res = await fetch(`/api/wars/${id}`)
        const json = await res.json()
        setWar(json.data as War)
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    })()
  }, [id])

  /* ───── fetch on-chain prices each 15 s ───── */
  useEffect(() => {
    if (!war) return

    const fetchPrice = async () => {
      try {
        const readReserves = async (tokenAddr: `0x${string}`) => {
          // 1. look up pool for token in your DB API
          const poolRes = await fetch(`/api/pools?token=${tokenAddr}`)
          const { poolAddress } = await poolRes.json()

          // 2. read reserves (token + ETH) – adjust ABI name if needed
          const [tokenRes, ethRes] = await client.readContract({
            address: poolAddress,
            abi: [{
              name: 'getReserves', type: 'function', stateMutability: 'view', outputs: [
                { name: 'tokenReserves', type: 'uint256' },
                { name: 'ethReserves', type: 'uint256' }]
            }],
            functionName: 'getReserves',
          }) as [bigint, bigint]

          // 3. price = ethReserves / tokenReserves
          return Number(formatEther(ethRes)) / (Number(tokenRes) / 1e18)
        }

        const [pA, pB] = await Promise.all([
          readReserves(war.tokenA.tokenAddress),
          readReserves(war.tokenB.tokenAddress),
        ])
        setPriceA(pA)
        setPriceB(pB)
      } catch (e) {
        console.error('price fetch failed', e)
      }
    }

    fetchPrice()
    const id = setInterval(fetchPrice, 15_000)
    return () => clearInterval(id)
  }, [war, client])

  /* ───── render ───── */
  if (loading) {
    return <div className="p-6 text-muted-foreground">Loading…</div>
  }
  if (!war) {
    return <div className="p-6 text-destructive">War not found.</div>
  }


  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-primary glow-text">{war.name}</h1>
          <p className="text-lg text-muted-foreground">{war.tokenA.name} vs {war.tokenB.name}</p>
        </div>
        <Badge variant="outline" className="text-lg uppercase cyber-gradient">
          {war.status}
        </Badge>
      </div>

      <Card className="cyber-gradient border-primary/20">
        <CardContent className="pt-6">
          <div className="grid grid-cols-2 gap-4 mb-4">
            {[war.tokenA, war.tokenB].map((token, index) => (
              <div key={index} className="bg-secondary/50 p-4 rounded-lg border border-primary/20">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-bold text-primary text-lg">{token.symbol}</span>
                  <span className={`text-sm ${token.change >= 0 ? "text-green-400" : "text-red-400"}`}>
                    {token.change >= 0 ? (
                      <TrendingUp className="inline mr-1 h-4 w-4" />
                    ) : (
                      <TrendingDown className="inline mr-1 h-4 w-4" />
                    )}
                    {Math.abs(token.change)}%
                  </span>
                </div>
                <div className="text-2xl font-semibold">100</div>
              </div>
            ))}
          </div>
          <div className="mb-4">
            <div className="flex justify-between text-sm mb-1">
              <span>Battle Progress</span>
              <span>{war.progress}%</span>
            </div>
            <Progress value={war.progress} className="h-2" />
          </div>
          <div className="flex justify-between items-center text-sm">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-primary" />
              <span>{timeRemaining(war.endTime)} remaining</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-primary" />
              <span>{war.totalParticipants} participants</span>
            </div>
            <div>
              <span className="font-bold">Total Volume: </span>
              <span className="text-primary">${war.totalVolume.toLocaleString()}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="cyber-gradient border-primary/20 md:col-span-2">
          <CardHeader>
            <CardTitle className="text-primary">Price Charts</CardTitle>
          </CardHeader>
          <CardContent>
            <TokenChart />
          </CardContent>
        </Card>

        <BuySellActions tokens={[war.tokenA, war.tokenB]} />
      </div>

      <Tabs defaultValue="leaderboard" className="w-full">
        <TabsList className="cyber-gradient w-full justify-start">
          <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
          <TabsTrigger value="history">Trade History</TabsTrigger>
        </TabsList>
        <TabsContent value="leaderboard">
          <Leaderboard />
        </TabsContent>
        <TabsContent value="history">
          <Card className="cyber-gradient border-primary/20">
            <CardHeader>
              <CardTitle className="text-primary">Trade History</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Recent trades will be displayed here.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
