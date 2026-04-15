export function ServiceCard({ service, isLocked }) {
  return (
    <article className={`group relative overflow-hidden rounded-brand border p-9 transition-all duration-300 ${isLocked 
      ? 'border-brand-border bg-brand-bg opacity-75 grayscale' 
      : 'border-brand-accent/20 bg-[rgba(110,231,183,0.03)] hover:bg-[rgba(110,231,183,0.06)] hover:-translate-y-1 hover:border-brand-accent/40 shadow-lg shadow-brand-accent/5'}`}
    >
      <div className={`absolute top-0 left-0 w-1 h-full bg-brand-accent transition-transform duration-500 scale-y-0 group-hover:scale-y-100 ${isLocked ? 'hidden' : ''}`}></div>
      
      <div className={`mb-6 flex h-12 w-12 items-center justify-center rounded-brand-sm font-head text-[0.85rem] font-bold tracking-widest ${isLocked 
        ? 'bg-brand-text/10 text-brand-text/40' 
        : 'bg-brand-accent-dim2 text-brand-accent shadow-sm shadow-brand-accent/20'}`}
      >
        {service.icon}
      </div>

      <h3 className="mb-3 font-head text-[1.15rem] font-bold tracking-tight text-brand-text">
        {service.title}
      </h3>
      
      <p className="mb-8 text-sm leading-relaxed text-brand-text2">
        {service.description}
      </p>

      {isLocked ? (
        <div className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.1em] text-brand-text3">
          <span className="text-[14px]">🔒</span> Premium Only
        </div>
      ) : (
        <button
          className="inline-flex items-center gap-2 text-[12px] font-bold uppercase tracking-[0.1em] text-brand-accent transition-colors hover:text-brand-text"
          type="button"
        >
          Request Now <span className="text-[14px] transition-transform group-hover:translate-x-1">→</span>
        </button>
      )}
    </article>
  )
}
