"use client"

import { useSearchParams } from "next/navigation"
import { SubmissionSuccess } from "@/components/success/submission-success"

export default function SuccessPage() {
  const searchParams = useSearchParams()

  const points = Number.parseInt(searchParams.get("points") || "0")
  const wasteType = searchParams.get("wasteType") || "electronic_item"
  const binLocation = searchParams.get("binLocation") || "Unknown Location"
  const transactionHash = searchParams.get("txHash") || undefined

  return (
    <SubmissionSuccess
      points={points}
      wasteType={wasteType}
      binLocation={binLocation}
      transactionHash={transactionHash}
    />
  )
}
