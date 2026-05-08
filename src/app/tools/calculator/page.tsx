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
  Select,
} from "@once-ui-system/core";
import { create, all, type MathJsInstance } from "mathjs";

const math: MathJsInstance = create(all);

type MathFunction = "sin" | "cos" | "tan" | "log" | "ln" | "sqrt" | "abs" | "round" | "ceil" | "floor";

const functions: { value: MathFunction; label: string }[] = [
  { value: "sin", label: "sin" },
  { value: "cos", label: "cos" },
  { value: "tan", label: "tan" },
  { value: "log", label: "log" },
  { value: "ln", label: "ln" },
  { value: "sqrt", label: "√" },
  { value: "abs", label: "|x|" },
  { value: "round", label: "round" },
  { value: "ceil", label: "ceil" },
  { value: "floor", label: "floor" },
];

export default function CalculatorPage() {
  const [expression, setExpression] = useState("");
  const [result, setResult] = useState<string>("");
  const [history, setHistory] = useState<string[]>([]);
  const [angleMode, setAngleMode] = useState<"deg" | "rad">("deg");
  const [error, setError] = useState<string | null>(null);

  const evaluate = useCallback((expr: string) => {
    try {
      setError(null);

      const scope: Record<string, number> = {};
      const transformedExpr = expr
        .replace(/sin\(/g, angleMode === "deg" ? "sin(deg(" : "sin(")
        .replace(/cos\(/g, angleMode === "deg" ? "cos(deg(" : "cos(")
        .replace(/tan\(/g, angleMode === "deg" ? "tan(deg(" : "tan(");

      const evaluated = math.evaluate(transformedExpr, scope);
      const num = Number(evaluated);

      const resultStr = Number.isInteger(num) ? num.toString() : num.toFixed(6);

      setResult(resultStr);
      setHistory((prev) => [`${expr} = ${resultStr}`, ...prev].slice(0, 20));
    } catch (e) {
      setError("Invalid expression");
      setResult("");
    }
  }, [angleMode]);

  const handleFunction = useCallback((fn: MathFunction) => {
    setExpression((prev) => `${prev}${fn}(`);
  }, []);

  const append = useCallback((value: string) => {
    setExpression((prev) => prev + value);
    setError(null);
  }, []);

  const clear = useCallback(() => {
    setExpression("");
    setResult("");
    setError(null);
  }, []);

  const backspace = useCallback(() => {
    setExpression((prev) => prev.slice(0, -1));
  }, []);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      evaluate(expression);
    }
  }, [expression, evaluate]);

  const buttons = [
    ["7", "8", "9", "/"],
    ["4", "5", "6", "*"],
    ["1", "2", "3", "-"],
    ["0", ".", "=", "+"],
  ];

  return (
    <Column maxWidth="s" gap="l" paddingY="12" horizontal="center">
      <Heading variant="display-strong-xs" align="center">
        Scientific Calculator
      </Heading>
      <Text onBackground="neutral-weak" variant="body-default-m" align="center">
        A full-featured calculator with trigonometric and algebraic functions
      </Text>

      <Flex fillWidth horizontal="end" gap="8">
        <Button
          size="s"
          variant={angleMode === "deg" ? "primary" : "secondary"}
          onClick={() => setAngleMode("deg")}
        >
          DEG
        </Button>
        <Button
          size="s"
          variant={angleMode === "rad" ? "primary" : "secondary"}
          onClick={() => setAngleMode("rad")}
        >
          RAD
        </Button>
      </Flex>

      <Column
        fillWidth
        padding="l"
        radius="m"
        border="neutral-alpha-weak"
        background="page"
        gap="m"
        onKeyDown={handleKeyDown}
      >
        <Input
          id="expression"
          label="Expression"
          value={expression}
          onChange={(e) => setExpression(e.target.value)}
          placeholder="Type an expression, e.g. 2 + 2"
        />

        <Flex fillWidth horizontal="end">
          <Button size="m" variant="primary" onClick={() => evaluate(expression)}>
            Calculate
          </Button>
        </Flex>

        {result && (
          <Column padding="m" radius="s" background="brand-alpha-weak" gap="4">
            <Text variant="body-default-s" onBackground="neutral-weak">Result:</Text>
            <Heading variant="heading-strong-xl">{result}</Heading>
          </Column>
        )}

        {error && (
          <Text variant="body-default-s" onBackground="danger-weak">{error}</Text>
        )}

        <Row gap="8" wrap={true}>
          {functions.map((fn) => (
            <Button key={fn.value} size="s" variant="tertiary" onClick={() => handleFunction(fn.value)}>
              {fn.label}
            </Button>
          ))}
        </Row>

        <Row gap="8" wrap={true}>
          {["(", ")", "pi", "e", "^", "%"].map((sym) => (
            <Button key={sym} size="s" variant="tertiary" onClick={() => append(sym === "pi" ? "pi" : sym)}>
              {sym}
            </Button>
          ))}
          <Button size="s" variant="tertiary" onClick={clear}>C</Button>
          <Button size="s" variant="tertiary" onClick={backspace}>⌫</Button>
        </Row>

        {buttons.map((row, i) => (
          <Row key={i} gap="8" fillWidth>
            {row.map((btn) => (
              <Flex key={btn} flex={1}>
                <Button
                  fillWidth
                  size="l"
                  variant={btn === "=" ? "primary" : "secondary"}
                  onClick={() => {
                    if (btn === "=") {
                      evaluate(expression);
                    } else {
                      append(btn);
                    }
                  }}
                >
                  {btn}
                </Button>
              </Flex>
            ))}
          </Row>
        ))}
      </Column>

      {history.length > 0 && (
        <Column
          fillWidth
          padding="l"
          radius="m"
          border="neutral-alpha-weak"
          background="page"
          gap="8"
        >
          <Heading as="h3" variant="heading-strong-xs">History</Heading>
          {history.map((entry, i) => (
            <Text key={i} variant="body-default-s" onBackground="neutral-weak">
              {entry}
            </Text>
          ))}
        </Column>
      )}
    </Column>
  );
}
