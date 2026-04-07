import { useEffect, useRef, useState } from 'react'
import './App.css'
import { AlphaexploraLandingViewModel, useViewModel } from './viewModels'

function useAnimatedNumber(target) {
  const [value, setValue] = useState(target)
  const previousValueRef = useRef(target)

  useEffect(() => {
    const start = previousValueRef.current
    const end = target

    if (start === end) {
      previousValueRef.current = end
      return
    }

    let frameId = 0
    let startTime = null
    const duration = 240

    const animate = (timestamp) => {
      if (startTime === null) {
        startTime = timestamp
      }

      const progress = Math.min((timestamp - startTime) / duration, 1)
      const eased = 1 - (1 - progress) ** 3
      const nextValue = Math.round(start + (end - start) * eased)

      setValue(nextValue)

      if (progress < 1) {
        frameId = window.requestAnimationFrame(animate)
      } else {
        previousValueRef.current = end
        setValue(end)
      }
    }

    frameId = window.requestAnimationFrame(animate)

    return () => window.cancelAnimationFrame(frameId)
  }, [target])

  return value
}

function FeatureCard({ feature }) {
  return (
    <article className="feature-card">
      <div className="feature-icon" aria-hidden="true">
        {feature.icon}
      </div>
      <h3>{feature.title}</h3>
      <p>{feature.description}</p>
    </article>
  )
}

function PricingCard({ plan, pricingMode, displayedPrice, isSelected, onSelect }) {
  return (
    <article
      className={`pricing-card${plan.featured ? ' featured' : ''}${isSelected ? ' selected' : ''}`}
    >
      {plan.featured ? <div className="popular-tag">Most popular</div> : null}
      <div className="plan-name">{plan.name}</div>
      <div className="plan-desc">{plan.description}</div>
      <div className="plan-price">
        {plan.custom ? null : <span className="price-currency">$</span>}
        <span className={`price-amount${plan.custom ? ' custom-price' : ''}`}>
          {plan.custom ? 'Custom' : displayedPrice}
        </span>
        {plan.custom ? null : (
          <span className="price-period">
            /{plan.name === 'Business' ? 'mo per seat' : 'mo'}
          </span>
        )}
      </div>
      <div className="price-annual">{plan.getAnnualNote(pricingMode)}</div>
      <hr className="plan-divider" />
      <ul className="feature-list">
        {plan.features.map((item) => (
          <li key={item}>
            <div className="check" aria-hidden="true">
              &#10003;
            </div>
            {item}
          </li>
        ))}
      </ul>
      <button
        className={`plan-btn${plan.featured ? ' featured-btn' : ''}`}
        type="button"
        onClick={() => onSelect(plan.name)}
      >
        {plan.buttonLabel}
      </button>
    </article>
  )
}

