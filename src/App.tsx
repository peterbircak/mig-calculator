import { useEffect, useMemo, useState } from "react";
import { Analytics } from "@vercel/analytics/react";
import CalculatorFeedbackState from "@/components/CalculatorFeedbackState";
import CalculatorInputControls, {
  type CalculatorInput,
  type MachineType,
  type Material,
  type PresetThickness,
  type ShieldingGas,
  type WeldingPosition,
  type WireDiameter } from
"@/components/CalculatorInputControls";
import CalculatorResultsPanel from "@/components/CalculatorResultsPanel";
import { Button } from "@/components/ui/button";

type RecommendationOutput = {
  voltage: string;
  wireSpeed: string;
  gasFlow: string;
};

type MigChartFamilyName = "ER70S-6 + Co2" | "ER70S-6 + 75% AR / 25% Co2" | "E71T-GS + N/A – Flux Core";

type MigChartRow = {
  thickness: PresetThickness;
  voltage: string | null;
  wire_speed: string | null;
};

type MigChartFamily = {
  family: MigChartFamilyName;
  material: Material;
  machineType: MachineType;
  weldingPosition: WeldingPosition;
  wireDiameter: WireDiameter;
  shieldingGas: ShieldingGas;
  flow_rate: string;
  source: "MakeMoneyWelding.com";
  rows: MigChartRow[];
};

type RawSetting = {
  voltage: number | null;
  wire_speed: number | null;
};

type RawWireSize = {
  diameter_in: string;
  diameter_mm: string;
  settings: Record<string, RawSetting>;
};

type RawConfiguration = {
  wire_type: "ER70S-6" | "E71T-GS";
  gas: "Co2" | "75% AR / 25% Co2" | "N/A – Flux Core";
  flow_rate: string;
  wire_sizes: RawWireSize[];
};

type MigChartRaw = {
  title: string;
  source: "MakeMoneyWelding.com";
  note: string;
  configurations: RawConfiguration[];
};

type CalculationState =
{status: "idle";} |
{status: "success";result: RecommendationOutput;} |
{status: "unsupported";} |
{
  status: "runtime_error";
  message: string;
  lastGoodResult: RecommendationOutput | null;
};

type MigRegressionResult = {
  totalChecked: number;
  mismatchCount: number;
};

const UNSUPPORTED_MESSAGE = "Something wrong with these settings. Double check your selection";
const RUNTIME_ERROR_MESSAGE = "Unable to calculate settings right now.";
const MIG_CHART_VERSION = "PETER_JSON_V2";

