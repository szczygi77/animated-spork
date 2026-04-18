import { AnimatePresence, motion } from "framer-motion"
import {
  AlertTriangle,
  Award,
  Bell,
  Box,
  ChevronDown,
  ChevronRight,
  CloudOff,
  Cpu,
  FileText,
  AtSign,
  Gamepad2,
  LayoutDashboard,
  Laptop,
  Lock,
  MessageCircle,
  MessagesSquare,
  MessageSquare,
  Radio,
  Send,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Tablet,
  Unlock,
  Users,
  Video,
  X,
  type LucideIcon,
} from "lucide-react"
import { useCallback, useEffect, useMemo, useState } from "react"

type ParentSection = "summary" | "vault" | "locks" | "family" | "certified"
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
  {
    id: "4",
    title: "Presja na prywatne DM — Instagram",
    severity: "średnie",
    platform: "Instagram",
    time: "2026-04-17 · 11:28",
    category: "Grooming (heurystyka)",
    patterns: ["Prośba o przejście na „priv”", "Eskalacja intymności w DM"],
    accountHint: "Metadane konta · bez treści wiadomości",
  },
  {
    id: "5",
    title: "SMS z linkiem — wiadomość systemowa",
    severity: "niskie",
    platform: "SMS / RCS",
    time: "2026-04-11 · 08:03",
    category: "Scam i phishing",
    patterns: ["Link skrócony z nieznanego numeru", "Podszywanie pod operatora"],
    accountHint: "Numer znormalizowany lokalnie",
  },
]

const PLATFORMS = [
  { name: "Discord", Icon: MessageSquare },
  { name: "Instagram", Icon: AtSign },
  { name: "SMS / RCS", Icon: MessagesSquare },
  { name: "Steam", Icon: Radio },
  { name: "TikTok", Icon: Video },
] as const

const PHI_LABEL = "Analiza behawioralna (Phi-3 Mini)"

const PATTERN_FEED = [
  "Wykryto wzorzec: Off-platforming",
  "Wykryto wzorzec: Słodka tajemnica (grooming)",
  "Wykryto wzorzec: Scam / phishing",
  "Wykryto wzorzec: Instagram — presja na prywatne DM (zablokowano)",
  "Wykryto wzorzec: Podejrzany SMS z linkiem (zablokowano)",
] as const

/** Demo: wynik z analizy behawioralnej (bez interakcji użytkownika). */
function computeBehavioralSafetyScore(): number {
  const patternSignals = PATTERN_FEED.length
  const criticalIncidents = VAULT_ITEMS.filter(
    (v) => v.severity === "krytyczne",
  ).length
  const raw = 9.2 - patternSignals * 0.1 - criticalIncidents * 0.2
  return Math.round(Math.min(10, Math.max(1, raw)) * 10) / 10
}

type CertifiedApp = {
  id: string
  name: string
  status: string
  description: string
  lastAudit: string
  Icon: LucideIcon
  badgeTone: "gold" | "sky"
}

const CERTIFIED_APPS: CertifiedApp[] = [
  {
    id: "roblox",
    name: "Roblox (Vigil Edition)",
    status: "Zintegrowano z Vigil SDK",
    description: "Pełna zgodność z protokołem ochrony behawioralnej",
    lastAudit: "2026-04-01",
    Icon: Gamepad2,
    badgeTone: "gold",
  },
  {
    id: "discord",
    name: "Discord (Safe-Plugin)",
    status: "Zintegrowano z Vigil SDK",
    description: "Weryfikacja wzorców groomingowych aktywna",
    lastAudit: "2026-03-22",
    Icon: MessageSquare,
    badgeTone: "sky",
  },
  {
    id: "minecraft",
    name: "Minecraft (Education Shield)",
    status: "Zintegrowano z Vigil SDK",
    description: "Ochrona on-device włączona",
    lastAudit: "2026-03-15",
    Icon: Box,
    badgeTone: "gold",
  },
  {
    id: "instagram",
    name: "Instagram (Safe DM)",
    status: "Zintegrowano z Vigil SDK",
    description: "Filtr DM i komentarzy — wykrywanie groomingowych schematów",
    lastAudit: "2026-03-28",
    Icon: AtSign,
    badgeTone: "sky",
  },
  {
    id: "sms",
    name: "SMS / RCS (Mobile Shield)",
    status: "Zintegrowano z Vigil SDK",
    description: "Analiza nadawcy i linków w wiadomościach systemowych",
    lastAudit: "2026-03-26",
    Icon: MessagesSquare,
    badgeTone: "gold",
  },
]

