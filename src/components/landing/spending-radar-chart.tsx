"use client";

import { useState } from "react";
import { cn } from "@/utils/cn";

export const INSIGHT_CATEGORIES = [
  { label: "EMI / loans", chartLabel: "EMI", pct: 33, amount: "₹28,000" },
  { label: "Rent", chartLabel: "Rent", pct: 18, amount: "₹15,500" },
  { label: "Groceries", chartLabel: "Groceries", pct: 13, amount: "₹11,000" },
  { label: "Transport", chartLabel: "Transport", pct: 9, amount: "₹7,500" },
  { label: "Dining", chartLabel: "Dining", pct: 8, amount: "₹6,800" },
  { label: "Bills", chartLabel: "Bills", pct: 8, amount: "₹6,500" },
  { label: "Shopping", chartLabel: "Shopping", pct: 7, amount: "₹5,600" },
  { label: "Health", chartLabel: "Health", pct: 5, amount: "₹4,600" },
] as const;

export const INSIGHT_TOTAL = "₹85,500";

export const INSIGHT_PROMPTS = [
  "EMI and rent are still my biggest costs — break them down.",
  "Where did most of it go? Rank my spending areas.",
  "Groceries is up compared with last quarter.",
  "Send me my quarterly spending summary.",
] as const;

const VIEWBOX = 360;
const CENTER = VIEWBOX / 2;
const RADIUS = 92;
const LABEL_OFFSET = 34;
const MAX_PCT = Math.max(...INSIGHT_CATEGORIES.map((category) => category.pct));

type RadarGeometry = {
  x: number;
  y: number;
  labelX: number;
  labelY: number;
  angle: number;
};

function radarPoint(index: number, total: number, valuePct: number): RadarGeometry {
  const angle = (Math.PI * 2 * index) / total - Math.PI / 2;
  const normalized = (valuePct / MAX_PCT) * 100;
  const radius = (normalized / 100) * RADIUS;

  return {
    x: CENTER + radius * Math.cos(angle),
    y: CENTER + radius * Math.sin(angle),
    labelX: CENTER + (RADIUS + LABEL_OFFSET) * Math.cos(angle),
    labelY: CENTER + (RADIUS + LABEL_OFFSET) * Math.sin(angle),
    angle,
  };
}

function labelAnchor(labelX: number) {
  if (labelX < CENTER - 10) return "end";
  if (labelX > CENTER + 10) return "start";
  return "middle";
}

