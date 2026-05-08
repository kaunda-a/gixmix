"use client";

import { useState, useCallback } from "react";
import {
  Column,
  Heading,
  Text,
  Flex,
  Row,
  Button,
  Input,
  Card,
  Select,
} from "@once-ui-system/core";

type ConversionCategory = "length" | "weight" | "temperature" | "volume" | "area" | "speed" | "time" | "digital";

interface ConversionUnit {
  value: string;
  label: string;
  toBase: (val: number) => number;
  fromBase: (val: number) => number;
}

const categories: Record<ConversionCategory, { label: string; units: ConversionUnit[] }> = {
  length: {
    label: "Length",
    units: [
      { value: "m", label: "Meters", toBase: (v) => v, fromBase: (v) => v },
      { value: "km", label: "Kilometers", toBase: (v) => v * 1000, fromBase: (v) => v / 1000 },
      { value: "cm", label: "Centimeters", toBase: (v) => v / 100, fromBase: (v) => v * 100 },
      { value: "mm", label: "Millimeters", toBase: (v) => v / 1000, fromBase: (v) => v * 1000 },
      { value: "mi", label: "Miles", toBase: (v) => v * 1609.344, fromBase: (v) => v / 1609.344 },
      { value: "yd", label: "Yards", toBase: (v) => v * 0.9144, fromBase: (v) => v / 0.9144 },
      { value: "ft", label: "Feet", toBase: (v) => v * 0.3048, fromBase: (v) => v / 0.3048 },
      { value: "in", label: "Inches", toBase: (v) => v * 0.0254, fromBase: (v) => v / 0.0254 },
    ],
  },
  weight: {
    label: "Weight",
    units: [
      { value: "kg", label: "Kilograms", toBase: (v) => v, fromBase: (v) => v },
      { value: "g", label: "Grams", toBase: (v) => v / 1000, fromBase: (v) => v * 1000 },
      { value: "mg", label: "Milligrams", toBase: (v) => v / 1e6, fromBase: (v) => v * 1e6 },
      { value: "lb", label: "Pounds", toBase: (v) => v * 0.453592, fromBase: (v) => v / 0.453592 },
      { value: "oz", label: "Ounces", toBase: (v) => v * 0.0283495, fromBase: (v) => v / 0.0283495 },
      { value: "t", label: "Tons (metric)", toBase: (v) => v * 1000, fromBase: (v) => v / 1000 },
    ],
  },
  temperature: {
    label: "Temperature",
    units: [
      { value: "c", label: "Celsius", toBase: (v) => v, fromBase: (v) => v },
      { value: "f", label: "Fahrenheit", toBase: (v) => (v - 32) * 5 / 9, fromBase: (v) => v * 9 / 5 + 32 },
      { value: "k", label: "Kelvin", toBase: (v) => v - 273.15, fromBase: (v) => v + 273.15 },
    ],
  },
  volume: {
    label: "Volume",
    units: [
      { value: "l", label: "Liters", toBase: (v) => v, fromBase: (v) => v },
      { value: "ml", label: "Milliliters", toBase: (v) => v / 1000, fromBase: (v) => v * 1000 },
      { value: "gal", label: "Gallons (US)", toBase: (v) => v * 3.78541, fromBase: (v) => v / 3.78541 },
      { value: "qt", label: "Quarts (US)", toBase: (v) => v * 0.946353, fromBase: (v) => v / 0.946353 },
      { value: "cup", label: "Cups", toBase: (v) => v * 0.236588, fromBase: (v) => v / 0.236588 },
      { value: "floz", label: "Fluid Ounces", toBase: (v) => v * 0.0295735, fromBase: (v) => v / 0.0295735 },
    ],
  },
  area: {
    label: "Area",
    units: [
      { value: "sqm", label: "Square Meters", toBase: (v) => v, fromBase: (v) => v },
      { value: "sqkm", label: "Square Kilometers", toBase: (v) => v * 1e6, fromBase: (v) => v / 1e6 },
      { value: "sqft", label: "Square Feet", toBase: (v) => v * 0.092903, fromBase: (v) => v / 0.092903 },
      { value: "acre", label: "Acres", toBase: (v) => v * 4046.86, fromBase: (v) => v / 4046.86 },
      { value: "ha", label: "Hectares", toBase: (v) => v * 10000, fromBase: (v) => v / 10000 },
    ],
  },
  speed: {
    label: "Speed",
    units: [
      { value: "kmh", label: "km/h", toBase: (v) => v / 3.6, fromBase: (v) => v * 3.6 },
      { value: "mph", label: "mph", toBase: (v) => v * 0.44704, fromBase: (v) => v / 0.44704 },
      { value: "ms", label: "m/s", toBase: (v) => v, fromBase: (v) => v },
      { value: "knot", label: "Knots", toBase: (v) => v * 0.514444, fromBase: (v) => v / 0.514444 },
    ],
  },
  time: {
    label: "Time",
    units: [
      { value: "s", label: "Seconds", toBase: (v) => v, fromBase: (v) => v },
      { value: "min", label: "Minutes", toBase: (v) => v * 60, fromBase: (v) => v / 60 },
      { value: "h", label: "Hours", toBase: (v) => v * 3600, fromBase: (v) => v / 3600 },
      { value: "d", label: "Days", toBase: (v) => v * 86400, fromBase: (v) => v / 86400 },
      { value: "wk", label: "Weeks", toBase: (v) => v * 604800, fromBase: (v) => v / 604800 },
    ],
  },
  digital: {
    label: "Digital Storage",
    units: [
      { value: "b", label: "Bytes", toBase: (v) => v, fromBase: (v) => v },
      { value: "kb", label: "Kilobytes", toBase: (v) => v * 1000, fromBase: (v) => v / 1000 },
      { value: "mb", label: "Megabytes", toBase: (v) => v * 1e6, fromBase: (v) => v / 1e6 },
      { value: "gb", label: "Gigabytes", toBase: (v) => v * 1e9, fromBase: (v) => v / 1e9 },
      { value: "tb", label: "Terabytes", toBase: (v) => v * 1e12, fromBase: (v) => v / 1e12 },
    ],
  },
};

