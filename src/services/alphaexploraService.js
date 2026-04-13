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
  pageTitle: 'Alphaexplora - Fintech SaaS Platform',
  stats: [
    { value: '98%', label: 'Uptime SLA guaranteed' },
    { value: '3.2x', label: 'Average workflow productivity gain' },
    { value: '14k', label: 'Teams managing operations on-platform' },
    { value: '<80 ms', label: 'Global p95 response time' },
  ],
  features: [
    {
      icon: 'AP',
      title: 'Automated approvals',
      description:
        'Route finance, compliance, and operational approvals instantly with policy-aware workflows.',
    },
    {
      icon: 'AR',
      title: 'Audit-ready records',
      description:
        'Track every decision, status change, and handoff with a clean audit trail your team can trust.',
    },
    {
      icon: 'BI',
      title: 'Business intelligence',
      description:
        'Give leadership live dashboards across revenue, service delivery, and customer health.',
    },
    {
      icon: 'AI',
      title: 'AI workflow assistant',
      description:
        'Summarize activity, flag blockers, and surface next actions without extra manual reporting.',
    },
    {
      icon: 'RB',
      title: 'Role-based controls',
      description:
        'Protect sensitive financial and operational data with granular permissions and secure access tiers.',
    },
    {
      icon: 'IN',
      title: 'Integrations that fit',
      description:
        'Connect CRM, accounting, support, and internal systems through APIs and event-based syncs.',
    },
  ],
  unlockedFeatures: [
    {
      title: 'Premium analytics workspace',
      description:
        'Monitor margin signals, workflow bottlenecks, and team performance in one executive layer.',
    },
    {
      title: 'Advanced automation rules',
      description:
        'Create premium routing logic with escalations, conditional branches, and SLA-aware triggers.',
    },
    {
      title: 'Dedicated onboarding support',
      description:
        'Launch faster with guided migration, configuration help, and premium implementation support.',
    },
    {
      title: 'Custom reporting access',
      description:
        'Unlock deeper exports, custom stakeholder views, and shareable performance snapshots.',
    },
  ],
  plans: [
    {
      name: 'Starter',
      description:
        'For small teams validating workflow fit before rolling out across the business.',
      monthly: 0,
      annual: 0,
      annualNote: 'Free tier for initial validation and internal testing',
      buttonLabel: 'Stay on Starter',
      features: [
        'Up to 5 users',
        'Core workflow automation',
        'Basic dashboards',
        'Community support',
        'Waitlist and beta access',
      ],
    },
    {
      name: 'Business',
      description:
        'For scaling teams that need stronger controls, reporting, and premium workflow depth.',
      monthly: 79,
      annual: 63,
      annualNote: {
        monthly: 'Switch to annual to save $192 per seat each year',
        annual: 'Billed yearly at $756 per seat and includes premium unlocks',
      },
      buttonLabel: 'Activate Business',
      featured: true,
      features: [
        'Unlimited users',
        'Advanced approvals',
        'Premium analytics workspace',
        'Priority support',
        'Audit-ready activity logs',
        'AI workflow assistant',
        'SSO and RBAC',
      ],
    },
    {
      name: 'Enterprise',
      description:
        'For organizations with custom governance, onboarding, and implementation requirements.',
      custom: true,
      annualNote: 'Contact sales for enterprise billing and rollout support',
      buttonLabel: 'Talk to sales',
      features: [
        'Everything in Business',
        'Custom automation rules',
        'Dedicated infrastructure options',
        'Security review support',
        'Custom data residency',
        'Named onboarding partner',
      ],
    },
  ],
  testimonials: [
    {
      initials: 'MK',
      name: 'Mara Kent',
      role: 'Head of Operations, Northstar Capital',
      quote:
        'Alphaexplora gave our finance and client-ops teams one operating layer. Approvals, exceptions, and status updates finally happen in the same system.',
    },
    {
      initials: 'JL',
      name: 'Jonas Lee',
      role: 'Chief of Staff, Paygrid Systems',
      quote:
        'The pricing logic made it easy to test free versus premium access with stakeholders, and the premium workspace is where the real value clicked for our team.',
    },
    {
      initials: 'RP',
      name: 'Rina Patel',
      role: 'VP Customer Success, Alloy Ledger',
      quote:
        'The waitlist experience was clean, and the product itself feels trustworthy. We could show leadership the premium unlocks immediately after changing the active plan.',
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
    return await apiRequest('/subscription')
  } catch (error) {
    if (isNetworkError(error)) {
      return readStoredSubscription()
    }

    throw error
  }
}

export async function updateSubscriptionState(subscriptionInput = {}) {
  const nextSnapshot = createSubscriptionSnapshot(subscriptionInput)

  try {
    const response = await apiRequest('/subscription', {
      method: 'POST',
      body: JSON.stringify(nextSnapshot),
    })

    writeStoredSubscription(response)
    return response
  } catch (error) {
    if (isNetworkError(error)) {
      writeStoredSubscription(nextSnapshot)
      return nextSnapshot
    }

    throw error
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
    return await apiRequest('/waitlist', {
      method: 'POST',
      body: JSON.stringify({ email: normalizedEmail }),
    })
  } catch (error) {
    if (!isNetworkError(error)) {
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
