export function PricingCard({
  plan,
  pricingMode,
  displayedPrice,
  isSelected,
  isDisabled = false,
  onSelect,
  isLast = false,
}) {
  const isFeatured = plan.featured
  
  return (
    <article
      className={`
        relative flex flex-col flex-1 p-8 font-body transition-all duration-300
        ${isSelected ? 'bg-brand-accent/5' : ''}
        ${!isLast ? 'border-r border-brand-border max-md:border-r-0 max-md:border-b' : ''}
      `}
    >
      {isFeatured ? (
        <div className="absolute -top-[12px] left-1/2 -translate-x-1/2 rounded-full bg-brand-accent px-3 py-0.5 text-[10px] font-bold uppercase tracking-[0.08em] text-[#052e16] z-10">
          Most popular
        </div>
      ) : null}

      <div className="mb-1 font-head text-[1.2rem] font-semibold tracking-[-0.01em] text-brand-text">
        {plan.name}
      </div>
      <div className="mb-6 text-[14px] leading-relaxed text-brand-text2">{plan.description}</div>

      <div className="mb-1 flex items-baseline gap-1.5">
        {plan.custom ? null : (
          <span className="font-head text-[1rem] font-semibold text-brand-text3">
            $
          </span>
        )}
        <span
          className={`font-head leading-none font-extrabold text-brand-text ${
            plan.custom ? 'text-[2rem] tracking-[-0.02em]' : 'text-[2.8rem] tracking-[-0.04em]'
          }`}
        >
          {plan.custom ? 'Custom' : displayedPrice}
        </span>
        {plan.custom ? null : (
          <span className="text-[12px] font-medium uppercase tracking-[0.05em] text-brand-text3">
            /{plan.name === 'Business' ? 'seat' : 'mo'}
          </span>
        )}
      </div>

      <div className="mb-6 min-h-[18px] text-[11px] text-brand-text3 italic">
        {plan.getAnnualNote(pricingMode)}
      </div>

      <div className="mb-6 flex-1">
        <ul className="space-y-2.5">
          {plan.features.map((item) => (
            <li key={item} className="flex items-start gap-2 text-[13px] leading-snug text-brand-text2">
              <div className="mt-0.5 flex h-[14px] w-[14px] shrink-0 items-center justify-center rounded-full bg-brand-accent/15 text-[8px] text-brand-accent" aria-hidden="true">
                &#10003;
              </div>
              {item}
            </li>
          ))}
        </ul>
      </div>

      <button
        className={`mt-auto w-full rounded-brand-sm px-4 py-2.5 text-center text-[13px] font-bold transition-all duration-200 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50
          ${isFeatured || isSelected 
            ? 'bg-brand-accent text-[#052e16] hover:opacity-90 transition-all' 
            : 'bg-brand-bg3 text-brand-text border border-brand-border2 hover:bg-brand-bg4'}
        `}

        type="button"
        disabled={isDisabled}
        onClick={() => onSelect(plan.name)}
      >
        {isSelected ? 'Current Plan' : plan.buttonLabel}
      </button>
    </article>
  )
}

