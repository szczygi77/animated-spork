import { FileWarning, Lock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export function EvidenceVault() {
  return (
    <Card className="overflow-hidden border-red-500/20 bg-gradient-to-br from-red-950/40 via-[#121214] to-[#0a0a0b] shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] backdrop-blur-xl">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Lock className="h-4 w-4 text-red-400/90" />
          <CardTitle className="text-base font-semibold text-white">
            Evidence Vault
          </CardTitle>
        </div>
        <CardDescription className="text-zinc-500">
          Secure incident package — metadata only; no conversation transcript shown
          here.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-3 sm:grid-cols-3">
          {[
            { label: "Platform", value: "Discord" },
            { label: "Timestamp", value: "2026-04-18 · 19:45 UTC+2" },
            { label: "Risk category", value: "Off-platforming" },
          ].map((row) => (
            <div
              key={row.label}
              className="rounded-xl border border-white/10 bg-black/30 px-3 py-3"
            >
              <p className="text-[10px] font-medium uppercase tracking-wider text-zinc-500">
                {row.label}
              </p>
              <p className="mt-1 font-mono text-sm text-zinc-200">{row.value}</p>
            </div>
          ))}
        </div>
        <Button
          className="w-full border border-red-500/40 bg-red-600/90 text-white shadow-[0_0_28px_rgba(239,68,68,0.35)] transition-shadow hover:bg-red-600 hover:shadow-[0_0_36px_rgba(239,68,68,0.45)]"
          size="lg"
        >
          <FileWarning className="mr-2 h-4 w-4" />
          Generate police report
        </Button>
      </CardContent>
    </Card>
  )
}