const MIG_CHART_RAW: MigChartRaw = {
  "title": "MIG Welding Settings Chart – Wire Speed & Voltage",
  "source": "MakeMoneyWelding.com",
  "note": "Voltage & wire speed will depend on other variables such as stickout, travel speed, weld angle, cleanliness of weldment etc.",
  "configurations": [
  {
    "wire_type": "ER70S-6",
    "gas": "Co2",
    "flow_rate": "20 CFH",
    "wire_sizes": [
    {
      "diameter_in": ".23\"",
      "diameter_mm": "0.6mm",
      "settings": {
        "3/8\" (9.5mm)": { "voltage": null, "wire_speed": null },
        "5/16\" (8mm)": { "voltage": null, "wire_speed": null },
        "1/4\" (6.4mm)": { "voltage": null, "wire_speed": null },
        "3/16\" (4.8mm)": { "voltage": 20.5, "wire_speed": 320 },
        "12ga (2.8mm)": { "voltage": 20, "wire_speed": 240 },
        "14ga (2.0mm)": { "voltage": 19, "wire_speed": 200 },
        "16ga (1.6mm)": { "voltage": 18, "wire_speed": 180 },
        "18ga (1.2mm)": { "voltage": 17.5, "wire_speed": 165 },
        "20ga (0.9mm)": { "voltage": 17, "wire_speed": 150 },
        "22ga (0.8mm)": { "voltage": 17, "wire_speed": 140 }
      }
    },
    {
      "diameter_in": ".030\"",
      "diameter_mm": "0.8mm",
      "settings": {
        "3/8\" (9.5mm)": { "voltage": 22, "wire_speed": 390 },
        "5/16\" (8mm)": { "voltage": 20.5, "wire_speed": 335 },
        "1/4\" (6.4mm)": { "voltage": 20, "wire_speed": 280 },
        "3/16\" (4.8mm)": { "voltage": 19, "wire_speed": 240 },
        "12ga (2.8mm)": { "voltage": 19, "wire_speed": 200 },
        "14ga (2.0mm)": { "voltage": 18.5, "wire_speed": 180 },
        "16ga (1.6mm)": { "voltage": 18, "wire_speed": 155 },
        "18ga (1.2mm)": { "voltage": 17.5, "wire_speed": 140 },
        "20ga (0.9mm)": { "voltage": 17, "wire_speed": 110 },
        "22ga (0.8mm)": { "voltage": null, "wire_speed": null }
      }
    },
    {
      "diameter_in": ".035\"",
      "diameter_mm": "0.9mm",
      "settings": {
        "3/8\" (9.5mm)": { "voltage": 22.5, "wire_speed": 310 },
        "5/16\" (8mm)": { "voltage": 22, "wire_speed": 285 },
        "1/4\" (6.4mm)": { "voltage": 21.5, "wire_speed": 260 },
        "3/16\" (4.8mm)": { "voltage": 20, "wire_speed": 225 },
        "12ga (2.8mm)": { "voltage": 19.5, "wire_speed": 180 },
        "14ga (2.0mm)": { "voltage": 19, "wire_speed": 170 },
        "16ga (1.6mm)": { "voltage": 18, "wire_speed": 150 },
        "18ga (1.2mm)": { "voltage": 18, "wire_speed": 125 },
        "20ga (0.9mm)": { "voltage": null, "wire_speed": null },
        "22ga (0.8mm)": { "voltage": null, "wire_speed": null }
      }
    },
    {
      "diameter_in": ".045\"",
      "diameter_mm": "1.2mm",
      "settings": {
        "3/8\" (9.5mm)": { "voltage": 23, "wire_speed": 240 },
        "5/16\" (8mm)": { "voltage": 22, "wire_speed": 220 },
        "1/4\" (6.4mm)": { "voltage": 21, "wire_speed": 280 },
        "3/16\" (4.8mm)": { "voltage": 19, "wire_speed": 155 },
        "12ga (2.8mm)": { "voltage": 19, "wire_speed": 140 },
        "14ga (2.0mm)": { "voltage": 18, "wire_speed": 120 },
        "16ga (1.6mm)": { "voltage": 18, "wire_speed": 110 },
        "18ga (1.2mm)": { "voltage": 17, "wire_speed": 75 },
        "20ga (0.9mm)": { "voltage": null, "wire_speed": null },
        "22ga (0.8mm)": { "voltage": null, "wire_speed": null }
      }
    }]

  },
  {
    "wire_type": "ER70S-6",
    "gas": "75% AR / 25% Co2",
    "flow_rate": "20 CFH",
    "wire_sizes": [
    {
      "diameter_in": ".23\"",
      "diameter_mm": "0.6mm",
      "settings": {
        "3/8\" (9.5mm)": { "voltage": null, "wire_speed": null },
        "5/16\" (8mm)": { "voltage": null, "wire_speed": null },
        "1/4\" (6.4mm)": { "voltage": null, "wire_speed": null },
        "3/16\" (4.8mm)": { "voltage": 19, "wire_speed": 320 },
        "12ga (2.8mm)": { "voltage": 18, "wire_speed": 250 },
        "14ga (2.0mm)": { "voltage": 18, "wire_speed": 230 },
        "16ga (1.6mm)": { "voltage": 17.5, "wire_speed": 220 },
        "18ga (1.2mm)": { "voltage": 16.5, "wire_speed": 175 },
        "20ga (0.9mm)": { "voltage": 16, "wire_speed": 160 },
        "22ga (0.8mm)": { "voltage": 16, "wire_speed": 145 }
      }
    },
    {
      "diameter_in": ".030\"",
      "diameter_mm": "0.8mm",
      "settings": {
        "3/8\" (9.5mm)": { "voltage": 20, "wire_speed": 390 },
        "5/16\" (8mm)": { "voltage": 19.5, "wire_speed": 335 },
        "1/4\" (6.4mm)": { "voltage": 19, "wire_speed": 280 },
        "3/16\" (4.8mm)": { "voltage": 18, "wire_speed": 240 },
        "12ga (2.8mm)": { "voltage": 18, "wire_speed": 200 },
        "14ga (2.0mm)": { "voltage": 17.5, "wire_speed": 180 },
        "16ga (1.6mm)": { "voltage": 17, "wire_speed": 155 },
        "18ga (1.2mm)": { "voltage": 16.5, "wire_speed": 140 },
        "20ga (0.9mm)": { "voltage": 16, "wire_speed": 110 },
        "22ga (0.8mm)": { "voltage": 16, "wire_speed": 100 }
      }
    },
    {
      "diameter_in": ".035\"",
      "diameter_mm": "0.9mm",
      "settings": {
        "3/8\" (9.5mm)": { "voltage": 21, "wire_speed": 310 },
        "5/16\" (8mm)": { "voltage": 20.5, "wire_speed": 285 },
        "1/4\" (6.4mm)": { "voltage": 20, "wire_speed": 260 },
        "3/16\" (4.8mm)": { "voltage": 19, "wire_speed": 225 },
        "12ga (2.8mm)": { "voltage": 18.5, "wire_speed": 180 },
        "14ga (2.0mm)": { "voltage": 17.5, "wire_speed": 170 },
        "16ga (1.6mm)": { "voltage": 17, "wire_speed": 150 },
        "18ga (1.2mm)": { "voltage": 17, "wire_speed": 125 },
        "20ga (0.9mm)": { "voltage": 16, "wire_speed": 100 },
        "22ga (0.8mm)": { "voltage": 16, "wire_speed": 80 }
      }
    },
    {
      "diameter_in": ".045\"",
      "diameter_mm": "1.2mm",
      "settings": {
        "3/8\" (9.5mm)": { "voltage": 21, "wire_speed": 240 },
        "5/16\" (8mm)": { "voltage": 20.5, "wire_speed": 220 },
        "1/4\" (6.4mm)": { "voltage": 20, "wire_speed": 180 },
        "3/16\" (4.8mm)": { "voltage": 18, "wire_speed": 155 },
        "12ga (2.8mm)": { "voltage": 18, "wire_speed": 140 },
        "14ga (2.0mm)": { "voltage": 17, "wire_speed": 120 },
        "16ga (1.6mm)": { "voltage": 17, "wire_speed": 110 },
        "18ga (1.2mm)": { "voltage": 16, "wire_speed": 75 },
        "20ga (0.9mm)": { "voltage": null, "wire_speed": null },
        "22ga (0.8mm)": { "voltage": null, "wire_speed": null }
      }
    }]

  },
  {
    "wire_type": "E71T-GS",
    "gas": "N/A – Flux Core",
    "flow_rate": "N/A – Tubular",
    "wire_sizes": [
    {
      "diameter_in": ".030\"",
      "diameter_mm": "0.8mm",
      "settings": {
        "3/8\" (9.5mm)": { "voltage": 20, "wire_speed": 375 },
        "5/16\" (8mm)": { "voltage": 19, "wire_speed": 340 },
        "1/4\" (6.4mm)": { "voltage": 18.5, "wire_speed": 300 },
        "3/16\" (4.8mm)": { "voltage": 17.5, "wire_speed": 275 },
        "12ga (2.8mm)": { "voltage": 16, "wire_speed": 240 },
        "14ga (2.0mm)": { "voltage": 15, "wire_speed": 180 },
        "16ga (1.6mm)": { "voltage": 14.5, "wire_speed": 150 },
        "18ga (1.2mm)": { "voltage": 14, "wire_speed": 125 },
        "20ga (0.9mm)": { "voltage": null, "wire_speed": null },
        "22ga (0.8mm)": { "voltage": null, "wire_speed": null }
      }
    },
    {
      "diameter_in": ".035\"",
      "diameter_mm": "0.9mm",
      "settings": {
        "3/8\" (9.5mm)": { "voltage": 21, "wire_speed": 300 },
        "5/16\" (8mm)": { "voltage": 20, "wire_speed": 275 },
        "1/4\" (6.4mm)": { "voltage": 18.5, "wire_speed": 250 },
        "3/16\" (4.8mm)": { "voltage": 17.5, "wire_speed": 210 },
        "12ga (2.8mm)": { "voltage": 16, "wire_speed": 170 },
        "14ga (2.0mm)": { "voltage": 15, "wire_speed": 140 },
        "16ga (1.6mm)": { "voltage": 14.5, "wire_speed": 110 },
        "18ga (1.2mm)": { "voltage": null, "wire_speed": null },
        "20ga (0.9mm)": { "voltage": null, "wire_speed": null },
        "22ga (0.8mm)": { "voltage": null, "wire_speed": null }
      }
    },
    {
      "diameter_in": ".045\"",
      "diameter_mm": "1.2mm",
      "settings": {
        "3/8\" (9.5mm)": { "voltage": 22.5, "wire_speed": 230 },
        "5/16\" (8mm)": { "voltage": 21.5, "wire_speed": 205 },
        "1/4\" (6.4mm)": { "voltage": 19, "wire_speed": 180 },
        "3/16\" (4.8mm)": { "voltage": 17.5, "wire_speed": 140 },
        "12ga (2.8mm)": { "voltage": 16, "wire_speed": 100 },
        "14ga (2.0mm)": { "voltage": 15, "wire_speed": 75 },
        "16ga (1.6mm)": { "voltage": null, "wire_speed": null },
        "18ga (1.2mm)": { "voltage": null, "wire_speed": null },
        "20ga (0.9mm)": { "voltage": null, "wire_speed": null },
        "22ga (0.8mm)": { "voltage": null, "wire_speed": null }
      }
    }]

  }]

};

