type CalculationState =
{status: "idle";} |
{status: "success";result: {voltage: string;wireSpeed: string;gasFlow: string;};} |
{status: "unsupported";} |
{status: "runtime_error";message: string;lastGoodResult: {voltage: string;wireSpeed: string;gasFlow: string;} | null;};

interface CalculatorFeedbackStateProps {
  calculationState: CalculationState;
}

export default function CalculatorFeedbackState({ calculationState }: CalculatorFeedbackStateProps) {
  if (calculationState.status === "idle") {
    return (
      <div className="rounded-lg border border-border bg-background p-4 text-sm text-muted-foreground" data-devize-id="RRmKcYN8">
        Enter your settings and tap Calculate Settings.
      </div>);

  }

  if (calculationState.status === "unsupported") {
    return (
      <div className="rounded-lg border border-border bg-background p-4 text-sm text-muted-foreground" data-devize-id="vv45TDyv">
        Something wrong with these settings. Double check your selection
      </div>);

  }

  if (calculationState.status === "runtime_error") {
    return (
      <div className="rounded-lg border border-border bg-background p-4 text-sm text-muted-foreground" data-devize-id="TQdwHpiZ">
        {calculationState.message}
      </div>);

  }

  return null;
}
