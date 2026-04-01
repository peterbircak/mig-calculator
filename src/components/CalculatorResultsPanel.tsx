type RecommendationOutput = {
  voltage: string;
  wireSpeed: string;
  gasFlow: string;
};

export interface CalculatorResultsPanelProps {
  result: RecommendationOutput | null;
}

export default function CalculatorResultsPanel({
  result
}: CalculatorResultsPanelProps) {
  if (!result) {
    return null;
  }

  return (
    <div className="grid grid-cols-2 gap-4" data-devize-id="life4GwD">
      <div className="relative flex flex-col justify-between overflow-hidden rounded-xl border border-border bg-muted p-4" data-devize-id="36SBISwO">
        <span className="mb-1 text-xs font-medium uppercase tracking-wide text-muted-foreground" data-devize-id="W9ezrAIk">
          Voltage
        </span>
        <div className="mt-2 flex items-baseline gap-1" data-devize-id="8RluXpJU">
          <span className="font-mono text-4xl font-bold tracking-tight text-foreground" data-devize-id="dciWh2JQ">
            {result.voltage}
          </span>
          <span className="text-sm font-medium text-muted-foreground" data-devize-id="VK8XI1df">V</span>
        </div>
      </div>

      <div className="relative flex flex-col justify-between overflow-hidden rounded-xl border border-border bg-muted p-4" data-devize-id="kBheIY3m">
        <span className="mb-1 text-xs font-medium uppercase tracking-wide text-muted-foreground" data-devize-id="RmhuCWBW">
          Wire Speed
        </span>
        <div className="mt-2 flex items-baseline gap-1" data-devize-id="HUzdOkUW">
          <span className="font-mono text-4xl font-bold tracking-tight text-foreground" data-devize-id="b1IW1FRP">
            {result.wireSpeed}
          </span>
          <span className="text-sm font-medium text-muted-foreground" data-devize-id="snAizvsp">ipm</span>
        </div>
      </div>

      <div className="relative col-span-2 flex flex-col justify-between overflow-hidden rounded-xl border border-border bg-muted p-4" data-devize-id="KcKvpc9s">
        <div className="flex w-full items-center justify-between" data-devize-id="7KqsaOCV">
          <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground" data-devize-id="jx0TxgkV">
            Gas Flow Rate
          </span>
          <div className="flex items-baseline gap-1" data-devize-id="gZMptgvJ">
            <span className="font-mono text-2xl font-bold tracking-tight text-foreground" data-devize-id="PKVqa8na">
              {result.gasFlow}
            </span>
            <span className="text-sm font-medium text-muted-foreground" data-devize-id="WGV2e8i3">cfh</span>
          </div>
        </div>
      </div>
    </div>);

}