export function SpendingRadarChart() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const total = INSIGHT_CATEGORIES.length;
  const gridLevels = [0.25, 0.5, 0.75, 1];

  const dataPoints = INSIGHT_CATEGORIES.map((category, index) => ({
    ...category,
    ...radarPoint(index, total, category.pct),
    index,
  }));

  const polygonPoints = dataPoints
    .map((point) => `${point.x},${point.y}`)
    .join(" ");

  const activeCategory =
    activeIndex === null ? null : INSIGHT_CATEGORIES[activeIndex];

  const activePoint =
    activeIndex === null ? null : dataPoints[activeIndex];

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:items-start">
      <div className="relative">
        <div
          className="relative mx-auto w-full max-w-[24rem] px-2 sm:max-w-[26rem] sm:px-3"
          onMouseLeave={() => setActiveIndex(null)}
        >
          <svg
            viewBox={`0 0 ${VIEWBOX} ${VIEWBOX}`}
            className="h-auto w-full overflow-visible"
            role="img"
            aria-label="Quarterly spending radar chart. EMI is the largest category at 33 percent."
          >
            {gridLevels.map((level) => {
              const ringPoints = INSIGHT_CATEGORIES.map((_, index) => {
                const point = radarPoint(index, total, level * MAX_PCT);
                return `${point.x},${point.y}`;
              }).join(" ");

              return (
                <polygon
                  key={level}
                  points={ringPoints}
                  fill="none"
                  stroke="var(--landing-border)"
                  strokeWidth={level === 1 ? 1.25 : 1}
                  opacity={level === 1 ? 0.95 : 0.5}
                />
              );
            })}

            {INSIGHT_CATEGORIES.map((_, index) => {
              const end = radarPoint(index, total, MAX_PCT);
              return (
                <line
                  key={`axis-${INSIGHT_CATEGORIES[index].chartLabel}`}
                  x1={CENTER}
                  y1={CENTER}
                  x2={end.x}
                  y2={end.y}
                  stroke="var(--landing-border)"
                  strokeWidth={1}
                  opacity={0.65}
                />
              );
            })}

            <polygon
              points={polygonPoints}
              fill="color-mix(in oklab, var(--landing-accent) 24%, transparent)"
              stroke="var(--landing-accent)"
              strokeWidth={2}
              strokeLinejoin="round"
              className="transition-[opacity] duration-200"
              opacity={activeIndex === null ? 1 : 0.82}
            />

            {dataPoints.map((point) => {
              const isActive = activeIndex === point.index;
              const isTop = point.index === 0;

              return (
                <g
                  key={point.label}
                  className="cursor-pointer"
                  onMouseEnter={() => setActiveIndex(point.index)}
                  onFocus={() => setActiveIndex(point.index)}
                  onBlur={() => setActiveIndex(null)}
                  tabIndex={0}
                  role="button"
                  aria-label={`${point.label}, ${point.amount}, ${point.pct} percent of quarterly spend`}
                >
                  <circle
                    cx={point.x}
                    cy={point.y}
                    r={isActive ? 9 : 7}
                    fill="transparent"
                  />
                  <circle
                    cx={point.x}
                    cy={point.y}
                    r={isActive || isTop ? 5 : 4}
                    fill={
                      isActive || isTop
                        ? "var(--landing-accent)"
                        : "var(--landing-surface)"
                    }
                    stroke="var(--landing-accent)"
                    strokeWidth={isActive ? 2.25 : 1.75}
                    className="transition-all duration-200"
                  />
                </g>
              );
            })}

            {dataPoints.map((point) => {
              const isActive = activeIndex === point.index;

              return (
                <text
                  key={`${point.label}-label`}
                  x={point.labelX}
                  y={point.labelY}
                  textAnchor={labelAnchor(point.labelX)}
                  dominantBaseline="middle"
                  className={cn(
                    "select-none text-[10px] font-medium transition-[fill,font-weight] duration-200 sm:text-[11px]",
                    isActive
                      ? "fill-landing-accent font-semibold"
                      : "fill-landing-muted",
                  )}
                >
                  {point.chartLabel}
                </text>
              );
            })}
          </svg>

          {activeCategory && activePoint ? (
            <div
              className="pointer-events-none absolute z-10 w-[9.5rem] -translate-x-1/2 -translate-y-[calc(100%+0.65rem)] rounded-[var(--radius-md)] border border-landing-accent/25 bg-white/95 px-3 py-2 text-center shadow-[0_8px_24px_-12px_color-mix(in_oklab,var(--landing-accent)_35%,transparent)] backdrop-blur-sm transition-opacity duration-150"
              style={{
                left: `${(activePoint.x / VIEWBOX) * 100}%`,
                top: `${(activePoint.y / VIEWBOX) * 100}%`,
              }}
            >
              <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-landing-muted">
                {activeCategory.label}
              </p>
              <p className="mt-0.5 font-mono text-sm font-semibold tabular-nums text-landing-fg">
                {activeCategory.amount}
              </p>
              <p className="mt-0.5 font-mono text-xs font-semibold tabular-nums text-landing-accent">
                {activeCategory.pct}% of quarter
              </p>
            </div>
          ) : null}
        </div>

        <p className="mt-3 text-center text-[11px] text-landing-muted sm:text-xs">
          Hover a point to see amount and share of spend.
        </p>
      </div>

      <div className="space-y-4">
        <div className="rounded-[var(--radius-md)] border border-landing-border bg-white/80 p-4">
          <div className="flex items-center justify-between gap-3">
            <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-landing-muted">
              Category rank · Q1
            </p>
            <span className="font-mono text-xs font-semibold tabular-nums text-landing-fg">
              {INSIGHT_TOTAL}
            </span>
          </div>

          <ol className="mt-3 space-y-2">
            {INSIGHT_CATEGORIES.map((category, index) => (
              <li
                key={category.label}
                className={cn(
                  "flex items-center justify-between gap-3 rounded-[var(--radius-md)] px-2.5 py-2 text-[12px] transition-colors",
                  activeIndex === index && "bg-landing-accent-soft/55",
                  activeIndex !== index &&
                    index === 0 &&
                    "bg-landing-accent-soft/35",
                )}
                onMouseEnter={() => setActiveIndex(index)}
                onMouseLeave={() => setActiveIndex(null)}
              >
                <span className="flex items-center gap-2 text-landing-fg">
                  <span
                    className={cn(
                      "flex h-5 w-5 items-center justify-center rounded-full font-mono text-[10px] font-bold",
                      index === 0
                        ? "bg-landing-accent text-white"
                        : "bg-landing-border/60 text-landing-muted",
                    )}
                  >
                    {index + 1}
                  </span>
                  {category.label}
                </span>
                <span className="flex items-center gap-2">
                  <span className="font-mono tabular-nums text-landing-muted">
                    {category.amount}
                  </span>
                  <span
                    className={cn(
                      "min-w-[2.5rem] text-right font-mono font-semibold tabular-nums",
                      index === 0 ? "text-landing-accent" : "text-landing-fg",
                    )}
                  >
                    {category.pct}%
                  </span>
                </span>
              </li>
            ))}
          </ol>
        </div>

        <div className="rounded-[var(--radius-md)] border border-dashed border-landing-border bg-white/70 p-4">
          <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-landing-muted">
            Ask in plain language
          </p>
          <ul className="mt-3 flex flex-wrap gap-2">
            {INSIGHT_PROMPTS.map((prompt) => (
              <li
                key={prompt}
                className="rounded-full border border-landing-accent/20 bg-landing-accent-soft/35 px-3 py-1.5 text-[12px] leading-snug text-landing-fg"
              >
                {prompt}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
