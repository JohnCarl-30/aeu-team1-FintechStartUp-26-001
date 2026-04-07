import { BaseViewModel } from './BaseViewModel'
import {
  AlphaexploraFeature,
  AlphaexploraPlan,
  AlphaexploraStat,
  AlphaexploraTestimonial,
} from '../models'
import {
  getLandingPageContent,
  normalizeEmail,
  submitWaitlistEmail,
} from '../services/alphaexploraService'

export class AlphaexploraLandingViewModel extends BaseViewModel {
  constructor() {
    const content = getLandingPageContent()

    super({
      pageTitle: content.pageTitle,
      stats: AlphaexploraStat.fromJSONArray(content.stats),
      logos: content.logos,
      features: AlphaexploraFeature.fromJSONArray(content.features),
      unlockedFeatures: AlphaexploraFeature.fromJSONArray(content.unlockedFeatures),
      plans: AlphaexploraPlan.fromJSONArray(content.plans),
      testimonials: AlphaexploraTestimonial.fromJSONArray(content.testimonials),
      pricingMode: 'monthly',
      selectedPlan: 'Business',
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
    return (
      this.state.selectedPlan === 'Business' ||
      this.state.selectedPlan === 'Enterprise'
    )
  }

  getPlanByName(planName) {
    return this.state.plans.find((plan) => plan.name === planName) ?? null
  }

  setPricingMode(mode) {
    this.setState({ pricingMode: mode })
  }

  selectPlan(planName) {
    this.scrollRequestId += 1

    this.setState({
      selectedPlan: planName,
      scrollTarget: {
        section:
          planName === 'Business' || planName === 'Enterprise'
            ? 'unlocked'
            : 'waitlist',
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