const categoryOptions = (Object.keys(categories) as ConversionCategory[]).map((key) => ({
  value: key,
  label: categories[key].label,
}));

export default function UnitConverterPage() {
  const [category, setCategory] = useState<ConversionCategory>("length");
  const [fromUnit, setFromUnit] = useState("m");
  const [toUnit, setToUnit] = useState("km");
  const [value, setValue] = useState("1");
  const [result, setResult] = useState<string | null>(null);

  const handleCategoryChange = useCallback((val: string) => {
    const newCat = val as ConversionCategory;
    setCategory(newCat);
    const cat = categories[newCat];
    if (cat.units.length >= 2) {
      setFromUnit(cat.units[0].value);
      setToUnit(cat.units[1].value);
    }
    setResult(null);
  }, []);

  const convert = useCallback(() => {
    const cat = categories[category];
    const from = cat.units.find((u) => u.value === fromUnit);
    const to = cat.units.find((u) => u.value === toUnit);
    if (!from || !to) return;

    const inputVal = parseFloat(value);
    if (isNaN(inputVal)) {
      setResult("Please enter a valid number");
      return;
    }

    const baseVal = from.toBase(inputVal);
    const converted = to.fromBase(baseVal);

    const formatted = Number.isInteger(converted)
      ? converted.toString()
      : converted.toFixed(6).replace(/\.?0+$/, "");

    setResult(`${inputVal} ${from.label} = ${formatted} ${to.label}`);
  }, [category, fromUnit, toUnit, value]);

  const cat = categories[category];
  const unitOptions = cat.units.map((u) => ({ value: u.value, label: u.label }));

  return (
    <Column maxWidth="s" gap="l" paddingY="12" horizontal="center">
      <Heading variant="display-strong-xs" align="center">
        Unit Converter
      </Heading>
      <Text onBackground="neutral-weak" variant="body-default-m" align="center">
        Convert between different units of measurement
      </Text>

      <Card
        fillWidth
        padding="l"
        radius="m"
        border="neutral-alpha-weak"
        background="page"
      >
        <Column gap="m">
          <Select
            id="category"
            label="Category"
            options={categoryOptions}
            value={category}
            onSelect={handleCategoryChange}
          />

          <Input
            id="value"
            label="Value"
            type="number"
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />

          <Row gap="m" vertical="end">
            <Flex flex={1}>
              <Select
                id="from"
                label="From"
                options={unitOptions}
                value={fromUnit}
                onSelect={(val) => setFromUnit(val)}
              />
            </Flex>
            <Flex flex={1}>
              <Select
                id="to"
                label="To"
                options={unitOptions}
                value={toUnit}
                onSelect={(val) => setToUnit(val)}
              />
            </Flex>
          </Row>

          <Flex fillWidth horizontal="center">
            <Button size="l" variant="primary" onClick={convert}>
              Convert
            </Button>
          </Flex>
        </Column>
      </Card>

      {result && (
        <Card
          fillWidth
          padding="l"
          radius="m"
          border="neutral-alpha-weak"
          background="page"
        >
          <Column horizontal="center" align="center">
            <Heading variant="heading-strong-m">{result}</Heading>
          </Column>
        </Card>
      )}
    </Column>
  );
}
