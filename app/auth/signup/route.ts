import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// Generate 6-digit OTP
function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

export async function POST(request: NextRequest) {
  try {
    const { username, password, firstName, lastName, email } = await request.json()

    console.log('Signup attempt for:', email)

    // 1. Check if user already exists
    const { data: existingUser } = await supabase
      .from('user')
      .select('email')
      .eq('email', email)
      .single()

    if (existingUser) {
      return NextResponse.json({ message: 'User already exists with this email' }, { status: 400 })
    }

    // 2. Check if username is taken
    const { data: existingUsername } = await supabase
      .from('user')
      .select('username')
      .eq('username', username)
      .single()

    if (existingUsername) {
      return NextResponse.json({ message: 'Username is already taken' }, { status: 400 })
    }

    // 3. Hash password
    const hashedPassword = await bcrypt.hash(password, 12)

    // 4. Generate OTP
    const otp = generateOTP()

    // 5. Create user in database
    const { data: newUser, error: createError } = await supabase
      .from('user')
      .insert({
        username,
        password: hashedPassword,
        first_name: firstName,
        last_name: lastName,
        email,
        otp,
        email_verified: false, // Change to true if you want to skip email verification for testing
        created_at: new Date().toISOString()
      })
      .select()
      .single()

    if (createError) {
      console.error('User creation error:', createError)
      return NextResponse.json({ message: 'Failed to create user' }, { status: 500 })
    }

    // 6. For testing, we'll skip sending the actual email
    // In production, you'd send the OTP via email service
    console.log('Generated OTP for', email, ':', otp)

    return NextResponse.json({
      message: 'User created successfully. Check console for OTP (in development).',
      id: newUser.id
    }, { status: 201 })

  } catch (error) {
    console.error('Signup error:', error)
    return NextResponse.json({ 
      message: 'An error occurred during signup' 
    }, { status: 500 })
  }
}