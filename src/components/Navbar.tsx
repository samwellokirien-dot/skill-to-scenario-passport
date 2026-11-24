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

interface NavbarProps {
  demoMode: boolean;
  onDemoModeChange: (checked: boolean) => void;
  geminiApiKey: string;
  onSaveApiKey: (key: string) => void;
}

export function Navbar({ demoMode, onDemoModeChange, geminiApiKey, onSaveApiKey }: NavbarProps) {
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
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6">
        <div className="flex items-center gap-2.5">
          <div className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <ShieldCheck className="size-5" aria-hidden="true" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-serif text-lg font-bold tracking-tight text-foreground">
                SkillVerify AI
              </span>
              <span className="hidden rounded bg-secondary px-2 py-0.5 text-xs font-medium text-secondary-foreground sm:inline-block">
                ILO Track 1
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              Refugee Credential Recognition &amp; Skills Validation
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 rounded-md border border-border bg-surface-subtle px-3 py-1.5">
            <Switch
              id="demo-mode-toggle"
              checked={demoMode}
              onCheckedChange={onDemoModeChange}
              aria-label="Demo Mode (Pre-filled AI)"
            />
            <Label htmlFor="demo-mode-toggle" className="cursor-pointer text-xs font-medium text-foreground">
              Demo Mode (Pre-filled AI)
            </Label>
          </div>

          <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
              <Button variant={hasKey && !demoMode ? "default" : "outline"} size="sm" className="gap-1.5">
                <KeyRound className="size-3.5" aria-hidden="true" />
                <span>{hasKey ? "Gemini Key Saved" : "Connect Gemini API"}</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Connect Live Gemini API Key</DialogTitle>
                <DialogDescription>
                  Use your Google AI Studio key to run live <span className="font-mono">gemini-2.5-flash</span>{" "}
                  credential mapping and grading. Your key stays in this browser only.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-2 py-2">
                <Label htmlFor="gemini-api-key">Gemini API Key</Label>
                <Input
                  id="gemini-api-key"
                  type="password"
                  placeholder="AIza..."
                  value={draftKey}
                  onChange={(e) => setDraftKey(e.target.value)}
                  autoComplete="off"
                />
                <p className="text-xs text-muted-foreground">
                  Turn off Demo Mode (or save a key here) to evaluate with live Gemini AI.
                </p>
              </div>
              <DialogFooter className="gap-2 sm:justify-between">
                {hasKey ? (
                  <Button type="button" variant="ghost" onClick={handleClear}>
                    Remove Key
                  </Button>
                ) : (
                  <span />
                )}
                <div className="flex gap-2">
                  <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="button" onClick={handleSave} disabled={!draftKey.trim()}>
                    Save &amp; Use Live AI
                  </Button>
                </div>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </header>
  );
}