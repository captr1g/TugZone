import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import TokenChart from "../components/TokenChart"

export default function UserProfilePage() {
  // In a real application, you would fetch the user data
  const user = {
    name: "John Doe",
    username: "cryptoking",
    avatar: "/placeholder.svg",
    portfolioValue: 10000,
    tokensOwned: 5,
    totalEarnings: 2500,
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="flex items-center space-x-4 py-4">
          <Avatar className="h-20 w-20">
            <AvatarImage src={user.avatar} alt={user.name} />
            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-2xl font-bold">{user.name}</h1>
            <p className="text-gray-400">@{user.username}</p>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Portfolio Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">${user.portfolioValue.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Tokens Owned</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{user.tokensOwned}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Total Earnings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">${user.totalEarnings.toLocaleString()}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Portfolio Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <TokenChart />
        </CardContent>
      </Card>

      {/* Add more sections like transaction history, achievements, etc. */}
    </div>
  )
}
