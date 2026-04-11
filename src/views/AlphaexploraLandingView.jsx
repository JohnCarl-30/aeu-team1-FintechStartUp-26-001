import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { AlphaexploraLandingViewModel, useViewModel } from '../viewModels'
import { FeatureCard } from '../components/FeatureCard'
import { PricingCard } from '../components/PricingCard'
import { useAnimatedNumber } from '../hooks/useAnimatedNumber'

export function AlphaexploraLandingView() {
  const { vm, state } = useViewModel(AlphaexploraLandingViewModel)
  const unlockedRef = useRef(null)
  const waitlistRef = useRef(null)
  const navigationItems = [
    { href: '#features', label: 'Features' },
    { href: '#pricing', label: 'Pricing' },
    { href: '#testimonials', label: 'Testimonials' },
    { href: '#waitlist', label: 'Beta' },
  ]
  const heroPillars = [
    {
      title: 'One operating layer',
      description: 'Unify approvals, reporting, and execution without stitching tools together.',
    },
    {
      title: 'Built for serious teams',
      description: 'Give RevOps, delivery, finance, and leadership one shared source of truth.',
    },
    {
      title: 'Move with confidence',
      description: 'Launch with AI automation, enterprise controls, and live visibility from day one.',
    },
  ]
  const operatingSignals = [
    {
      title: 'Revenue, operations, and delivery stay aligned',
      description: 'Workflows, escalations, and leadership updates sync in real time.',
      status: 'Live',
    },
    {
      title: 'Automations resolve routine work before it spreads',
      description: 'Route approvals, summarize activity, and surface blockers without manual follow-up.',
      status: 'Active',
    },
    {
      title: 'Leaders get one dashboard for the whole business',
      description: 'Forecasting, execution health, and service signals stay visible in a single view.',
      status: 'Ready',
    },
  ]

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
    vm.loadSubscriptionState()
  }, [vm])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('opacity-100', 'translate-y-0')
            entry.target.classList.remove('opacity-0', 'translate-y-[30px]')
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
    <div className="bg-brand-bg text-brand-text min-h-screen">
      <nav className="fixed top-0 left-0 right-0 z-50 h-16 border-b border-brand-border bg-[rgba(15,23,42,0.72)] px-8 backdrop-blur-xl animate-fade-in opacity-0 [animation-fill-mode:forwards] max-md:px-4">
        <div className="mx-auto flex h-full max-w-[1280px] items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <Link to="/" className="font-head tracking-[-0.02em] text-[1.4rem] font-extrabold shrink-0">
              Alphaexplora<span className="text-brand-accent">.</span>
            </Link>
            {state.subscriptionStatus.hasActiveSubscription && (
              <div className="rounded-full bg-brand-accent-dim2 border border-brand-accent/30 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-brand-accent animate-in fade-in zoom-in duration-500">
                Premium
              </div>
            )}
          </div>
          <ul className="flex gap-8 list-none max-md:hidden">
          {navigationItems.map((item) => (
            <li key={item.href}>
              <a href={item.href} className="text-brand-text2 text-sm tracking-[0.01em] transition-colors hover:text-brand-text">
                {item.label}
              </a>
            </li>
          ))}
        </ul>
        <a href="#waitlist" className="rounded-brand-sm bg-brand-accent px-5 py-2.5 font-body text-sm font-semibold text-[#052e16] transition-all duration-200 hover:-translate-y-[1px] hover:opacity-90">
          Join Beta
        </a>
        </div>
      </nav>

      <header className="relative overflow-hidden px-8 pt-16 max-md:px-4">
        <div className="pointer-events-none absolute inset-0 bg-[length:64px_64px] [mask-image:radial-gradient(ellipse_80%_60%_at_50%_45%,black_28%,transparent_100%)]" style={{ backgroundImage: 'linear-gradient(var(--color-brand-border) 1px, transparent 1px), linear-gradient(90deg, var(--color-brand-border) 1px, transparent 1px)' }}></div>
        <div className="pointer-events-none absolute right-[8%] top-[12%] h-[420px] w-[420px] rounded-full bg-[radial-gradient(circle,rgba(110,231,183,0.22)_0%,transparent_68%)] blur-2xl"></div>
        <div className="pointer-events-none absolute left-[8%] top-[18%] h-[280px] w-[280px] rounded-full bg-[radial-gradient(circle,rgba(59,130,246,0.14)_0%,transparent_72%)] blur-3xl"></div>

        <div className="relative mx-auto flex min-h-[calc(100vh-4rem)] max-w-[1280px] flex-col items-center justify-center text-center py-14">
          <div className="max-w-[800px] flex flex-col items-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[rgba(110,231,183,0.28)] bg-brand-accent-dim2 px-3.5 py-1.5 text-xs font-medium uppercase tracking-[0.08em] text-brand-accent animate-fade-up opacity-0 [animation-fill-mode:forwards]">
              <div className="h-1.5 w-1.5 rounded-full bg-brand-accent animate-[pulse_2.6s_infinite]"></div>
              Private beta for B2B operators
            </div>

            <p className="mb-5 text-sm tracking-[0.12em] text-brand-text3 uppercase animate-fade-in opacity-0 [animation-fill-mode:forwards] [animation-delay:80ms]">
              For revenue, operations, and leadership teams
            </p>

            <h1 className="mb-6 max-w-[15ch] font-head text-[clamp(2.8rem,6vw,5.2rem)] font-extrabold leading-[1.0] tracking-[-0.05em] animate-fade-up opacity-0 [animation-fill-mode:forwards] [animation-delay:140ms]">
              One command layer for your B2B operation.
            </h1>

            <p className="mb-10 max-w-[580px] text-[clamp(1rem,1.5vw,1.15rem)] leading-[1.7] text-brand-text2 animate-fade-in opacity-0 [animation-fill-mode:forwards] [animation-delay:220ms]">
              Unify your workflows, reporting, and execution in one shared source of truth.
            </p>

            <div className="mb-10 flex flex-wrap justify-center gap-4 animate-fade-up opacity-0 [animation-fill-mode:forwards] [animation-delay:300ms] max-sm:flex-col">
              <a href="#waitlist" className="rounded-brand-sm bg-brand-accent px-7 py-3.5 text-[15px] font-semibold text-[#052e16] transition-all duration-200 hover:-translate-y-[1px] hover:opacity-90 max-sm:w-full max-sm:text-center">
                Join Beta
              </a>
              <a href="#features" className="rounded-brand-sm border border-brand-border2 bg-transparent px-7 py-3.5 text-[15px] font-semibold text-brand-text transition-all duration-200 hover:-translate-y-[2px] hover:bg-brand-bg4 max-sm:w-full max-sm:text-center">
                See features
              </a>
            </div>

            <div className="grid gap-8 sm:grid-cols-3 animate-fade-in opacity-0 [animation-fill-mode:forwards] [animation-delay:380ms] text-left">
              {heroPillars.map((pillar) => (
                <article key={pillar.title} className="border-l border-brand-border pl-4">
                  <h2 className="mb-1.5 font-head text-[1rem] font-semibold tracking-[-0.02em] text-brand-text">
                    {pillar.title}
                  </h2>
                  <p className="text-sm leading-[1.65] text-brand-text2">
                    {pillar.description}
                  </p>
                </article>
              ))}
            </div>

            <div className="mt-10 border-t border-brand-border pt-8 animate-fade-in opacity-0 [animation-fill-mode:forwards] [animation-delay:460ms]">
              <p className="mb-5 text-xs uppercase tracking-[0.12em] text-brand-text3">
                Teams evaluating Alphaexplora today
              </p>
              <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
                {state.logos.map((logo) => (
                  <div key={logo} className="font-head text-[1.05rem] font-bold text-brand-text3 opacity-60 transition-opacity duration-200 hover:opacity-90">
                    {logo}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="border-y border-brand-border bg-[rgba(15,23,42,0.72)] px-8 py-10 backdrop-blur-md">
        <div className="mx-auto grid max-w-[1280px] grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-12 text-center reveal opacity-0 translate-y-[30px] transition-all duration-600 ease-out">
          {state.stats.map((stat) => (
            <div key={stat.label}>
              <div className="font-head text-[2.8rem] font-extrabold tracking-[-0.03em] text-brand-text mb-1">{stat.value}</div>
              <div className="text-sm text-brand-text2">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      <section id="features" className="py-24 px-8 max-w-[1200px] mx-auto border-t border-brand-border">
        <div className="mb-16 reveal opacity-0 translate-y-[30px] transition-all duration-600 ease-out">
          <div className="text-brand-accent text-xs tracking-[0.08em] uppercase font-medium mb-4">Platform capabilities</div>
          <h2 className="font-head text-[clamp(1.8rem,4vw,3rem)] font-bold tracking-[-0.02em] leading-[1.15] mb-5">
            Built for operators who need
            <br />
            clarity, speed, and control.
          </h2>
          <p className="text-[1.05rem] text-brand-text2 max-w-[520px] leading-[1.7]">
            Designed for the rhythm of B2B teams: clarity, control, and constant execution pressure.
          </p>
        </div>

        <div className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-[1px] bg-brand-border border border-brand-border rounded-brand overflow-hidden reveal opacity-0 translate-y-[30px] transition-all duration-600 ease-out">
          {state.features.map((feature) => (
            <FeatureCard key={feature.title} feature={feature} />
          ))}
        </div>

        <div
          ref={unlockedRef}
          id="unlocked-section"
          className={`border-t border-brand-border mt-12 pt-12 ${vm.isUnlockedVisible ? 'block' : 'hidden'}`}
        >
          <div className="inline-flex items-center gap-1.5 bg-brand-accent/10 border border-brand-accent/20 text-brand-accent text-[11px] font-semibold tracking-[0.08em] uppercase py-1 px-3 rounded-full mb-8">
            <div className="h-1.5 w-1.5 rounded-full bg-brand-accent animate-pulse"></div>
            Premium tier active
          </div>
          <h3 className="font-head text-[1.6rem] font-bold tracking-[-0.02em] mb-5">
            Unlocked: Advanced Capabilities
          </h3>
          <p className="text-[1.05rem] text-brand-text2 max-w-[520px] leading-[1.7]">
            Advanced capabilities now active for your organization.
          </p>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(260px,1fr))] gap-4 mt-8">
            {state.unlockedFeatures.map((feature) => (
              <article key={feature.title} className="bg-[linear-gradient(135deg,rgba(253,224,71,0.04),rgba(110,231,183,0.04))] border border-[rgba(253,224,71,0.12)] rounded-brand p-7 relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-[linear-gradient(90deg,var(--color-brand-amber),var(--color-brand-accent))]"></div>
                <h4 className="font-head tracking-[-0.01em] text-base font-semibold mb-2">{feature.title}</h4>
                <p className="text-[13px] text-brand-text2">{feature.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="pricing" className="py-24 px-8 max-w-[1200px] mx-auto border-t border-brand-border">
        <div className="mb-12 reveal opacity-0 translate-y-[30px] transition-all duration-600 ease-out">
          <div className="text-brand-accent text-xs tracking-[0.08em] uppercase font-medium mb-4">Pricing</div>
          <h2 className="font-head text-[clamp(1.8rem,4vw,3rem)] font-bold tracking-[-0.02em] leading-[1.15] mb-5">Simple, transparent pricing.</h2>
          <p className="text-[1.05rem] text-brand-text2 max-w-[520px] leading-[1.7]">
            Scale as you grow. No surprise fees, no seat minimums on Starter.
          </p>
        </div>



        <div className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-6 items-start reveal opacity-0 translate-y-[30px] transition-all duration-600 ease-out max-md:p-4">
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
                isDisabled={state.isSubscriptionLoading || state.isSubscriptionSaving}
                onSelect={(planName) => vm.selectPlan(planName)}
              />
            )
          })}
        </div>
      </section>

      <section id="testimonials" className="py-24 px-8 max-w-[1200px] mx-auto border-t border-brand-border">
        <div className="mb-16 reveal opacity-0 translate-y-[30px] transition-all duration-600 ease-out">
          <div className="text-brand-accent text-xs tracking-[0.08em] uppercase font-medium mb-4">Testimonials</div>
          <h2 className="font-head text-[clamp(1.8rem,4vw,3rem)] font-bold tracking-[-0.02em] leading-[1.15] mb-5">
            Trusted by operators who demand results.
          </h2>
        </div>

        <div
          className="relative overflow-hidden reveal opacity-0 translate-y-[30px] transition-all duration-600 ease-out"
        >
          <div
            className="flex transition-transform duration-500 ease-[cubic-bezier(0.25,0.46,0.45,0.94)]"
            style={{ transform: `translateX(-${state.currentSlide * 100}%)` }}
          >
            {state.testimonials.map((testimonial) => (
              <div key={testimonial.name} className="min-w-full p-2">
                <article className="bg-brand-bg2 border border-brand-border rounded-brand p-12 relative max-md:p-8">
                  <div className="absolute top-8 right-8 text-brand-amber text-sm tracking-[2px] max-md:static max-md:mb-4">&#9733;&#9733;&#9733;&#9733;&#9733;</div>
                  <div className="font-head text-[5rem] text-brand-accent leading-[0.5] mb-8 opacity-40">&quot;</div>
                  <p className="font-head text-[1.2rem] leading-[1.7] text-brand-text mb-8 italic font-light">{testimonial.quote}</p>
                  <div className="flex items-center gap-4 text-brand-text2">
                    <div className="w-12 h-12 rounded-full bg-brand-accent-dim2 border-2 border-brand-accent font-head text-sm font-bold text-brand-accent shrink-0 flex items-center justify-center">{testimonial.initials}</div>
                    <div>
                      <div className="font-head tracking-[-0.01em] font-semibold text-[15px] mb-0.5 text-brand-text">{testimonial.name}</div>
                      <div className="text-[13px]">{testimonial.role}</div>
                    </div>
                  </div>
                </article>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-4 mt-8 justify-center">
          <button
            className="w-10 h-10 rounded-full bg-brand-bg3 border border-brand-border2 text-brand-text text-base flex items-center justify-center transition-all duration-200 cursor-pointer hover:bg-brand-bg4 hover:border-brand-accent hover:text-brand-accent"
            type="button"
            aria-label="Previous testimonial"
            onClick={() => vm.shiftSlide(-1)}
          >
            &larr;
          </button>
          <div className="flex gap-2">
            {state.testimonials.map((testimonial, index) => (
              <button
                key={testimonial.name}
                className={`w-[6px] h-[6px] rounded-full cursor-pointer border-0 transition-all duration-200 ${state.currentSlide === index ? 'bg-brand-accent w-5 rounded-[3px]' : 'bg-brand-border2'}`}
                type="button"
                aria-label={`Go to testimonial ${index + 1}`}
                onClick={() => vm.goToSlide(index)}
              ></button>
            ))}
          </div>
          <button
            className="w-10 h-10 rounded-full bg-brand-bg3 border border-brand-border2 text-brand-text text-base flex items-center justify-center transition-all duration-200 cursor-pointer hover:bg-brand-bg4 hover:border-brand-accent hover:text-brand-accent"
            type="button"
            aria-label="Next testimonial"
            onClick={() => vm.shiftSlide(1)}
          >
            &rarr;
          </button>
        </div>
      </section>

      <section id="waitlist" ref={waitlistRef} className="py-24 px-8 max-w-[1200px] mx-auto border-t border-brand-border text-center">
        <div className="max-w-[560px] mx-auto reveal opacity-0 translate-y-[30px] transition-all duration-600 ease-out">
          <div className="text-brand-accent text-xs tracking-[0.08em] uppercase font-medium mb-4">Private beta access</div>
          <h2 className="font-head text-[clamp(1.8rem,4vw,3rem)] font-bold tracking-[-0.02em] leading-[1.15] mb-5">Join the beta before public launch.</h2>
          <p className="text-[1.05rem] text-brand-text2 max-w-[520px] leading-[1.7] mx-auto">
            Get founding pricing and dedicated onboarding.
          </p>

          <div className="mt-12">
            {state.successEmail ? (
              <div className="flex flex-col items-center gap-4 p-8 border border-[rgba(110,231,183,0.3)] bg-brand-accent-dim2 mt-6 rounded-brand" aria-live="polite">
                <div className="w-14 h-14 bg-brand-accent rounded-full text-2xl text-[#052e16] flex items-center justify-center">&#10003;</div>
                <h3 className="font-head text-[1.3rem] font-bold text-brand-accent">You are on the list!</h3>
                <p className="text-sm text-brand-text2">
                  We will be in touch at <strong className="text-brand-text">{state.successEmail}</strong> very soon.
                </p>
              </div>
            ) : (
              <form className="flex flex-col items-stretch" onSubmit={handleSubmit}>
                <div
                  className={`flex overflow-hidden bg-brand-bg2 border rounded-brand transition-colors duration-200 focus-within:border-brand-accent max-sm:flex-col ${state.formMessage.type === 'error' ? 'border-brand-red' : 'border-brand-border'}`}
                >
                  <input
                    type="email"
                    className="flex-1 p-[14px_16px] bg-transparent border-0 outline-0 text-brand-text font-body text-[15px] placeholder:text-brand-text3"
                    value={state.email}
                    placeholder="you@company.com"
                    autoComplete="email"
                    onChange={(event) => {
                      vm.setEmail(event.target.value)
                      vm.clearFormMessage()
                    }}
                  />
                  <button className="bg-brand-accent text-[#052e16] font-body text-[15px] font-semibold px-7 py-3 transition-opacity duration-200 cursor-pointer border-0 whitespace-nowrap hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed max-sm:w-full max-sm:py-3.5" type="submit" disabled={state.isSubmitting}>
                    {state.isSubmitting ? 'Joining...' : 'Join Beta'}
                  </button>
                </div>
                <div
                  className={`mt-3 text-sm min-h-[20px] transition-all duration-300 text-brand-text2 ${state.formMessage.type === 'error' ? 'text-brand-red' : ''} ${state.formMessage.type === 'success' ? 'text-brand-accent' : ''}`}
                  aria-live="polite"
                >
                  {state.formMessage.text}
                </div>
              </form>
            )}

            <p className="text-xs text-brand-text2 mt-4">
              No spam. Unsubscribe anytime. We never share your email.
            </p>
          </div>
        </div>
      </section>

      <footer className="py-12 px-8 max-w-[1200px] mx-auto border-t border-brand-border flex justify-between items-center flex-wrap gap-4 max-sm:flex-col max-sm:text-center">
        <Link to="/" className="font-head text-[1.2rem] font-extrabold tracking-[-0.02em]">
          Alphaexplora<span className="text-brand-accent">.</span>
        </Link>
        <p className="text-[13px] text-brand-text3">
          © {new Date().getFullYear()} Alphaexplora.
        </p>
        <ul className="flex gap-8 list-none max-sm:flex-col max-sm:gap-4">
          {navigationItems.map((item) => (
            <li key={item.href}>
              <a href={item.href} className="text-[13px] text-brand-text3 transition-colors hover:text-brand-text">
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </footer>
    </div>
  )
}
