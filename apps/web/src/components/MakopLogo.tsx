export function MakopLogo({ className = 'text-4xl' }: { className?: string }) {
  return (
    <span className={`font-black tracking-widest uppercase ${className}`}>
      <span className="glow-text">Mak</span><span className="ball-o" /><span className="glow-text">p</span>
    </span>
  )
}