function App() {
  const { vm, state } = useViewModel(AlphaexploraLandingViewModel)
  const unlockedRef = useRef(null)
  const waitlistRef = useRef(null)

  const starterPlan = vm.getPlanByName('Starter')
  const businessPlan = vm.getPlanByName('Business')
  const displayedStarterPrice = useAnimatedNumber(
    starterPlan?.getPrice(state.pricingMode) ?? 0,
  )
  const displayedBusinessPrice = useAnimatedNumber(
    businessPlan?.getPrice(state.pricingMode) ?? 0,
  )

  useEffect(() => {
    document.title = state.pageTitle
  }, [state.pageTitle])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible')
          }
        })
      },
      { threshold: 0.12 },
    )

    const elements = document.querySelectorAll('.reveal')
    elements.forEach((element) => observer.observe(element))

    return () => observer.disconnect()
  }, [state.selectedPlan])

  useEffect(() => {
    vm.startAutoSlide()

    return () => {
      vm.stopAutoSlide()
    }
  }, [vm])

  useEffect(() => {
    if (!state.scrollTarget) {
      return undefined
    }

    const timeoutId = window.setTimeout(() => {
      const targetRef =
        state.scrollTarget.section === 'unlocked' ? unlockedRef : waitlistRef

      targetRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      vm.clearScrollTarget()
    }, 120)

    return () => window.clearTimeout(timeoutId)
  }, [state.scrollTarget, vm])

  async function handleSubmit(event) {
    event.preventDefault()
    await vm.submitWaitlist()
  }

  return (
    <div className="alphaexplora-page">
      <nav>
        <div className="nav-logo">
          Alphaexplora<span>.</span>
        </div>
        <ul className="nav-links">
          <li>
            <a href="#features">Features</a>
          </li>
          <li>
            <a href="#pricing">Pricing</a>
          </li>
          <li>
            <a href="#testimonials">Testimonials</a>
          </li>
          <li>
            <a href="#waitlist">Waitlist</a>
          </li>
        </ul>
        <a href="#waitlist" className="nav-cta">
          Join Beta
        </a>
      </nav>

      <header className="hero">
        <div className="hero-grid"></div>
        <div className="hero-glow"></div>

        <div className="hero-badge fade-up">
          <div className="badge-dot"></div>
          Now in limited beta - 500 spots remaining
        </div>

        <h1 className="fade-up">
          The operating system for
          <br />
          <span className="accent">modern enterprises.</span>
        </h1>
        <p className="hero-sub fade-up">
          Alphaexplora unifies your workflows, data, and teams in a single intelligent
          platform. Built for organizations that cannot afford to slow down.
        </p>

        <div className="hero-actions fade-up">
          <a href="#waitlist" className="btn-primary">
            Get early access
          </a>
          <a href="#features" className="btn-ghost">
            Explore features
          </a>
        </div>

        <div className="social-strip fade-up">
          <p>Trusted by forward-thinking companies</p>
          <div className="logos">
            {state.logos.map((logo) => (
              <div key={logo} className="logo-item">
                {logo}
              </div>
            ))}
          </div>
        </div>
      </header>

      <div className="stat-strip">
        <div className="stat-inner">
          {state.stats.map((stat) => (
            <div key={stat.label}>
              <div className="stat-number">{stat.value}</div>
              <div className="stat-label">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      <section id="features">
        <div className="features-header reveal">
          <div className="section-label">Core platform</div>
          <h2 className="section-title">
            Everything your enterprise needs,
            <br />
            nothing it does not.
          </h2>
          <p className="section-sub">
            Alphaexplora was built from the ground up for the way complex organizations
            actually work - asynchronously, globally, and at scale.
          </p>
        </div>

        <div className="features-grid reveal">
          {state.features.map((feature) => (
            <FeatureCard key={feature.title} feature={feature} />
          ))}
        </div>

        <div
          ref={unlockedRef}
          id="unlocked-section"
          className={vm.isUnlockedVisible ? 'visible' : ''}
        >
          <div className="unlocked-badge">Business plan - exclusive features</div>
          <h3 className="section-title unlocked-title">
            Unlocked: Advanced Capabilities
          </h3>
          <p className="section-sub">
            These features are available exclusively on Business and above.
            You are seeing them because you chose a plan built for serious
            organizations.
          </p>
          <div className="unlocked-grid">
            {state.unlockedFeatures.map((feature) => (
              <article key={feature.title} className="unlocked-card">
                <h4>{feature.title}</h4>
                <p>{feature.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="pricing">
        <div className="pricing-header reveal">
          <div className="section-label">Pricing</div>
          <h2 className="section-title">Simple, transparent pricing.</h2>
          <p className="section-sub">
            Scale as you grow. No surprise fees, no seat minimums on Starter.
          </p>
        </div>

        <div className="pricing-toggle" role="tablist" aria-label="Billing mode">
          <button
            className={`toggle-btn${state.pricingMode === 'monthly' ? ' active' : ''}`}
            type="button"
            onClick={() => vm.setPricingMode('monthly')}
          >
            Monthly
          </button>
          <button
            className={`toggle-btn${state.pricingMode === 'annual' ? ' active' : ''}`}
            type="button"
            onClick={() => vm.setPricingMode('annual')}
          >
            Annual <span className="save-badge">Save 20%</span>
          </button>
        </div>

        <div className="pricing-grid reveal">
          {state.plans.map((plan) => {
            const displayedPrice =
              plan.name === 'Starter'
                ? displayedStarterPrice
                : plan.name === 'Business'
                  ? displayedBusinessPrice
                  : null

            return (
              <PricingCard
                key={plan.name}
                plan={plan}
                pricingMode={state.pricingMode}
                displayedPrice={displayedPrice}
                isSelected={state.selectedPlan === plan.name}
                onSelect={(planName) => vm.selectPlan(planName)}
              />
            )
          })}
        </div>
      </section>

      <section id="testimonials">
        <div className="testimonials-header reveal">
          <div className="section-label">Testimonials</div>
          <h2 className="section-title">
            Trusted by operators who demand results.
          </h2>
        </div>

        <div
          className="slider-container reveal"
          onMouseEnter={() => vm.setSliderPaused(true)}
          onMouseLeave={() => vm.setSliderPaused(false)}
        >
          <div
            className="slider-track"
            style={{ transform: `translateX(-${state.currentSlide * 100}%)` }}
          >
            {state.testimonials.map((testimonial) => (
              <div key={testimonial.name} className="testimonial-card">
                <article className="testimonial-inner">
                  <div className="stars">&#9733;&#9733;&#9733;&#9733;&#9733;</div>
                  <div className="quote-mark">&quot;</div>
                  <p className="testimonial-text">{testimonial.quote}</p>
                  <div className="testimonial-author">
                    <div className="author-avatar">{testimonial.initials}</div>
                    <div>
                      <div className="author-name">{testimonial.name}</div>
                      <div className="author-role">{testimonial.role}</div>
                    </div>
                  </div>
                </article>
              </div>
            ))}
          </div>
        </div>

        <div className="slider-controls">
          <button
            className="slider-btn"
            type="button"
            aria-label="Previous testimonial"
            onClick={() => vm.shiftSlide(-1)}
          >
            &larr;
          </button>
          <div className="slider-dots">
            {state.testimonials.map((testimonial, index) => (
              <button
                key={testimonial.name}
                className={`dot${state.currentSlide === index ? ' active' : ''}`}
                type="button"
                aria-label={`Go to testimonial ${index + 1}`}
                onClick={() => vm.goToSlide(index)}
              ></button>
            ))}
          </div>
          <button
            className="slider-btn"
            type="button"
            aria-label="Next testimonial"
            onClick={() => vm.shiftSlide(1)}
          >
            &rarr;
          </button>
        </div>
      </section>

      <section id="waitlist" ref={waitlistRef}>
        <div className="waitlist-inner reveal">
          <div className="section-label">Beta access</div>
          <h2 className="section-title">Be first. Lock in founding rates.</h2>
          <p className="section-sub centered-copy">
            Beta members get 40% off their first year, a dedicated onboarding
            call, and direct access to our product team.
          </p>

          <div className="waitlist-form">
            {state.successEmail ? (
              <div className="success-state visible" aria-live="polite">
                <div className="success-icon">&#10003;</div>
                <h3>You are on the list!</h3>
                <p>
                  We will be in touch at <strong>{state.successEmail}</strong> very soon.
                </p>
              </div>
            ) : (
              <form className="form-group" onSubmit={handleSubmit}>
                <div
                  className={`email-row${state.formMessage.type === 'error' ? ' error' : ''}`}
                >
                  <input
                    type="email"
                    className="email-input"
                    value={state.email}
                    placeholder="you@company.com"
                    autoComplete="email"
                    onChange={(event) => {
                      vm.setEmail(event.target.value)
                      vm.clearFormMessage()
                    }}
                  />
                  <button className="submit-btn" type="submit" disabled={state.isSubmitting}>
                    {state.isSubmitting ? 'Joining...' : 'Join waitlist'}
                  </button>
                </div>
                <div
                  className={`form-message${state.formMessage.type ? ` ${state.formMessage.type}` : ''}`}
                  aria-live="polite"
                >
                  {state.formMessage.text}
                </div>
              </form>
            )}

            <p className="privacy-note">
              No spam. Unsubscribe anytime. We never share your email.
            </p>
          </div>
        </div>
      </section>

      <footer>
        <div className="footer-logo">
          Alphaexplora<span>.</span>
        </div>
        <p className="footer-copy">
          Copyright {new Date().getFullYear()} Alphaexplora Technologies, Inc. All rights reserved.
        </p>
        <ul className="footer-links">
          <li>
            <a href="#">Privacy</a>
          </li>
          <li>
            <a href="#">Terms</a>
          </li>
          <li>
            <a href="#">Security</a>
          </li>
          <li>
            <a href="#">Status</a>
          </li>
        </ul>
      </footer>
    </div>
  )
}

export default App
