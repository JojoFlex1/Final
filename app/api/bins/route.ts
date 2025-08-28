import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET() {
  const supabase = await createClient()

  try {
    const { data: bins, error } = await supabase.from("bins").select("*").eq("is_active", true).order("name")

    if (error) throw error

    return NextResponse.json(bins)
  } catch (error) {
    console.error("Error fetching bins:", error)
    return NextResponse.json({ error: "Failed to fetch bins" }, { status: 500 })
  }
}
