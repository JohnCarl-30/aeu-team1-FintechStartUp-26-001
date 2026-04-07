import { supabase } from '../database/supabase'

const landingPageContent = {
  // ... (content remains the same)
}

function clone(data) {
  return JSON.parse(JSON.stringify(data))
}

export function getLandingPageContent() {
  return clone(landingPageContent)
}

export function normalizeEmail(email = '') {
  return email.trim().toLowerCase()
}

export function isValidWaitlistEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export async function submitWaitlistEmail(email) {
  const normalizedEmail = normalizeEmail(email)

  if (!normalizedEmail) {
    throw new Error('Please enter your email address.')
  }

  if (!isValidWaitlistEmail(normalizedEmail)) {
    throw new Error('Please enter a valid email address.')
  }

  try {
    // 1. Check if email already exists in Supabase
    const { data: existing, error: fetchError } = await supabase
      .from('waitlist')
      .select('email')
      .eq('email', normalizedEmail)
      .single()

    if (fetchError && fetchError.code !== 'PGRST116') {
      // PGRST116 means no rows found, which is what we want
      throw fetchError
    }

    if (existing) {
      throw new Error(
        'This email is already registered. Check your inbox for your invite details.',
      )
    }

    // 2. Insert new email
    const { error: insertError } = await supabase
      .from('waitlist')
      .insert([{ email: normalizedEmail }])

    if (insertError) {
      throw insertError
    }

    return { email: normalizedEmail }
  } catch (error) {
    console.error('Supabase Error:', error)

    // Handle unique constraint violation (just in case the check above missed it)
    if (error.code === '23505') {
      throw new Error('This email is already registered.')
    }

    throw new Error(
      error instanceof Error
        ? error.message
        : 'Something went wrong while joining the waitlist. Please try again later.',
    )
  }
}
