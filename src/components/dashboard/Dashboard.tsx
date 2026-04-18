import { motion } from "framer-motion"
import { Activity, Shield } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { EvidenceVault } from "./EvidenceVault"
import { ProtectionBento } from "./ProtectionBento"
import { SafetyGauge } from "./SafetyGauge"
import { ThreatFeed } from "./ThreatFeed"
import { ZeroCloudCard } from "./ZeroCloudCard"

const containerVariants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.08, delayChildren: 0.06 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 18 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.42, ease: [0.22, 1, 0.36, 1] as const },
  },
}

export function Dashboard() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#0A0A0B] text-zinc-100">
      {/* Ambient gradient */}
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-10%,rgba(59,130,246,0.14),transparent)]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_100%_50%,rgba(16,185,129,0.06),transparent)]"
        aria-hidden
      />

      <motion.div
        className="relative mx-auto max-w-6xl px-4 pb-16 pt-10 md:px-6 md:pt-14"
        initial="hidden"
        animate="show"
        variants={containerVariants}
      >
        {/* Top bar */}
        <motion.header
          variants={itemVariants}
          className="mb-10 flex flex-col gap-4 border-b border-white/10 pb-8 md:flex-row md:items-end md:justify-between"
        >
          <div>
            <p className="font-mono text-xs font-medium uppercase tracking-[0.2em] text-zinc-500">
              VIGIL 3.0
            </p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-white md:text-4xl">
              Parent dashboard
            </h1>
            <p className="mt-2 max-w-xl text-sm text-zinc-400">
              The Intelligent Safety Shield — behavioral signals, not message
              surveillance.
            </p>
          </div>
          <motion.div
            className="flex items-center gap-3 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-2 backdrop-blur-sm"
            animate={{
              boxShadow: [
                "0 0 0 0 rgba(16,185,129,0.35)",
                "0 0 24px 2px rgba(16,185,129,0.2)",
                "0 0 0 0 rgba(16,185,129,0.35)",
              ],
            }}
            transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
          >
            <motion.span
              className="relative flex h-2.5 w-2.5"
              aria-hidden
            >
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-40" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400" />
            </motion.span>
            <Shield className="h-4 w-4 text-emerald-400" />
            <span className="text-sm font-medium text-emerald-100">
              Shield status: Active
            </span>
          </motion.div>
        </motion.header>

        {/* Bento */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-12 lg:gap-5">
          {/* Safety score — spans 5 */}
          <motion.section
            variants={itemVariants}
            className="lg:col-span-5"
          >
            <Card className="h-full border-white/10 bg-white/[0.03] backdrop-blur-xl">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between gap-2">
                  <CardTitle className="text-base font-semibold text-white">
                    Safety overview
                  </CardTitle>
                  <Activity className="h-4 w-4 text-zinc-500" />
                </div>
              </CardHeader>
              <CardContent className="flex flex-col items-center pt-2">
                <SafetyGauge score={8.5} max={10} />
                <p className="mt-4 max-w-xs text-center text-xs text-zinc-500">
                  Composite score from on-device pattern analysis this week.
                </p>
              </CardContent>
            </Card>
          </motion.section>

          {/* Active protection */}
          <motion.section
            variants={itemVariants}
            className="lg:col-span-7"
          >
            <Card className="h-full border-white/10 bg-white/[0.03] backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="text-base font-semibold text-white">
                  Active protection
                </CardTitle>
                <p className="text-sm text-zinc-500">
                  Monitored channels with live policy enforcement
                </p>
              </CardHeader>
              <CardContent>
                <ProtectionBento />
              </CardContent>
            </Card>
          </motion.section>

          {/* Threat feed */}
          <motion.section
            variants={itemVariants}
            className="lg:col-span-7"
          >
            <Card className="border-white/10 bg-white/[0.03] backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="text-base font-semibold text-white">
                  Pattern detections
                </CardTitle>
                <p className="text-sm text-zinc-500">
                  Recent behavioral signals (sanitized descriptions)
                </p>
              </CardHeader>
              <CardContent>
                <ThreatFeed />
              </CardContent>
            </Card>
          </motion.section>

          {/* Zero cloud */}
          <motion.section
            variants={itemVariants}
            className="lg:col-span-5"
          >
            <ZeroCloudCard />
          </motion.section>

          {/* Evidence vault — full width */}
          <motion.section
            variants={itemVariants}
            className="lg:col-span-12"
          >
            <EvidenceVault />
          </motion.section>
        </div>
      </motion.div>
    </div>
  )
}
