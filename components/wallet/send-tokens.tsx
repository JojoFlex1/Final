"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Send, ArrowLeft } from "lucide-react"
import { toast } from "@/hooks/use-toast"

interface SendTokensProps {
  onBack: () => void
}

export function SendTokens({ onBack }: SendTokensProps) {
  const [recipient, setRecipient] = useState("")
  const [amount, setAmount] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSend = async () => {
    if (!recipient || !amount) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    try {
      // Here you would integrate with your Cardano wallet service
      // For now, simulate the transaction
      await new Promise((resolve) => setTimeout(resolve, 2000))

      toast({
        title: "Success!",
        description: `Sent ${amount} tokens to ${recipient.slice(0, 10)}...`,
      })

      setRecipient("")
      setAmount("")
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send tokens",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="border-emerald-200">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <CardTitle className="text-emerald-800">Send Tokens</CardTitle>
            <CardDescription>Transfer tokens to another wallet</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="recipient">Recipient Address</Label>
          <Input
            id="recipient"
            placeholder="addr_test1..."
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            className="font-mono text-sm"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="amount">Amount</Label>
          <Input
            id="amount"
            type="number"
            placeholder="0.00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>

        <div className="bg-emerald-50 p-3 rounded-lg">
          <p className="text-sm text-emerald-700">
            <strong>Network:</strong> Cardano Testnet
          </p>
          <p className="text-sm text-emerald-700">
            <strong>Fee:</strong> ~0.17 ADA
          </p>
        </div>

        <Button
          onClick={handleSend}
          disabled={loading || !recipient || !amount}
          className="w-full bg-emerald-600 hover:bg-emerald-700"
        >
          {loading ? (
            "Sending..."
          ) : (
            <>
              <Send className="w-4 h-4 mr-2" />
              Send Tokens
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  )
}
