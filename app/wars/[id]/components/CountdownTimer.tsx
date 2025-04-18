"use client"

import { useState, useEffect } from "react"

export default function CountdownTimer({ endTime }: { endTime: Date }) {
  const [timeLeft, setTimeLeft] = useState("")

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date()
      const difference = endTime.getTime() - now.getTime()

      if (difference > 0) {
        const hours = Math.floor((difference / (1000 * 60 * 60)) % 24)
        const minutes = Math.floor((difference / 1000 / 60) % 60)
        const seconds = Math.floor((difference / 1000) % 60)

        setTimeLeft(`${hours}h ${minutes}m ${seconds}s`)
      } else {
        setTimeLeft("Ended")
        clearInterval(timer)
      }
    }, 1000)

    return () => clearInterval(timer)
  }, [endTime])

  return <span>{timeLeft}</span>
}
