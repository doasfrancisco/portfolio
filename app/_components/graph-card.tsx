const empty: [number, number][] = [
  [0, 0], [30, 0], [60, 0], [75, 0], [105, 0], [135, 0], [210, 0], [405, 0],
  [465, 0], [495, 0], [525, 0], [555, 0], [570, 0], [600, 0], [615, 0], [765, 0],
  [0, 15], [30, 15], [45, 15], [75, 15], [90, 15], [195, 15], [210, 15], [270, 15],
  [285, 15], [345, 15], [390, 15], [405, 15], [480, 15], [495, 15], [540, 15],
  [555, 15], [570, 15], [585, 15], [615, 15], [630, 15], [690, 15],
  [0, 30], [15, 30], [30, 30], [45, 30], [75, 30], [150, 30], [195, 30], [360, 30],
  [390, 30], [495, 30], [540, 30], [555, 30], [615, 30], [630, 30], [675, 30],
  [705, 30], [720, 30], [750, 30], [765, 30],
  [15, 45], [30, 45], [45, 45], [60, 45], [90, 45], [195, 45], [345, 45], [405, 45],
  [480, 45], [525, 45], [540, 45], [555, 45], [585, 45], [600, 45], [645, 45],
  [705, 45],
  [0, 60], [90, 60], [105, 60], [120, 60], [135, 60], [165, 60], [270, 60], [435, 60],
  [465, 60], [480, 60], [510, 60], [570, 60], [630, 60], [705, 60], [720, 60],
  [0, 75], [15, 75], [30, 75], [60, 75], [150, 75], [165, 75], [195, 75], [225, 75],
  [240, 75], [315, 75], [345, 75], [360, 75], [390, 75], [435, 75], [450, 75],
  [465, 75], [525, 75], [570, 75], [615, 75], [630, 75], [645, 75], [690, 75],
  [735, 75], [750, 75],
  [0, 90], [15, 90], [30, 90], [45, 90], [75, 90], [90, 90], [105, 90], [150, 90],
  [180, 90], [315, 90], [345, 90], [360, 90], [420, 90], [465, 90], [525, 90],
  [540, 90], [555, 90], [585, 90], [630, 90], [720, 90],
];

const maxilar: [number, number][] = [
  [15, 0], [45, 0], [90, 0], [120, 0], [150, 0], [165, 0], [180, 0], [195, 0],
  [225, 0], [240, 0], [255, 0], [270, 0], [285, 0], [300, 0], [315, 0], [330, 0],
  [345, 0], [360, 0], [375, 0], [390, 0], [420, 0], [435, 0], [450, 0], [480, 0],
  [510, 0], [540, 0], [585, 0],
  [15, 15], [60, 15], [105, 15], [120, 15], [135, 15], [150, 15], [165, 15],
  [180, 15], [225, 15], [240, 15], [255, 15], [300, 15], [315, 15], [330, 15],
  [360, 15], [375, 15], [420, 15], [435, 15], [450, 15], [465, 15], [510, 15],
  [525, 15], [600, 15],
  [60, 30], [90, 30], [105, 30], [120, 30], [135, 30], [165, 30], [180, 30],
  [210, 30], [225, 30], [240, 30], [255, 30], [270, 30], [285, 30], [300, 30],
  [315, 30], [330, 30], [345, 30], [375, 30], [405, 30], [420, 30], [435, 30],
  [450, 30], [465, 30], [480, 30], [510, 30], [525, 30], [570, 30],
  [0, 45], [75, 45], [105, 45], [120, 45], [135, 45], [150, 45], [165, 45], [180, 45],
  [210, 45], [225, 45], [240, 45], [255, 45], [270, 45], [285, 45], [300, 45],
  [315, 45], [330, 45], [360, 45], [375, 45], [390, 45], [420, 45], [435, 45],
  [450, 45], [465, 45], [495, 45], [510, 45], [570, 45],
  [15, 60], [30, 60], [45, 60], [60, 60], [75, 60], [150, 60], [180, 60], [195, 60],
  [210, 60], [225, 60], [240, 60], [255, 60], [285, 60], [300, 60], [315, 60],
  [330, 60], [345, 60], [360, 60], [375, 60], [390, 60], [405, 60], [420, 60],
  [450, 60], [495, 60], [525, 60], [540, 60], [555, 60], [585, 60],
  [45, 75], [75, 75], [90, 75], [105, 75], [120, 75], [135, 75], [180, 75], [210, 75],
  [255, 75], [270, 75], [285, 75], [300, 75], [330, 75], [375, 75], [405, 75],
  [420, 75], [480, 75], [495, 75], [510, 75], [540, 75], [555, 75], [600, 75],
  [60, 90], [120, 90], [135, 90], [165, 90], [195, 90], [210, 90], [225, 90],
  [240, 90], [255, 90], [270, 90], [285, 90], [300, 90], [330, 90], [375, 90],
  [390, 90], [405, 90], [435, 90], [450, 90], [480, 90], [495, 90], [510, 90],
  [570, 90], [615, 90],
];

