import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { AlphaexploraLandingViewModel, useViewModel } from '../viewModels'
import { FeatureCard } from '../components/FeatureCard'
import { PricingCard } from '../components/PricingCard'
import { useAnimatedNumber } from '../hooks/useAnimatedNumber'

export function AlphaexploraLandingView() {
  const { vm, state } = useViewModel(AlphaexploraLandingViewModel)
  const premiumRef = useRef(null)
  const waitlistRef = useRef(null)
  const [activeSection, setActiveSection] = useState('hero')
  const shellClass = 'mx-auto w-full max-w-[1500px] px-8 max-md:px-4'
  const sectionClass = `${shellClass} snap-section border-t border-brand-border py-12`
  const navigationItems = [
    { href: '#features', label: 'Features' },
    { href: '#pricing', label: 'Pricing' },
    { href: '#testimonials', label: 'Testimonials' },
    { href: '#waitlist', label: 'Beta' },
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
    vm.startAutoSlide()

    return () => vm.stopAutoSlide()
  }, [vm])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('opacity-100', 'translate-y-0')
            entry.target.classList.remove('opacity-0', 'translate-y-[30px]')
            
            if (entry.target.id) {
              setActiveSection(entry.target.id)
            }
          }
        })
      },
      { threshold: 0.5 },
    )

    const sections = document.querySelectorAll('.snap-section')
    const revealElements = document.querySelectorAll('.reveal')
    
    sections.forEach((section) => observer.observe(section))
    revealElements.forEach((element) => observer.observe(element))

    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!state.scrollTarget) {
      return undefined
    }

    const timeoutId = window.setTimeout(() => {
      const targetRef =
        state.scrollTarget.section === 'premium' ? premiumRef : waitlistRef

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
    <div className="snap-container bg-brand-bg text-brand-text">
      {/* Side Dot Navigation */}
      <div className="fixed right-6 top-1/2 z-[60] -translate-y-1/2 flex flex-col gap-4 max-md:hidden">
        {['hero', 'features', 'pricing', 'premium', 'testimonials', 'waitlist'].map((id) => (
          <a
            key={id}
            href={`#${id === 'hero' ? '' : id}`}
            className="group relative flex items-center justify-center p-2"
            aria-label={`Jump to ${id}`}
            onClick={(e) => {
              e.preventDefault()
              document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
              setActiveSection(id)
            }}
          >
            <div className={`h-1.5 rounded-full transition-all duration-300 ${activeSection === id ? 'w-6 bg-brand-accent' : 'w-1.5 bg-brand-text/20 group-hover:bg-brand-accent group-hover:scale-125'}`}></div>
            <div className={`absolute right-8 scale-0 bg-brand-bg2 border border-brand-border px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-brand-accent transition-all duration-300 group-hover:scale-100 group-hover:opacity-100 ${activeSection === id ? 'scale-100 opacity-100' : 'opacity-0'}`}>
              {id}
            </div>
          </a>
        ))}
      </div>

      <nav id="top" className="fixed top-0 left-0 right-0 z-50 h-16 border-b border-brand-border bg-[rgba(15,23,42,0.72)] backdrop-blur-xl animate-fade-in opacity-0 [animation-fill-mode:forwards]">
        <div className={`${shellClass} flex h-full items-center justify-between gap-6`}>
          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="shrink-0 font-head text-[1.4rem] font-extrabold tracking-[-0.02em]"
            >
              Alphaexplora<span className="text-brand-accent">.</span>
            </Link>
            <div className="hidden rounded-full border border-brand-accent/20 bg-brand-accent/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.08em] text-brand-accent md:block">
              {state.subscriptionStatus.accessTier} tier
            </div>
          </div>

          <ul className="flex list-none gap-8 max-md:hidden">
            {navigationItems.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className="text-sm tracking-[0.01em] text-brand-text2 transition-colors hover:text-brand-text"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>

          <a
            href="#waitlist"
            className="rounded-brand-sm bg-brand-accent px-5 py-2.5 font-body text-sm font-semibold text-[#052e16] transition-all duration-200 hover:-translate-y-[1px] hover:opacity-90"
          >
            Get Started
          </a>
        </div>
      </nav>

      <header id="hero" className="snap-section relative overflow-hidden pt-16">
        <div
          className="pointer-events-none absolute inset-0 bg-[length:64px_64px] [mask-image:radial-gradient(ellipse_80%_60%_at_50%_45%,black_28%,transparent_100%)]"
          style={{
            backgroundImage:
              'linear-gradient(var(--color-brand-border) 1px, transparent 1px), linear-gradient(90deg, var(--color-brand-border) 1px, transparent 1px)',
          }}
        ></div>
        <div className="pointer-events-none absolute right-[8%] top-[12%] h-[420px] w-[420px] rounded-full bg-[radial-gradient(circle,rgba(110,231,183,0.2)_0%,transparent_68%)] blur-2xl"></div>
        <div className="pointer-events-none absolute left-[8%] top-[18%] h-[280px] w-[280px] rounded-full bg-[radial-gradient(circle,rgba(59,130,246,0.14)_0%,transparent_72%)] blur-3xl"></div>

        <div className={`${shellClass} relative flex min-h-[calc(100vh-4rem)] flex-col justify-center py-16`}>
          <div className="max-w-[860px]">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[rgba(110,231,183,0.28)] bg-brand-accent-dim2 px-3.5 py-1.5 text-xs font-medium uppercase tracking-[0.08em] text-brand-accent animate-fade-up opacity-0 [animation-fill-mode:forwards]">
              <div className="h-1.5 w-1.5 rounded-full bg-brand-accent animate-[pulse_2.6s_infinite]"></div>
              Fintech workflow platform
            </div>

            <h1 className="mb-6 max-w-[12ch] font-head text-[clamp(3rem,6vw,5.4rem)] font-extrabold leading-[0.98] tracking-[-0.05em] animate-fade-up opacity-0 [animation-fill-mode:forwards] [animation-delay:120ms]">
              Built to earn trust from the first scroll.
            </h1>

            <p className="max-w-[760px] text-[clamp(1rem,1.5vw,1.16rem)] leading-[1.8] text-brand-text2 animate-fade-in opacity-0 [animation-fill-mode:forwards] [animation-delay:220ms]">
              Alphaexplora provides a unified institutional command layer for treasury,
              risk orchestration, and global compliance. Our platform empowers 
              modern fintech teams to scale with confidence through real-time 
              visibility and automated multi-entity control.
            </p>

            <div className="mt-10 flex flex-wrap gap-4 animate-fade-up opacity-0 [animation-fill-mode:forwards] [animation-delay:320ms] max-sm:flex-col">
              <a
                href="#pricing"
                className="rounded-brand-sm bg-brand-accent px-7 py-3.5 text-center text-[15px] font-semibold text-[#052e16] transition-all duration-200 hover:-translate-y-[1px] hover:opacity-90"
              >
                View pricing
              </a>
              <a
                href="#waitlist"
                className="rounded-brand-sm border border-brand-border2 bg-transparent px-7 py-3.5 text-center text-[15px] font-semibold text-brand-text transition-all duration-200 hover:-translate-y-[2px] hover:bg-brand-bg4"
              >
                Join the beta
              </a>
            </div>
          </div>

          <div className="mt-14 w-full overflow-hidden border border-brand-border bg-[rgba(15,23,42,0.72)] backdrop-blur-md reveal opacity-0 translate-y-[30px] transition-all duration-600 ease-out">
            <div className="flex w-full max-md:flex-col">
              {state.stats.map((stat) => (
                <div
                  key={stat.label}
                  className="flex flex-1 basis-0 flex-col justify-center border-r border-brand-border bg-[rgba(15,23,42,0.9)] px-6 py-8 last:border-r-0 max-md:basis-auto max-md:border-r-0 max-md:border-b last:max-md:border-b-0"
                >
                  <div className="mb-2 font-head text-[clamp(2.4rem,4vw,4.4rem)] font-extrabold tracking-[-0.05em] text-brand-text">
                    {stat.value}
                  </div>
                  <div className="max-w-[18ch] text-sm leading-[1.6] text-brand-text2">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </header>

      <section id="features" className={sectionClass}>
        <div className="mb-16 reveal opacity-0 translate-y-[30px] transition-all duration-600 ease-out">
          <div className="mb-4 text-xs font-medium uppercase tracking-[0.08em] text-brand-accent">
            Features
          </div>
          <h2 className="mb-5 font-head text-[clamp(1.9rem,4vw,3.2rem)] font-bold leading-[1.12] tracking-[-0.02em]">
            Unparalleled institutional capabilities designed for the modern era.
          </h2>
          <p className="max-w-[620px] text-[1.05rem] leading-[1.7] text-brand-text2">
            Built from the ground up for performance, security, and global scale.
            Our infrastructure supports the most demanding fintech workloads.
          </p>
        </div>

        <div className="reveal grid grid-cols-1 gap-[1px] overflow-hidden rounded-brand border border-brand-border bg-brand-border opacity-0 translate-y-[30px] transition-all duration-600 ease-out md:grid-cols-2 xl:grid-cols-3">
          {state.features.map((feature) => (
            <FeatureCard key={feature.title} feature={feature} />
          ))}
        </div>
      </section>

      <section id="pricing" className={sectionClass}>
        <div className="mb-16 text-center reveal opacity-0 translate-y-[30px] transition-all duration-600 ease-out">
          <div className="mb-4 text-xs font-medium uppercase tracking-[0.08em] text-brand-accent">
            Pricing
          </div>
          <h2 className="mx-auto mb-5 max-w-[800px] font-head text-[clamp(1.9rem,4vw,3.2rem)] font-bold leading-[1.12] tracking-[-0.02em]">
            Transparent institutional pricing for teams of all sizes.
          </h2>
          <p className="mx-auto max-w-[620px] text-[1.05rem] leading-[1.7] text-brand-text2">
            Choose the plan that fits your current scale and unlock more 
            advanced capabilities as your organization grows.
          </p>

          <div className="mt-10 flex justify-center">
            <div className="inline-flex overflow-hidden rounded-full border border-brand-border bg-[rgba(15,23,42,0.62)] p-1 font-body">
              {['monthly', 'annual'].map((mode) => (
                <button
                  key={mode}
                  type="button"
                  className={`rounded-full px-5 py-2 text-sm font-semibold capitalize tracking-[0.01em] transition-all duration-200 ${state.pricingMode === mode
                    ? 'bg-brand-accent text-[#052e16]'
                    : 'text-brand-text2 hover:text-brand-text'
                    }`}
                  onClick={() => vm.setPricingMode(mode)}
                  disabled={state.isSubscriptionSaving}
                >
                  {mode}
                </button>
              ))}
            </div>
          </div>
        </div>

          <div className="mb-12 text-center text-[15px] leading-[1.6] text-brand-text3">
            Switching plans will immediately update your workspace and feature access.
          </div>

        {state.subscriptionError ? (
          <div className="mb-8 rounded-brand border border-brand-red/40 bg-[rgba(248,113,113,0.08)] px-4 py-3 text-sm text-brand-red">
            {state.subscriptionError}
          </div>
        ) : null}

        <div className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] items-start gap-6 reveal opacity-0 translate-y-[30px] transition-all duration-600 ease-out">
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

      <section id="premium" ref={premiumRef} className={sectionClass}>
        <div className="mb-12 reveal opacity-0 translate-y-[30px] transition-all duration-600 ease-out">
          <div className="mb-4 text-xs font-medium uppercase tracking-[0.08em] text-brand-accent">
            Premium unlocks
          </div>
          <h2 className="mb-5 font-head text-[clamp(1.9rem,4vw,3.2rem)] font-bold leading-[1.12] tracking-[-0.02em]">
            Unlock advanced institutional tools with a premium subscription.
          </h2>
          <p className="max-w-[620px] text-[1.05rem] leading-[1.7] text-brand-text2">
            Get access to global multi-entity support, direct bank connectivity, 
            and white-glove implementation services.
          </p>
        </div>

        {vm.isUnlockedVisible ? (
          <div className="grid grid-cols-[repeat(auto-fit,minmax(260px,1fr))] gap-4">
            {state.unlockedFeatures.map((feature) => (
              <article
                key={feature.title}
                className="reveal relative overflow-hidden rounded-brand border border-[rgba(110,231,183,0.18)] bg-[linear-gradient(135deg,rgba(110,231,183,0.06),rgba(59,130,246,0.04))] p-7 opacity-0 translate-y-[30px] transition-all duration-600 ease-out"
              >
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-[linear-gradient(90deg,var(--color-brand-accent),rgba(59,130,246,0.7))]"></div>
                <div className="mb-4 inline-flex rounded-full border border-brand-accent/20 bg-brand-accent/10 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-brand-accent">
                  Unlocked
                </div>
                <h3 className="mb-2 font-head text-[1.05rem] font-semibold tracking-[-0.01em]">
                  {feature.title}
                </h3>
                <p className="text-sm leading-[1.7] text-brand-text2">
                  {feature.description}
                </p>
              </article>
            ))}
          </div>
        ) : (
          <div className="reveal rounded-brand border border-brand-border bg-[rgba(15,23,42,0.62)] px-6 py-6 opacity-0 translate-y-[30px] transition-all duration-600 ease-out">
            <div className="mb-2 font-head text-[1.2rem] font-semibold tracking-[-0.02em]">
              Premium institutional features are currently locked.
            </div>
            <p className="text-sm leading-[1.7] text-brand-text2">
              Please upgrade to a Business or Enterprise plan to gain access 
              to our global command layer and advanced automation tools.
            </p>
          </div>
        )}
      </section>

      <section id="testimonials" className={sectionClass}>
        <div className="mb-16 reveal opacity-0 translate-y-[30px] transition-all duration-600 ease-out">
          <div className="mb-4 text-xs font-medium uppercase tracking-[0.08em] text-brand-accent">
            Testimonials
          </div>
          <h2 className="mb-5 font-head text-[clamp(1.9rem,4vw,3.2rem)] font-bold leading-[1.12] tracking-[-0.02em]">
            A simple testimonial slider keeps the long-scroll page interactive.
          </h2>
        </div>

        <div
          className="relative overflow-hidden reveal opacity-0 translate-y-[30px] transition-all duration-600 ease-out"
          onMouseEnter={() => vm.setSliderPaused(true)}
          onMouseLeave={() => vm.setSliderPaused(false)}
        >
          <div
            className="flex transition-transform duration-500 ease-[cubic-bezier(0.25,0.46,0.45,0.94)]"
            style={{ transform: `translateX(-${state.currentSlide * 100}%)` }}
          >
            {state.testimonials.map((testimonial) => (
              <div key={testimonial.name} className="min-w-full p-2">
                <article className="relative rounded-brand border border-brand-border bg-brand-bg2 p-12 max-md:p-8">
                  <div className="absolute top-8 right-8 text-sm tracking-[2px] text-brand-amber max-md:static max-md:mb-4">
                    &#9733;&#9733;&#9733;&#9733;&#9733;
                  </div>
                  <div className="mb-8 font-head text-[5rem] leading-[0.5] text-brand-accent opacity-40">
                    &quot;
                  </div>
                  <p className="mb-8 font-head text-[1.2rem] font-light italic leading-[1.7] text-brand-text">
                    {testimonial.quote}
                  </p>
                  <div className="flex items-center gap-4 text-brand-text2">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 border-brand-accent bg-brand-accent-dim2 font-head text-sm font-bold text-brand-accent">
                      {testimonial.initials}
                    </div>
                    <div>
                      <div className="mb-0.5 font-head text-[15px] font-semibold tracking-[-0.01em] text-brand-text">
                        {testimonial.name}
                      </div>
                      <div className="text-[13px]">{testimonial.role}</div>
                    </div>
                  </div>
                </article>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 flex items-center justify-center gap-4">
          <button
            className="flex h-10 w-10 items-center justify-center rounded-full border border-brand-border2 bg-brand-bg3 text-base text-brand-text transition-all duration-200 hover:border-brand-accent hover:bg-brand-bg4 hover:text-brand-accent"
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
                className={`h-[6px] cursor-pointer rounded-full border-0 transition-all duration-200 ${state.currentSlide === index
                  ? 'w-5 rounded-[3px] bg-brand-accent'
                  : 'w-[6px] bg-brand-border2'
                  }`}
                type="button"
                aria-label={`Go to testimonial ${index + 1}`}
                onClick={() => vm.goToSlide(index)}
              ></button>
            ))}
          </div>
          <button
            className="flex h-10 w-10 items-center justify-center rounded-full border border-brand-border2 bg-brand-bg3 text-base text-brand-text transition-all duration-200 hover:border-brand-accent hover:bg-brand-bg4 hover:text-brand-accent"
            type="button"
            aria-label="Next testimonial"
            onClick={() => vm.shiftSlide(1)}
          >
            &rarr;
          </button>
        </div>
      </section>

      <section id="waitlist" ref={waitlistRef} className={`${sectionClass} !justify-between gap-12 pt-32 pb-8`}>
        <div className="mx-auto max-w-[640px] reveal opacity-0 translate-y-[30px] transition-all duration-600 ease-out flex-1 flex flex-col justify-center">
          <div className="mb-4 text-xs font-medium uppercase tracking-[0.08em] text-brand-accent">
            Beta waitlist
          </div>
          <p className="mx-auto max-w-[560px] text-[1.05rem] leading-[1.7] text-brand-text2">
            Secure your spot in our upcoming institutional beta. We are currently
            onboarding a limited number of partners for our Q3 intake.
          </p>

          <div className="mt-12">
            {state.successEmail ? (
              <div
                className="mt-6 flex flex-col items-center gap-4 rounded-brand border border-[rgba(110,231,183,0.3)] bg-brand-accent-dim2 p-8"
                aria-live="polite"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-accent text-2xl text-[#052e16]">
                  &#10003;
                </div>
                <h3 className="font-head text-[1.3rem] font-bold text-brand-accent">
                  Reservation confirmed.
                </h3>
                <p className="text-sm text-brand-text2">
                  We have added <strong className="text-brand-text">{state.successEmail}</strong> to the priority queue.
                </p>
              </div>
            ) : (
              <form className="flex flex-col items-stretch" onSubmit={handleSubmit}>
                <div
                  className={`flex overflow-hidden rounded-brand border bg-brand-bg2 transition-colors duration-200 focus-within:border-brand-accent max-sm:flex-col ${state.formMessage.type === 'error'
                    ? 'border-brand-red'
                    : 'border-brand-border'
                    }`}
                >
                  <input
                    type="email"
                    className="flex-1 border-0 bg-transparent p-[14px_16px] text-[15px] text-brand-text outline-0 placeholder:text-brand-text3"
                    value={state.email}
                    placeholder="institutional.email@firm.com"
                    autoComplete="email"
                    onChange={(event) => {
                      vm.setEmail(event.target.value)
                      vm.clearFormMessage()
                    }}
                  />
                  <button
                    className="cursor-pointer border-0 bg-brand-accent px-7 py-3 font-body text-[15px] font-semibold whitespace-nowrap text-[#052e16] transition-opacity duration-200 hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50 max-sm:w-full max-sm:py-3.5"
                    type="submit"
                    disabled={state.isSubmitting}
                  >
                    {state.isSubmitting ? 'Processing...' : 'Request Access'}
                  </button>
                </div>
                <div
                  className={`mt-3 min-h-[20px] text-left text-sm transition-all duration-300 ${state.formMessage.type === 'error'
                    ? 'text-brand-red'
                    : state.formMessage.type === 'success'
                      ? 'text-brand-accent'
                      : 'text-brand-text2'
                    }`}
                  aria-live="assertive"
                >
                  {state.formMessage.text}
                </div>
              </form>
            )}

            <p className="mt-8 text-xs text-brand-text2">
              Privacy is our priority. Your data is handled according to our 
              institutional security standards. No marketing spam, ever.
            </p>
          </div>
        </div>

        <div id="footer" className="w-full border-t border-brand-border pt-16 mt-auto">
          <div className="mb-16 grid grid-cols-1 gap-12 md:grid-cols-4 text-left">
            <div className="md:col-span-1">
              <Link
                to="/"
                className="mb-6 block font-head text-[1.4rem] font-extrabold tracking-[-0.02em]"
              >
                Alphaexplora<span className="text-brand-accent">.</span>
              </Link>
              <p className="text-[13px] leading-relaxed text-brand-text2">
                The institutional command layer for modern fintech. 
                Manage global liquidity, risk orchestration, and 
                automated multi-entity control in one unified platform.
              </p>
            </div>

            <div>
              <h4 className="mb-6 font-head text-sm font-bold uppercase tracking-wider text-brand-text">
                Product
              </h4>
              <ul className="list-none space-y-4 p-0">
                <li>
                  <a
                    href="#features"
                    className="text-[14px] text-brand-text2 transition-colors hover:text-brand-accent"
                  >
                    Features
                  </a>
                </li>
                <li>
                  <a
                    href="#pricing"
                    className="text-[14px] text-brand-text2 transition-colors hover:text-brand-accent"
                  >
                    Pricing
                  </a>
                </li>
                <li>
                  <a
                    href="#premium"
                    className="text-[14px] text-brand-text2 transition-colors hover:text-brand-accent"
                  >
                    Premium access
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="mb-6 font-head text-sm font-bold uppercase tracking-wider text-brand-text">
                Platform
              </h4>
              <ul className="list-none space-y-4 p-0">
                <li>
                  <a
                    href="#"
                    className="text-[14px] text-brand-text2 transition-colors hover:text-brand-accent"
                  >
                    API Reference
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-[14px] text-brand-text2 transition-colors hover:text-brand-accent"
                  >
                    Status Page
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-[14px] text-brand-text2 transition-colors hover:text-brand-accent"
                  >
                    Security Policy
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="mb-6 font-head text-sm font-bold uppercase tracking-wider text-brand-text">
                Contact
              </h4>
              <div className="space-y-4 text-[14px] leading-relaxed text-brand-text2">
                <p className="flex items-center gap-2">
                  <span className="text-brand-accent">Email:</span> hello@alphaexplora.com
                </p>
                <p className="flex items-center gap-2">
                  <span className="text-brand-accent">Phone:</span> +1 (555) 123-4567
                </p>
                <p className="flex items-start gap-2">
                  <span className="text-brand-accent">Office:</span> 
                  <span>
                    123 Fintech Square<br />
                    San Francisco, CA 94105
                  </span>
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 border-t border-brand-border pt-8">
            <p className="text-[13px] text-brand-text3">
              © {new Date().getFullYear()} Alphaexplora. All rights reserved.
            </p>
            <div className="flex gap-8">
              <a href="#" className="text-[13px] text-brand-text3 transition-colors hover:text-brand-text">
                Privacy Policy
              </a>
              <a href="#" className="text-[13px] text-brand-text3 transition-colors hover:text-brand-text">
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
