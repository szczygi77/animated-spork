const R = 78
const CX = 100
const CY = 100
/** Top semicircle arc length */
const ARC = Math.PI * R

type SafetyGaugeProps = {
  score: number
  max?: number
}

export function SafetyGauge({ score, max = 10 }: SafetyGaugeProps) {
  const pct = Math.min(1, Math.max(0, score / max))
  const offset = ARC * (1 - pct)

  return (
    <div className="relative flex flex-col items-center">
      <svg
        viewBox="0 0 200 120"
        className="h-36 w-56 md:h-40 md:w-64"
        aria-hidden
      >
        <defs>
          <linearGradient id="gaugeSafe" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#059669" />
            <stop offset="100%" stopColor="#34d399" />
          </linearGradient>
        </defs>
        {/* Track */}
        <path
          d={`M ${CX - R} ${CY} A ${R} ${R} 0 0 1 ${CX + R} ${CY}`}
          fill="none"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth="12"
          strokeLinecap="round"
        />
        {/* Value */}
        <path
          d={`M ${CX - R} ${CY} A ${R} ${R} 0 0 1 ${CX + R} ${CY}`}
          fill="none"
          stroke="url(#gaugeSafe)"
          strokeWidth="12"
          strokeLinecap="round"
          strokeDasharray={ARC}
          strokeDashoffset={offset}
          className="transition-[stroke-dashoffset] duration-700 ease-out"
        />
      </svg>
      <div className="absolute bottom-1 flex flex-col items-center text-center">
        <span className="text-4xl font-bold tracking-tight text-white md:text-5xl">
          {score}
          <span className="text-lg font-medium text-zinc-500 md:text-xl">
            /{max}
          </span>
        </span>
        <span className="text-xs font-medium uppercase tracking-wider text-zinc-500">
          Safety score
        </span>
      </div>
    </div>
  )
}