const inmoba: [number, number][] = [
  [630, 0], [645, 0], [660, 0], [675, 0], [690, 0], [705, 0], [720, 0], [735, 0],
  [750, 0],
  [645, 15], [660, 15], [675, 15], [705, 15], [720, 15], [735, 15], [750, 15],
  [765, 15],
  [585, 30], [600, 30], [645, 30], [660, 30], [690, 30], [735, 30],
  [615, 45], [630, 45], [660, 45], [675, 45], [690, 45], [720, 45], [735, 45],
  [750, 45], [765, 45],
  [600, 60], [615, 60], [645, 60], [660, 60], [675, 60], [690, 60], [735, 60],
  [750, 60], [765, 60],
  [585, 75], [660, 75], [675, 75], [705, 75], [720, 75], [765, 75],
  [600, 90], [645, 90], [660, 90], [675, 90], [690, 90], [705, 90], [735, 90],
  [750, 90], [765, 90],
];

function Cells({ color, data }: { color: string; data: [number, number][] }) {
  return (
    <g fill={color}>
      {data.map(([x, y]) => (
        <rect key={`${color}-${x}-${y}`} x={x} y={y} width={12} height={12} rx={2} />
      ))}
    </g>
  );
}

const months = [
  { name: "Apr", g: 5 }, { name: "May", g: 4 }, { name: "Jun", g: 4 },
  { name: "Jul", g: 4 }, { name: "Aug", g: 5 }, { name: "Sep", g: 4 },
  { name: "Oct", g: 4 }, { name: "Nov", g: 5 }, { name: "Dec", g: 4 },
  { name: "Jan", g: 4 }, { name: "Feb", g: 5 }, { name: "Mar", g: 4 },
];

const yearRow = {
  color: "#666666",
  fontSize: 13,
  fontWeight: 500,
  lineHeight: "16px",
  width: 148,
  paddingBlock: 10,
  paddingInline: 18,
  boxSizing: "border-box",
} as const;

export function GraphCard() {
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
            412 contributions in the last year
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
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 3,
              paddingTop: 22,
              width: 28,
            }}
          >
            <div style={{ height: 12 }} />
            <div
              style={{
                color: "#555555",
                fontSize: 10,
                lineHeight: "12px",
                height: 12,
              }}
            >
              Mon
            </div>
            <div style={{ height: 12 }} />
            <div
              style={{
                color: "#555555",
                fontSize: 10,
                lineHeight: "12px",
                height: 12,
              }}
            >
              Wed
            </div>
            <div style={{ height: 12 }} />
            <div
              style={{
                color: "#555555",
                fontSize: 10,
                lineHeight: "12px",
                height: 12,
              }}
            >
              Fri
            </div>
            <div style={{ height: 12 }} />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <div style={{ display: "flex", height: 16, width: 777 }}>
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
              width="777"
              height="102"
              viewBox="0 0 777 102"
              xmlns="http://www.w3.org/2000/svg"
              style={{ flexShrink: 0 }}
            >
              <Cells color="#141414" data={empty} />
              <Cells color="#22D3EE" data={maxilar} />
              <Cells color="#F59E0B" data={inmoba} />
            </svg>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <div
            style={{
              backgroundColor: "#FFFFFF",
              borderRadius: 8,
              paddingBlock: 10,
              paddingInline: 18,
              width: 148,
              boxSizing: "border-box",
            }}
          >
            <div
              style={{
                color: "#000000",
                fontSize: 13,
                fontWeight: 600,
                lineHeight: "16px",
              }}
            >
              2026
            </div>
          </div>
          <div style={yearRow}>2025</div>
          <div style={yearRow}>2024-2023</div>
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
          {[
            { c: "#22D3EE", l: "maxilar" },
            { c: "#A78BFA", l: "syntax" },
            { c: "#F59E0B", l: "inmoba" },
            { c: "#4EC86C", l: "damelo" },
          ].map(({ c, l }) => (
            <div
              key={l}
              style={{ display: "flex", alignItems: "center", gap: 6 }}
            >
              <div
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: 2,
                  backgroundColor: c,
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
                {l}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
