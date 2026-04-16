import { supabase } from '../database/supabase'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '/api'

export const DUPLICATE_WAITLIST_MESSAGE = 'This email is already registered'
const SUBSCRIPTION_STORAGE_KEY = 'alphaexplora_subscription'
const WAITLIST_STORAGE_KEY = 'alphaexplora_waitlist'
const DEFAULT_WAITLIST_EMAILS = [
  'test@test.com',
  'finance@meridian.com',
  'ops@vantara.io',
]

const landingPageContent = {
  pageTitle: 'Alphaexplora - Institutional Fintech Command Center',
  stats: [
    { value: '99.99%', label: 'Infrastructure uptime' },
    { value: '45%', label: 'Efficiency gain in approvals' },
    { value: '2,500+', label: 'Enterprise organizations' },
    { value: '<50ms', label: 'Edge latency' },
  ],
  features: [
    {
      icon: 'TR',
      title: 'Treasury management',
      description:
        'Manage global liquidity across multiple entities and currencies with real-time positioning.',
    },
    {
      icon: 'RM',
      title: 'Risk orchestration',
      description:
        'Unified risk monitoring engine that flags anomalies and policy violations automatically.',
    },
    {
      icon: 'LD',
      title: 'Ledger-as-a-service',
      description:
        'High-performance immutable ledger for high-volume transaction processing and accounting.',
    },
    {
      icon: 'AN',
      title: 'Predictive analytics',
      description:
        'Leverage historical data to forecast cash flow, churn, and operational bottlenecks.',
    },
    {
      icon: 'CO',
      title: 'Compliance autopilot',
      description:
        'Automated KYC, AML, and regulatory reporting tailored to global jurisdictions.',
    },
    {
      icon: 'EX',
      title: 'Open API ecosystem',
      description:
        'Integrate seamlessly with your existing stack via our developer-first API and SDKs.',
    },
  ],
  unlockedFeatures: [
    {
      icon: 'GE',
      title: 'Global multi-entity support',
      description:
        'Consolidate reporting and operations across an unlimited number of international subsidiaries.',
    },
    {
      icon: 'BI',
      title: 'Direct banking integrations',
      description:
        'Connect directly to major global banks for automated reconciliation and execution.',
    },
    {
      icon: 'CW',
      title: 'Advanced custom workflows',
      description:
        'Design complex multi-stage approvals with conditional logic and external data enrichment.',
    },
    {
      icon: 'PC',
      title: 'Private cloud deployment',
      description:
        'Deploy the entire Alphaexplora stack within your own VPC for maximum data sovereignty and security.',
    },
  ],
  premiumServices: [
    {
      title: 'Dedicated Solutions Architect',
      description: 'Human-led architectural design and ongoing technical optimization for global scale.',
      icon: 'SA'
    },
    {
      title: '24/7 Priority Support Desk',
      description: 'Exclusive access to our senior engineering team with sub-10 minute response times.',
      icon: 'PS'
    },
    {
      title: 'Managed Compliance Audits',
      description: 'Proactive internal auditing and regulatory readiness reporting for multiple jurisdictions.',
      icon: 'CA'
    },
    {
      title: 'Custom Liquidity Pipelines',
      description: 'Tailored data flows and execution paths designed for your specific institutional needs.',
      icon: 'LP'
    }
  ],
  plans: [
    {
      name: 'Starter',
      description:
        'Essential fintech toolkit for early-stage teams and rapid prototyping.',
      monthly: 0,
      annual: 0,
      annualNote: 'Free for up to 5 users, forever.',
      buttonLabel: 'Get Started',
      features: [
        'Up to 5 users',
        'Standard ledger access',
        'Basic reporting',
        'Email support',
        'Public API access',
      ],
    },
    {
      name: 'Business',
      description:
        'Comprehensive command layer for scaling organizations with complex needs.',
      monthly: 99,
      annual: 79,
      annualNote: {
        monthly: 'Save $240 per year when billed annually',
        annual: 'Billed annually at $948 per year',
      },
      buttonLabel: 'Upgrade Now',
      featured: true,
      features: [
        'Everything in Starter',
        'Unlimited users',
        'Risk orchestration engine',
        'Priority support',
        'Full audit logs',
        'Predictive analytics',
        'SSO & Advanced RBAC',
      ],
    },
    {
      name: 'Enterprise',
      description:
        'Dedicated infrastructure and white-glove support for global enterprises.',
      custom: true,
      annualNote: 'Custom pricing based on volume and requirements',
      buttonLabel: 'Contact Sales',
      features: [
        'Everything in Business',
        'Custom workflow builder',
        'On-premise / Private Cloud',
        'Direct bank connectivity',
        'Compliance autopilot',
        'White-Glove Implementation',
        'Named success manager',
      ],
    },
  ],
  testimonials: [
    {
      initials: 'AM',
      name: 'Alex Mercer',
      role: 'CTO, GlobalPay Solutions',
      quote:
        'Moving our core operations to Alphaexplora reduced our reconciliation time by over 60%. The API is the most robust we have worked with.',
    },
    {
      initials: 'SC',
      name: 'Sarah Chen',
      role: 'Director of Finance, Velocity Tech',
      quote:
        'The level of control we gained over our multi-entity subsidiary approvals is unprecedented. It has become our primary operating system.',
    },
    {
      initials: 'DV',
      name: 'David Vance',
      role: 'Operations Lead, FinStream',
      quote:
        'Exceptional performance and beautiful design. Our team actually enjoys managing complex transactions now. A game changer for us.',
    },
  ],
}

