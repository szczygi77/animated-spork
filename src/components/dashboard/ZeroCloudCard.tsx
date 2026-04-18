import { CloudOff } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function ZeroCloudCard() {
  return (
    <Card className="border-white/10 bg-gradient-to-br from-white/[0.07] to-transparent backdrop-blur-xl">
      <CardHeader className="flex flex-row items-start gap-4 space-y-0">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-sky-500/30 bg-sky-500/10 text-sky-400">
          <CloudOff className="h-6 w-6" strokeWidth={1.5} />
        </div>
        <div>
          <CardTitle className="text-lg font-semibold text-white">
            Zero Cloud Policy
          </CardTitle>
          <p className="mt-2 text-sm leading-relaxed text-zinc-400">
            Behavioral analysis runs entirely on-device. Conversation content never
            leaves your teen&apos;s hardware — no training on chats, no cloud
            retention. You see categories and metadata, not raw messages.
          </p>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <p className="rounded-lg border border-white/5 bg-black/20 px-3 py-2 font-mono text-xs text-zinc-500">
          Architecture: local LLM · encrypted vault · parent consent for exports
        </p>
      </CardContent>
    </Card>
  )
}