const mapGas = (gas: RawConfiguration["gas"]): ShieldingGas => {
  if (gas === "Co2") return "c100";
  if (gas === "75% AR / 25% Co2") return "c25";
  return "flux_core_na";
};

const mapFamilyName = (wireType: RawConfiguration["wire_type"], gas: RawConfiguration["gas"]): MigChartFamilyName => {
  if (wireType === "ER70S-6" && gas === "Co2") return "ER70S-6 + Co2";
  if (wireType === "ER70S-6" && gas === "75% AR / 25% Co2") return "ER70S-6 + 75% AR / 25% Co2";
  return "E71T-GS + N/A – Flux Core";
};

const mapWireDiameter = (diameterIn: string): WireDiameter => {
  if (diameterIn === ".23\"") return "023";
  if (diameterIn === ".030\"") return "030";
  if (diameterIn === ".035\"") return "035";
  return "045";
};

const thicknessKeyMap: Record<string, PresetThickness> = {
  "22ga (0.8mm)": "22ga",
  "20ga (0.9mm)": "20ga",
  "18ga (1.2mm)": "18ga",
  "16ga (1.6mm)": "16ga",
  "14ga (2.0mm)": "14ga",
  "12ga (2.8mm)": "12ga",
  "3/16\" (4.8mm)": "3/16",
  "1/4\" (6.4mm)": "1/4",
  "5/16\" (8mm)": "5/16",
  "3/8\" (9.5mm)": "3/8"
};

