export function FeatureCard({ feature }) {
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