const cardBase =
  "rounded-2xl border border-white/10 bg-zinc-900/50 backdrop-blur-sm"

const TEEN_SCAN_ITEMS: {
  id: string
  label: string
  time: string
  Icon: LucideIcon
}[] = [
  { id: "discord", label: "Discord", time: "Dziś, 14:02", Icon: MessageSquare },
  { id: "instagram", label: "Instagram", time: "Dziś, 13:48", Icon: AtSign },
  { id: "sms", label: "SMS / RCS", time: "Dziś, 12:10", Icon: MessagesSquare },
  { id: "roblox", label: "Roblox", time: "Dziś, 13:40", Icon: Gamepad2 },
  {
    id: "messenger",
    label: "Messenger",
    time: "Wczoraj, 21:15",
    Icon: MessageCircle,
  },
]

const teenCardBase =
  "rounded-2xl border border-blue-500/20 bg-zinc-950/70 backdrop-blur-sm"

const PROTECTED_DEVICES: {
  id: string
  label: string
  Icon: typeof Laptop
}[] = [
  { id: "pc", label: "PC", Icon: Laptop },
  { id: "phone", label: "Smartfon", Icon: Smartphone },
  { id: "tablet", label: "Tablet", Icon: Tablet },
]

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
  const behavioralSafetyScore = useMemo(() => computeBehavioralSafetyScore(), [])
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [hardLock, setHardLock] = useState(false)
  const [lockReason, setLockReason] = useState<LockReason>("offplatform")
  const [parentToast, setParentToast] = useState(false)
  const [toastSextortion, setToastSextortion] = useState(false)
  const [showInstantAlert, setShowInstantAlert] = useState(false)
  const [vaultModalItem, setVaultModalItem] = useState<VaultItem | null>(null)
  const [reportStep, setReportStep] = useState<ReportStep>("idle")

  const simulateSextortion = useCallback(() => {
    setLockReason("sextortion")
    setHardLock(true)
    setParentToast(true)
    setToastSextortion(true)
    setShowInstantAlert(true)
  }, [])

  const dismissLock = useCallback(() => {
    setHardLock(false)
  }, [])

  const dismissToast = useCallback(() => {
    setParentToast(false)
    setToastSextortion(false)
  }, [])

  const dismissInstantAlert = useCallback(() => {
    setShowInstantAlert(false)
  }, [])

  const unlockFromInstantAlert = useCallback(() => {
    setHardLock(false)
    setParentToast(false)
    setToastSextortion(false)
    setShowInstantAlert(false)
  }, [])

  const generateSosFromInstantAlert = useCallback(() => {
    setSection("vault")
    setVaultModalItem(VAULT_ITEMS[0] ?? null)
    setReportStep("idle")
    setShowInstantAlert(false)
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
                    ? "VIGIL wykrył krytyczne zagrożenie (Grooming) w aplikacji Discord / Instagram. Hard Lock aktywny na urządzeniu."
                    : "Wykryto krytyczne zagrożenie behawioralne (m.in. SMS / Instagram). Hard Lock aktywny na urządzeniu dziecka — bez ujawniania treści wiadomości."}
                </p>
                <div className="mt-3 flex items-center gap-3 text-xs font-medium">
                  <button
                    type="button"
                    onClick={dismissToast}
                    className="text-red-300 underline"
                  >
                    Zamknij
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowInstantAlert(true)}
                    className="text-red-200 underline"
                  >
                    Otwórz alert
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <InstantAlertModal
        open={showInstantAlert && mode === "parent"}
        onClose={dismissInstantAlert}
        onUnlock={unlockFromInstantAlert}
        onGenerateSos={generateSosFromInstantAlert}
      />

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
          behavioralSafetyScore={behavioralSafetyScore}
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

const VIGIL_LOGO_SRC = `${import.meta.env.BASE_URL}vigil-logo.png`.replace(
  /\/{2,}/g,
  "/",
)

