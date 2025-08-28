"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { QrCode, ArrowLeft, Copy, RefreshCw } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import { createBrowserClient } from "@/lib/supabase/client"

interface ReceiveTokensProps {
  onBack: () => void
}

export function ReceiveTokens({ onBack }: ReceiveTokensProps) {
  const [walletAddress, setWalletAddress] = useState("")
  const [amount, setAmount] = useState("")
  const [loading, setLoading] = useState(true)
  const supabase = createBrowserClient()

  useEffect(() => {
    loadWalletAddress()
  }, [])

  const loadWalletAddress = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) return

      const { data: profile } = await supabase.from("profiles").select("wallet_address").eq("id", user.id).single()

      if (profile?.wallet_address) {
        setWalletAddress(profile.wallet_address)
      }
    } catch (error) {
      console.error("Error loading wallet address:", error)
    } finally {
      setLoading(false)
    }
  }

  const copyAddress = () => {
    if (walletAddress) {
      navigator.clipboard.writeText(walletAddress)
      toast({
        title: "Copied!",
        description: "Wallet address copied to clipboard",
      })
    }
  }

  const generateQRCode = () => {
    // In a real implementation, you would generate a QR code
    toast({
      title: "QR Code",
      description: "QR code generation would be implemented here",
    })
  }

  if (loading) {
    return (
      <Card className="border-emerald-200">
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="h-20 bg-gray-200 rounded"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-emerald-200">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <CardTitle className="text-emerald-800">Receive Tokens</CardTitle>
            <CardDescription>Share your wallet address to receive ADA</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>Your Wallet Address</Label>
          <div className="flex gap-2">
            <Input value={walletAddress || "Wallet address not generated"} readOnly className="font-mono text-sm" />
            <Button onClick={copyAddress} size="sm" variant="outline" disabled={!walletAddress}>
              <Copy className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="amount">Amount (Optional)</Label>
          <Input
            id="amount"
            type="number"
            placeholder="0.00 ADA"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
          <p className="text-xs text-emerald-600">Specify an amount to request a specific payment</p>
        </div>

        <div className="bg-emerald-50 p-4 rounded-lg text-center">
          <QrCode className="w-16 h-16 mx-auto text-emerald-600 mb-2" />
          <p className="text-sm text-emerald-700 mb-3">QR Code for easy sharing</p>
          <Button onClick={generateQRCode} size="sm" variant="outline" disabled={!walletAddress}>
            Generate QR Code
          </Button>
        </div>

        <div className="bg-amber-50 p-3 rounded-lg">
          <p className="text-sm text-amber-700">
            <strong>Network:</strong> Cardano Testnet
            <br />
            <strong>Note:</strong> Only send ADA and Cardano native tokens to this address
          </p>
        </div>

        <Button onClick={loadWalletAddress} variant="outline" className="w-full border-emerald-200 bg-transparent">
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh Address
        </Button>
      </CardContent>
    </Card>
  )
}
