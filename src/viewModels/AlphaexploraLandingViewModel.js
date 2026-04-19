import { BaseViewModel } from './BaseViewModel'
import {
  AlphaexploraFeature,
  AlphaexploraPlan,
  AlphaexploraStat,
  AlphaexploraTestimonial,
} from '../models'
import {
  createSubscriptionSnapshot,
  fetchSubscriptionState,
  getLandingPageContent,
  normalizeEmail,
  submitWaitlistEmail,
  updateSubscriptionState,
} from '../services/alphaexploraService'

export class AlphaexploraLandingViewModel extends BaseViewModel {
  constructor() {
    const content = getLandingPageContent()
    const initialSubscription = createSubscriptionSnapshot({
      planName: 'Starter',
      billingCycle: 'monthly',
    })

    super({
      pageTitle: content.pageTitle,
      stats: AlphaexploraStat.fromJSONArray(content.stats),
      logos: content.logos,
      features: AlphaexploraFeature.fromJSONArray(content.features),
      unlockedFeatures: AlphaexploraFeature.fromJSONArray(content.unlockedFeatures),
      premiumServices: content.premiumServices || [],
      plans: AlphaexploraPlan.fromJSONArray(content.plans),
      testimonials: AlphaexploraTestimonial.fromJSONArray(content.testimonials),
      pricingMode: initialSubscription.billingCycle,
      selectedPlan: initialSubscription.planName,
      subscriptionStatus: initialSubscription,
      isSubscriptionLoading: false,
      isSubscriptionSaving: false,
      subscriptionError: '',
      currentSlide: 0,
      isSliderPaused: false,
      email: '',
      formMessage: { type: '', text: '' },
      isSubmitting: false,
      successEmail: '',
      scrollTarget: null,
    })

    this.autoSlideInterval = null
    this.scrollRequestId = 0
  }

  get isUnlockedVisible() {
    return this.state.subscriptionStatus.hasActiveSubscription
  }

  get isConciergeAvailable() {
    return this.state.subscriptionStatus.accessTier === 'premium'
  }

  getPlanByName(planName) {
    return this.state.plans.find((plan) => plan.name === planName) ?? null
  }

  async loadSubscriptionState() {
    this.setState({
      isSubscriptionLoading: true,
      subscriptionError: '',
    })

    try {
      const subscriptionStatus = await fetchSubscriptionState()

      this.setState({
        pricingMode: subscriptionStatus.billingCycle,
        selectedPlan: subscriptionStatus.planName,
        subscriptionStatus,
        isSubscriptionLoading: false,
      })
    } catch (error) {
      this.setState({
        isSubscriptionLoading: false,
        subscriptionError:
          error instanceof Error
            ? error.message
            : 'Unable to load subscription state.',
      })
    }
  }

  async syncSubscription(nextValues = {}, { shouldScroll = false } = {}) {
    const nextPlanName = nextValues.planName ?? this.state.selectedPlan
    const nextBillingCycle = nextValues.billingCycle ?? this.state.pricingMode
    const nextSubscriptionStatus = createSubscriptionSnapshot({
      planName: nextPlanName,
      billingCycle: nextBillingCycle,
    })
    const previousState = {
      pricingMode: this.state.pricingMode,
      selectedPlan: this.state.selectedPlan,
      subscriptionStatus: this.state.subscriptionStatus,
      subscriptionError: this.state.subscriptionError,
      scrollTarget: this.state.scrollTarget,
    }

    if (shouldScroll) {
      this.scrollRequestId += 1
    }

    this.setState({
      pricingMode: nextSubscriptionStatus.billingCycle,
      selectedPlan: nextSubscriptionStatus.planName,
      subscriptionStatus: nextSubscriptionStatus,
      isSubscriptionSaving: true,
      subscriptionError: '',
      scrollTarget: shouldScroll
        ? {
            section: nextSubscriptionStatus.hasActiveSubscription ? 'premium' : 'waitlist',
            id: this.scrollRequestId,
          }
        : this.state.scrollTarget,
    })

    try {
      const subscriptionStatus = await updateSubscriptionState(nextSubscriptionStatus)

      this.setState({
        pricingMode: subscriptionStatus.billingCycle,
        selectedPlan: subscriptionStatus.planName,
        subscriptionStatus,
        isSubscriptionSaving: false,
      })

      return true
    } catch (error) {
      this.setState({
        ...previousState,
        isSubscriptionSaving: false,
        subscriptionError:
          error instanceof Error
            ? error.message
            : 'Unable to update subscription state.',
      })

      return false
    }
  }

  setPricingMode(mode) {
    return this.syncSubscription({ billingCycle: mode })
  }

  selectPlan(planName) {
    return this.syncSubscription({ planName }, { shouldScroll: true })
  }

  scrollToWaitlist() {
    this.scrollRequestId += 1
    this.setState({
      scrollTarget: {
        section: 'waitlist',
        id: this.scrollRequestId,
      },
    })
  }

  clearScrollTarget() {
    if (!this.state.scrollTarget) {
      return
    }

    this.setState({ scrollTarget: null })
  }

  goToSlide(index) {
    const totalSlides = this.state.testimonials.length

    if (!totalSlides) {
      return
    }

    const nextIndex = ((index % totalSlides) + totalSlides) % totalSlides
    this.setState({ currentSlide: nextIndex })
  }

  shiftSlide(direction) {
    this.goToSlide(this.state.currentSlide + direction)
  }

  setSliderPaused(isPaused) {
    this.setState({ isSliderPaused: isPaused })
  }

  startAutoSlide() {
    if (this.autoSlideInterval || this.state.testimonials.length === 0) {
      return
    }

    this.autoSlideInterval = window.setInterval(() => {
      if (this.state.isSliderPaused) {
        return
      }

      this.shiftSlide(1)
    }, 5000)
  }

  stopAutoSlide() {
    if (!this.autoSlideInterval) {
      return
    }

    window.clearInterval(this.autoSlideInterval)
    this.autoSlideInterval = null
  }

  setEmail(email) {
    this.setState({ email })
  }

  clearFormMessage() {
    if (!this.state.formMessage.type) {
      return
    }

    this.setState({
      formMessage: { type: '', text: '' },
    })
  }

  async submitWaitlist() {
    const normalizedEmail = normalizeEmail(this.state.email)

    if (!normalizedEmail) {
      this.setState({
        formMessage: { type: 'error', text: 'Please enter your email address.' },
      })
      return false
    }

    this.setState({
      email: normalizedEmail,
      isSubmitting: true,
      formMessage: { type: '', text: '' },
    })

    try {
      const result = await submitWaitlistEmail(normalizedEmail)

      this.setState({
        email: '',
        isSubmitting: false,
        successEmail: result.email,
        formMessage: {
          type: 'success',
          text: 'Invite reserved successfully.',
        },
      })

      return true
    } catch (error) {
      this.setState({
        isSubmitting: false,
        formMessage: {
          type: 'error',
          text:
            error instanceof Error
              ? error.message
              : 'Something went wrong while joining the waitlist.',
        },
      })

      return false
    }
  }

  dispose() {
    this.stopAutoSlide()
    super.dispose()
  }
}
