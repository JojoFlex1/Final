import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    console.log('Login attempt for:', email)

    // 1. Find user by email
    const { data: user, error: userError } = await supabase
      .from('user')
      .select('*')
      .eq('email', email)
      .single()

    if (userError || !user) {
      return NextResponse.json({ message: 'Invalid email or password' }, { status: 400 })
    }

    // 2. Check if email is verified
    if (!user.email_verified) {
      return NextResponse.json({ message: 'Please verify your email first' }, { status: 400 })
    }

    // 3. Verify password
    const isValidPassword = await bcrypt.compare(password, user.password)
    
    if (!isValidPassword) {
      return NextResponse.json({ message: 'Invalid email or password' }, { status: 400 })
    }

    // 4. Create JWT token
    const token = jwt.sign(
      { 
        userId: user.id, 
        email: user.email,
        username: user.username 
      },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    )

    console.log('Login successful for:', email)

    return NextResponse.json({
      message: 'Login successful',
      access_token: token,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        firstName: user.first_name,
        lastName: user.last_name
      }
    })

  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json({ 
      message: 'An error occurred during login' 
    }, { status: 500 })
  }
}