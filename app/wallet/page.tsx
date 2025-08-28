import { WalletConnection } from "@/components/wallet/wallet-connection"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Shield, Zap, Globe } from "lucide-react"
import Link from "next/link"

export default function WalletPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Link>
        </div>

        <div className="max-w-2xl mx-auto space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold text-balance">Wallet Connection</h1>
            <p className="text-muted-foreground">Connect your Cardano wallet to interact with the blockchain</p>
          </div>

          <WalletConnection />

          {/* Benefits */}
          <Card className="bg-muted/50">
            <CardHeader>
              <CardTitle className="text-lg">Why Connect Your Wallet?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <Shield className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <h3 className="font-semibold">Verified Transactions</h3>
                  <p className="text-sm text-muted-foreground">
                    All your waste submissions are recorded on the Cardano blockchain for transparency
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Zap className="h-5 w-5 text-accent mt-0.5" />
                <div>
                  <h3 className="font-semibold">Instant Points</h3>
                  <p className="text-sm text-muted-foreground">
                    Earn points immediately when your transactions are confirmed on-chain
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Globe className="h-5 w-5 text-chart-2 mt-0.5" />
                <div>
                  <h3 className="font-semibold">Global Impact</h3>
                  <p className="text-sm text-muted-foreground">
                    Join a global network of eco-conscious individuals making a real difference
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