const MIG_CHART_DATA: MigChartFamily[] = MIG_CHART_RAW.configurations.flatMap((configuration) =>
configuration.wire_sizes.map((wireSize) => {
  const rows = Object.entries(wireSize.settings).
  filter(([key]) => key in thicknessKeyMap).
  map(
    ([key, setting]) =>
    ({
      thickness: thicknessKeyMap[key],
      voltage: setting.voltage === null ? null : String(setting.voltage),
      wire_speed: setting.wire_speed === null ? null : String(setting.wire_speed)
    }) as MigChartRow
  );

  return {
    family: mapFamilyName(configuration.wire_type, configuration.gas),
    material: "mild_steel" as Material,
    machineType: "cv" as MachineType,
    weldingPosition: "flat" as WeldingPosition,
    wireDiameter: mapWireDiameter(wireSize.diameter_in),
    shieldingGas: mapGas(configuration.gas),
    flow_rate: configuration.flow_rate,
    source: MIG_CHART_RAW.source,
    rows
  };
})
);

const MATERIAL_OPTIONS: Array<{value: Material;label: string;}> = [{ value: "mild_steel", label: "Mild Steel" }];

const THICKNESS_OPTIONS: Array<{value: PresetThickness;label: string;}> = [
{ value: "22ga", label: "22ga (0.8mm)" },
{ value: "20ga", label: "20ga (0.9mm)" },
{ value: "18ga", label: "18ga (1.2mm)" },
{ value: "16ga", label: "16ga (1.6mm)" },
{ value: "14ga", label: "14ga (2.0mm)" },
{ value: "12ga", label: "12ga (2.8mm)" },
{ value: "3/16", label: "3/16\" (4.8mm)" },
{ value: "1/4", label: "1/4\" (6.4mm)" },
{ value: "5/16", label: "5/16\" (8mm)" },
{ value: "3/8", label: "3/8\" (9.5mm)" }];


