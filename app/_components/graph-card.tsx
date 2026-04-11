"use client";

import { useMemo, useState } from "react";
import { useTab, type TabKey, type YearKey } from "./tab-context";
import {
  COMMIT_BY_YEAR,
  COMMIT_DAYS,
  type ProjectKey,
} from "../_data/commits";

/* ----------------------------- config ----------------------------- */

const COLS = 53;
const ROWS = 7;

// vertical variant (sidebar on desktop)
// each row holds 14 days (2 weeks), so the grid is 14 cols x 27 rows
const V_CELL = 10;
const V_STRIDE = 13;
const V_GRID_COLS = 14;
const V_GRID_ROWS = 27;
const V_SVG_W = V_GRID_COLS * V_STRIDE - (V_STRIDE - V_CELL); // 179
const V_SVG_H = V_GRID_ROWS * V_STRIDE - (V_STRIDE - V_CELL); // 348

function gridPosFor(cell: CellInfo): { gridCol: number; gridRow: number } {
  // cell.col = week (0..52), cell.row = dayOfWeek (0..6)
  const linearIdx = cell.col * 7 + cell.row;
  return {
    gridCol: linearIdx % V_GRID_COLS,
    gridRow: Math.floor(linearIdx / V_GRID_COLS),
  };
}

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

/* ----------------------------- main ----------------------------- */

export function GraphCard() {
  return (
    <>
      <div className="catafract-desktop-only">
        <GraphCardDesktop />
      </div>
      <div className="catafract-mobile-only catafract-graph-section">
        <GraphCardMobile />
      </div>
    </>
  );
}

function GraphCardDesktop() {
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
        width: "100%",
        backgroundColor: "#0A0A0A",
        border: "1px solid #1A1A1A",
        borderRadius: 12,
        paddingBlock: 24,
        paddingInline: 22,
        display: "flex",
        flexDirection: "column",
        gap: 16,
        boxSizing: "border-box",
        position: "relative",
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        <div
          style={{
            color: "#FFFFFF",
            fontSize: 14,
            fontWeight: 600,
            lineHeight: "18px",
          }}
        >
          {yearCount.toLocaleString()} contributions
        </div>
        <div
          style={{
            color: "#555555",
            fontFamily: "var(--font-mono), monospace",
            fontSize: 11,
            lineHeight: "14px",
          }}
        >
          ~/catafract/projects · {YEAR_SUBTITLE[activeYear]}
        </div>
      </div>

      <div
        style={{
          display: "flex",
          gap: 6,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {(
          [
            ["2026", "2026"],
            ["2025", "2025"],
            ["2024-2023", "24–23"],
          ] as [YearKey, string][]
        ).map(([y, label]) => (
          <VerticalYearPill
            key={y}
            label={label}
            active={activeYear === y}
            onClick={() => setActiveYear(y)}
          />
        ))}
      </div>

      <div
        style={{
          position: "relative",
          width: "100%",
          paddingTop: 2,
        }}
      >
        <div
          style={{
            position: "relative",
            width: V_SVG_W,
            marginInline: "auto",
          }}
        >
          <svg
            width={V_SVG_W}
            height={V_SVG_H}
            viewBox={`0 0 ${V_SVG_W} ${V_SVG_H}`}
            xmlns="http://www.w3.org/2000/svg"
            style={{ display: "block", overflow: "visible" }}
            onMouseLeave={() => setHovered(null)}
          >
            {cells.map((cell) => {
              const { gridCol, gridRow } = gridPosFor(cell);
              const x = gridCol * V_STRIDE;
              const y = gridRow * V_STRIDE;
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
                  width={V_CELL}
                  height={V_CELL}
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

          <div
            style={{
              position: "absolute",
              left: "calc(100% + 8px)",
              top: 0,
              width: 28,
              display: "flex",
              flexDirection: "column",
            }}
          >
            {months.map((m) => (
              <div
                key={m.name}
                style={{
                  height: (m.g / 2) * V_STRIDE,
                  color: "#666666",
                  fontSize: 10,
                  lineHeight: "12px",
                }}
              >
                {m.name}
              </div>
            ))}
          </div>

          {hovered && hovered.total > 0 && (
            <VerticalTooltip cell={hovered} isCombined={isCombined} />
          )}
        </div>
      </div>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "10px 14px",
          justifyContent: "center",
          alignItems: "center",
          borderTop: "1px solid #1A1A1A",
          paddingTop: 14,
        }}
      >
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
                fontSize: 11,
                fontWeight: 500,
                lineHeight: "13px",
              }}
            >
              {PROJECT_LABEL[p]}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

function VerticalYearPill({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        all: "unset",
        cursor: "pointer",
        backgroundColor: active ? "#FFFFFF" : "transparent",
        border: active ? "none" : "1px solid #222222",
        borderRadius: 6,
        paddingBlock: active ? 7 : 6,
        paddingInline: 12,
        color: active ? "#000000" : "#888888",
        fontSize: 11,
        fontWeight: active ? 700 : 500,
        lineHeight: "13px",
        textAlign: "center",
        boxSizing: "border-box",
      }}
    >
      {label}
    </button>
  );
}

