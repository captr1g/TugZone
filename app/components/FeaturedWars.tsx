import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

const wars = [
  { id: 1, name: "ETH vs BTC", status: "active", endTime: "2h 15m", participants: 1243 },
  { id: 2, name: "DOGE vs SHIB", status: "upcoming", startTime: "1d 3h", participants: 567 },
  { id: 3, name: "ADA vs DOT", status: "completed", endTime: "3h ago", participants: 2109 },
]

export default function FeaturedWars() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Featured Token Wars</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-4">
          {wars.map((war) => (
            <li key={war.id} className="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
              <div>
                <Link href={`/wars/${war.id}`} className="text-lg font-semibold hover:text-purple-400">
                  {war.name}
                </Link>
                <div className="text-sm text-gray-400">
                  {war.status === "active" && `Ends in ${war.endTime}`}
                  {war.status === "upcoming" && `Starts in ${war.startTime}`}
                  {war.status === "completed" && `Ended ${war.endTime}`}
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Badge
                  variant={war.status === "active" ? "default" : war.status === "upcoming" ? "secondary" : "outline"}
                >
                  {war.status}
                </Badge>
                <div className="text-sm">{war.participants} participants</div>
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}
