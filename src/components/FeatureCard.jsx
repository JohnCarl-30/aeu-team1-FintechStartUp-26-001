export function FeatureCard({ feature }) {
  return (
    <article className="group bg-brand-bg p-8 transition-all duration-300 hover:bg-brand-bg2 hover:scale-[1.02] border border-transparent hover:border-brand-accent/20 max-sm:p-6">
      <div className="w-12 h-12 bg-gradient-to-br from-brand-accent/20 to-brand-accent/5 rounded-brand flex items-center justify-center mb-5 border border-brand-accent/20">
        <span className="text-sm font-bold tracking-wider text-brand-accent">
          {feature.icon}
        </span>
      </div>
      <h3 className="font-head text-[1.15rem] font-semibold mb-3 tracking-[-0.01em] text-brand-text group-hover:text-brand-accent transition-colors">{feature.title}</h3>
      <p className="text-[14px] leading-[1.7] text-brand-text2">{feature.description}</p>
    </article>
  )
}
