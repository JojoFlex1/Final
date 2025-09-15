import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: NextRequest) {
  try {
    const { email, otp } = await request.json()

    console.log('Verifying OTP for:', email)

    // 1. Find user by email
    const { data: user, error: userError } = await supabase
      .from('user')
      .select('*')
      .eq('email', email)
      .single()

    if (userError || !user) {
      return NextResponse.json({ message: 'Email not found' }, { status: 400 })
    }

    // 2. Check OTP
    if (user.otp !== otp) {
      return NextResponse.json({ message: 'OTP is invalid' }, { status: 400 })
    }

    // 3. Update user as verified
    const { error: updateError } = await supabase
      .from('user')
      .update({ 
        email_verified: true, 
        otp: null 
      })
      .eq('email', email)

    if (updateError) {
      console.error('Update error:', updateError)
      return NextResponse.json({ message: 'Failed to verify user' }, { status: 500 })
    }

    console.log('OTP verified successfully for:', email)

    return NextResponse.json({
      result: true,
      message: 'Email verified successfully'
    })

  } catch (error) {
    console.error('OTP verification error:', error)
    return NextResponse.json({ 
      message: 'An error occurred during verification' 
    }, { status: 500 })
  }
}