const WIRE_DIAMETER_OPTIONS: Array<{value: WireDiameter;label: string;}> = [
{ value: "023", label: '.023"' },
{ value: "030", label: '.030"' },
{ value: "035", label: '.035"' },
{ value: "045", label: '.045"' }];


const MACHINE_TYPE_OPTIONS: Array<{value: MachineType;label: string;}> = [{ value: "cv", label: "CV" }];
const WELDING_POSITION_OPTIONS: Array<{value: WeldingPosition;label: string;}> = [{ value: "flat", label: "Flat" }];

const GAS_OPTIONS: Array<{value: ShieldingGas;label: string;}> = [
{ value: "c25", label: "75% AR / 25% Co2" },
{ value: "c100", label: "Co2" },
{ value: "flux_core_na", label: "N/A – Flux Core" }];


const thicknessLabelMap = new Map(THICKNESS_OPTIONS.map((option) => [option.value, option.label]));

const normalizeInput = (previousInput: CalculatorInput, changedKey: keyof CalculatorInput, changedValue: CalculatorInput[keyof CalculatorInput]): CalculatorInput => {
  const draftInput: CalculatorInput = { ...previousInput, [changedKey]: changedValue } as CalculatorInput;

  const validFamilies = MIG_CHART_DATA.filter(
    (family) =>
    family.material === draftInput.material &&
    family.machineType === draftInput.machineType &&
    family.weldingPosition === draftInput.weldingPosition
  );

  const allowedWire = Array.from(new Set(validFamilies.map((family) => family.wireDiameter)));
  const nextWire = allowedWire.includes(draftInput.wireDiameter) ? draftInput.wireDiameter : allowedWire[0] ?? draftInput.wireDiameter;

  const validGasForWire = validFamilies.filter((family) => family.wireDiameter === nextWire).map((family) => family.shieldingGas);
  const nextGas = validGasForWire.includes(draftInput.shieldingGas) ? draftInput.shieldingGas : validGasForWire[0] ?? draftInput.shieldingGas;

  const selectedFamily = validFamilies.find((family) => family.wireDiameter === nextWire && family.shieldingGas === nextGas);
  const allowedThickness = selectedFamily?.rows.map((row) => row.thickness) ?? [];
  const nextThickness = allowedThickness.includes(draftInput.presetThickness) ? draftInput.presetThickness : allowedThickness[0] ?? draftInput.presetThickness;

  return {
    ...draftInput,
    wireDiameter: nextWire,
    shieldingGas: nextGas,
    presetThickness: nextThickness,
    material: "mild_steel",
    machineType: "cv",
    weldingPosition: "flat"
  };
};

const resolveRecommendation = (input: CalculatorInput): RecommendationOutput | null => {
  const family = MIG_CHART_DATA.find(
    (item) =>
    item.material === input.material &&
    item.machineType === input.machineType &&
    item.weldingPosition === input.weldingPosition &&
    item.wireDiameter === input.wireDiameter &&
    item.shieldingGas === input.shieldingGas
  );

  if (!family) {
    return null;
  }

  const row = family.rows.find((item) => item.thickness === input.presetThickness);
  if (!row || row.voltage === null || row.wire_speed === null) {
    return null;
  }

  return {
    voltage: row.voltage,
    wireSpeed: row.wire_speed,
    gasFlow: family.flow_rate
  };
};

