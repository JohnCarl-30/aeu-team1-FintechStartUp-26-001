import { useEffect, useRef, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { AlphaexploraLandingViewModel, useViewModel } from '../viewModels'

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
    <article className="bg-brand-bg p-10 transition-colors duration-200 hover:bg-brand-bg2 max-sm:p-8">
      <div className="w-11 h-11 bg-brand-accent-dim2 rounded-brand-sm text-[0.8rem] font-bold tracking-[0.08em] text-brand-accent mb-6 flex items-center justify-center" aria-hidden="true">
        {feature.icon}
      </div>
      <h3 className="font-head text-[1.1rem] font-semibold mb-[0.6rem] tracking-[-0.01em]">{feature.title}</h3>
      <p className="text-[14px] leading-relaxed text-brand-text2">{feature.description}</p>
    </article>
  )
}

function PricingCard({ plan, pricingMode, displayedPrice, isSelected, onSelect }) {
  const isFeatured = plan.featured
  
  return (
    <article
      className={`
        bg-brand-bg2 border border-brand-border rounded-brand p-10 relative transition-all duration-200
        hover:-translate-y-1 max-sm:p-8
        ${isFeatured ? 'bg-[linear-gradient(135deg,rgba(110,231,183,0.05),var(--color-brand-bg2))]' : ''}
        ${isSelected ? 'bg-[rgba(110,231,183,0.1)] border-brand-accent shadow-[0_0_20px_rgba(110,231,183,0.15)] -translate-y-1 z-10' : ''}
      `}
    >
      {isFeatured ? (
        <div className="absolute -top-[13px] left-1/2 -translate-x-1/2 bg-brand-accent text-[#052e16] text-[11px] font-bold tracking-[0.08em] uppercase py-1 px-3.5 rounded-full">
          Most popular
        </div>
      ) : null}
      
      <div className="font-head text-[1.1rem] font-bold tracking-[-0.01em] mb-2">{plan.name}</div>
      <div className="text-[13px] mb-8 leading-relaxed text-brand-text2">{plan.description}</div>
      
      <div className="flex items-baseline gap-1 mb-2">
        {plan.custom ? null : <span className="text-[1.2rem] text-brand-text2 font-head">$</span>}
        <span className={`font-head font-extrabold leading-none tracking-[-0.03em] ${plan.custom ? 'text-[2.2rem] tracking-[-0.02em]' : 'text-5xl'}`}>
          {plan.custom ? 'Custom' : displayedPrice}
        </span>
        {plan.custom ? null : (
          <span className="text-[13px] text-brand-text2">
            /{plan.name === 'Business' ? 'mo per seat' : 'mo'}
          </span>
        )}
      </div>
      
      <div className="text-xs min-h-[20px] mb-8 text-brand-text2">{plan.getAnnualNote(pricingMode)}</div>
      
      <hr className="border-0 border-t border-brand-border my-6" />
      
      <ul className="mb-8">
        {plan.features.map((item) => (
          <li key={item} className="flex items-start gap-2.5 text-sm text-brand-text2 py-1.5">
            <div className="w-[18px] h-[18px] bg-brand-accent-dim2 rounded-full shrink-0 flex items-center justify-center text-[10px] text-brand-accent mt-[1px]" aria-hidden="true">
              &#10003;
            </div>
            {item}
          </li>
        ))}
      </ul>
      
      <button
        className={`w-full py-3 px-[28px] text-sm rounded-brand-sm font-semibold transition-all duration-200 cursor-pointer text-center disabled:opacity-50
          ${isFeatured ? 'bg-brand-accent text-[#052e16] hover:opacity-90 hover:-translate-y-[1px]' : 'bg-transparent text-brand-text border border-brand-border2 hover:bg-brand-bg4 hover:-translate-y-[2px]'}
        `}
        type="button"
        onClick={() => onSelect(plan.name)}
      >
        {plan.buttonLabel}
      </button>
    </article>
  )
}

