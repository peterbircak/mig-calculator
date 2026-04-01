import { Label } from "@/components/ui/label";

export type Material = "mild_steel";
export type MachineType = "cv";
export type WeldingPosition = "flat";
export type PresetThickness =
"22ga" |
"20ga" |
"18ga" |
"16ga" |
"14ga" |
"12ga" |
"3/16" |
"1/4" |
"5/16" |
"3/8";
export type WireDiameter = "023" | "030" | "035" | "045";
export type ShieldingGas = "c25" | "c100" | "flux_core_na";

export interface Option<T extends string> {
  value: T;
  label: string;
}

export interface CalculatorInput {
  material: Material;
  machineType: MachineType;
  weldingPosition: WeldingPosition;
  presetThickness: PresetThickness;
  wireDiameter: WireDiameter;
  shieldingGas: ShieldingGas;
}

export interface CalculatorInputControlsProps {
  input: CalculatorInput;
  materialOptions: Array<Option<Material>>;
  thicknessOptions: Array<Option<PresetThickness>>;
  wireDiameterOptions: Array<Option<WireDiameter>>;
  machineTypeOptions: Array<Option<MachineType>>;
  weldingPositionOptions: Array<Option<WeldingPosition>>;
  gasOptions: Array<Option<ShieldingGas>>;
  onMaterialChange: (material: Material) => void;
  onPresetThicknessChange: (presetThickness: PresetThickness) => void;
  onWireDiameterChange: (wireDiameter: WireDiameter) => void;
  onMachineTypeChange: (machineType: MachineType) => void;
  onWeldingPositionChange: (weldingPosition: WeldingPosition) => void;
  onShieldingGasChange: (shieldingGas: ShieldingGas) => void;
}

