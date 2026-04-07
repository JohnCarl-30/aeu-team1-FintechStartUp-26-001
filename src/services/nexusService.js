const landingPageContent = {
  pageTitle: 'Nexus - Enterprise Software Platform',
  stats: [
    { value: '98%', label: 'Uptime SLA guaranteed' },
    { value: '3.2x', label: 'Average productivity gain' },
    { value: '14k', label: 'Teams on the platform' },
    { value: '<80 ms', label: 'Global p95 response time' },
  ],
  logos: ['Meridian', 'Vantara', 'Prism&Co', 'Orbis', 'Kova'],
  features: [
    {
      icon: 'RT',
      title: 'Real-time Collaboration',
      description:
        'Simultaneous editing, presence indicators, and conflict-free merging. Your whole team, always in sync.',
    },
    {
      icon: 'SC',
      title: 'Enterprise Security',
      description:
        'SOC 2 Type II controls, SSO and SAML, granular RBAC, and encryption for data at rest and in transit.',
    },
    {
      icon: 'AP',
      title: '500+ Integrations',
      description:
        'Native connectors for Salesforce, Jira, Slack, and every major SaaS tool, plus a full REST API and webhooks.',
    },
    {
      icon: 'BI',
      title: 'Advanced Analytics',
      description:
        'Live dashboards, custom metrics, anomaly detection, and exportable reporting for every stakeholder.',
    },
    {
      icon: 'AI',
      title: 'AI Automation',
      description:
        'Intelligent task routing, predictive bottleneck alerts, and smart summaries powered by foundation models.',
    },
    {
      icon: 'GL',
      title: 'Global Infrastructure',
      description:
        'Deployed across 12 regions with data residency options for GDPR, HIPAA, and industry-specific compliance.',
    },
  ],
  unlockedFeatures: [
    {
      title: 'Custom AI Agents',
      description:
        'Build, deploy, and manage autonomous agents tailored to your exact workflows with no ML team required.',
    },
    {
      title: 'Dedicated Infrastructure',
      description:
        'Isolated compute clusters, dedicated egress IPs, and a committed SLA with financial guarantees.',
    },
    {
      title: 'White-label Portal',
      description:
        'Expose a branded client portal with custom domains, themes, and feature flags for each customer segment.',
    },
    {
      title: 'Priority Support and CSM',
      description:
        '24/7 engineering escalation, a named success partner, and quarterly business reviews for every account.',
    },
  ],
  plans: [
    {
      name: 'Starter',
      description:
        'For small teams getting started. Free forever, no credit card required.',
      monthly: 0,
      annual: 0,
      annualNote: '',
      buttonLabel: 'Get started free',
      features: [
        'Up to 5 users',
        '3 active projects',
        '5 GB storage',
        'Community support',
        'Core integrations (10)',
      ],
    },
    {
      name: 'Business',
      description:
        'For growing teams that need power, security, and scalability.',
      monthly: 79,
      annual: 63,
      annualNote: {
        monthly: 'Switch to annual to save $192 per seat per year',
        annual: 'Billed as $756 per seat yearly - save $192 vs monthly',
      },
      buttonLabel: 'Start 14-day trial',
      featured: true,
      features: [
        'Unlimited users',
        'Unlimited projects',
        '500 GB storage',
        'Priority support',
        'All 500+ integrations',
        'Advanced analytics',
        'SSO and SAML',
      ],
    },
    {
      name: 'Enterprise',
      description:
        'For organizations with complex requirements and dedicated support.',
      custom: true,
      annualNote: 'Contact us for annual pricing',
      buttonLabel: 'Contact sales',
      features: [
        'Everything in Business',
        'Custom AI agents',
        'Dedicated infrastructure',
        'White-label portal',
        'Named CSM',
        '99.99% SLA',
        'Custom contracts and DPA',
      ],
    },
  ],
  testimonials: [
    {
      initials: 'SR',
      name: 'Sarah Reinholt',
      role: 'VP of Engineering, Meridian Technologies',
      quote:
        'Switching to Nexus cut our cross-team communication overhead by nearly half. What used to take three tools and a Slack thread now happens in one place, with an audit trail and zero dropped context.',
    },
    {
      initials: 'DK',
      name: 'Daniel Kim',
      role: 'COO, Vantara Systems',
      quote:
        'The AI automation alone paid for the subscription in week one. Our ops team went from manually routing 200 daily requests to handling edge cases only. It is genuinely transformative.',
    },
    {
      initials: 'AM',
      name: 'Anika Metzger',
      role: 'CISO, Orbis Financial Group',
      quote:
        'Our security team had concerns about moving to a new platform. Nexus documentation and the dedicated security review call resolved every one of them. The RBAC model feels enterprise-grade.',
    },
  ],
}

const seededEmails = [
  'test@test.com',
  'admin@nexus.com',
  'demo@example.com',
  'john@acme.org',
  'marketing@trial.io',
]

const submittedEmails = new Set(seededEmails.map((email) => email.toLowerCase().trim()))

function clone(data) {
  return JSON.parse(JSON.stringify(data))
}

function wait(ms = 900) {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms)
  })
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

  if (submittedEmails.has(normalizedEmail)) {
    throw new Error(
      'This email is already registered. Check your inbox for your invite details.',
    )
  }

  await wait()
  submittedEmails.add(normalizedEmail)

  return { email: normalizedEmail }
}
