"use client";

import { useMemo, useState, type CSSProperties } from "react";
import { useTab, type TabKey, type YearKey } from "./tab-context";
import {
  COMMIT_BY_YEAR,
  COMMIT_DAYS,
  type ProjectKey,
} from "../_data/commits";

/* ----------------------------- config ----------------------------- */

const CELL = 12;
const STRIDE = 15;
const COLS = 53;
const ROWS = 7;
const SVG_W = COLS * STRIDE - (STRIDE - CELL); // 792
const SVG_H = ROWS * STRIDE - (STRIDE - CELL); // 102

const PROJECT_COLORS: Record<ProjectKey, string> = {
  maxilar: "#22D3EE",
  pulso: "#F472B6",
  syntax: "#A78BFA",
  inmoba: "#F59E0B",
  damelo: "#A3A3A3",
  doctoc: "#4EC86C",
};

const PROJECT_LABEL: Record<ProjectKey, string> = {
  maxilar: "maxilar",
  pulso: "pulso",
  syntax: "syntax",
  inmoba: "inmoba",
  damelo: "d.sh",
  doctoc: "doctoc",
};

const YEAR_SUBTITLE: Record<YearKey, string> = {
  "2026": "jan — dec 2026",
  "2025": "jan — dec 2025",
  "2024-2023": "2023 + 2024 · syntax era",
};

/* ----------------------------- helpers ----------------------------- */

function parseDate(iso: string): Date {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d);
}

