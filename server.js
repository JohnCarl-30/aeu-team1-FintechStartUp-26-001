import cors from 'cors';
import express from 'express';
import process from 'process';
import { pathToFileURL } from 'url';

export const app = express();
const PORT = process.env.PORT || 3001;

export const DUPLICATE_WAITLIST_MESSAGE = 'This email is already registered';
const VALID_PLAN_NAMES = new Set(['Starter', 'Business', 'Enterprise']);
const VALID_BILLING_CYCLES = new Set(['monthly', 'annual']);
const existingWaitlistEmails = new Set([
  'test@test.com',
  'finance@meridian.com',
  'ops@vantara.io',
]);

let activeSubscription = createSubscriptionState({
  planName: 'Business',
  billingCycle: 'monthly',
});

app.use(cors());
app.use(express.json());

function normalizeEmail(email = '') {
  return String(email).trim().toLowerCase();
}

function isValidWaitlistEmail(email = '') {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function normalizePlanName(planName = 'Starter') {
  return VALID_PLAN_NAMES.has(planName) ? planName : 'Starter';
}

function normalizeBillingCycle(billingCycle = 'monthly') {
  return VALID_BILLING_CYCLES.has(billingCycle) ? billingCycle : 'monthly';
}

export function createSubscriptionState({ planName, billingCycle } = {}) {
  const normalizedPlanName = normalizePlanName(planName);
  const normalizedBillingCycle = normalizeBillingCycle(billingCycle);
  const hasActiveSubscription = normalizedPlanName !== 'Starter';

  return {
    planName: normalizedPlanName,
    billingCycle: normalizedBillingCycle,
    hasActiveSubscription,
    accessTier: hasActiveSubscription ? 'premium' : 'free',
  };
}

app.get('/api/subscription', (_req, res) => {
  return res.status(200).json(activeSubscription);
});

app.post('/api/subscription', (req, res) => {
  activeSubscription = createSubscriptionState(req.body ?? {});
  return res.status(200).json(activeSubscription);
});

app.post('/api/waitlist', (req, res) => {
  const normalizedEmail = normalizeEmail(req.body?.email);

  if (!normalizedEmail) {
    return res.status(400).json({ error: 'Please enter your email address.' });
  }

  if (!isValidWaitlistEmail(normalizedEmail)) {
    return res.status(400).json({ error: 'Please enter a valid email address.' });
  }

  if (existingWaitlistEmails.has(normalizedEmail)) {
    return res.status(409).json({ error: DUPLICATE_WAITLIST_MESSAGE });
  }

  existingWaitlistEmails.add(normalizedEmail);

  return res.status(200).json({
    success: true,
    email: normalizedEmail,
  });
});

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  app.listen(PORT, () => {
    console.log(`Express server is running on http://localhost:${PORT}`);
  });
}
