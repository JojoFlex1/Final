import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  try {
    const { data: bin, error } = await supabase.from("bins").select("*").eq("id", id).eq("is_active", true).single()

    if (error) throw error

    return NextResponse.json(bin)
  } catch (error) {
    console.error("Error fetching bin:", error)
    return NextResponse.json({ error: "Bin not found" }, { status: 404 })
  }
}