function toIso(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${dd}`;
}

const COMMITS_BY_DATE = new Map<string, Partial<Record<ProjectKey, number>>>();
for (const day of COMMIT_DAYS) {
  COMMITS_BY_DATE.set(day.date, day.byProject);
}

type YearBreakdown = {
  year: number;
  byProject: Partial<Record<ProjectKey, number>>;
  total: number;
};

type CellInfo = {
  date: string; // anchor-year date (YYYY-MM-DD)
  col: number;
  row: number;
  byProject: Partial<Record<ProjectKey, number>>;
  total: number;
  dominant: ProjectKey | null;
  // present only for the combined "2024-2023" view
  yearBreakdown?: YearBreakdown[];
};

function computeDominantAndTotal(
  byProject: Partial<Record<ProjectKey, number>>,
): { total: number; dominant: ProjectKey | null } {
  let total = 0;
  let dominant: ProjectKey | null = null;
  let domCount = -1;
  for (const [p, c] of Object.entries(byProject) as [ProjectKey, number][]) {
    total += c;
    if (c > domCount) {
      domCount = c;
      dominant = p;
    }
  }
  return { total, dominant };
}

function buildSingleYear(year: number): CellInfo[] {
  const jan1 = new Date(year, 0, 1);
  const startSun = new Date(jan1);
  startSun.setDate(startSun.getDate() - startSun.getDay());

  const cells: CellInfo[] = [];
  for (let i = 0; i < COLS * ROWS; i++) {
    const d = new Date(startSun);
    d.setDate(d.getDate() + i);
    const col = Math.floor(i / ROWS);
    const row = i % ROWS;
    const date = toIso(d);
    const byProject = COMMITS_BY_DATE.get(date) ?? {};
    const { total, dominant } = computeDominantAndTotal(byProject);
    cells.push({ date, col, row, byProject, total, dominant });
  }
  return cells;
}

function buildCombined(anchorYear: number, otherYear: number): CellInfo[] {
  const jan1 = new Date(anchorYear, 0, 1);
  const startSun = new Date(jan1);
  startSun.setDate(startSun.getDate() - startSun.getDay());

  const cells: CellInfo[] = [];
  for (let i = 0; i < COLS * ROWS; i++) {
    const d = new Date(startSun);
    d.setDate(d.getDate() + i);
    const col = Math.floor(i / ROWS);
    const row = i % ROWS;
    const dateAnchor = toIso(d);
    const mmdd = dateAnchor.slice(5);
    const dateOther = `${otherYear}-${mmdd}`;

    const anchorData = COMMITS_BY_DATE.get(dateAnchor) ?? {};
    const otherData = COMMITS_BY_DATE.get(dateOther) ?? {};

    const merged: Partial<Record<ProjectKey, number>> = {};
    for (const [p, c] of Object.entries(anchorData) as [ProjectKey, number][]) {
      merged[p] = (merged[p] ?? 0) + c;
    }
    for (const [p, c] of Object.entries(otherData) as [ProjectKey, number][]) {
      merged[p] = (merged[p] ?? 0) + c;
    }

    const { total, dominant } = computeDominantAndTotal(merged);

    const anchorTotal = Object.values(anchorData).reduce(
      (s, v) => s + (v ?? 0),
      0,
    );
    const otherTotal = Object.values(otherData).reduce(
      (s, v) => s + (v ?? 0),
      0,
    );

    const yearBreakdown: YearBreakdown[] = [];
    if (anchorTotal > 0) {
      yearBreakdown.push({
        year: anchorYear,
        byProject: anchorData,
        total: anchorTotal,
      });
    }
    if (otherTotal > 0) {
      yearBreakdown.push({
        year: otherYear,
        byProject: otherData,
        total: otherTotal,
      });
    }

    cells.push({
      date: dateAnchor,
      col,
      row,
      byProject: merged,
      total,
      dominant,
      yearBreakdown: yearBreakdown.length > 0 ? yearBreakdown : undefined,
    });
  }
  return cells;
}

function buildCells(year: YearKey): CellInfo[] {
  if (year === "2026") return buildSingleYear(2026);
  if (year === "2025") return buildSingleYear(2025);
  return buildCombined(2024, 2023);
}

function cellOpacity(total: number): number {
  if (total <= 0) return 1;
  if (total <= 2) return 0.38;
  if (total <= 5) return 0.58;
  if (total <= 9) return 0.78;
  return 1;
}

function formatDateShort(iso: string, withDow: boolean, withYear: boolean): string {
  const d = parseDate(iso);
  const opts: Intl.DateTimeFormatOptions = {
    month: "short",
    day: "numeric",
  };
  if (withDow) opts.weekday = "short";
  if (withYear) opts.year = "numeric";
  return d.toLocaleDateString("en-US", opts);
}

/* ----------------------------- ui bits ----------------------------- */

const months = [
  { name: "Jan", g: 5 },
  { name: "Feb", g: 4 },
  { name: "Mar", g: 4 },
  { name: "Apr", g: 5 },
  { name: "May", g: 4 },
  { name: "Jun", g: 5 },
  { name: "Jul", g: 4 },
  { name: "Aug", g: 5 },
  { name: "Sep", g: 4 },
  { name: "Oct", g: 5 },
  { name: "Nov", g: 4 },
  { name: "Dec", g: 4 },
];

const dayLabelColStyle: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: 3,
  paddingTop: 22,
  width: 28,
};

const dayLabelRow = {
  color: "#555555",
  fontSize: 10,
  lineHeight: "12px",
  height: 12,
} as const;

type YearButtonProps = {
  year: YearKey;
  active: boolean;
  count: number;
  onClick: () => void;
};

function YearButton({ year, active, count, onClick }: YearButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        all: "unset",
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        gap: 2,
        backgroundColor: active ? "#FFFFFF" : "transparent",
        borderRadius: 8,
        paddingBlock: 10,
        paddingInline: 18,
        width: 148,
        boxSizing: "border-box",
        cursor: "pointer",
        transition: "background-color 120ms ease",
      }}
    >
      <div
        style={{
          color: active ? "#000000" : "#888888",
          fontSize: 13,
          fontWeight: 600,
          lineHeight: "16px",
        }}
      >
        {year}
      </div>
      <div
        style={{
          color: active ? "#555555" : "#444444",
          fontFamily: "var(--font-mono), monospace",
          fontSize: 10,
          lineHeight: "12px",
        }}
      >
        {count.toLocaleString()} commits
      </div>
    </button>
  );
}

/* ----------------------------- main ----------------------------- */

export function GraphCard() {
  const { activeYear, setActiveYear, focusTerminal } = useTab();
  const [hovered, setHovered] = useState<CellInfo | null>(null);

  const cells = useMemo(() => buildCells(activeYear), [activeYear]);
  const yearCount = COMMIT_BY_YEAR[activeYear] ?? 0;
  const isCombined = activeYear === "2024-2023";

  function handleClickCell(cell: CellInfo) {
    if (cell.dominant) {
      focusTerminal(cell.dominant as TabKey);
    }
  }

  return (
    <div
      style={{
        width: 1100,
        backgroundColor: "#0A0A0A",
        border: "1px solid #1A1A1A",
        borderRadius: 12,
        paddingBlock: 32,
        paddingInline: 40,
        display: "flex",
        flexDirection: "column",
        gap: 20,
        boxSizing: "border-box",
        position: "relative",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", alignItems: "baseline", gap: 14 }}>
          <div
            style={{
              color: "#FFFFFF",
              fontSize: 15,
              fontWeight: 600,
              lineHeight: "18px",
            }}
          >
            {yearCount.toLocaleString()} contributions ·{" "}
            <span style={{ color: "#888888", fontWeight: 500 }}>
              {YEAR_SUBTITLE[activeYear]}
            </span>
          </div>
          <div
            style={{
              color: "#555555",
              fontFamily: "var(--font-mono), monospace",
              fontSize: 12,
              lineHeight: "16px",
            }}
          >
            ~/catafract/projects
          </div>
        </div>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: 32,
        }}
      >
        <div style={{ display: "flex", gap: 8 }}>
          <div style={dayLabelColStyle}>
            <div style={{ height: 12 }} />
            <div style={dayLabelRow}>Mon</div>
            <div style={{ height: 12 }} />
            <div style={dayLabelRow}>Wed</div>
            <div style={{ height: 12 }} />
            <div style={dayLabelRow}>Fri</div>
            <div style={{ height: 12 }} />
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 6,
              position: "relative",
            }}
          >
            <div style={{ display: "flex", height: 16, width: SVG_W }}>
              {months.map((m) => (
                <div
                  key={m.name}
                  style={{
                    flexGrow: m.g,
                    flexBasis: 0,
                    color: "#666666",
                    fontSize: 10,
                    lineHeight: "12px",
                  }}
                >
                  {m.name}
                </div>
              ))}
            </div>

            <svg
              width={SVG_W}
              height={SVG_H}
              viewBox={`0 0 ${SVG_W} ${SVG_H}`}
              xmlns="http://www.w3.org/2000/svg"
              style={{ flexShrink: 0 }}
              onMouseLeave={() => setHovered(null)}
            >
              {cells.map((cell) => {
                const x = cell.col * STRIDE;
                const y = cell.row * STRIDE;
                const isEmpty = cell.total === 0;
                const fill = isEmpty
                  ? "#141414"
                  : PROJECT_COLORS[cell.dominant as ProjectKey];
                const opacity = cellOpacity(cell.total);
                const clickable = !isEmpty;
                return (
                  <rect
                    key={cell.date}
                    x={x}
                    y={y}
                    width={CELL}
                    height={CELL}
                    rx={2}
                    fill={fill}
                    fillOpacity={opacity}
                    style={{ cursor: clickable ? "pointer" : "default" }}
                    onMouseEnter={() => setHovered(cell)}
                    onClick={() => handleClickCell(cell)}
                  />
                );
              })}
            </svg>

            {hovered && hovered.total > 0 && (
              <Tooltip
                cell={hovered}
                containerWidth={SVG_W}
                isCombined={isCombined}
              />
            )}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {(["2026", "2025", "2024-2023"] as YearKey[]).map((y) => (
            <YearButton
              key={y}
              year={y}
              active={activeYear === y}
              count={COMMIT_BY_YEAR[y] ?? 0}
              onClick={() => setActiveYear(y)}
            />
          ))}
        </div>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderTop: "1px solid #1A1A1A",
          paddingTop: 14,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          {(Object.keys(PROJECT_COLORS) as ProjectKey[]).map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => focusTerminal(p as TabKey)}
              style={{
                all: "unset",
                display: "flex",
                alignItems: "center",
                gap: 6,
                cursor: "pointer",
              }}
            >
              <div
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: 2,
                  backgroundColor: PROJECT_COLORS[p],
                }}
              />
              <div
                style={{
                  color: "#CCCCCC",
                  fontSize: 12,
                  fontWeight: 500,
                  lineHeight: "16px",
                }}
              >
                {PROJECT_LABEL[p]}
              </div>
            </button>
          ))}
        </div>
        <div
          style={{
            color: "#555555",
            fontFamily: "var(--font-mono), monospace",
            fontSize: 11,
            lineHeight: "14px",
          }}
        >
          click any cell to jump to the project
        </div>
      </div>
    </div>
  );
}

/* ----------------------------- tooltip ----------------------------- */

function Tooltip({
  cell,
  containerWidth,
  isCombined,
}: {
  cell: CellInfo;
  containerWidth: number;
  isCombined: boolean;
}) {
  const xCenter = cell.col * STRIDE + CELL / 2;
  const yTop = cell.row * STRIDE;
  const yBottom = yTop + CELL;
  const estWidth = 240;
  const leftRaw = xCenter - estWidth / 2;
  const left = Math.max(0, Math.min(containerWidth - estWidth, leftRaw));
  const placeBelow = cell.row <= 2;
  const top = placeBelow ? yBottom + 10 : yTop - 10;

  return (
    <div
      style={{
        position: "absolute",
        left,
        top,
        transform: placeBelow ? "translateY(0)" : "translateY(-100%)",
        backgroundColor: "#050507",
        border: "1px solid #1C1C20",
        borderRadius: 8,
        padding: "10px 12px",
        minWidth: estWidth,
        pointerEvents: "none",
        zIndex: 20,
        boxShadow: "0 10px 24px rgba(0,0,0,0.5)",
      }}
    >
      {isCombined ? (
        <CombinedTooltipBody cell={cell} />
      ) : (
        <SingleTooltipBody cell={cell} />
      )}
      <div
        style={{
          marginTop: 8,
          paddingTop: 8,
          borderTop: "1px solid #1C1C20",
          color: "#444444",
          fontFamily: "var(--font-mono), monospace",
          fontSize: 10,
          lineHeight: "12px",
        }}
      >
        click to open tab
      </div>
    </div>
  );
}

function HeaderRow({ left, right }: { left: string; right: string }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 12,
      }}
    >
      <div
        style={{
          color: "#CCCCCC",
          fontFamily: "var(--font-mono), monospace",
          fontSize: 11,
          lineHeight: "14px",
        }}
      >
        {left}
      </div>
      <div
        style={{
          color: "#888888",
          fontFamily: "var(--font-mono), monospace",
          fontSize: 11,
          lineHeight: "14px",
        }}
      >
        {right}
      </div>
    </div>
  );
}

function ProjectLine({ p, count }: { p: ProjectKey; count: number }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 12,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <div
          style={{
            width: 8,
            height: 8,
            borderRadius: 2,
            backgroundColor: PROJECT_COLORS[p],
          }}
        />
        <div
          style={{
            color: "#E5E5E5",
            fontFamily: "var(--font-mono), monospace",
            fontSize: 11,
            lineHeight: "14px",
          }}
        >
          {PROJECT_LABEL[p]}
        </div>
      </div>
      <div
        style={{
          color: "#888888",
          fontFamily: "var(--font-mono), monospace",
          fontSize: 11,
          lineHeight: "14px",
        }}
      >
        {count}
      </div>
    </div>
  );
}

function SingleTooltipBody({ cell }: { cell: CellInfo }) {
  const entries = Object.entries(cell.byProject) as [ProjectKey, number][];
  entries.sort((a, b) => b[1] - a[1]);
  return (
    <>
      <HeaderRow
        left={formatDateShort(cell.date, true, true)}
        right={`${cell.total} ${cell.total === 1 ? "commit" : "commits"}`}
      />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 3,
          marginTop: 6,
        }}
      >
        {entries.map(([p, c]) => (
          <ProjectLine key={p} p={p} count={c} />
        ))}
      </div>
    </>
  );
}

function CombinedTooltipBody({ cell }: { cell: CellInfo }) {
  const breakdown = cell.yearBreakdown ?? [];
  return (
    <>
      <HeaderRow
        left={formatDateShort(cell.date, false, false)}
        right={`${cell.total} ${cell.total === 1 ? "commit" : "commits"}`}
      />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 8,
          marginTop: 8,
        }}
      >
        {breakdown.map((yr) => {
          const entries = Object.entries(yr.byProject) as [
            ProjectKey,
            number,
          ][];
          entries.sort((a, b) => b[1] - a[1]);
          return (
            <div
              key={yr.year}
              style={{ display: "flex", flexDirection: "column", gap: 3 }}
            >
              <div
                style={{
                  color: "#666666",
                  fontFamily: "var(--font-mono), monospace",
                  fontSize: 10,
                  lineHeight: "12px",
                  letterSpacing: "0.2px",
                }}
              >
                {yr.year}
              </div>
              {entries.map(([p, c]) => (
                <ProjectLine key={p} p={p} count={c} />
              ))}
            </div>
          );
        })}
      </div>
    </>
  );
}
