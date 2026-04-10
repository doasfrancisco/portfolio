import type { CSSProperties } from "react";
import { MockupGallery } from "./mockups";

const mono: CSSProperties = { fontFamily: "var(--font-mono), monospace" };

function Prompt({ cmd }: { cmd: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
      <span
        style={{
          ...mono,
          color: "#22D3EE",
          fontSize: 13,
          fontWeight: 700,
          lineHeight: "16px",
        }}
      >
        catafract@maxilar
      </span>
      <span style={{ ...mono, color: "#555555", fontSize: 13, lineHeight: "16px" }}>
        :~ $
      </span>
      <span style={{ ...mono, color: "#FFFFFF", fontSize: 13, lineHeight: "16px" }}>
        {cmd}
      </span>
    </div>
  );
}

function Tab({
  label,
  index,
  active,
  dotColor,
}: {
  label: string;
  index: number;
  active?: boolean;
  dotColor: string;
}) {
  const borderColor = active ? "#22D3EE" : "#1A1A1A";
  const bg = active ? "#0F1A1C" : "#0A0A0A";
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        backgroundColor: bg,
        border: `${active ? "1.5px" : "1px"} solid ${borderColor}`,
        borderRadius: 8,
        paddingBlock: 10,
        paddingInline: 16,
        cursor: "pointer",
      }}
    >
      <div
        style={{
          width: 8,
          height: 8,
          borderRadius: 2,
          backgroundColor: dotColor,
        }}
      />
      <span
        style={{
          ...mono,
          color: active ? "#FFFFFF" : "#888888",
          fontSize: 12,
          fontWeight: active ? 700 : 600,
          lineHeight: "16px",
        }}
      >
        {label}
      </span>
      <div
        style={{
          backgroundColor: active ? "#0A0A0A" : "#050505",
          border: `1px solid ${active ? "#1A3A38" : "#1A1A1A"}`,
          borderRadius: 4,
          paddingBlock: 2,
          paddingInline: 7,
        }}
      >
        <span
          style={{
            ...mono,
            color: active ? "#22D3EE" : "#555555",
            fontSize: 9,
            fontWeight: 700,
            lineHeight: "12px",
          }}
        >
          {index}
        </span>
      </div>
    </div>
  );
}

function TabBar() {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        backgroundColor: "#050505",
        borderBottom: "1px solid #1A1A1A",
        paddingBlock: 14,
        paddingInline: 16,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          height: 20,
          borderRight: "1px solid #1A1A1A",
          marginRight: 2,
          paddingRight: 14,
        }}
      >
        <div
          style={{
            width: 12,
            height: 12,
            borderRadius: "50%",
            backgroundColor: "#FF5F57",
          }}
        />
        <div
          style={{
            width: 12,
            height: 12,
            borderRadius: "50%",
            backgroundColor: "#FEBC2E",
          }}
        />
        <div
          style={{
            width: 12,
            height: 12,
            borderRadius: "50%",
            backgroundColor: "#28C840",
          }}
        />
      </div>
      <Tab label="maxilar" index={1} active dotColor="#22D3EE" />
      <Tab label="syntax" index={2} dotColor="#3D2F5C" />
      <Tab label="inmoba" index={3} dotColor="#5C4316" />
      <div style={{ flexGrow: 1 }} />
      <span style={{ ...mono, color: "#1A1A1A", fontSize: 11, lineHeight: "14px" }}>
        |
      </span>
    </div>
  );
}

function Metadata() {
  const Item = ({ k, v, color }: { k: string; v: string; color?: string }) => (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <span style={{ ...mono, color: "#555555", fontSize: 11, lineHeight: "14px" }}>
        {k}
      </span>
      <span
        style={{
          ...mono,
          color: color ?? "#CCCCCC",
          fontSize: 12,
          fontWeight: 600,
          lineHeight: "16px",
        }}
      >
        {v}
      </span>
    </div>
  );
  const Pipe = () => (
    <span style={{ ...mono, color: "#1A1A1A", fontSize: 12, lineHeight: "16px" }}>
      |
    </span>
  );
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 24,
        paddingTop: 20,
      }}
    >
      <Item k="role" v="co-founder · ceo" />
      <Pipe />
      <Item k="raised" v="$15k equity free" />
      <Pipe />
      <Item k="exit" v="acquired by doctoc" color="#4EC86C" />
      <Pipe />
      <Item k="dates" v="jan 2025 — jan 2026" />
    </div>
  );
}