export default function CalculatorInputControls({
  input,
  materialOptions,
  thicknessOptions,
  wireDiameterOptions,
  machineTypeOptions,
  weldingPositionOptions,
  gasOptions,
  onMaterialChange,
  onPresetThicknessChange,
  onWireDiameterChange,
  onMachineTypeChange,
  onWeldingPositionChange,
  onShieldingGasChange
}: CalculatorInputControlsProps) {
  return (
    <div className="flex flex-col gap-7 sm:gap-6" data-devize-id="0Oaf3euy">
      {/* Material Selection */}
      <div className="space-y-3.5" data-devize-id="md0IlmD5">
        <div className="space-y-1.5" data-devize-id="E1vgdG0g">
          <Label className="text-sm font-semibold uppercase tracking-wider text-foreground" data-devize-id="l6xkpmm5">
            Material
          </Label>
          <p className="text-xs text-muted-foreground" data-devize-id="Y6TQwJpv">Choose the base metal you are welding.</p>
          <p className="text-xs text-muted-foreground" data-devize-id="joSuEAXr">Options are limited to available recommendations for your current selections.</p>
        </div>
        <div className="grid grid-cols-3 gap-2.5" data-devize-id="DfwQKhlj">
          {materialOptions.map((option) => {
            const checked = input.material === option.value;
            return (
              <label key={option.value} className="relative cursor-pointer" data-devize-id="lSDVUXBT">
                <input
                  className="sr-only"
                  type="radio"
                  name="material"
                  checked={checked}
                  onChange={() => onMaterialChange(option.value)}
                  data-devize-id="h84m88Bl" />


                <div
                  className={`flex h-full min-h-11 flex-col items-center justify-center rounded-lg border p-3 text-center text-sm font-medium leading-tight transition-all ${
                  checked ?
                  "border-primary bg-primary/10 text-foreground" :
                  "border-border bg-muted text-muted-foreground hover:bg-muted/80"}`
                  }
                  data-devize-id="tbnITbwN">

                  {option.label}
                </div>
              </label>);

          })}
        </div>
      </div>

      {/* Thickness Selection */}
      <div className="space-y-3.5" data-devize-id="7XQLyMAD">
        <div className="flex items-center justify-between" data-devize-id="2EyPdC1I">
          <div className="space-y-1.5" data-devize-id="fgyx0m9P">
            <Label
              htmlFor="thickness"
              className="text-sm font-semibold uppercase tracking-wider text-foreground"
              data-devize-id="cXfSrShu">

              Thickness
            </Label>
            <p className="text-xs text-muted-foreground" data-devize-id="7jFVmeey">Pick the closest material thickness in your shop.</p>
          </div>
          <span className="font-mono text-xs text-muted-foreground" data-devize-id="dTdF0xkS">
            Gauge / Inches
          </span>
        </div>
        <select
          id="thickness"
          className="w-full rounded-lg border border-border bg-muted py-3.5 pl-4 pr-10 text-sm text-foreground shadow-sm transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/50"
          value={input.presetThickness}
          onChange={(event) => onPresetThicknessChange(event.target.value as PresetThickness)}
          aria-label="Material thickness"
          data-devize-id="AfVhTxVd">

          {thicknessOptions.map((option) =>
          <option key={option.value} value={option.value} data-devize-id="8LjOYQmG">
              {option.label}
            </option>
          )}
        </select>
      </div>

      {/* Wire Diameter Selection */}
      <div className="space-y-3.5" data-devize-id="ew054H7p">
        <div className="space-y-1.5" data-devize-id="5aQ3OQth">
          <Label className="text-sm font-semibold uppercase tracking-wider text-foreground" data-devize-id="hzedaX3E">
            Wire Diameter
          </Label>
          <p className="text-xs text-muted-foreground" data-devize-id="HFRVbG8E">Match your installed spool size.</p>
        </div>
        <div className="grid grid-cols-4 gap-2.5" data-devize-id="bCB3Xs4I">
          {wireDiameterOptions.map((option) => {
            const checked = input.wireDiameter === option.value;
            return (
              <label key={option.value} className="relative cursor-pointer" data-devize-id="FOlFjyq8">
                <input
                  className="sr-only"
                  type="radio"
                  name="wire_dia"
                  checked={checked}
                  onChange={() => onWireDiameterChange(option.value)}
                  data-devize-id="axtfsqNt" />


                <div
                  className={`flex min-h-11 justify-center rounded-lg border py-2.5 font-mono text-sm transition-all ${
                  checked ?
                  "border-primary bg-primary/10 text-foreground" :
                  "border-border bg-muted text-muted-foreground hover:bg-muted/80"}`
                  }
                  data-devize-id="VhAC6ILi">

                  {option.label}
                </div>
              </label>);

          })}
        </div>
      </div>

      {/* Machine Type and Welding Position */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2" data-devize-id="dsfd0Hks">
        <div className="space-y-3.5" data-devize-id="bpdDbXw6">
          <div className="space-y-1.5" data-devize-id="FMcpbW4O">
            <Label
              htmlFor="machineType"
              className="text-sm font-semibold uppercase tracking-wider text-foreground"
              data-devize-id="meHwk9V4">

              Machine Type
            </Label>
            <p className="text-xs text-muted-foreground" data-devize-id="VG2Zk3Qa">Select the power source you are running.</p>
          </div>
          <select
            id="machineType"
            className="w-full rounded-lg border border-border bg-muted py-3.5 pl-4 pr-10 text-sm text-foreground shadow-sm transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/50"
            value={input.machineType}
            onChange={(event) => onMachineTypeChange(event.target.value as MachineType)}
            data-devize-id="WGMUOXhr">

            {machineTypeOptions.map((option) =>
            <option key={option.value} value={option.value} data-devize-id="QItzyLRl">
                {option.label}
              </option>
            )}
          </select>
        </div>

        <div className="space-y-3.5" data-devize-id="oSTW531S">
          <div className="space-y-1.5" data-devize-id="Kfbg8s97">
            <Label
              htmlFor="weldingPosition"
              className="text-sm font-semibold uppercase tracking-wider text-foreground"
              data-devize-id="PD75XWKo">

              Welding Position
            </Label>
            <p className="text-xs text-muted-foreground" data-devize-id="6zATHomG">Set this to your real weld orientation.</p>
          </div>
          <select
            id="weldingPosition"
            className="w-full rounded-lg border border-border bg-muted py-3.5 pl-4 pr-10 text-sm text-foreground shadow-sm transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/50"
            value={input.weldingPosition}
            onChange={(event) => onWeldingPositionChange(event.target.value as WeldingPosition)}
            data-devize-id="jM9yia9X">

            {weldingPositionOptions.map((option) =>
            <option key={option.value} value={option.value} data-devize-id="QLd9icKk">
                {option.label}
              </option>
            )}
          </select>
        </div>
      </div>

      {/* Shielding Gas Selection */}
      <div className="space-y-3.5" data-devize-id="2zSFJwXz">
        <div className="space-y-1.5" data-devize-id="HIKIK9MG">
          <Label
            htmlFor="gas"
            className="text-sm font-semibold uppercase tracking-wider text-foreground"
            data-devize-id="o47CShqP">

            Shielding Gas
          </Label>
          <p className="text-xs text-muted-foreground" data-devize-id="klsxUUJc">Confirm the bottle connected to your setup.</p>
        </div>
        <select
          id="gas"
          className="w-full rounded-lg border border-border bg-muted py-3.5 pl-4 pr-10 text-sm text-foreground shadow-sm transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/50"
          value={input.shieldingGas}
          onChange={(event) => onShieldingGasChange(event.target.value as ShieldingGas)}
          data-devize-id="m9pH2RKO">

          {gasOptions.map((option) =>
          <option key={option.value} value={option.value} data-devize-id="9Exsjxc9">
              {option.label}
            </option>
          )}
        </select>
      </div>
    </div>);

}
