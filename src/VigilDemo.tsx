import { AnimatePresence, motion } from "framer-motion"
import {
  AlertTriangle,
  Bell,
  ChevronDown,
  ChevronRight,
  CloudOff,
  Cpu,
  FileText,
  LayoutDashboard,
  Lock,
  MessageSquare,
  Minus,
  Plus,
  Radio,
  Shield,
  ShieldCheck,
  Sparkles,
  Users,
  Video,
  X,
} from "lucide-react"
import { useCallback, useEffect, useState } from "react"

type ParentSection = "summary" | "vault" | "locks" | "family"
type AgeBand = "under16" | "senior16"
type Severity = "niskie" | "średnie" | "krytyczne"
type LockReason = "sextortion" | "offplatform"
type ReportStep = "idle" | "preparing" | "packing" | "ready"

type VaultItem = {
  id: string
  title: string
  severity: Severity
  platform: string
  time: string
  category: string
  patterns: string[]
  accountHint: string
}

const VAULT_ITEMS: VaultItem[] = [
  {
    id: "1",
    title: "Off-platforming — Discord",
    severity: "krytyczne",
    platform: "Discord",
    time: "2026-04-18 · 19:42",
    category: "Off-platforming",
    patterns: ["Próba przeniesienia rozmowy", "Nieznana osoba dorosła"],
    accountHint: "Użytkownik zewnętrzny · ID zaszyte lokalnie",
  },
  {
    id: "2",
    title: "Wzorce groomingowe — Roblox",
    severity: "średnie",
    platform: "Roblox",
    time: "2026-04-16 · 14:10",
    category: "Grooming (heurystyka)",
    patterns: ["Eskalacja intymności", "Budowanie „słodkiej tajemnicy”"],
    accountHint: "Profil gry · metadane tylko na urządzeniu",
  },
  {
    id: "3",
    title: "Phishing / scam — Steam",
    severity: "niskie",
    platform: "Steam",
    time: "2026-04-12 · 09:55",
    category: "Scam i phishing",
    patterns: ["Podszywanie pod administrację", "Wyłudzenie przedmiotów"],
    accountHint: "Link zewnętrzny zablokowany",
  },
]

const PLATFORMS = [
  { name: "Discord", Icon: MessageSquare },
  { name: "Steam", Icon: Radio },
  { name: "TikTok", Icon: Video },
] as const

const PHI_LABEL = "Analiza behawioralna (Phi-3 Mini)"

const PATTERN_FEED = [
  "Wykryto wzorzec: Off-platforming",
  "Wykryto wzorzec: Słodka tajemnica (grooming)",
  "Wykryto wzorzec: Scam / phishing",
] as const

const cardBase =
  "rounded-2xl border border-white/10 bg-zinc-900/50 backdrop-blur-sm"

function severityStyles(s: Severity) {
  if (s === "krytyczne")
    return "bg-red-500/20 text-red-300 border-red-500/40"
  if (s === "średnie")
    return "bg-amber-500/15 text-amber-200 border-amber-500/35"
  return "bg-emerald-500/10 text-emerald-300 border-emerald-500/30"
}

function severityLabel(s: Severity) {
  const map: Record<Severity, string> = {
    niskie: "Niskie",
    średnie: "Średnie",
    krytyczne: "Krytyczne",
  }
  return map[s]
}

