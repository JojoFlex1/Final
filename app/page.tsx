"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { StatsCards } from "@/components/dashboard/stats-cards"
import { RecentActivity } from "@/components/dashboard/recent-activity"
import { QuickActions } from "@/components/dashboard/quick-actions"
import { PointsChart } from "@/components/dashboard/points-chart"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, X } from "lucide-react"

export default function DashboardPage() {
  const searchParams = useSearchParams()
  const [showSuccessAlert, setShowSuccessAlert] = useState(false)

  useEffect(() => {
    // Check if user just submitted waste
    if (searchParams.get("submitted") === "true") {
      setShowSuccessAlert(true)
      // Auto-hide after 5 seconds
      const timer = setTimeout(() => setShowSuccessAlert(false), 5000)
      return () => clearTimeout(timer)
    }
  }, [searchParams])

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Success Alert */}
        {showSuccessAlert && (
          <Alert className="border-primary/20 bg-primary/5">
            <CheckCircle className="h-4 w-4 text-primary" />
            <AlertDescription className="flex items-center justify-between">
              <span>
                Great job! Your e-waste submission has been recorded and points have been added to your account.
              </span>
              <button
                onClick={() => setShowSuccessAlert(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            </AlertDescription>
          </Alert>
        )}

        <DashboardHeader />
        <StatsCards />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <PointsChart />
            <RecentActivity />
          </div>
          <div className="space-y-6">
            <QuickActions />
          </div>
        </div>
      </div>
    </div>
  )
}