function GitLog() {
  const commits = [
    { hash: "a7f2c01", msg: "feat: hand off accounts to doctoc, archive infra" },
    {
      hash: "3d9b144",
      msg: "feat: scheduling agent now covers 12 clinics across lima",
    },
    {
      hash: "8e41a0b",
      msg: "fix: intake flow drops fewer leads after reminder rewrite",
    },
    { hash: "1c5ff20", msg: "chore: initial commit — one dentist, one agent, one dream" },
  ];
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 6,
        paddingTop: 20,
      }}
    >
      <Prompt cmd="git log --oneline -4" />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 4,
          paddingTop: 6,
        }}
      >
        {commits.map((c) => (
          <div
            key={c.hash}
            style={{
              display: "flex",
              alignItems: "baseline",
              gap: 14,
            }}
          >
            <span
              style={{
                ...mono,
                color: "#F59E0B",
                fontSize: 12,
                lineHeight: "16px",
              }}
            >
              {c.hash}
            </span>
            <span
              style={{
                ...mono,
                color: "#CCCCCC",
                fontSize: 12,
                lineHeight: "16px",
              }}
            >
              {c.msg}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function Gallery() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        paddingTop: 4,
      }}
    >
      <div style={{ paddingTop: 20 }}>
        <Prompt cmd="imgcat screens/*.png" />
      </div>
      <MockupGallery />
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 14,
          paddingTop: 14,
        }}
      >
        <span
          style={{
            ...mono,
            color: "#555555",
            fontSize: 11,
            lineHeight: "14px",
          }}
        >
          9 files · 8.7mb · rendered in 0.04s
        </span>
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          paddingTop: 16,
        }}
      >
        <span
          style={{
            ...mono,
            color: "#22D3EE",
            fontSize: 13,
            fontWeight: 700,
            lineHeight: "16px",
          }}
        >
          catafract@maxilar
        </span>
        <span
          style={{
            ...mono,
            color: "#555555",
            fontSize: 13,
            lineHeight: "16px",
          }}
        >
          :~ $
        </span>
        <div style={{ width: 8, height: 16, backgroundColor: "#22D3EE" }} />
      </div>
    </div>
  );
}

function TerminalBody() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 10,
        paddingBlock: 28,
        paddingInline: 32,
      }}
    >
      <Prompt cmd="cat about.md" />
      <h2
        style={{
          margin: 0,
          color: "#FFFFFF",
          fontSize: 36,
          fontWeight: 700,
          letterSpacing: "-1px",
          lineHeight: 1.1,
          paddingTop: 12,
        }}
      >
        AI agents for cool dentists.
      </h2>
      <p
        style={{
          margin: 0,
          color: "#888888",
          fontSize: 16,
          lineHeight: 1.6,
          maxWidth: 720,
          paddingTop: 4,
        }}
      >
        Maxilar built AI agents that sit inside dental practices — handling
        intake, scheduling, and follow-ups without the front desk breaking a
        sweat. We raised $15K equity free, shipped for a year, and sold to
        Doctoc in January.
      </p>
      <Metadata />
      <GitLog />
      <Gallery />
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderTop: "1px solid #1A1A1A",
          marginTop: 16,
          paddingTop: 16,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <a
            href="https://catafract.com"
            style={{
              ...mono,
              color: "#22D3EE",
              fontSize: 12,
              lineHeight: "16px",
              textDecoration: "underline",
            }}
          >
            catafract.com
          </a>
          <span
            style={{ ...mono, color: "#333333", fontSize: 12, lineHeight: "16px" }}
          >
            ↗
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <span
            style={{ ...mono, color: "#555555", fontSize: 11, lineHeight: "14px" }}
          >
            182 commits
          </span>
          <span
            style={{ ...mono, color: "#4EC86C", fontSize: 11, lineHeight: "14px" }}
          >
            ● shipped
          </span>
        </div>
      </div>
    </div>
  );
}

export function Terminal() {
  return (
    <div
      style={{
        width: 1100,
        backgroundColor: "#0A0A0A",
        border: "1px solid #1A1A1A",
        borderRadius: 12,
        overflow: "hidden",
        boxSizing: "border-box",
      }}
    >
      <TabBar />
      <TerminalBody />
    </div>
  );
}