function VerticalTooltip({
  cell,
  isCombined,
}: {
  cell: CellInfo;
  isCombined: boolean;
}) {
  const { gridRow } = gridPosFor(cell);
  const yCenter = gridRow * V_STRIDE + V_CELL / 2;
  const maxY = V_GRID_ROWS * V_STRIDE;
  const topRaw = yCenter - 50;
  const top = Math.max(0, Math.min(maxY - 120, topRaw));

  return (
    <div
      style={{
        position: "absolute",
        right: "calc(100% + 12px)",
        top,
        backgroundColor: "#050507",
        border: "1px solid #1C1C20",
        borderRadius: 8,
        padding: "10px 12px",
        minWidth: 220,
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

/* ----------------------------- tooltip ----------------------------- */

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

/* ----------------------------- mobile ----------------------------- */

const MOBILE_MONTH_LETTERS = [
  "J",
  "F",
  "M",
  "A",
  "M",
  "J",
  "J",
  "A",
  "S",
  "O",
  "N",
  "D",
];

const MOBILE_LEGEND: ProjectKey[] = [
  "maxilar",
  "pulso",
  "syntax",
  "inmoba",
  "damelo",
  "doctoc",
];

type MobileCell = {
  month: number;
  weekRow: number;
  dominant: ProjectKey | null;
  total: number;
};

function weekRowForDay(day: number): number {
  if (day <= 6) return 0;
  if (day <= 13) return 1;
  if (day <= 20) return 2;
  if (day <= 27) return 3;
  return 4;
}

function buildMobileCells(year: YearKey): MobileCell[] {
  const years =
    year === "2026" ? [2026] : year === "2025" ? [2025] : [2024, 2023];

  const buckets = new Map<string, Partial<Record<ProjectKey, number>>>();
  for (let m = 0; m < 12; m++) {
    for (let r = 0; r < 5; r++) {
      buckets.set(`${m}-${r}`, {});
    }
  }

  for (const day of COMMIT_DAYS) {
    const [yStr, mStr, dStr] = day.date.split("-");
    const y = Number(yStr);
    if (!years.includes(y)) continue;
    const m = Number(mStr) - 1;
    const d = Number(dStr);
    const r = weekRowForDay(d);
    const key = `${m}-${r}`;
    const existing = buckets.get(key)!;
    for (const [p, c] of Object.entries(day.byProject) as [
      ProjectKey,
      number,
    ][]) {
      existing[p] = (existing[p] ?? 0) + c;
    }
  }

  const cells: MobileCell[] = [];
  for (let m = 0; m < 12; m++) {
    for (let r = 0; r < 5; r++) {
      const merged = buckets.get(`${m}-${r}`)!;
      const { total, dominant } = computeDominantAndTotal(merged);
      cells.push({ month: m, weekRow: r, dominant, total });
    }
  }
  return cells;
}

function GraphCardMobile() {
  const { activeYear, setActiveYear, focusTerminal } = useTab();
  const cells = useMemo(() => buildMobileCells(activeYear), [activeYear]);
  const yearCount = COMMIT_BY_YEAR[activeYear] ?? 0;

  const YEAR_OPTIONS: { key: YearKey; label: string }[] = [
    { key: "2026", label: "2026" },
    { key: "2025", label: "2025" },
    { key: "2024-2023", label: "2024–23" },
  ];

  return (
    <div
      style={{
        width: "100%",
        maxWidth: 312,
        marginInline: "auto",
        boxSizing: "border-box",
        backgroundColor: "#0A0A0A",
        border: "1px solid #1A1A1A",
        borderRadius: 12,
        padding: 18,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 14,
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          gap: 4,
        }}
      >
        <div
          style={{
            color: "#FFFFFF",
            fontSize: 14,
            fontWeight: 600,
            lineHeight: "17px",
          }}
        >
          {yearCount.toLocaleString()} contributions in the last year
        </div>
        <div
          style={{
            color: "#555555",
            fontFamily: "var(--font-mono), monospace",
            fontSize: 11,
            lineHeight: "14px",
          }}
        >
          ~/catafract/projects
        </div>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          gap: 6,
        }}
      >
        {YEAR_OPTIONS.map((y) => {
          const active = activeYear === y.key;
          return (
            <button
              key={y.key}
              type="button"
              onClick={() => setActiveYear(y.key)}
              style={{
                all: "unset",
                cursor: "pointer",
                backgroundColor: active ? "#FFFFFF" : "transparent",
                border: active ? "none" : "1px solid #1A1A1A",
                borderRadius: 6,
                paddingBlock: active ? 7 : 6,
                paddingInline: 12,
                color: active ? "#000000" : "#666666",
                fontSize: 11,
                fontWeight: active ? 700 : 500,
                lineHeight: "13px",
              }}
            >
              {y.label}
            </button>
          );
        })}
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: 201,
          gap: 6,
        }}
      >
        <div
          style={{
            display: "flex",
            gap: 3,
            width: 201,
          }}
        >
          {MOBILE_MONTH_LETTERS.map((letter, i) => (
            <div
              key={i}
              style={{
                width: 14,
                textAlign: "center",
                color: i === 0 ? "#888888" : "#666666",
                fontFamily: "var(--font-mono), monospace",
                fontSize: 8,
                lineHeight: "10px",
              }}
            >
              {letter}
            </div>
          ))}
        </div>
        <svg
          width={201}
          height={82}
          viewBox="0 0 201 82"
          xmlns="http://www.w3.org/2000/svg"
          style={{ flexShrink: 0 }}
        >
          {cells.map((cell) => {
            const x = cell.month * 17;
            const y = cell.weekRow * 17;
            const isEmpty = cell.total === 0;
            const fill = isEmpty
              ? "#141414"
              : PROJECT_COLORS[cell.dominant as ProjectKey];
            const opacity = cellOpacity(cell.total);
            const clickable = !isEmpty;
            return (
              <rect
                key={`${cell.month}-${cell.weekRow}`}
                x={x}
                y={y}
                width={14}
                height={14}
                rx={2}
                fill={fill}
                fillOpacity={opacity}
                style={{ cursor: clickable ? "pointer" : "default" }}
                onClick={() => {
                  if (cell.dominant)
                    focusTerminal(cell.dominant as TabKey);
                }}
              />
            );
          })}
        </svg>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexWrap: "wrap",
          width: 276,
          gap: "10px 14px",
          borderTop: "1px solid #1A1A1A",
          paddingTop: 14,
        }}
      >
        {MOBILE_LEGEND.map((p) => (
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
                width: 9,
                height: 9,
                borderRadius: 2,
                backgroundColor: PROJECT_COLORS[p],
              }}
            />
            <div
              style={{
                color: "#CCCCCC",
                fontSize: 11,
                fontWeight: 500,
                lineHeight: "13px",
              }}
            >
              {PROJECT_LABEL[p]}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