const runMigRegressionValidation = (): MigRegressionResult => {
  let totalChecked = 0;
  let mismatchCount = 0;

  for (const family of MIG_CHART_DATA) {
    for (const row of family.rows) {
      totalChecked += 1;

      const calculatorInput: CalculatorInput = {
        material: family.material,
        machineType: family.machineType,
        weldingPosition: family.weldingPosition,
        wireDiameter: family.wireDiameter,
        shieldingGas: family.shieldingGas,
        presetThickness: row.thickness
      };

      const actual = resolveRecommendation(calculatorInput);
      const expectedSupported = row.voltage !== null && row.wire_speed !== null;

      if (!expectedSupported) {
        if (actual !== null) {
          mismatchCount += 1;
          console.error("[MIG Regression] Expected unsupported but got recommendation", {
            input: calculatorInput,
            actual,
            chartVersion: MIG_CHART_VERSION
          });
        }
        continue;
      }

      const expected: RecommendationOutput = {
        voltage: row.voltage!,
        wireSpeed: row.wire_speed!,
        gasFlow: family.flow_rate
      };

      if (actual === null || actual.voltage !== expected.voltage || actual.wireSpeed !== expected.wireSpeed || actual.gasFlow !== expected.gasFlow) {
        mismatchCount += 1;
        console.error("[MIG Regression] Supported cell mismatch", {
          input: calculatorInput,
          expected,
          actual,
          chartVersion: MIG_CHART_VERSION
        });
      }
    }
  }

  return {
    totalChecked,
    mismatchCount
  };
};

const initialInput: CalculatorInput = {
  material: "mild_steel",
  machineType: "cv",
  weldingPosition: "flat",
  presetThickness: "3/16",
  wireDiameter: "030",
  shieldingGas: "c25"
};

