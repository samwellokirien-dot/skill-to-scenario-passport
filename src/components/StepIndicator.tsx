import { Check } from "lucide-react";
import type { WorkflowStep } from "@/lib/skillverify-types";

interface StepIndicatorProps {
  currentStep: WorkflowStep;
  maxCompletedStep: number;
  onSelectStep: (step: WorkflowStep) => void;
}

const STEPS: Array<{ step: WorkflowStep; label: string; subtitle: string }> = [
  { step: 1, label: "Qualification Mapper", subtitle: "Background & equivalents" },
  { step: 2, label: "Practical Assessment", subtitle: "3 real-world scenarios" },
  { step: 3, label: "Competency Passport", subtitle: "Certificate & 30-day plan" },
];

export function StepIndicator({ currentStep, maxCompletedStep, onSelectStep }: StepIndicatorProps) {
  return (
    <nav aria-label="Assessment progress" className="no-print mb-8">
      <ol className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {STEPS.map((item) => {
          const isCurrent = item.step === currentStep;
          const isCompleted = item.step < currentStep || item.step <= maxCompletedStep;
          const isClickable = item.step <= maxCompletedStep + 1 && item.step !== currentStep;

          return (
            <li key={item.step}>
              <button
                type="button"
                disabled={!isClickable}
                onClick={() => isClickable && onSelectStep(item.step)}
                aria-current={isCurrent ? "step" : undefined}
                className={`flex w-full items-center gap-3 rounded-lg border px-4 py-3 text-left transition-colors ${
                  isCurrent
                    ? "border-primary bg-card shadow-xs"
                    : isCompleted
                      ? "border-border bg-card hover:border-primary/50"
                      : "border-border/70 bg-surface-subtle opacity-70"
                } ${isClickable ? "cursor-pointer" : "cursor-default"}`}
              >
                <span
                  className={`flex size-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${
                    isCurrent
                      ? "bg-primary text-primary-foreground"
                      : isCompleted
                        ? "bg-verified text-verified-foreground"
                        : "bg-muted text-muted-foreground"
                  }`}
                >
                  {isCompleted && !isCurrent ? <Check className="size-4" aria-hidden="true" /> : item.step}
                </span>
                <span className="min-w-0">
                  <span className="block truncate text-sm font-semibold text-foreground">
                    {item.label}
                  </span>
                  <span className="block truncate text-xs text-muted-foreground">{item.subtitle}</span>
                </span>
              </button>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}