const VALID_PLAN_NAMES = new Set(['Starter', 'Business', 'Enterprise'])
const VALID_BILLING_CYCLES = new Set(['monthly', 'annual'])

function clone(data) {
  return JSON.parse(JSON.stringify(data))
}

async function apiRequest(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers ?? {}),
    },
    ...options,
  })

  const payload = await response.json().catch(() => ({}))

  if (!response.ok) {
    throw new Error(payload.error ?? 'Something went wrong while contacting the server.')
  }

  return payload
}

function isNetworkError(error) {
  return (
    error instanceof TypeError ||
    /failed to fetch|networkerror|load failed/i.test(String(error?.message ?? ''))
  )
}

function readStoredWaitlistEmails() {
  let storedEmails = []

  try {
    const parsed = JSON.parse(localStorage.getItem(WAITLIST_STORAGE_KEY) ?? '[]')
    storedEmails = Array.isArray(parsed) ? parsed : []
  } catch {
    storedEmails = []
  }

  return new Set(
    [...DEFAULT_WAITLIST_EMAILS, ...storedEmails]
      .map((email) => normalizeEmail(email))
      .filter(Boolean),
  )
}

function writeStoredWaitlistEmails(emailSet) {
  localStorage.setItem(WAITLIST_STORAGE_KEY, JSON.stringify([...emailSet]))
}

function readStoredSubscription() {
  try {
    const parsed = JSON.parse(localStorage.getItem(SUBSCRIPTION_STORAGE_KEY) ?? '{}')
    return createSubscriptionSnapshot(parsed)
  } catch {
    return createSubscriptionSnapshot()
  }
}

function writeStoredSubscription(snapshot) {
  localStorage.setItem(SUBSCRIPTION_STORAGE_KEY, JSON.stringify(snapshot))
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

export function normalizePlanName(planName = 'Starter') {
  return VALID_PLAN_NAMES.has(planName) ? planName : 'Starter'
}

export function normalizeBillingCycle(billingCycle = 'monthly') {
  return VALID_BILLING_CYCLES.has(billingCycle) ? billingCycle : 'monthly'
}

export function createSubscriptionSnapshot({
  planName = 'Starter',
  billingCycle = 'monthly',
} = {}) {
  const normalizedPlanName = normalizePlanName(planName)
  const normalizedBillingCycle = normalizeBillingCycle(billingCycle)
  const hasActiveSubscription = normalizedPlanName !== 'Starter'

  return {
    planName: normalizedPlanName,
    billingCycle: normalizedBillingCycle,
    hasActiveSubscription,
    accessTier: hasActiveSubscription ? 'premium' : 'free',
  }
}

export async function fetchSubscriptionState() {
  try {
    const { data, error } = await supabase
      .from('app_state')
      .select('value')
      .eq('key', 'subscription')
      .single()

    if (error) throw error
    return data.value
  } catch (error) {
    try {
      return await apiRequest('/subscription')
    } catch (apiError) {
      return readStoredSubscription()
    }
  }
}

export async function updateSubscriptionState(subscriptionInput = {}) {
  const nextSnapshot = createSubscriptionSnapshot(subscriptionInput)

  try {
    const { error } = await supabase
      .from('app_state')
      .upsert({ key: 'subscription', value: nextSnapshot }, { onConflict: 'key' })

    if (error) throw error

    // Sync with local API if available
    apiRequest('/subscription', {
      method: 'POST',
      body: JSON.stringify(nextSnapshot),
    }).catch(() => {})

    writeStoredSubscription(nextSnapshot)
    return nextSnapshot
  } catch (error) {
    writeStoredSubscription(nextSnapshot)
    return nextSnapshot
  }
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
    const { error } = await supabase
      .from('waitlist')
      .insert({ email: normalizedEmail })

    if (error) {
      if (error.code === '23505') {
        throw new Error(DUPLICATE_WAITLIST_MESSAGE)
      }
      throw error
    }

    // Sync with local API if available
    apiRequest('/waitlist', {
      method: 'POST',
      body: JSON.stringify({ email: normalizedEmail }),
    }).catch(() => {})

    return {
      success: true,
      email: normalizedEmail,
    }
  } catch (error) {
    if (error.message === DUPLICATE_WAITLIST_MESSAGE) {
      throw error
    }

    const existingEmails = readStoredWaitlistEmails()

    if (existingEmails.has(normalizedEmail)) {
      throw new Error(DUPLICATE_WAITLIST_MESSAGE)
    }

    existingEmails.add(normalizedEmail)
    writeStoredWaitlistEmails(existingEmails)

    return {
      success: true,
      email: normalizedEmail,
    }
  }
}
