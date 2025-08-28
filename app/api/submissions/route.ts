import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET() {
  const supabase = await createClient()

  try {
    // Get current user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { data: submissions, error } = await supabase
      .from("waste_submissions")
      .select(`
        *,
        bins (name, address),
        point_transactions (points)
      `)
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })

    if (error) throw error

    return NextResponse.json(submissions)
  } catch (error) {
    console.error("Error fetching submissions:", error)
    return NextResponse.json({ error: "Failed to fetch submissions" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  const supabase = await createClient()

  try {
    // Get current user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { bin_id, waste_type, weight_kg, image_url } = await request.json()

    if (!bin_id || !waste_type) {
      return NextResponse.json({ error: "Bin ID and waste type are required" }, { status: 400 })
    }

    // Calculate points based on waste type and weight
    const pointsMap: Record<string, number> = {
      phones: 50,
      laptops: 100,
      tablets: 75,
      batteries: 25,
      cables: 10,
      small_electronics: 30,
      computers: 150,
      monitors: 80,
      printers: 60,
      gaming_devices: 90,
      all_electronics: 40,
    }

    const basePoints = pointsMap[waste_type] || 20
    const weightMultiplier = weight_kg ? Math.max(1, Math.floor(weight_kg)) : 1
    const points_earned = basePoints * weightMultiplier

    // Create waste submission
    const { data: submission, error: submissionError } = await supabase
      .from("waste_submissions")
      .insert({
        user_id: user.id,
        bin_id,
        waste_type,
        weight_kg,
        image_url,
        points_earned,
        status: "verified", // Auto-verify for now
      })
      .select()
      .single()

    if (submissionError) throw submissionError

    // Create point transaction
    const { error: transactionError } = await supabase.from("point_transactions").insert({
      user_id: user.id,
      submission_id: submission.id,
      points: points_earned,
      transaction_type: "earned",
      description: `Points earned for ${waste_type} disposal`,
    })

    if (transactionError) throw transactionError

    return NextResponse.json(submission)
  } catch (error) {
    console.error("Error creating submission:", error)
    return NextResponse.json({ error: "Failed to create submission" }, { status: 500 })
  }
}
