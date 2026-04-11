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
        className={`w-full py-3 px-[28px] text-sm rounded-brand-sm font-semibold transition-all duration-200 cursor-pointer text-center disabled:cursor-not-allowed disabled:opacity-50
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
