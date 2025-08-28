import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  const supabase = await createClient()

  try {
    const { qr_code } = await request.json()

    if (!qr_code) {
      return NextResponse.json({ error: "QR code is required" }, { status: 400 })
    }

    const { data: bin, error } = await supabase
      .from("bins")
      .select("*")
      .eq("qr_code", qr_code)
      .eq("is_active", true)
      .single()

    if (error) throw error

    return NextResponse.json(bin)
  } catch (error) {
    console.error("Error scanning bin:", error)
    return NextResponse.json({ error: "Invalid QR code" }, { status: 404 })
  }
}
