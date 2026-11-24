import { useState } from "react";
import { KeyRound, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import type { Language } from "@/lib/skillverify-types";
import { t } from "@/lib/skillverify-i18n";

interface NavbarProps {
  demoMode: boolean;
  onDemoModeChange: (checked: boolean) => void;
  geminiApiKey: string;
  onSaveApiKey: (key: string) => void;
  language: Language;
  onLanguageChange: (language: Language) => void;
}

const LANGUAGES: Array<{ value: Language; label: string; short: string }> = [
  { value: "en", label: "English", short: "EN" },
  { value: "fr", label: "Français", short: "FR" },
  { value: "ar", label: "العربية", short: "ع" },
];

export function Navbar({ demoMode, onDemoModeChange, geminiApiKey, onSaveApiKey, language, onLanguageChange }: NavbarProps) {
  const [open, setOpen] = useState(false);
  const [draftKey, setDraftKey] = useState(geminiApiKey);

  const handleOpenChange = (nextOpen: boolean) => {
    if (nextOpen) setDraftKey(geminiApiKey);
    setOpen(nextOpen);
  };

  const handleSave = () => {
    const trimmed = draftKey.trim();
    onSaveApiKey(trimmed);
    if (trimmed) onDemoModeChange(false);
    setOpen(false);
  };

  const handleClear = () => {
    setDraftKey("");
    onSaveApiKey("");
    onDemoModeChange(true);
    setOpen(false);
  };

  const hasKey = geminiApiKey.trim().length > 0;

  return (
    <header className="no-print sticky top-0 z-30 border-b border-border bg-card/95 backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6">
        <div className="flex min-w-0 items-center gap-2.5">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <ShieldCheck className="size-5" aria-hidden="true" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-serif text-lg font-bold tracking-tight text-foreground">SkillVerify AI</span>
              <span className="hidden rounded bg-secondary px-2 py-0.5 text-xs font-medium text-secondary-foreground lg:inline-block">ILO Track 1</span>
            </div>
            <p className="hidden text-xs text-muted-foreground sm:block">{t(language, "brandTagline")}</p>
          </div>
        </div>

        <div className="flex w-full flex-wrap items-center justify-between gap-2 sm:w-auto sm:justify-end">
          <div className="inline-flex rounded-full border border-border bg-surface-subtle p-1" role="group" aria-label="Interface language">
            {LANGUAGES.map((item) => (
              <button
                key={item.value}
                type="button"
                onClick={() => onLanguageChange(item.value)}
                aria-pressed={language === item.value}
                aria-label={item.label}
                className={`rounded-full px-2.5 py-1 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                  language === item.value ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <span className="sm:hidden">{item.short}</span>
                <span className="hidden sm:inline">{item.label}</span>
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 rounded-full border border-border bg-surface-subtle px-3 py-1.5">
            <Switch id="demo-mode-toggle" checked={demoMode} onCheckedChange={onDemoModeChange} aria-label={t(language, "demoMode")} />
            <Label htmlFor="demo-mode-toggle" className="hidden cursor-pointer text-xs font-medium text-foreground md:inline-block">{t(language, "demoMode")}</Label>
          </div>

          <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
              <Button variant={hasKey && !demoMode ? "default" : "outline"} size="sm" className="gap-1.5">
                <KeyRound className="size-3.5" aria-hidden="true" />
                <span className="hidden xs:inline">{hasKey ? t(language, "keySaved") : t(language, "connectGemini")}</span>
                <span className="xs:hidden">API</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Connect Live Gemini API Key</DialogTitle>
                <DialogDescription>Use your Google AI Studio key to run live gemini-2.5-flash credential mapping and grading. Your key stays in this browser only and is never included in shared reports.</DialogDescription>
              </DialogHeader>
              <div className="space-y-2 py-2">
                <Label htmlFor="gemini-api-key">Gemini API Key</Label>
                <Input id="gemini-api-key" type="password" placeholder="AIza..." value={draftKey} onChange={(event) => setDraftKey(event.target.value)} autoComplete="off" />
                <p className="text-xs text-muted-foreground">Turn off Demo Mode, or save a key here, to evaluate with live Gemini AI.</p>
              </div>
              <DialogFooter className="gap-2 sm:justify-between">
                {hasKey ? <Button type="button" variant="ghost" onClick={handleClear}>Remove Key</Button> : <span />}
                <div className="flex gap-2">
                  <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                  <Button type="button" onClick={handleSave} disabled={!draftKey.trim()}>Save &amp; Use Live AI</Button>
                </div>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </header>
  );
}
