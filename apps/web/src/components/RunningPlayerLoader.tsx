export function RunningPlayerLoader() {
  return (
    <div className="flex flex-col items-center gap-3 py-10">
      <svg viewBox="0 0 200 70" width="176" className="block" aria-hidden="true">

        {/* Ground */}
        <line x1="5" y1="61" x2="195" y2="61"
              stroke="hsl(141 50% 72%)" strokeWidth="1.5" strokeLinecap="round" />

        {/* Goal frame */}
        <g stroke="hsl(215 20% 38%)" strokeWidth="2.5" fill="none" strokeLinecap="round">
          <line x1="163" y1="34" x2="163" y2="61" />
          <line x1="178" y1="34" x2="178" y2="61" />
          <line x1="163" y1="34" x2="178" y2="34" />
        </g>
        {/* Net */}
        <g stroke="hsl(215 15% 70%)" strokeWidth="0.7">
          <line x1="167" y1="35" x2="167" y2="61" />
          <line x1="172" y1="35" x2="172" y2="61" />
          <line x1="163" y1="42" x2="178" y2="42" />
          <line x1="163" y1="51" x2="178" y2="51" />
          <line x1="163" y1="58" x2="178" y2="58" />
        </g>

        {/* Player + ball: runs from left to goal, fades out, resets */}
        <g>
          <animateTransform attributeName="transform" type="translate"
            values="0,0; 115,0" dur="2s" repeatCount="indefinite" calcMode="linear" />
          <animate attributeName="opacity"
            values="0;1;1;0;0" keyTimes="0;0.05;0.80;0.88;1"
            dur="2s" repeatCount="indefinite" calcMode="linear" />

          {/* Head */}
          <circle cx="22" cy="33" r="5" fill="hsl(160 70% 38%)" />
          {/* Body */}
          <line x1="22" y1="38" x2="22" y2="51"
                stroke="hsl(160 70% 38%)" strokeWidth="2.2" strokeLinecap="round" />

          {/* Left arm */}
          <line x1="22" y1="42" x2="16" y2="47"
                stroke="hsl(160 70% 38%)" strokeWidth="1.8" strokeLinecap="round">
            <animateTransform attributeName="transform" type="rotate"
              values="30,22,42;-30,22,42;30,22,42" dur="0.34s" repeatCount="indefinite" />
          </line>
          {/* Right arm */}
          <line x1="22" y1="42" x2="28" y2="47"
                stroke="hsl(160 70% 38%)" strokeWidth="1.8" strokeLinecap="round">
            <animateTransform attributeName="transform" type="rotate"
              values="-30,22,42;30,22,42;-30,22,42" dur="0.34s" repeatCount="indefinite" />
          </line>

          {/* Left leg */}
          <line x1="22" y1="51" x2="17" y2="61"
                stroke="hsl(160 70% 38%)" strokeWidth="1.8" strokeLinecap="round">
            <animateTransform attributeName="transform" type="rotate"
              values="-40,22,51;40,22,51;-40,22,51" dur="0.34s" repeatCount="indefinite" />
          </line>
          {/* Right leg */}
          <line x1="22" y1="51" x2="27" y2="61"
                stroke="hsl(160 70% 38%)" strokeWidth="1.8" strokeLinecap="round">
            <animateTransform attributeName="transform" type="rotate"
              values="40,22,51;-40,22,51;40,22,51" dur="0.34s" repeatCount="indefinite" />
          </line>

          {/* Ball */}
          <circle cx="33" cy="58" r="4" fill="white" stroke="hsl(215 15% 55%)" strokeWidth="1" />
          <line x1="29" y1="58" x2="37" y2="58"
                stroke="hsl(215 15% 55%)" strokeWidth="0.9" strokeLinecap="round">
            <animateTransform attributeName="transform" type="rotate"
              values="0,33,58;360,33,58" dur="0.45s" repeatCount="indefinite" />
          </line>
          <line x1="33" y1="54" x2="33" y2="62"
                stroke="hsl(215 15% 55%)" strokeWidth="0.9" strokeLinecap="round">
            <animateTransform attributeName="transform" type="rotate"
              values="0,33,58;360,33,58" dur="0.45s" repeatCount="indefinite" />
          </line>
        </g>

      </svg>
      <p className="text-sm text-slate-500">Načítání...</p>
    </div>
  )
}
