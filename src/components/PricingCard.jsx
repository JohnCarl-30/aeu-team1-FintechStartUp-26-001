export function PricingCard({
  plan,
  pricingMode,
  displayedPrice,
  isSelected,
  isDisabled = false,
  onSelect,
}) {
  const isFeatured = plan.featured
  
  return (
    <article
      className={`
        bg-brand-bg2 border border-brand-border rounded-brand p-10 relative font-body transition-all duration-200
        hover:-translate-y-1 max-sm:p-8
        ${isFeatured ? 'bg-[linear-gradient(135deg,rgba(110,231,183,0.05),var(--color-brand-bg2))]' : ''}
        ${isSelected ? 'bg-[rgba(110,231,183,0.1)] border-brand-accent shadow-[0_0_20px_rgba(110,231,183,0.15)] -translate-y-1 z-10' : ''}
      `}
    >
      {isFeatured ? (
        <div className="absolute -top-[13px] left-1/2 -translate-x-1/2 rounded-full bg-brand-accent px-3.5 py-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-[#052e16]">
          Most popular
        </div>
      ) : null}

      <div className="mb-2 font-head text-[1.3rem] font-semibold tracking-[-0.02em] text-brand-text">
        {plan.name}
      </div>
      <div className="mb-8 text-[15px] leading-[1.75] text-brand-text2">{plan.description}</div>

      <div className="mb-2 flex items-baseline gap-1.5">
        {plan.custom ? null : (
          <span className="font-head text-[1.15rem] font-semibold tracking-[-0.02em] text-brand-text2">
            $
          </span>
        )}
        <span
          className={`font-head leading-none font-extrabold text-brand-text ${
            plan.custom ? 'text-[2.35rem] tracking-[-0.03em]' : 'text-[3.35rem] tracking-[-0.05em]'
          }`}
        >
          {plan.custom ? 'Custom' : displayedPrice}
        </span>
        {plan.custom ? null : (
          <span className="text-[13px] font-medium uppercase tracking-[0.06em] text-brand-text3">
            /{plan.name === 'Business' ? 'mo per seat' : 'mo'}
          </span>
        )}
      </div>

      <div className="mb-8 min-h-[20px] text-[12px] leading-[1.6] text-brand-text3">
        {plan.getAnnualNote(pricingMode)}
      </div>

      <hr className="border-0 border-t border-brand-border my-6" />

      <ul className="mb-8">
        {plan.features.map((item) => (
          <li key={item} className="flex items-start gap-2.5 py-1.5 text-[14px] leading-[1.6] text-brand-text2">
            <div className="mt-[1px] flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full bg-brand-accent-dim2 text-[10px] text-brand-accent" aria-hidden="true">
              &#10003;
            </div>
            {item}
          </li>
        ))}
      </ul>

      <button
        className={`w-full rounded-brand-sm px-[28px] py-3 text-center text-sm font-semibold transition-all duration-200 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50
          ${isFeatured ? 'bg-brand-accent text-[#052e16] hover:opacity-90 hover:-translate-y-[1px]' : 'bg-transparent text-brand-text border border-brand-border2 hover:bg-brand-bg4 hover:-translate-y-[2px]'}
        `}
        type="button"
        disabled={isDisabled}
        onClick={() => onSelect(plan.name)}
      >
        {isSelected ? 'Current plan' : plan.buttonLabel}
      </button>
    </article>
  )
}