export default function App() {
  const [input, setInput] = useState<CalculatorInput>(initialInput);
  const [calculationState, setCalculationState] = useState<CalculationState>({ status: "idle" });
  const [lastGoodResult, setLastGoodResult] = useState<RecommendationOutput | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  useEffect(() => {
    const { totalChecked, mismatchCount } = runMigRegressionValidation();
    const summary = `[MIG Regression] checked=${totalChecked} mismatches=${mismatchCount} chart=${MIG_CHART_VERSION}`;

    if (mismatchCount > 0) {
      console.error(summary);
      return;
    }

    console.info(summary);
  }, []);

  const viableFamilies = useMemo(
    () =>
    MIG_CHART_DATA.filter(
      (family) =>
      family.material === input.material &&
      family.machineType === input.machineType &&
      family.weldingPosition === input.weldingPosition
    ),
    [input.material, input.machineType, input.weldingPosition]
  );

  const viableWireDiameterOptions = useMemo(
    () => WIRE_DIAMETER_OPTIONS.filter((option) => viableFamilies.some((family) => family.wireDiameter === option.value)),
    [viableFamilies]
  );

  const viableGasOptions = useMemo(() => {
    const familyForWire = viableFamilies.filter((family) => family.wireDiameter === input.wireDiameter);
    return GAS_OPTIONS.filter((option) => familyForWire.some((family) => family.shieldingGas === option.value));
  }, [viableFamilies, input.wireDiameter]);

  const viableThicknessOptions = useMemo(() => {
    const selectedFamily = viableFamilies.find(
      (family) => family.wireDiameter === input.wireDiameter && family.shieldingGas === input.shieldingGas
    );
    const thicknessValues = new Set(selectedFamily?.rows.map((row) => row.thickness) ?? []);
    return THICKNESS_OPTIONS.filter((option) => thicknessValues.has(option.value));
  }, [viableFamilies, input.wireDiameter, input.shieldingGas]);

  const displayedResult = useMemo(() => {
    if (calculationState.status === "success") {
      return calculationState.result;
    }

    if (calculationState.status === "runtime_error" && calculationState.lastGoodResult) {
      return calculationState.lastGoodResult;
    }

    return null;
  }, [calculationState]);

  const onInputChange = <K extends keyof CalculatorInput,>(key: K, value: CalculatorInput[K]) => {
    setInput((previous) => normalizeInput(previous, key, value));
  };

  const onCalculate = async () => {
    setIsCalculating(true);

    try {
      const recommendation = resolveRecommendation(input);

      if (!recommendation) {
        setCalculationState({ status: "unsupported" });
        return;
      }

      setLastGoodResult(recommendation);
      setCalculationState({ status: "success", result: recommendation });
    } catch {
      setCalculationState({
        status: "runtime_error",
        message: RUNTIME_ERROR_MESSAGE,
        lastGoodResult
      });
    } finally {
      setIsCalculating(false);
    }
  };

  const feedbackState = calculationState.status === "unsupported" ? { status: "unsupported" as const, message: UNSUPPORTED_MESSAGE } : calculationState;

  return (
    <main className="min-h-screen bg-background text-foreground" data-devize-id="Fjb6IA7V">
      <section className="mx-auto w-full max-w-6xl px-4 pb-10 pt-5 sm:pt-7 lg:px-6" data-devize-id="GsQcK3Yd">
        <header className="mx-auto mb-6 max-w-3xl space-y-2.5 lg:mb-8 lg:mx-0" data-devize-id="LujUm5Aa">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary" data-devize-id="ja2sPviR">
            MIG Calculator
          </p>
          <h1 className="text-3xl font-bold tracking-tight" data-devize-id="smuEzzHN">
            Welding Settings
          </h1>
          <p className="text-sm leading-relaxed text-muted-foreground" data-devize-id="ChNST2lq">
            Dial in your machine with proven starting points before your first pass.
          </p>
        </header>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(320px,420px)] lg:items-start" data-devize-id="two-column-layout">
          <div className="rounded-lg border border-border/70 bg-card p-4 sm:p-5" data-devize-id="pne9HyS0">
            <form
              className="flex flex-col gap-5"
              onSubmit={(event) => {
                event.preventDefault();
                void onCalculate();
              }}
              data-devize-id="OARfrlqR">

              <CalculatorInputControls
                input={input}
                materialOptions={MATERIAL_OPTIONS}
                thicknessOptions={viableThicknessOptions.map((option) => ({
                  value: option.value,
                  label: thicknessLabelMap.get(option.value) ?? option.label
                }))}
                wireDiameterOptions={viableWireDiameterOptions}
                machineTypeOptions={MACHINE_TYPE_OPTIONS}
                weldingPositionOptions={WELDING_POSITION_OPTIONS}
                gasOptions={viableGasOptions}
                onMaterialChange={(material) => onInputChange("material", material)}
                onPresetThicknessChange={(presetThickness) => onInputChange("presetThickness", presetThickness)}
                onWireDiameterChange={(wireDiameter) => onInputChange("wireDiameter", wireDiameter)}
                onMachineTypeChange={(machineType) => onInputChange("machineType", machineType)}
                onWeldingPositionChange={(weldingPosition) => onInputChange("weldingPosition", weldingPosition)}
                onShieldingGasChange={(shieldingGas) => onInputChange("shieldingGas", shieldingGas)}
                data-devize-id="Dnxx9COV" />


            </form>
          </div>

          <section className="space-y-4 rounded-lg border border-border/70 bg-card p-4 sm:p-5 lg:sticky lg:top-6" data-devize-id="zG4lGjQ3">
            <Button type="button" onClick={() => void onCalculate()} className="w-full py-6 text-base font-semibold" disabled={isCalculating} data-devize-id="LvOHh3cU">
              {isCalculating ? "Calculating..." : "Calculate Settings"}
            </Button>
            <div className="flex items-center gap-2" data-devize-id="fBDJc34g">
              <div className="h-4 w-1.5 rounded-full bg-primary" data-devize-id="6vciflVi" />
              <h2 className="text-sm font-semibold uppercase tracking-wider" data-devize-id="CDthXeNc">
                Recommended Starting Points
              </h2>
            </div>

            <p className="text-xs leading-relaxed text-muted-foreground" data-devize-id="2uLCPSIi">
              Results are tuned for practical shop setup and should be verified with your weld test.
            </p>
            <CalculatorFeedbackState calculationState={feedbackState} data-devize-id="k3HJV5p4" />
            <CalculatorResultsPanel result={displayedResult} data-devize-id="wyb3eJgc" />

            <p className="text-xs leading-relaxed text-muted-foreground" data-devize-id="QBvyyKdW">
              Use as a starting point. Fine-tune at the weld.
            </p>
          </section>
        </div>
      </section>
      <Analytics />
    </main>);

}
