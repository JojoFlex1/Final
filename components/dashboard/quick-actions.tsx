"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { QrCode, MapPin, Upload, User, Award } from "lucide-react"
import Link from "next/link"

export function QuickActions() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <Link href="/scan" className="block">
          <Button className="w-full justify-start gap-3 h-12" size="lg">
            <QrCode className="h-5 w-5" />
            Scan Bin QR Code
          </Button>
        </Link>

        <Link href="/bins" className="block">
          <Button variant="outline" className="w-full justify-start gap-3 h-12 bg-transparent" size="lg">
            <MapPin className="h-5 w-5" />
            Find Nearby Bins
          </Button>
        </Link>

        <Link href="/submit" className="block">
          <Button variant="outline" className="w-full justify-start gap-3 h-12 bg-transparent" size="lg">
            <Upload className="h-5 w-5" />
            Submit E-Waste
          </Button>
        </Link>

        <Link href="/leaderboard" className="block">
          <Button variant="outline" className="w-full justify-start gap-3 h-12 bg-transparent" size="lg">
            <Award className="h-5 w-5" />
            View Leaderboard
          </Button>
        </Link>

        <Link href="/profile" className="block">
          <Button variant="ghost" className="w-full justify-start gap-3 h-12" size="lg">
            <User className="h-5 w-5" />
            Edit Profile
          </Button>
        </Link>
      </CardContent>
    </Card>
  )
}
