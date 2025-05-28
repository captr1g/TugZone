import type React from "react"
import { GeistSans } from "geist/font/sans"
import { Press_Start_2P } from "next/font/google"
import "./globals.css"
import Header from "./components/Header"
import Sidebar from "./components/Sidebar"
import Providers from "@/hooks/providers"
import '@coinbase/onchainkit/styles.css';

const pressStart2P = Press_Start_2P({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
  variable: "--font-press-start-2p",
})

export const metadata = {
  title: "TugZone | Underground Token Battles",
  description: "Enter the arena of competitive token trading",
  generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${GeistSans.className} ${pressStart2P.variable}`}>
      <body className="min-h-screen">
        <Providers>
          <div className="flex min-h-screen">

            <Sidebar />

            <div className="flex flex-col flex-1">
              <Header />
              <main className="flex-1 p-6">{children}</main>
            </div>
          </div>
        </Providers>
      </body>
    </html>
  )
}

