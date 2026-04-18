import { Gamepad2, MessageCircle, Music2, Smartphone } from "lucide-react"
import { motion } from "framer-motion"

const CHANNELS = [
  { name: "Discord", Icon: MessageCircle },
  { name: "Roblox", Icon: Gamepad2 },
  { name: "TikTok", Icon: Music2 },
  { name: "WhatsApp", Icon: Smartphone },
] as const

const tileVariants = {
  hidden: { opacity: 0, scale: 0.96 },
  show: (i: number) => ({
    opacity: 1,
    scale: 1,
    transition: {
      delay: 0.15 + i * 0.06,
      duration: 0.35,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  }),
}

export function ProtectionBento() {
  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4">
      {CHANNELS.map((ch, i) => (
        <motion.div
          key={ch.name}
          custom={i}
          variants={tileVariants}
          initial="hidden"
          animate="show"
          className="relative flex flex-col items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-6 backdrop-blur-md"
        >
          <div
            className="relative flex h-14 w-14 items-center justify-center rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 shadow-[0_0_24px_rgba(16,185,129,0.22)]"
            aria-hidden
          >
            <ch.Icon className="h-7 w-7" strokeWidth={1.5} />
            <span
              className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full bg-emerald-400 shadow-[0_0_10px_#34d399]"
              title="Protected"
            />
          </div>
          <span className="text-sm font-medium text-zinc-200">{ch.name}</span>
          <span className="text-[10px] font-medium uppercase tracking-widest text-emerald-500/90">
            Active
          </span>
        </motion.div>
      ))}
    </div>
  )
}
