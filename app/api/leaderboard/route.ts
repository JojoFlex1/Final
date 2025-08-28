import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET() {
  const supabase = await createClient()

  try {
    const { data: leaderboard, error } = await supabase
      .from("profiles")
      .select("username, first_name, last_name, total_points, avatar_url")
      .order("total_points", { ascending: false })
      .limit(50)

    if (error) throw error

    return NextResponse.json(leaderboard)
  } catch (error) {
    console.error("Error fetching leaderboard:", error)
    return NextResponse.json({ error: "Failed to fetch leaderboard" }, { status: 500 })
  }
}