export function AlphaexploraLandingView() {
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
    <div className="bg-brand-bg text-brand-text min-h-screen">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#09090b]/85 backdrop-blur-md border-b border-brand-border px-8 h-16 flex items-center justify-between max-md:px-4">
        <Link to="/" className="font-head tracking-[-0.02em] text-[1.4rem] font-extrabold">
          Alphaexplora<span className="text-brand-accent">.</span>
        </Link>
        <ul className="flex gap-8 list-none max-md:hidden">
          <li>
            <NavLink to="/features" className="text-brand-text2 text-sm tracking-[0.01em] hover:text-brand-text transition-colors">Features</NavLink>
          </li>
          <li>
            <NavLink to="/pricing" className="text-brand-text2 text-sm tracking-[0.01em] hover:text-brand-text transition-colors">Pricing</NavLink>
          </li>
          <li>
            <NavLink to="/testimonials" className="text-brand-text2 text-sm tracking-[0.01em] hover:text-brand-text transition-colors">Testimonials</NavLink>
          </li>
          <li>
            <NavLink to="/waitlist" className="text-brand-text2 text-sm tracking-[0.01em] hover:text-brand-text transition-colors">Waitlist</NavLink>
          </li>
        </ul>
        <NavLink to="/waitlist" className="bg-brand-accent text-[#052e16] font-body text-sm font-medium py-2.5 px-5 rounded-brand-sm transition-all duration-200 hover:opacity-90 hover:-translate-y-[1px]">
          Join Beta
        </NavLink>
      </nav>

      <header className="min-h-screen flex flex-col items-center justify-center text-center pt-32 pb-16 px-8 relative overflow-hidden max-md:px-4">
        <div className="absolute inset-0 pointer-events-none bg-[length:64px_64px] [mask-image:radial-gradient(ellipse_80%_60%_at_50%_50%,black_30%,transparent_100%)]" style={{ backgroundImage: 'linear-gradient(var(--color-brand-border) 1px, transparent 1px), linear-gradient(90deg, var(--color-brand-border) 1px, transparent 1px)' }}></div>
        <div className="absolute pointer-events-none top-[20%] left-1/2 -translate-x-1/2 w-[min(70vw,600px)] h-[300px] bg-[radial-gradient(ellipse,rgba(110,231,183,0.12)_0%,transparent_70%)]"></div>

        <div className="relative inline-flex items-center gap-2 bg-brand-accent-dim2 border border-[rgba(110,231,183,0.3)] text-brand-accent text-xs font-medium tracking-[0.08em] uppercase py-1.5 px-3.5 rounded-full mb-8 animate-fade-up opacity-0 [animation-fill-mode:forwards]">
          <div className="w-1.5 h-1.5 bg-brand-accent rounded-full animate-[pulse_2s_infinite]"></div>
          Now in limited beta - 500 spots remaining
        </div>

        <h1 className="relative font-head text-[clamp(2.8rem,6vw,5.5rem)] font-extrabold leading-[1.05] tracking-[-0.03em] mb-6 max-w-[900px] animate-fade-up opacity-0 [animation-fill-mode:forwards]">
          The operating system for
          <br />
          <span className="text-brand-accent">modern enterprises.</span>
        </h1>
        
        <p className="relative font-body text-[clamp(1rem,2vw,1.2rem)] text-brand-text2 max-w-[560px] leading-[1.7] mb-12 animate-fade-up opacity-0 [animation-fill-mode:forwards] [animation-delay:100ms]">
          Alphaexplora unifies your workflows, data, and teams in a single intelligent
          platform. Built for organizations that cannot afford to slow down.
        </p>

        <div className="relative flex gap-4 flex-wrap justify-center mb-16 animate-fade-up opacity-0 [animation-fill-mode:forwards] [animation-delay:200ms] max-sm:w-full max-sm:flex-col">
          <NavLink to="/waitlist" className="bg-brand-accent text-[#052e16] font-body text-[15px] font-semibold py-3.5 px-7 rounded-brand-sm transition-all duration-200 hover:opacity-90 hover:-translate-y-[1px] max-sm:w-full">
            Get early access
          </NavLink>
          <NavLink to="/features" className="bg-transparent text-brand-text border border-brand-border2 font-body text-[15px] font-semibold py-3.5 px-7 rounded-brand-sm transition-all duration-200 hover:bg-brand-bg4 hover:-translate-y-[2px] max-sm:w-full">
            Explore features
          </NavLink>
        </div>

        <div className="relative p-8 flex flex-col items-center gap-6 animate-fade-up opacity-0 [animation-fill-mode:forwards] [animation-delay:300ms]">
          <p className="text-xs tracking-[0.08em] uppercase text-brand-text3">Trusted by forward-thinking companies</p>
          <div className="flex gap-12 items-center flex-wrap justify-center">
            {state.logos.map((logo) => (
              <div key={logo} className="font-head text-[1.1rem] font-bold text-brand-text3 opacity-50 hover:opacity-80 transition-opacity duration-200">
                {logo}
              </div>
            ))}
          </div>
        </div>
      </header>

      <div className="bg-brand-bg2 py-12 px-8 border-t border-brand-border">
        <div className="max-w-[1200px] mx-auto grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-12 text-center">
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
          <div className="text-brand-accent text-xs tracking-[0.08em] uppercase font-medium mb-4">Core platform</div>
          <h2 className="font-head text-[clamp(1.8rem,4vw,3rem)] font-bold tracking-[-0.02em] leading-[1.15] mb-5">
            Everything your enterprise needs,
            <br />
            nothing it does not.
          </h2>
          <p className="text-[1.05rem] text-brand-text2 max-w-[520px] leading-[1.7]">
            Alphaexplora was built from the ground up for the way complex organizations
            actually work - asynchronously, globally, and at scale.
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
          <div className="inline-flex items-center gap-1.5 bg-[rgba(253,224,71,0.1)] border border-[rgba(253,224,71,0.25)] text-brand-amber text-[11px] font-semibold tracking-[0.08em] uppercase py-1 px-2.5 rounded-full mb-8">
            Business plan - exclusive features
          </div>
          <h3 className="font-head text-[1.6rem] font-bold tracking-[-0.02em] mb-5">
            Unlocked: Advanced Capabilities
          </h3>
          <p className="text-[1.05rem] text-brand-text2 max-w-[520px] leading-[1.7]">
            These features are available exclusively on Business and above.
            You are seeing them because you chose a plan built for serious
            organizations.
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

        <div className="inline-flex bg-brand-bg3 border border-brand-border rounded-full p-1 mb-12" role="tablist" aria-label="Billing mode">
          <button
            className={`py-2 px-5 rounded-full border-0 font-body text-sm font-medium transition-all duration-200 ${state.pricingMode === 'monthly' ? 'bg-brand-bg text-brand-text shadow-sm' : 'bg-transparent text-brand-text2'}`}
            type="button"
            onClick={() => vm.setPricingMode('monthly')}
          >
            Monthly
          </button>
          <button
            className={`flex items-center py-2 px-5 rounded-full border-0 font-body text-sm font-medium transition-all duration-200 ${state.pricingMode === 'annual' ? 'bg-brand-bg text-brand-text shadow-sm' : 'bg-transparent text-brand-text2'}`}
            type="button"
            onClick={() => vm.setPricingMode('annual')}
          >
            Annual <span className="inline-flex items-center bg-[rgba(110,231,183,0.15)] text-brand-accent text-[10px] font-semibold py-0.5 px-1.5 rounded-full ml-1.5 tracking-[0.05em]">Save 20%</span>
          </button>
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
          onMouseEnter={() => vm.setSliderPaused(true)}
          onMouseLeave={() => vm.setSliderPaused(false)}
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
          <div className="text-brand-accent text-xs tracking-[0.08em] uppercase font-medium mb-4">Beta access</div>
          <h2 className="font-head text-[clamp(1.8rem,4vw,3rem)] font-bold tracking-[-0.02em] leading-[1.15] mb-5">Be first. Lock in founding rates.</h2>
          <p className="text-[1.05rem] text-brand-text2 max-w-[520px] leading-[1.7] mx-auto">
            Beta members get 40% off their first year, a dedicated onboarding
            call, and direct access to our product team.
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
                    {state.isSubmitting ? 'Joining...' : 'Join waitlist'}
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
          Copyright {new Date().getFullYear()} Alphaexplora Technologies, Inc. All rights reserved.
        </p>
        <ul className="flex gap-8 list-none max-sm:flex-col max-sm:gap-4">
          <li>
            <NavLink to="/privacy" className="text-[13px] text-brand-text3 hover:text-brand-text transition-colors">Privacy</NavLink>
          </li>
          <li>
            <NavLink to="/terms" className="text-[13px] text-brand-text3 hover:text-brand-text transition-colors">Terms</NavLink>
          </li>
          <li>
            <NavLink to="/security" className="text-[13px] text-brand-text3 hover:text-brand-text transition-colors">Security</NavLink>
          </li>
          <li>
            <NavLink to="/status" className="text-[13px] text-brand-text3 hover:text-brand-text transition-colors">Status</NavLink>
          </li>
        </ul>
      </footer>
    </div>
  )
}