/** Logo PNG z jasnym tłem: `plate` — „szklana” płytka; `glow` — wersja na ciemne tło (filtr). */
function VigilLogoMark({
  variant = "plate",
  className = "",
}: {
  variant?: "plate" | "glow"
  className?: string
}) {
  if (variant === "glow") {
    return (
      <img
        src={VIGIL_LOGO_SRC}
        alt="Vigil"
        width={180}
        height={48}
        className={`h-8 w-auto max-w-[min(100%,200px)] object-contain brightness-0 invert hue-rotate-[195deg] saturate-125 opacity-95 drop-shadow-[0_0_14px_rgba(56,189,248,0.45)] ${className}`}
      />
    )
  }
  return (
    <div
      className={`inline-flex items-center justify-center rounded-2xl border border-white/25 bg-gradient-to-b from-zinc-50 to-zinc-200/95 p-2.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.85),0_10px_32px_rgba(0,0,0,0.45)] ring-1 ring-black/10 ${className}`}
    >
      <img
        src={VIGIL_LOGO_SRC}
        alt="Vigil"
        width={220}
        height={56}
        className="h-10 w-auto max-w-[min(100%,220px)] object-contain md:h-11"
      />
    </div>
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
            {reportStep === "idle" ? (
              <>
                <p className="mt-2 text-sm leading-relaxed text-zinc-400">
                  <strong className="text-zinc-300">
                    Transkrypcje i treść rozmów nie są widoczne w panelu rodzica.
                  </strong>{" "}
                  Szczegółowe metadane incydentu (platforma, czas, kategoria,
                  identyfikator) zostaną ujawnione dopiero po uruchomieniu
                  oficjalnej ścieżki eksportu — zgodnie z RODO i protokołem KGP.
                </p>
                <p className="mt-3 rounded-xl border border-white/10 bg-black/30 p-3 text-xs text-zinc-500">
                  Incydent krytyczny zweryfikowany lokalnie na urządzeniu (Zero
                  Cloud). Jedyna świadoma droga ujawnienia danych do celów
                  zgłoszeniowych to przycisk poniżej.
                </p>
                <button
                  type="button"
                  onClick={onGenerate}
                  className="mt-5 w-full rounded-xl border border-red-500/50 bg-red-600/90 py-3 text-sm font-semibold text-white shadow-[0_0_28px_rgba(239,68,68,0.3)] transition hover:bg-red-600"
                >
                  Generuj raport dla Policji (KGP)
                </button>
              </>
            ) : null}

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
                <div className="space-y-2 rounded-xl border border-white/10 bg-black/40 p-4 font-mono text-xs text-zinc-400">
                  <p>
                    <span className="text-zinc-600">Platforma:</span>{" "}
                    {item.platform}
                  </p>
                  <p>
                    <span className="text-zinc-600">Czas:</span> {item.time}
                  </p>
                  <p>
                    <span className="text-zinc-600">Kategoria:</span>{" "}
                    {item.category}
                  </p>
                  <p>
                    <span className="text-zinc-600">Identyfikator (lokalny):</span>{" "}
                    {item.accountHint}
                  </p>
                </div>
                <p className="text-xs text-zinc-500">
                  Transkrypcja i treść wiadomości{" "}
                  <strong className="text-zinc-400">nie są</strong> częścią tego
                  podglądu — pozostają zaszyte lokalnie do formalnej ścieżki
                  przekazania organom.
                </p>
                <div className="rounded-xl border border-sky-500/25 bg-sky-500/5 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-sky-300">
                    Podgląd raportu PDF (symulacja)
                  </p>
                  <p className="mt-2 text-xs text-zinc-400">
                    Sygnatura czasowa: {item.time}
                  </p>
                  <p className="mt-1 text-xs text-zinc-400">
                    Id sprawcy (zaszyfrowany): VIGIL-HASH-9F2A-77C1
                  </p>
                  <p className="mt-2 text-xs text-zinc-500">
                    Fragment transkrypcji (wyłącznie ryzykowny):
                  </p>
                  <p className="mt-1 rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-xs text-zinc-300">
                    "...przenieśmy rozmowę na WhatsApp i wyślij prywatne zdjęcie..."
                  </p>
                </div>
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
                <button
                  type="button"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-sky-500/35 bg-sky-500/10 py-2.5 text-sm font-semibold text-sky-100 hover:bg-sky-500/15"
                >
                  <Send className="h-4 w-4" />
                  Wyślij do CERT Polska / Policja
                </button>
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

function InstantAlertModal({
  open,
  onClose,
  onUnlock,
  onGenerateSos,
}: {
  open: boolean
  onClose: () => void
  onUnlock: () => void
  onGenerateSos: () => void
}) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[70] flex items-center justify-center bg-black/80 p-4 backdrop-blur-md"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.98, opacity: 0 }}
            className="w-full max-w-2xl rounded-2xl border border-red-500/40 bg-zinc-900/50 p-6 backdrop-blur-sm"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="rounded-xl border border-red-500/40 bg-red-500/15 p-2">
                  <ShieldAlert className="h-5 w-5 text-red-300" />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-red-300">
                    Instant Alert
                  </p>
                  <h3 className="mt-1 text-lg font-bold text-white">
                    Decyzja w sekundę
                  </h3>
                </div>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg p-1 text-zinc-500 hover:bg-white/10 hover:text-white"
                aria-label="Zamknij"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-5 space-y-4">
              <div className="rounded-xl border border-red-500/35 bg-red-500/10 p-4">
                <p className="text-sm font-semibold text-red-100">
                  Powiadomienie push
                </p>
                <p className="mt-1 text-sm text-red-200/90">
                  VIGIL wykrył krytyczne zagrożenie (Grooming) w aplikacji
                  Discord / Instagram.
                </p>
              </div>

              <div className="rounded-xl border border-white/10 bg-black/30 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
                  Analiza behawioralna
                </p>
                <p className="mt-2 text-sm text-zinc-300">
                  Użytkownik X próbuje wyłudzić zdjęcia w DM na Instagramie i
                  przenieść rozmowę na WhatsApp; równolegle pojawił się SMS z
                  linkiem z nieznanego numeru. Wykryto eskalację intymności i
                  off-platforming.
                </p>
              </div>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={onUnlock}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-amber-400/40 bg-amber-500/15 py-3 text-sm font-semibold text-amber-100 hover:bg-amber-500/20"
              >
                <Unlock className="h-4 w-4" />
                Odblokuj
              </button>
              <button
                type="button"
                onClick={onGenerateSos}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-500/45 bg-red-600/85 py-3 text-sm font-semibold text-white hover:bg-red-600"
              >
                <FileText className="h-4 w-4" />
                Generuj Raport SOS
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function VigilSafeBadge({ tone }: { tone: "gold" | "sky" }) {
  const toneCls =
    tone === "gold"
      ? "border-amber-400/35 bg-amber-500/10 text-amber-100"
      : "border-sky-400/35 bg-sky-500/10 text-sky-100"
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${toneCls}`}
    >
      <ShieldCheck className="h-3 w-3 shrink-0" strokeWidth={2} />
      Vigil Safe
    </span>
  )
}

function CertifiedAppsPanel() {
  return (
    <div className="space-y-6">
      <div className={`${cardBase} border-blue-500/15 p-6`}>
        <h2 className="text-sm font-semibold uppercase tracking-wider text-sky-200/90">
          Vigil Safe — certyfikowane ekosystemy
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-zinc-400">
          Te aplikacje posiadają wbudowany silnik Vigil. Gwarantują najwyższy
          standard ochrony bez utraty wydajności i są w pełni zgodne z
          architekturą Zero Cloud.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-zinc-500">
          Dzięki integracji SDK nastolatek może swobodnie korzystać z tych
          przestrzeni przy zachowaniu pełnej dyskrecji — analiza behawioralna
          odbywa się lokalnie, a rodzic otrzymuje wyłącznie agregaty i sygnały
          zgodne z polityką produktu.
        </p>
      </div>

      <ul className="space-y-4">
        {CERTIFIED_APPS.map((app, i) => (
          <motion.li
            key={app.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            className="rounded-2xl border border-blue-500/20 bg-zinc-900/50 p-5 backdrop-blur-sm"
          >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl border border-blue-500/25 bg-blue-500/5 text-blue-300">
                  <app.Icon className="h-7 w-7" strokeWidth={1.5} />
                </div>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-semibold text-white">{app.name}</h3>
                    <VigilSafeBadge tone={app.badgeTone} />
                  </div>
                  <p className="mt-1 text-sm text-zinc-400">{app.description}</p>
                  <p className="mt-2 text-xs font-medium text-emerald-300/90">
                    {app.status}
                  </p>
                </div>
              </div>
              <div className="shrink-0 text-left sm:text-right">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-600">
                  Ostatni audyt
                </p>
                <p className="mt-0.5 font-mono text-sm text-zinc-300">
                  {app.lastAudit}
                </p>
              </div>
            </div>
          </motion.li>
        ))}
      </ul>
    </div>
  )
}

function ParentShell({
  ageBand,
  section,
  onSection,
  behavioralSafetyScore,
  expandedId,
  onToggleVault,
  onOpenCritical,
  onSimulateSextortion,
}: {
  ageBand: AgeBand
  section: ParentSection
  onSection: (s: ParentSection) => void
  behavioralSafetyScore: number
  expandedId: string | null
  onToggleVault: (id: string) => void
  onOpenCritical: (item: VaultItem) => void
  onSimulateSextortion: () => void
}) {
  const nav: { id: ParentSection; label: string; Icon: typeof LayoutDashboard }[] =
    [
      { id: "summary", label: "Podsumowanie", Icon: LayoutDashboard },
      { id: "vault", label: "Skarbiec dowodów", Icon: Shield },
      { id: "certified", label: "Certyfikowane", Icon: Award },
      { id: "locks", label: "Ustawienia blokad", Icon: Lock },
      { id: "family", label: "Moja rodzina", Icon: Users },
    ]

  return (
    <div className="flex min-h-[100dvh] flex-col pt-28 md:flex-row md:pt-24">
      <aside className="border-b border-white/10 bg-zinc-950/60 px-4 py-4 backdrop-blur-md md:w-56 md:border-b-0 md:border-r md:px-3">
        <div className="mb-6 hidden px-2 md:block">
          <div className="mb-3 flex justify-center">
            <VigilLogoMark variant="plate" className="w-full max-w-[11rem]" />
          </div>
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
                  {section === "certified" &&
                    "Certyfikowane aplikacje (Vigil Safe)"}
                  {section === "locks" && "Ustawienia blokad (Hard Lock)"}
                  {section === "family" && "Moja rodzina"}
                </h1>
                <p className="mt-1 text-sm text-zinc-500">
                  {section === "certified"
                    ? "B2B — zaufane integracje SDK i Zero Cloud"
                    : "Analiza wzorców — polityka bez cytatów (No-Quotation)"}
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
                behavioralSafetyScore={behavioralSafetyScore}
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
            {section === "certified" && <CertifiedAppsPanel />}
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
  behavioralSafetyScore,
}: {
  ageBand: AgeBand
  behavioralSafetyScore: number
}) {
  return (
    <div className="space-y-8">
      <div className={`${cardBase} p-5`}>
        <h3 className="text-sm font-semibold text-white">Chronione urządzenia</h3>
        <p className="mt-1 text-xs text-zinc-500">
          Lokalny silnik LLM aktywny na wszystkich podpiętych urządzeniach.
        </p>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          {PROTECTED_DEVICES.map(({ id, label, Icon }) => (
            <div
              key={id}
              className="rounded-xl border border-white/10 bg-black/30 p-3"
            >
              <div className="flex items-center gap-2">
                <Icon className="h-4 w-4 text-sky-300" />
                <p className="text-sm font-medium text-zinc-200">{label}</p>
              </div>
              <p className="mt-2 text-xs text-emerald-300">Status: Chroniony</p>
              <p className="text-[11px] text-zinc-500">Lokalne LLM aktywne</p>
            </div>
          ))}
        </div>
      </div>

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
              Obiektywny wskaźnik bezpieczeństwa (skala 1–10, tylko odczyt)
            </p>
            <motion.p
              key={`${ageBand}-${behavioralSafetyScore}`}
              initial={{ scale: 0.96, opacity: 0.75 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 380, damping: 28 }}
              className="mt-2 text-6xl font-bold tabular-nums text-white md:text-7xl"
              style={{
                textShadow:
                  "0 0 40px rgba(59,130,246,0.45), 0 0 80px rgba(59,130,246,0.15)",
              }}
            >
              {behavioralSafetyScore.toFixed(1)}
              <span className="text-3xl font-semibold text-zinc-500 md:text-4xl">
                /10
              </span>
            </motion.p>
            <p className="mt-3 max-w-lg text-xs leading-relaxed text-zinc-500">
              Wskaźnik wyliczony lokalnie przez model Phi-3 Mini na podstawie
              ostatnich 7 dni.
            </p>
            <p className="mt-3 max-w-md text-sm text-zinc-400">
              Raport tygodniowy: wskaźnik + liczba zablokowanych zagrożeń — bez
              cytatów i bez wglądu w prywatne rozmowy. Wynik nie podlega ręcznej
              edycji.
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
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
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
          <p className="mt-3 text-xs leading-relaxed text-zinc-600">
            Na smartfonie chronione są także{" "}
            <strong className="text-zinc-400">SMS / RCS</strong> oraz{" "}
            <strong className="text-zinc-400">Instagram</strong> (DM i
            komentarze) — analiza wzorców wyłącznie na urządzeniu, bez treści w
            chmurze.
          </p>
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
        W widoku rodzica <strong className="text-zinc-300">nie ma podglądu
        transkrypcji</strong> ani treści rozmów — zgodnie z RODO i polityką
        No-Quotation. Wiersz <strong className="text-zinc-300">krytyczny</strong>
        : otwiera protokół SOS; szczegółowe metadane incydentu pojawią się dopiero
        po wygenerowaniu raportu dla Policji (KGP). Pozostałe wiersze: rozwinięcie
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
                  <span className="text-xs text-sky-400">
                    Protokół SOS — metadane po KGP →
                  </span>
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
  const [scanState, setScanState] = useState<"safe" | "analyzing" | "alert">(
    "safe",
  )

  useEffect(() => {
    if (hardLock) {
      setScanState("alert")
      return
    }
    setScanState("safe")
    const interval = window.setInterval(() => {
      setScanState("analyzing")
      window.setTimeout(() => setScanState("safe"), 1800)
    }, 7000)
    return () => window.clearInterval(interval)
  }, [hardLock])

  const bentoContainer = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.07, delayChildren: 0.06 },
    },
  }

  const bentoItem = {
    hidden: { opacity: 0, y: 14 },
    show: {
      opacity: 1,
      y: 0,
      transition: { type: "spring" as const, stiffness: 380, damping: 28 },
    },
  }

  return (
    <div className="relative min-h-[100dvh] bg-[#030303] pb-32 pt-28 text-zinc-100">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_90%_50%_at_50%_-10%,rgba(37,99,235,0.12),transparent_55%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_80%_100%,rgba(16,185,129,0.06),transparent_45%)]" />

      <motion.div
        className="relative z-10 mx-auto max-w-lg px-4"
        variants={bentoContainer}
        initial="hidden"
        animate="show"
      >
        <motion.div variants={bentoItem} className="mb-6 text-center">
          <div className="mb-4 flex justify-center">
            <VigilLogoMark variant="plate" />
          </div>
          <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-blue-400/80">
            On-Device AI
          </p>
          <h2 className="mt-1 text-2xl font-bold tracking-tight text-white">
            Twój Vigil
          </h2>
          <p className="mt-1 text-sm text-zinc-500">
            Wszystko dzieje się na Twoim telefonie — m.in. Discord, Instagram,
            SMS — bez wysyłania treści do chmury.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 gap-3">
          <motion.div
            variants={bentoItem}
            className={`col-span-2 ${teenCardBase} p-5`}
          >
            <div className="flex items-start gap-4">
              <div className="relative flex h-20 w-20 shrink-0 items-center justify-center">
                <motion.div
                  className="absolute inset-0 rounded-full border border-blue-500/30"
                  animate={{ scale: [1, 1.35, 1], opacity: [0.5, 0, 0.5] }}
                  transition={{ duration: 2.2, repeat: Infinity, ease: "easeOut" }}
                />
                <motion.div
                  className="absolute inset-1 rounded-full border border-blue-400/25"
                  animate={{ scale: [1, 1.2, 1], opacity: [0.4, 0.15, 0.4] }}
                  transition={{
                    duration: 2.2,
                    repeat: Infinity,
                    ease: "easeOut",
                    delay: 0.35,
                  }}
                />
                <div className="relative flex h-14 w-14 items-center justify-center rounded-full border border-blue-500/40 bg-blue-500/10 shadow-[0_0_28px_rgba(59,130,246,0.35)]">
                  <Shield className="h-7 w-7 text-blue-300" strokeWidth={1.5} />
                </div>
              </div>
              <div className="min-w-0 flex-1 pt-0.5">
                <h3 className="text-sm font-semibold uppercase tracking-wide text-blue-200/90">
                  Status ochrony
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-zinc-300">
                  Vigil AI aktywnie analizuje wzorce lokalnie.
                </p>
                <p className="mt-2 inline-flex items-center gap-1.5 text-xs font-medium text-emerald-400/90">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
                  </span>
                  Skan na żywo
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            variants={bentoItem}
            className={`col-span-2 ${teenCardBase} border-emerald-500/15 p-5`}
          >
            <div className="flex gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-emerald-500/25 bg-emerald-500/10 text-emerald-300">
                <Lock className="h-5 w-5" strokeWidth={1.5} />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white">
                  Prywatność pod kontrolą
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-zinc-400">
                  Twoje rozmowy są prywatne. Rodzic widzi tylko kategorie zagrożeń,
                  nigdy treść.
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            variants={bentoItem}
            className={`col-span-2 ${teenCardBase} p-5`}
          >
            <h3 className="text-sm font-semibold text-white">
              Ostatnie skanowanie wzorców
            </h3>
            <p className="mt-1 text-xs text-zinc-500">
              AI sprawdza zachowanie, nie czyta Twoich wiadomości jak zwykły czat.
            </p>
            <ul className="mt-4 space-y-3">
              {TEEN_SCAN_ITEMS.map((row) => (
                <li
                  key={row.id}
                  className="flex items-center gap-3 rounded-xl border border-white/5 bg-black/25 px-3 py-2.5"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-blue-500/20 bg-blue-500/5 text-blue-300">
                    <row.Icon className="h-5 w-5" strokeWidth={1.5} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-zinc-200">{row.label}</p>
                    <p className="text-[11px] text-zinc-600">{row.time}</p>
                  </div>
                  <span className="shrink-0 text-right text-[11px] font-medium leading-snug text-emerald-400">
                    Bezpieczne:
                    <br />
                    Brak manipulacji behawioralnej
                  </span>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            variants={bentoItem}
            className={`col-span-2 ${teenCardBase} border-sky-500/25 p-5`}
          >
            <h3 className="text-sm font-semibold text-white">Zero Cloud Setup</h3>
            <p className="mt-1 text-xs text-zinc-500">
              Prywatność przez architekturę — onboarding technologiczny.
            </p>
            <div className="mt-4 grid grid-cols-3 gap-2 text-center text-[11px]">
              <div className="rounded-lg border border-white/10 bg-black/30 px-2 py-2 text-zinc-300">
                Dane tekstowe
              </div>
              <motion.div
                className="rounded-lg border border-sky-500/30 bg-sky-500/10 px-2 py-2 text-sky-100"
                animate={{
                  boxShadow: [
                    "0 0 0 rgba(14,165,233,0)",
                    "0 0 14px rgba(14,165,233,0.35)",
                    "0 0 0 rgba(14,165,233,0)",
                  ],
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                Lokalne AI
              </motion.div>
              <div className="rounded-lg border border-emerald-500/25 bg-emerald-500/10 px-2 py-2 text-emerald-100">
                Bez chmury
              </div>
            </div>
          </motion.div>

          <motion.div variants={bentoItem} className={`col-span-2 ${teenCardBase} p-5`}>
            <h3 className="text-sm font-semibold text-white">
              Twoje bezpieczne aplikacje
            </h3>
            <p className="mt-1 text-xs text-zinc-500">
              Vigil Safe — sprawdzone integracje.
            </p>
            <div className="teen-apps-scroll mt-4 -mx-1 flex gap-5 overflow-x-auto px-1 pb-2">
              {CERTIFIED_APPS.map((app) => (
                <div
                  key={app.id}
                  className="flex w-[5.25rem] shrink-0 flex-col items-center gap-2"
                >
                  <div className="relative flex flex-col items-center">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-blue-500/25 bg-zinc-900/80 text-blue-200 shadow-inner">
                      <app.Icon className="h-7 w-7" strokeWidth={1.5} />
                    </div>
                    <div className="mt-1.5 origin-top scale-[0.72]">
                      <VigilSafeBadge tone="gold" />
                    </div>
                  </div>
                  <span className="max-w-[5.25rem] truncate text-center text-[10px] font-medium text-zinc-400">
                    {app.name.split("(")[0].trim()}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        <motion.div variants={bentoItem} className="mt-8 flex justify-center">
          <button
            type="button"
            onClick={onSimulateSextortion}
            className="rounded-full border border-red-500/40 bg-red-950/40 px-5 py-2.5 text-xs font-semibold text-red-200 shadow-[0_0_24px_rgba(239,68,68,0.15)] backdrop-blur-md transition hover:border-red-500/60 hover:bg-red-950/60"
          >
            TEST: Symuluj zagrożenie
          </button>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className={`fixed right-4 top-28 z-40 rounded-full border px-3 py-1.5 text-[11px] font-semibold backdrop-blur-md ${
          scanState === "safe"
            ? "border-emerald-400/40 bg-emerald-500/10 text-emerald-200"
            : scanState === "analyzing"
              ? "border-amber-400/45 bg-amber-500/15 text-amber-100"
              : "border-red-500/45 bg-red-500/20 text-red-100"
        }`}
      >
        {scanState === "safe" && "Cichy Strażnik: wszystko OK"}
        {scanState === "analyzing" &&
          "Cichy Strażnik: analizuję podejrzany kontekst"}
        {scanState === "alert" && "Cichy Strażnik: krytyczny alert"}
      </motion.div>

      <AnimatePresence>
        {hardLock && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-[#140202]/95 p-5 backdrop-blur-2xl"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: "spring", stiffness: 320, damping: 26 }}
              className={`w-full max-w-md border p-8 text-center shadow-[0_0_60px_rgba(220,38,38,0.35)] backdrop-blur-md ${
                lockReason === "sextortion"
                  ? "rounded-2xl border-red-600/40 bg-red-950/80"
                  : `rounded-2xl ${cardBase} border-red-500/50`
              }`}
            >
              <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-red-600/25 ring-2 ring-red-500/40">
                <AlertTriangle className="h-9 w-9 text-red-400" />
              </div>
              {lockReason === "sextortion" ? (
                <>
                  <p className="font-mono text-[11px] font-semibold uppercase tracking-widest text-red-300/90">
                    Alert bezpieczeństwa
                  </p>
                  <h3 className="mt-2 text-xl font-bold leading-snug tracking-tight text-white">
                    ALERT BEZPIECZEŃSTWA: Wykryto wzorzec szantażu (Sextortion)
                  </h3>
                  <p className="mt-4 text-sm leading-relaxed text-red-100/85">
                    To połączenie zostało zawieszone ze względu na Twoje
                    bezpieczeństwo. Czekamy na weryfikację rodzica.
                  </p>
                  <p className="mt-2 text-xs text-red-200/80">
                    Vigil zabezpieczył dowody w Skarbcu lokalnym.
                  </p>
                  <button
                    type="button"
                    onClick={onDismissLock}
                    className="mt-6 w-full rounded-xl bg-red-600 py-3.5 text-sm font-bold text-white shadow-lg shadow-red-900/40 transition hover:bg-red-500"
                  >
                    Zablokuj aplikację i poproś o wsparcie
                  </button>
                  <p className="mt-4 text-xs text-red-200/60">
                    Rodzic dostał powiadomienie. W demo możesz zamknąć ten ekran
                    przyciskiem powyżej.
                  </p>
                </>
              ) : (
                <>
                  <h3 className="text-xl font-bold tracking-tight text-white">
                    Aplikacja zablokowana — interwencja Vigil
                  </h3>
                  <p className="mt-3 text-sm text-zinc-400">{lockCopy}</p>
                  <p className="mt-2 text-xs text-zinc-600">
                    Rodzic otrzymał Instant Alert. Odblokowanie po weryfikacji w
                    Vigil Parent.
                  </p>
                  <button
                    type="button"
                    onClick={onDismissLock}
                    className="mt-6 w-full rounded-xl bg-zinc-800 py-3 text-sm font-medium text-white hover:bg-zinc-700"
                  >
                    Zamknij (demo)
                  </button>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        .teen-apps-scroll::-webkit-scrollbar { display: none; }
        .teen-apps-scroll { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  )
}