export default function VigilDemo() {
  const [mode, setMode] = useState<"teen" | "parent">("parent")
  const [section, setSection] = useState<ParentSection>("summary")
  const [ageBand, setAgeBand] = useState<AgeBand>("under16")
  const [safetyScore, setSafetyScore] = useState(8)
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [hardLock, setHardLock] = useState(false)
  const [lockReason, setLockReason] = useState<LockReason>("offplatform")
  const [parentToast, setParentToast] = useState(false)
  const [toastSextortion, setToastSextortion] = useState(false)
  const [vaultModalItem, setVaultModalItem] = useState<VaultItem | null>(null)
  const [reportStep, setReportStep] = useState<ReportStep>("idle")

  const simulateSextortion = useCallback(() => {
    setLockReason("sextortion")
    setHardLock(true)
    setParentToast(true)
    setToastSextortion(true)
  }, [])

  const dismissLock = useCallback(() => {
    setHardLock(false)
  }, [])

  const dismissToast = useCallback(() => {
    setParentToast(false)
    setToastSextortion(false)
  }, [])

  const openCriticalModal = useCallback((item: VaultItem) => {
    if (item.severity !== "krytyczne") return
    setVaultModalItem(item)
    setReportStep("idle")
  }, [])

  const closeVaultModal = useCallback(() => {
    setVaultModalItem(null)
    setReportStep("idle")
  }, [])

  const startReportGeneration = useCallback(() => {
    setReportStep("preparing")
  }, [])

  useEffect(() => {
    if (reportStep === "preparing") {
      const t = window.setTimeout(() => setReportStep("packing"), 900)
      return () => window.clearTimeout(t)
    }
    if (reportStep === "packing") {
      const t = window.setTimeout(() => setReportStep("ready"), 1200)
      return () => window.clearTimeout(t)
    }
  }, [reportStep])

  useEffect(() => {
    if (!parentToast) return
    const t = window.setTimeout(() => {
      setParentToast(false)
      setToastSextortion(false)
    }, 10000)
    return () => window.clearTimeout(t)
  }, [parentToast])

  const bumpScore = (d: number) => {
    setSafetyScore((s) => Math.min(10, Math.max(1, s + d)))
  }

  return (
    <div className="relative min-h-[100dvh] min-h-screen bg-[#050505] text-zinc-100">
      {/* Mode switch */}
      <div className="fixed left-0 right-0 top-0 z-50 flex flex-col items-center gap-2 p-3">
        <div className="flex items-center gap-1 rounded-full border border-white/10 bg-black/50 p-1 backdrop-blur-md">
          <button
            type="button"
            onClick={() => setMode("parent")}
            className={`rounded-full px-4 py-2 text-sm font-medium transition ${
              mode === "parent"
                ? "bg-[#3B82F6] text-white shadow-[0_0_24px_rgba(59,130,246,0.35)]"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            Panel rodzica
          </button>
          <button
            type="button"
            onClick={() => setMode("teen")}
            className={`rounded-full px-4 py-2 text-sm font-medium transition ${
              mode === "teen"
                ? "bg-emerald-600/90 text-white shadow-[0_0_20px_rgba(16,185,129,0.3)]"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            Widok nastolatka
          </button>
        </div>
        {mode === "parent" && (
          <div className="flex items-center gap-1 rounded-full border border-white/10 bg-black/40 p-1 text-xs backdrop-blur-md">
            <button
              type="button"
              onClick={() => setAgeBand("under16")}
              className={`rounded-full px-3 py-1.5 font-medium ${
                ageBand === "under16"
                  ? "bg-white/15 text-white"
                  : "text-zinc-500 hover:text-zinc-300"
              }`}
            >
              Poniżej 16 lat
            </button>
            <button
              type="button"
              onClick={() => setAgeBand("senior16")}
              className={`rounded-full px-3 py-1.5 font-medium ${
                ageBand === "senior16"
                  ? "bg-white/15 text-white"
                  : "text-zinc-500 hover:text-zinc-300"
              }`}
            >
              Senior Teen 16+
            </button>
          </div>
        )}
      </div>

      <AnimatePresence>
        {parentToast && mode === "parent" && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="fixed left-4 right-4 top-28 z-40 mx-auto max-w-lg md:left-auto md:right-8 md:top-32"
          >
            <div className="flex items-start gap-3 rounded-2xl border border-red-500/40 bg-red-950/90 p-4 shadow-[0_0_32px_rgba(239,68,68,0.25)] backdrop-blur-md">
              <Bell className="mt-0.5 h-5 w-5 shrink-0 text-red-400" />
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-red-100">Instant Alert</p>
                <p className="mt-1 text-sm text-red-200/90">
                  {toastSextortion
                    ? "Wykryto wzorzec zagrożenia: sextortion (szantaż intymnymi materiałami). Hard Lock na urządzeniu. Kategoria i metadane — bez cytatu treści rozmowy."
                    : "Wykryto krytyczne zagrożenie behawioralne. Hard Lock aktywny na urządzeniu dziecka — bez ujawniania treści wiadomości."}
                </p>
                <button
                  type="button"
                  onClick={dismissToast}
                  className="mt-3 text-xs font-medium text-red-300 underline"
                >
                  Zamknij
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <SosVaultModal
        item={vaultModalItem}
        reportStep={reportStep}
        onClose={closeVaultModal}
        onGenerate={startReportGeneration}
      />

      {mode === "parent" ? (
        <ParentShell
          ageBand={ageBand}
          section={section}
          onSection={setSection}
          safetyScore={safetyScore}
          onBumpScore={bumpScore}
          expandedId={expandedId}
          onToggleVault={(id) =>
            setExpandedId((e) => (e === id ? null : id))
          }
          onOpenCritical={openCriticalModal}
          onSimulateSextortion={simulateSextortion}
        />
      ) : (
        <TeenShield
          hardLock={hardLock}
          lockReason={lockReason}
          onDismissLock={dismissLock}
          onSimulateSextortion={simulateSextortion}
        />
      )}
    </div>
  )
}

function ZeroCloudBadge() {
  return (
    <motion.div
      className="inline-flex items-center gap-2 rounded-full border border-sky-500/40 bg-sky-500/10 px-4 py-2 text-xs font-semibold text-sky-200"
      animate={{
        boxShadow: [
          "0 0 0 0 rgba(56,189,248,0.35)",
          "0 0 20px 4px rgba(56,189,248,0.2)",
          "0 0 0 0 rgba(56,189,248,0.35)",
        ],
        borderColor: [
          "rgba(56,189,248,0.45)",
          "rgba(125,211,252,0.6)",
          "rgba(56,189,248,0.45)",
        ],
      }}
      transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
    >
      <CloudOff className="h-4 w-4 shrink-0 text-sky-300" />
      <span>Wszystkie dane pozostają na urządzeniu dziecka</span>
    </motion.div>
  )
}

function SosVaultModal({
  item,
  reportStep,
  onClose,
  onGenerate,
}: {
  item: VaultItem | null
  reportStep: ReportStep
  onClose: () => void
  onGenerate: () => void
}) {
  return (
    <AnimatePresence>
      {item && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 p-4 backdrop-blur-md"
          role="dialog"
          aria-modal
          aria-labelledby="sos-title"
        >
          <motion.div
            initial={{ scale: 0.94, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.96, opacity: 0 }}
            className={`relative max-h-[90vh] w-full max-w-lg overflow-y-auto ${cardBase} p-6 shadow-2xl`}
          >
            <button
              type="button"
              onClick={onClose}
              className="absolute right-4 top-4 rounded-lg p-1 text-zinc-500 hover:bg-white/10 hover:text-white"
              aria-label="Zamknij"
            >
              <X className="h-5 w-5" />
            </button>
            <h2 id="sos-title" className="pr-10 text-lg font-bold text-white">
              Protokół SOS — incydent krytyczny
            </h2>
            <p className="mt-2 text-sm text-zinc-400">
              Metadane i kategoria.{" "}
              <strong className="text-zinc-300">
                Treść rozmowy nie jest wyświetlana
              </strong>{" "}
              przed Twoją decyzją o zgłoszeniu — zgodnie z RODO i protokołem KGP.
            </p>
            <div className="mt-4 space-y-2 rounded-xl border border-white/10 bg-black/40 p-4 font-mono text-xs text-zinc-400">
              <p>
                <span className="text-zinc-600">Platforma:</span> {item.platform}
              </p>
              <p>
                <span className="text-zinc-600">Czas:</span> {item.time}
              </p>
              <p>
                <span className="text-zinc-600">Kategoria:</span> {item.category}
              </p>
              <p>
                <span className="text-zinc-600">Identyfikator (lokalny):</span>{" "}
                {item.accountHint}
              </p>
            </div>

            {reportStep === "idle" && (
              <button
                type="button"
                onClick={onGenerate}
                className="mt-5 w-full rounded-xl border border-red-500/50 bg-red-600/90 py-3 text-sm font-semibold text-white shadow-[0_0_28px_rgba(239,68,68,0.3)] transition hover:bg-red-600"
              >
                Generuj raport dla Policji (KGP)
              </button>
            )}

            {reportStep !== "idle" && reportStep !== "ready" && (
              <div className="mt-5 space-y-3">
                <p className="text-center text-sm text-zinc-400">
                  {reportStep === "preparing"
                    ? "Przygotowywanie pakietu metadanych…"
                    : "Formatowanie pliku zgodnego z wymaganiami KGP…"}
                </p>
                <div className="h-2 overflow-hidden rounded-full bg-zinc-800">
                  <motion.div
                    className="h-full bg-gradient-to-r from-red-600 to-amber-500"
                    initial={{ width: "0%" }}
                    animate={{
                      width: reportStep === "preparing" ? "45%" : "100%",
                    }}
                    transition={{ duration: reportStep === "preparing" ? 0.8 : 1 }}
                  />
                </div>
              </div>
            )}

            {reportStep === "ready" && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-5 space-y-3"
              >
                <div className="flex items-center gap-2 text-emerald-400">
                  <FileText className="h-5 w-5" />
                  <span className="text-sm font-semibold">
                    Plik gotowy (symulacja)
                  </span>
                </div>
                <pre
                  className="max-h-40 overflow-auto rounded-lg border border-white/10 bg-black/50 p-3 text-[11px] leading-relaxed text-zinc-400"
                  tabIndex={0}
                >
                  {`VIGIL_INCIDENT_REPORT_KGP.txt (metadane)
────────────────────────────
Źródło: ${item.platform}
Znacznik czasu: ${item.time}
Kategoria: ${item.category}
Powiązanie: ${item.accountHint}
────────────────────────────
UWAGA: Transkrypcja incydentu zabezpieczona lokalnie na urządzeniu.
Vigil nie przesyła danych automatycznie — decyzja o wysłaniu należy do rodzica.`}
                </pre>
                <p className="text-xs text-zinc-500">
                  W produkcji: eksport PDF/TXT jednym kliknięciem. Tu: podgląd
                  wyłącznie metadanych — bez treści czatu.
                </p>
                <button
                  type="button"
                  onClick={onClose}
                  className="w-full rounded-xl bg-zinc-800 py-2.5 text-sm font-medium text-white hover:bg-zinc-700"
                >
                  Zamknij
                </button>
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function ParentShell({
  ageBand,
  section,
  onSection,
  safetyScore,
  onBumpScore,
  expandedId,
  onToggleVault,
  onOpenCritical,
  onSimulateSextortion,
}: {
  ageBand: AgeBand
  section: ParentSection
  onSection: (s: ParentSection) => void
  safetyScore: number
  onBumpScore: (d: number) => void
  expandedId: string | null
  onToggleVault: (id: string) => void
  onOpenCritical: (item: VaultItem) => void
  onSimulateSextortion: () => void
}) {
  const nav: { id: ParentSection; label: string; Icon: typeof LayoutDashboard }[] =
    [
      { id: "summary", label: "Podsumowanie", Icon: LayoutDashboard },
      { id: "vault", label: "Skarbiec dowodów", Icon: Shield },
      { id: "locks", label: "Ustawienia blokad", Icon: Lock },
      { id: "family", label: "Moja rodzina", Icon: Users },
    ]

  return (
    <div className="flex min-h-[100dvh] flex-col pt-28 md:flex-row md:pt-24">
      <aside className="border-b border-white/10 bg-zinc-950/60 px-4 py-4 backdrop-blur-md md:w-56 md:border-b-0 md:border-r md:px-3">
        <div className="mb-6 hidden px-2 md:block">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-500">
            VIGIL 3.0
          </p>
          <p className="mt-1 text-sm font-semibold text-white">
            The Intelligent Safety Shield
          </p>
        </div>
        <nav className="flex gap-2 overflow-x-auto pb-1 md:flex-col md:overflow-visible md:pb-0">
          {nav.map(({ id, label, Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => onSection(id)}
              className={`flex shrink-0 items-center gap-2 rounded-xl px-3 py-2.5 text-left text-sm transition md:w-full ${
                section === id
                  ? "bg-white/10 text-white"
                  : "text-zinc-400 hover:bg-white/5 hover:text-zinc-200"
              }`}
            >
              <Icon className="h-4 w-4 shrink-0" />
              <span className="whitespace-nowrap">{label}</span>
            </button>
          ))}
        </nav>
      </aside>

      <div className="flex min-h-0 flex-1 flex-col">
        <main className="flex-1 overflow-y-auto px-4 pb-36 pt-6 md:px-8">
          <div className="mx-auto max-w-4xl">
            <div className="mb-4 flex flex-wrap items-center gap-3">
              <ZeroCloudBadge />
            </div>
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-white md:text-3xl">
                  {section === "summary" && "Podsumowanie ochrony"}
                  {section === "vault" && "Skarbiec dowodów (Evidence Vault)"}
                  {section === "locks" && "Ustawienia blokad (Hard Lock)"}
                  {section === "family" && "Moja rodzina"}
                </h1>
                <p className="mt-1 text-sm text-zinc-500">
                  Analiza wzorców — polityka bez cytatów (No-Quotation)
                </p>
                {ageBand === "senior16" && (
                  <p className="mt-2 rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-xs text-amber-200/90">
                    Tryb Senior Teen 16+: ograniczone raportowanie — poniżej
                    uproszczony zakres danych zgodnie z dokumentacją produktu.
                  </p>
                )}
              </div>
              <button
                type="button"
                onClick={onSimulateSextortion}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-500/50 bg-red-600/80 px-4 py-2.5 text-sm font-semibold text-white shadow-[0_0_24px_rgba(239,68,68,0.25)] transition hover:bg-red-600"
              >
                TEST: Symuluj zagrożenie (Sextortion)
              </button>
            </div>

            {section === "summary" && (
              <SummaryPanel
                ageBand={ageBand}
                safetyScore={safetyScore}
                onBumpScore={onBumpScore}
              />
            )}
            {section === "vault" && (
              <VaultPanel
                ageBand={ageBand}
                expandedId={expandedId}
                onToggle={onToggleVault}
                onOpenCritical={onOpenCritical}
              />
            )}
            {section === "locks" && <LocksPanel />}
            {section === "family" && <FamilyPanel ageBand={ageBand} />}
          </div>
        </main>

        <footer className="fixed bottom-0 left-0 right-0 z-30 border-t border-white/10 bg-[#050505]/95 px-4 py-3 backdrop-blur-md md:left-56">
          <div className="mx-auto flex max-w-4xl flex-col items-start gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2">
              <CloudOff className="h-4 w-4 text-sky-400" />
              <span className="text-xs font-semibold uppercase tracking-wide text-sky-300">
                Zero Cloud Policy
              </span>
            </div>
            <p className="text-xs text-zinc-500">
              Analiza na urządzeniu — żadna treść rozmowy nie opuszcza telefonu ani
              komputera dziecka.
            </p>
          </div>
        </footer>
      </div>
    </div>
  )
}

function SummaryPanel({
  ageBand,
  safetyScore,
  onBumpScore,
}: {
  ageBand: AgeBand
  safetyScore: number
  onBumpScore: (d: number) => void
}) {
  return (
    <div className="space-y-8">
      {ageBand === "senior16" && (
        <div className={`${cardBase} border-amber-500/20 p-6`}>
          <h2 className="text-sm font-semibold uppercase tracking-wider text-amber-200/90">
            Senior Teen — uproszczony podgląd
          </h2>
          <p className="mt-3 text-3xl font-bold text-white">
            Czy wystąpiło zagrożenie?{" "}
            <span className="text-amber-400">Tak</span>
          </p>
          <p className="mt-2 text-sm text-zinc-400">
            Kategoria (bez cytatów):{" "}
            <strong className="text-zinc-200">Off-platforming</strong> — ostatnia
            detekcja behawioralna.
          </p>
          <p className="mt-3 text-xs text-zinc-600">
            Powyżej 16 r. rodzic widzi wyłącznie informację tak/nie oraz kategorię
            zdarzenia — bez szczegółowego feedu jak w profilu poniżej 16 lat.
          </p>
        </div>
      )}

      {ageBand === "under16" && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className={`relative overflow-hidden ${cardBase} p-8`}
        >
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-20%,rgba(59,130,246,0.2),transparent)]" />
          <div className="relative flex flex-col items-center text-center">
            <p className="text-sm font-medium text-zinc-400">
              Wskaźnik bezpieczeństwa (skala 1–10)
            </p>
            <motion.p
              key={safetyScore}
              initial={{ scale: 0.92, opacity: 0.7 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              className="mt-2 text-6xl font-bold tabular-nums text-white md:text-7xl"
              style={{
                textShadow:
                  "0 0 40px rgba(59,130,246,0.45), 0 0 80px rgba(59,130,246,0.15)",
              }}
            >
              {safetyScore}
              <span className="text-3xl font-semibold text-zinc-500 md:text-4xl">
                /10
              </span>
            </motion.p>
            <div className="mt-4 flex items-center gap-2">
              <button
                type="button"
                onClick={() => onBumpScore(-1)}
                className="rounded-lg border border-white/10 bg-white/5 p-2 hover:bg-white/10"
                aria-label="Zmniejsz wskaźnik"
              >
                <Minus className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => onBumpScore(1)}
                className="rounded-lg border border-white/10 bg-white/5 p-2 hover:bg-white/10"
                aria-label="Zwiększ wskaźnik"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
            <p className="mt-4 max-w-md text-sm text-zinc-400">
              Raport tygodniowy: wskaźnik + liczba zablokowanych zagrożeń — bez
              cytatów i bez wglądu w prywatne rozmowy.
            </p>
          </div>
        </motion.div>
      )}

      {ageBand === "under16" && (
        <div>
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-500">
              Status monitorowania
            </h2>
            <span className="inline-flex items-center gap-1 rounded-full border border-violet-500/30 bg-violet-500/10 px-2.5 py-0.5 text-[10px] font-medium text-violet-200">
              <Cpu className="h-3 w-3" />
              {PHI_LABEL}
            </span>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            {PLATFORMS.map(({ name, Icon }, i) => (
              <motion.div
                key={name}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                className={`flex flex-col gap-3 ${cardBase} p-4`}
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.12)]">
                    <Icon className="h-6 w-6" strokeWidth={1.5} />
                  </div>
                  <div className="ml-auto h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]" />
                </div>
                <p className="font-semibold text-white">{name}</p>
                <p className="text-[11px] leading-snug text-zinc-500">{PHI_LABEL}</p>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {ageBand === "under16" && (
        <div className={`${cardBase} p-5`}>
          <h3 className="flex items-center gap-2 text-sm font-semibold text-white">
            <Sparkles className="h-4 w-4 text-amber-400" />
            Ostatnie detekcje (tylko kategorie)
          </h3>
          <ul className="mt-3 space-y-2 text-sm text-zinc-400">
            {PATTERN_FEED.map((line) => (
              <li key={line}>• {line}</li>
            ))}
          </ul>
          <p className="mt-3 text-xs text-zinc-600">
            Brak cytatów z czatu — wyłącznie etykiety wzorców behawioralnych.
          </p>
        </div>
      )}
    </div>
  )
}

function VaultPanel({
  ageBand,
  expandedId,
  onToggle,
  onOpenCritical,
}: {
  ageBand: AgeBand
  expandedId: string | null
  onToggle: (id: string) => void
  onOpenCritical: (item: VaultItem) => void
}) {
  if (ageBand === "senior16") {
    return (
      <div className={`space-y-4 ${cardBase} p-6`}>
        <h3 className="font-semibold text-white">Skarbiec — widok ograniczony</h3>
        <p className="text-sm text-zinc-400">
          W trybie 16+ widzisz skrót: czy incydent wystąpił oraz{" "}
          <strong className="text-zinc-300">kategorię</strong>, bez pełnej listy
          metadanych jak w profilu poniżej 16 lat.
        </p>
        <div className="rounded-xl border border-white/10 bg-black/30 p-4">
          <p className="text-sm text-zinc-300">
            Ostatnia kategoria: <strong>Off-platforming</strong>
          </p>
          <p className="mt-1 text-xs text-zinc-600">
            Pełny Evidence Vault z protokołem SOS dostępny w planie rodzinnym dla
            profilu &lt;16 (demo).
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-zinc-400">
        Kliknij wiersz <strong className="text-zinc-300">krytyczny</strong>, aby
        otworzyć modal SOS z generowaniem raportu KGP. Inne poziomy: rozwinięcie
        metadanych (bez treści wiadomości).
      </p>
      <ul className="space-y-3">
        {VAULT_ITEMS.map((item) => {
          const open = expandedId === item.id
          const isCritical = item.severity === "krytyczne"
          return (
            <li key={item.id} className={`overflow-hidden ${cardBase}`}>
              <button
                type="button"
                onClick={() => {
                  if (isCritical) onOpenCritical(item)
                  else onToggle(item.id)
                }}
                className="flex w-full items-center gap-3 p-4 text-left transition hover:bg-white/[0.04]"
              >
                <span
                  className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase ${severityStyles(item.severity)}`}
                >
                  {severityLabel(item.severity)}
                </span>
                <span className="flex-1 font-medium text-zinc-200">
                  {item.title}
                </span>
                {isCritical ? (
                  <span className="text-xs text-sky-400">Otwórz SOS →</span>
                ) : open ? (
                  <ChevronDown className="h-5 w-5 text-zinc-500" />
                ) : (
                  <ChevronRight className="h-5 w-5 text-zinc-500" />
                )}
              </button>
              {!isCritical && (
                <AnimatePresence initial={false}>
                  {open && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="overflow-hidden border-t border-white/10"
                    >
                      <div className="space-y-3 p-4 pt-2">
                        <div className="grid gap-2 text-xs sm:grid-cols-2">
                          <div className="rounded-lg bg-black/40 px-3 py-2 font-mono text-zinc-400">
                            <span className="text-zinc-600">Platforma</span>
                            <br />
                            {item.platform}
                          </div>
                          <div className="rounded-lg bg-black/40 px-3 py-2 font-mono text-zinc-400">
                            <span className="text-zinc-600">Czas</span>
                            <br />
                            {item.time}
                          </div>
                          <div className="rounded-lg bg-black/40 px-3 py-2 font-mono text-zinc-400 sm:col-span-2">
                            <span className="text-zinc-600">Kategoria</span>
                            <br />
                            {item.category}
                          </div>
                        </div>
                        <p className="text-xs text-zinc-600">
                          Treść rozmowy nie jest pokazywana.
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              )}
            </li>
          )
        })}
      </ul>
    </div>
  )
}

function LocksPanel() {
  return (
    <div className={`space-y-4 ${cardBase} p-6`}>
      <div className="flex items-start gap-3">
        <Lock className="mt-1 h-5 w-5 text-amber-400" />
        <div>
          <h3 className="font-semibold text-white">Hard Lock</h3>
          <p className="mt-2 text-sm leading-relaxed text-zinc-400">
            Przy bezpośrednim zagrożeniu Vigil blokuje dostęp do aplikacji.
            Odblokowanie wymaga weryfikacji w Vigil Parent — widzisz{" "}
            <strong className="text-zinc-300">kategorię zagrożenia</strong>, nie
            cytat rozmowy.
          </p>
        </div>
      </div>
      <div className="rounded-xl border border-dashed border-white/10 p-4 text-center text-sm text-zinc-500">
        Reguły czasowe i lista aplikacji — w wersji produkcyjnej
      </div>
    </div>
  )
}

function FamilyPanel({ ageBand }: { ageBand: AgeBand }) {
  return (
    <div className={`${cardBase} p-6`}>
      <h3 className="font-semibold text-white">Profil chroniony</h3>
      <p className="mt-2 text-sm text-zinc-400">
        {ageBand === "under16"
          ? "Poniżej 16 r.: obowiązkowy e-mail rodzica. Raporty bez treści rozmów — tylko wskaźnik i liczba incydentów."
          : "Senior Teen 16+: większa autonomia, ograniczone raportowanie do rodzica (tak/nie + kategoria)."}
      </p>
      <div className="mt-4 flex items-center gap-3 rounded-xl border border-white/10 bg-black/30 p-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500/20 text-sm font-bold text-blue-300">
          M
        </div>
        <div>
          <p className="font-medium text-white">Mateusz</p>
          <p className="text-xs text-zinc-500">
            Urządzenie: online · Zero Cloud · On-Device Intelligence
          </p>
        </div>
      </div>
    </div>
  )
}

function TeenShield({
  hardLock,
  lockReason,
  onDismissLock,
  onSimulateSextortion,
}: {
  hardLock: boolean
  lockReason: LockReason
  onDismissLock: () => void
  onSimulateSextortion: () => void
}) {
  const lockCopy =
    lockReason === "sextortion"
      ? "Wykryto wzorzec: sextortion (szantaż intymnymi materiałami). Kategoria bez cytatu treści."
      : "Wykryto wzorzec krytyczny behawioralnie. Szczegóły kategorii przekazane rodzicowi jako metadane — nie cytat czatu."

  return (
    <div className="relative flex min-h-[100dvh] items-center justify-center px-4 pb-28 pt-32">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_30%,rgba(16,185,129,0.08),transparent_50%)]" />

      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="relative z-10 flex max-w-sm flex-col items-center text-center"
      >
        <motion.div
          className="mb-6 flex h-24 w-24 items-center justify-center rounded-full border border-emerald-500/40 bg-emerald-500/10 shadow-[0_0_40px_rgba(16,185,129,0.25)]"
          animate={{
            boxShadow: [
              "0 0 40px rgba(16,185,129,0.2)",
              "0 0 56px rgba(16,185,129,0.35)",
              "0 0 40px rgba(16,185,129,0.2)",
            ],
          }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          <ShieldCheck className="h-12 w-12 text-emerald-400" strokeWidth={1.25} />
        </motion.div>
        <h2 className="text-xl font-semibold text-white">Tryb dyskretny</h2>
        <p className="mt-2 text-sm leading-relaxed text-zinc-500">
          Vigil chroni prywatność — analiza wzorców na urządzeniu (Zero Cloud).
          Rodzic nie otrzymuje cytatów z rozmów.
        </p>
        <button
          type="button"
          onClick={onSimulateSextortion}
          className="mt-8 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-medium text-zinc-400 backdrop-blur-md hover:bg-white/10 hover:text-zinc-200"
        >
          TEST: Symuluj zagrożenie (Sextortion)
        </button>
      </motion.div>

      <AnimatePresence>
        {hardLock && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-red-950/90 p-6 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className={`max-w-md ${cardBase} border-red-500/50 p-8 text-center shadow-[0_0_48px_rgba(239,68,68,0.35)]`}
            >
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-500/20">
                <AlertTriangle className="h-8 w-8 text-red-400" />
              </div>
              <h3 className="text-xl font-bold tracking-tight text-white">
                Aplikacja zablokowana — interwencja Vigil
              </h3>
              <p className="mt-3 text-sm text-zinc-400">{lockCopy}</p>
              <p className="mt-2 text-xs text-zinc-600">
                Rodzic otrzymał Instant Alert. Odblokowanie po weryfikacji w Vigil
                Parent.
              </p>
              <button
                type="button"
                onClick={onDismissLock}
                className="mt-6 w-full rounded-xl bg-zinc-800 py-3 text-sm font-medium text-white hover:bg-zinc-700"
              >
                Zamknij (demo)
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
