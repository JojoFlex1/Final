"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Wallet, CheckCircle, AlertCircle, ExternalLink } from "lucide-react"

interface WalletInfo {
  address: string
  balance: number
  isConnected: boolean
}

export function WalletConnection() {
  const [wallet, setWallet] = useState<WalletInfo | null>(null)
  const [isConnecting, setIsConnecting] = useState(false)

  useEffect(() => {
    // Check if wallet is already connected
    checkWalletConnection()
  }, [])

  const checkWalletConnection = async () => {
    try {
      // Mock wallet connection check - replace with actual wallet API
      const mockWallet = {
        address: "addr_test1qz8p8rp4cvmnepjhh53j3ewqzsfmu4r3lcpyqpen4cpt4jc...",
        balance: 125.5,
        isConnected: true,
      }
      setWallet(mockWallet)
    } catch (error) {
      console.error("Error checking wallet connection:", error)
    }
  }

  const connectWallet = async () => {
    setIsConnecting(true)
    try {
      // Mock wallet connection - replace with actual wallet integration
      await new Promise((resolve) => setTimeout(resolve, 2000))

      const connectedWallet = {
        address: "addr_test1qz8p8rp4cvmnepjhh53j3ewqzsfmu4r3lcpyqpen4cpt4jc...",
        balance: 125.5,
        isConnected: true,
      }
      setWallet(connectedWallet)
    } catch (error) {
      console.error("Error connecting wallet:", error)
    } finally {
      setIsConnecting(false)
    }
  }

  const disconnectWallet = () => {
    setWallet(null)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wallet className="h-5 w-5" />
          Cardano Wallet
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {wallet?.isConnected ? (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-primary" />
              <Badge className="bg-primary/10 text-primary border-primary/20">Connected</Badge>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Address:</span>
                <code className="text-xs bg-muted px-2 py-1 rounded">{wallet.address}</code>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Balance:</span>
                <span className="font-semibold">{wallet.balance} ADA</span>
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open("https://preprod.cardanoscan.io", "_blank")}
                className="flex-1 gap-2 bg-transparent"
              >
                <ExternalLink className="h-3 w-3" />
                View on Explorer
              </Button>
              <Button variant="ghost" size="sm" onClick={disconnectWallet} className="flex-1">
                Disconnect
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-muted-foreground" />
              <Badge variant="secondary">Not Connected</Badge>
            </div>

            <p className="text-sm text-muted-foreground">
              Connect your Cardano wallet to submit transactions to the blockchain and earn verified points.
            </p>

            <Button onClick={connectWallet} disabled={isConnecting} className="w-full gap-2">
              <Wallet className="h-4 w-4" />
              {isConnecting ? "Connecting..." : "Connect Wallet"}
            </Button>

            <div className="text-xs text-muted-foreground space-y-1">
              <p>Supported wallets:</p>
              <ul className="list-disc list-inside space-y-0.5 ml-2">
                <li>Nami</li>
                <li>Eternl</li>
                <li>Flint</li>
                <li>Yoroi</li>
              </ul>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
