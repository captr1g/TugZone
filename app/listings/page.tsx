"use client"

import { useEffect, useState } from "react"
import { X, Zap, ExternalLink } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

// Types
interface Token {
  id: string
  tokenAddress: string
  poolAddress: string
  name: string
  symbol: string
  totalSupply: number
  description?: string
  imageURL?: string
  creatorAddress: string
  launchDate: string
  initialBuyAmount: number
  warCount: number
  isActive: boolean
  price?: number
  change24h?: number

}

export default function ListingsPage() {
  const [tokens, setTokens] = useState<Token[]>([])
  const [selectedToken, setSelectedToken] = useState<Token | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    ; (async () => {
      try {
        const res = await fetch("/api/tokens")
        const json = await res.json()
        const data = Array.isArray(json.data) ? (json.data as Token[]) : []
        setTokens(data)
      } catch (err) {
        console.error("Error loading tokens:", err)
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  return (
    <div className="flex h-screen bg-white">
      {/* LEFT SIDE: Token List */}
      <div className="w-1/2 border-r border-gray-200 overflow-y-auto bg-white px-4 py-6">
        <div className="flex items-center space-x-2 mb-6">
          <Zap className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-semibold text-primary">Verified</h2>
        </div>

        {loading ? (
          <p className="text-gray-500">Loading tokens...</p>
        ) : (
          <ul className="space-y-2">
            {tokens.map((token) => {
              const isActive = selectedToken?.id === token.id
              const marketCapMillions =
                token.price != null
                  ? ((token.totalSupply * token.price) / 1_000_000).toFixed(1) + "M"
                  : "N/A"

              return (
                <li
                  key={token.id}
                  onClick={() => setSelectedToken(token)}
                  className={
                    "cursor-pointer flex items-center justify-between p-3 rounded-xl transition-all " +
                    (isActive
                      ? "bg-white hover:bg-gray-100"
                      : "hover:bg-white")
                  }
                >
                  <div className="flex items-center space-x-3">
                    {token.imageURL ? (
                      <img
                        src={token.imageURL}
                        alt={`${token.name} logo`}
                        className="h-6 w-6 rounded-full bg-gray-100"
                      />
                    ) : (
                      <div className="h-6 w-6 rounded-full bg-gray-200" />
                    )}
                    <div>
                      <p className="font-medium text-gray-800">{token.name}</p>
                      <p className="text-sm text-gray-500">{token.symbol}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-800">
                      {token.price != null ? `$${token.price.toFixed(4)}` : "N/A"}
                    </p>
                    <p className="text-xs text-gray-500">${marketCapMillions}</p>
                  </div>
                </li>
              )
            })}
          </ul>
        )}
      </div>


      {/* ───────────────────────────────────────────────────────────────── */}
      {/* RIGHT SIDE: Token Details (Reorganized & Updated Stats) */}
      <div className="w-1/2 p-6 overflow-y-auto">
        {selectedToken ? (
          <div className="relative h-full">
            {/* Close Button */}
            <button
              onClick={() => setSelectedToken(null)}
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Header: Logo + Name + Symbol + 24h Change */}
            <div className="flex items-center space-x-3">
              {selectedToken.imageURL ? (
                <img
                  src={selectedToken.imageURL}
                  alt={`${selectedToken.name} logo`}
                  className="h-10 w-10 rounded-full bg-gray-100"
                />
              ) : (
                <div className="h-10 w-10 rounded-full bg-gray-100" />
              )}
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {selectedToken.name}{" "}
                  <span className="ml-1 text-sm text-gray-500">{selectedToken.symbol}</span>
                </h1>
                {selectedToken.change24h != null && (
                  <p
                    className={
                      "mt-1 text-sm font-semibold " +
                      (selectedToken.change24h >= 0 ? "text-green-600" : "text-red-600")
                    }
                  >
                    {selectedToken.change24h >= 0 ? "+" : ""}
                    {selectedToken.change24h.toFixed(2)}%
                  </p>
                )}
              </div>
            </div>

            {/* ─────────────────────────────────────────────── */}
            {/* Price Chart Section */}
            <div className="mt-8">
              <p className="text-lg font-semibold text-gray-700 mb-2">Price Chart</p>
              <div className="h-64 w-full rounded-lg border border-gray-200 bg-gray-50 flex items-center justify-center">
                <span className="text-gray-400">[Chart Component]</span>
              </div>
              <div className="mt-4 flex space-x-4">
                {["1H", "1D", "1W", "1M", "All"].map((label) => (
                  <button
                    key={label}
                    className="rounded-full px-3 py-1 text-xs font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* ─────────────────────────────────────────────── */}
            {/* About / Description */}
            {selectedToken.description && (
              <div className="mt-8">
                <h2 className="text-lg font-semibold text-gray-700 mb-2">About</h2>
                <p className="text-gray-600 leading-relaxed">{selectedToken.description}</p>
              </div>
            )}

            {/* ─────────────────────────────────────────────── */}
            {/* Deployer / Builder Section */}
            <div className="mt-8">
              <h2 className="text-lg font-semibold text-gray-700 mb-2">Deployer</h2>
              <div className="inline-flex items-center space-x-2 rounded-lg bg-gray-100 px-3 py-2">
                <div className="h-6 w-6 rounded-full bg-gray-300" />
                <p className="text-sm font-medium text-gray-800">
                  {selectedToken.creatorAddress.slice(0, 6)}...
                  {selectedToken.creatorAddress.slice(-4)}
                </p>
              </div>
            </div>

            {/* ─────────────────────────────────────────────── */}
            {/* Links Section */}
            <div className="mt-8">
              <h2 className="text-lg font-semibold text-gray-700 mb-2">Links</h2>
              <div className="space-y-2">
                {/* Token Contract Link */}
                <a
                  href={`https://etherscan.io/token/${selectedToken.tokenAddress}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-2 rounded-lg bg-gray-100 px-3 py-2 hover:bg-gray-200"
                >
                  <ExternalLink className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-800">Contract</span>
                </a>
                {/* Pool Address Link */}
                <a
                  href={`https://etherscan.io/address/${selectedToken.poolAddress}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-2 rounded-lg bg-gray-100 px-3 py-2 hover:bg-gray-200"
                >
                  <ExternalLink className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-800">Pool</span>
                </a>
              </div>
            </div>

            {/* ─────────────────────────────────────────────── */}
            {/* Stats Section (alternating backgrounds) */}
            <div className="mt-8">
              <h2 className="text-lg font-semibold text-gray-700 mb-4">Stats</h2>
              <div className="text-sm text-gray-600">
                {/* Price Row (index 0 – background) */}
                <div className="grid grid-cols-2 bg-gray-100 rounded-lg">
                  <div className="px-3 py-2">Price</div>
                  <div className="px-3 py-2 text-right">
                    {selectedToken.price != null
                      ? `$${selectedToken.price.toFixed(6)}`
                      : "N/A"}
                  </div>
                </div>

                {/* Market Cap Row (index 1 – no background) */}
                <div className="grid grid-cols-2">
                  <div className="px-3 py-2">Market Cap</div>
                  <div className="px-3 py-2 text-right">
                    {selectedToken.price != null
                      ? `$${((selectedToken.totalSupply * selectedToken.price) / 1_000_000).toFixed(1)}M`
                      : "N/A"}
                  </div>
                </div>

                {/* Circulating Supply Row (index 2 – background) */}
                <div className="grid grid-cols-2 bg-gray-100">
                  <div className="px-3 py-2">Circulating Supply</div>
                  <div className="px-3 py-2 text-right">
                    {selectedToken.totalSupply.toLocaleString()}
                  </div>
                </div>

                {/* Created Row (index 3 – no background) */}
                <div className="grid grid-cols-2">
                  <div className="px-3 py-2">Created</div>
                  <div className="px-3 py-2 text-right">
                    {new Date(selectedToken.launchDate).toLocaleString()}
                  </div>
                </div>
              </div>
            </div>

            {/* (Optional) If you have a "Holders" field, insert it at index 2 and shift others */}
            {/* Example: */}
            {/* <div className="bg-gray-100 px-3 py-2">Holders</div> */}
            {/* <div className="px-3 py-2 text-right">{selectedToken.holders ?? "—"}</div> */}
          </div>
        ) : (
          <div className="flex h-full items-center justify-center text-gray-500">
            <p>Select a token to view details</p>
          </div>
        )}
      </div>
    </div>
  )
}

