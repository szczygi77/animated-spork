import { ShieldAlert } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"

export type ThreatItem = {
  id: string
  message: string
  severity: "high" | "medium" | "low"
  time: string
}

const MOCK: ThreatItem[] = [
  {
    id: "1",
    message: "Attempted off-platforming blocked in Discord",
    severity: "high",
    time: "2h ago",
  },
  {
    id: "2",
    message: "Unknown adult pattern flagged — grooming heuristics",
    severity: "medium",
    time: "1d ago",
  },
  {
    id: "3",
    message: "External link quarantined in browser session",
    severity: "low",
    time: "3d ago",
  },
]

function severityVariant(
  s: ThreatItem["severity"]
): "destructive" | "secondary" | "outline" {
  if (s === "high") return "destructive"
  if (s === "medium") return "secondary"
  return "outline"
}

function severityLabel(s: ThreatItem["severity"]) {
  if (s === "high") return "Critical"
  if (s === "medium") return "Elevated"
  return "Low"
}

export function ThreatFeed({ items = MOCK }: { items?: ThreatItem[] }) {
  return (
    <ScrollArea className="h-[220px] pr-3">
      <ul className="space-y-0">
        {items.map((t, idx) => (
          <li key={t.id}>
            {idx > 0 ? <Separator className="my-3 bg-white/10" /> : null}
            <div className="flex gap-3">
              <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/5">
                <ShieldAlert className="h-4 w-4 text-zinc-400" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm leading-snug text-zinc-200">{t.message}</p>
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <Badge variant={severityVariant(t.severity)}>
                    {severityLabel(t.severity)}
                  </Badge>
                  <span className="text-xs text-zinc-500">{t.time}</span>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </ScrollArea>
  )
}
