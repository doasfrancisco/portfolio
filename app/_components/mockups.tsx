import type { ReactNode, CSSProperties } from "react";

const mono: CSSProperties = { fontFamily: "var(--font-mono), monospace" };

function Mockup({
  num,
  title,
  size,
  titleBarWidth,
  headerRight,
  children,
}: {
  num: string;
  title: string;
  size: string;
  titleBarWidth: number;
  headerRight?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div
      className="catafract-terminal-tile"
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 8,
        width: 320,
        flexShrink: 0,
      }}
    >
      <div
        className="catafract-terminal-tile-box"
        style={{
          backgroundColor: "#0A1518",
          border: "1px solid #1A3A3E",
          borderRadius: 8,
          height: 180,
          padding: 12,
          display: "flex",
          flexDirection: "column",
          gap: 8,
          boxSizing: "border-box",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <div
            style={{
              width: 5,
              height: 5,
              borderRadius: "50%",
              backgroundColor: "#22D3EE",
            }}
          />
          <div
            style={{
              width: titleBarWidth,
              height: 4,
              borderRadius: 2,
              backgroundColor: "#1A3A3E",
            }}
          />
          <div style={{ flexGrow: 1 }} />
          {headerRight}
        </div>
        {children}
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          paddingInline: 4,
        }}
      >
        <div
          className="catafract-terminal-tile-label-num"
          style={{ ...mono, color: "#555555", fontSize: 10, lineHeight: "12px" }}
        >
          {num}
        </div>
        <div
          className="catafract-terminal-tile-label-name"
          style={{
            ...mono,
            color: "#CCCCCC",
            fontSize: 11,
            fontWeight: 600,
            lineHeight: "14px",
          }}
        >
          {title}
        </div>
        <div style={{ flexGrow: 1 }} />
        <div
          className="catafract-terminal-tile-label-size"
          style={{ ...mono, color: "#444444", fontSize: 10, lineHeight: "12px" }}
        >
          {size}
        </div>
      </div>
    </div>
  );
}

const card = (h?: number): CSSProperties => ({
  backgroundColor: "#0F2124",
  border: "1px solid #1A3A3E",
  borderRadius: 3,
  ...(h !== undefined ? { height: h } : {}),
});

const sideBar = (w: number) => ({
  width: w,
  height: 4,
  borderRadius: 2,
  backgroundColor: "#1A3A3E",
});

/* 01 — dashboard */
function Dashboard() {
  return (
    <Mockup
      num="01"
      title="dashboard.png"
      size="1.2mb"
      titleBarWidth={50}
      headerRight={<div style={sideBar(24)} />}
    >
      <div style={{ display: "flex", flexGrow: 1, gap: 6 }}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 5,
            width: 54,
            flexShrink: 0,
          }}
        >
          <div
            style={{ height: 7, borderRadius: 2, backgroundColor: "#22D3EE" }}
          />
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              style={{ height: 5, borderRadius: 2, backgroundColor: "#1A3A3E" }}
            />
          ))}
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            flexGrow: 1,
            gap: 5,
          }}
        >
          <div style={{ display: "flex", gap: 5 }}>
            <div style={{ ...card(34), flex: 1 }} />
            <div style={{ ...card(34), flex: 1 }} />
          </div>
          <div style={{ ...card(), flexGrow: 1 }} />
        </div>
      </div>
    </Mockup>
  );
}

/* 02 — chat */
function Chat() {
  return (
    <Mockup num="02" title="chat.png" size="0.8mb" titleBarWidth={45}>
      <div style={{ display: "flex", flexGrow: 1, gap: 6 }}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 5,
            width: 78,
            flexShrink: 0,
          }}
        >
          {[true, false, false, false].map((active, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 4,
                paddingBlock: 3,
                paddingInline: 2,
                backgroundColor: active ? "#0F2124" : "transparent",
                borderRadius: 3,
              }}
            >
              <div
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: "50%",
                  backgroundColor: active ? "#22D3EE" : "#1A3A3E",
                }}
              />
              <div
                style={{
                  flexGrow: 1,
                  height: 3,
                  borderRadius: 1,
                  backgroundColor: "#1A3A3E",
                }}
              />
            </div>
          ))}
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            flexGrow: 1,
            gap: 6,
            paddingTop: 2,
          }}
        >
          <div
            style={{
              alignSelf: "flex-start",
              backgroundColor: "#0F2124",
              border: "1px solid #1A3A3E",
              borderRadius: 6,
              height: 12,
              width: "75%",
            }}
          />
          <div
            style={{
              alignSelf: "flex-end",
              backgroundColor: "#143438",
              borderRadius: 6,
              height: 12,
              width: "55%",
            }}
          />
          <div
            style={{
              alignSelf: "flex-start",
              backgroundColor: "#0F2124",
              border: "1px solid #1A3A3E",
              borderRadius: 6,
              height: 12,
              width: "65%",
            }}
          />
          <div
            style={{
              alignSelf: "flex-end",
              backgroundColor: "#143438",
              borderRadius: 6,
              height: 12,
              width: "45%",
            }}
          />
        </div>
      </div>
    </Mockup>
  );
}

/* 03 — schedule */
function Schedule() {
  const h1 = Array(7).fill(0);
  const row = (highlightIdx: number) =>
    h1.map((_, i) => (
      <div
        key={i}
        style={{
          flex: 1,
          backgroundColor: i === highlightIdx ? "#22D3EE" : "#0F2124",
          border:
            i === highlightIdx
              ? "1px solid #22D3EE"
              : "1px solid #1A3A3E",
          borderRadius: 2,
        }}
      />
    ));
  return (
    <Mockup
      num="03"
      title="schedule.png"
      size="1.4mb"
      titleBarWidth={55}
      headerRight={<div style={sideBar(22)} />}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          flexGrow: 1,
          gap: 3,
        }}
      >
        <div style={{ display: "flex", gap: 3, height: 6, flexShrink: 0 }}>
          {h1.map((_, i) => (
            <div
              key={i}
              style={{
                flex: 1,
                borderRadius: 1,
                backgroundColor: i === 3 ? "#22D3EE" : "#1A3A3E",
              }}
            />
          ))}
        </div>
        <div style={{ display: "flex", flexGrow: 1, gap: 3 }}>{row(2)}</div>
        <div style={{ display: "flex", flexGrow: 1, gap: 3 }}>{row(4)}</div>
        <div style={{ display: "flex", flexGrow: 1, gap: 3 }}>{row(1)}</div>
      </div>
    </Mockup>
  );
}

/* 04 — intake */
function Intake() {
  return (
    <Mockup num="04" title="intake.png" size="0.6mb" titleBarWidth={40}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          flexGrow: 1,
          gap: 7,
          paddingInline: 18,
          paddingTop: 2,
        }}
      >
        {[60, 50, 72].map((w, i) => (
          <div
            key={i}
            style={{ display: "flex", flexDirection: "column", gap: 2 }}
          >
            <div
              style={{
                width: w,
                height: 3,
                borderRadius: 1,
                backgroundColor: "#1A3A3E",
              }}
            />
            <div style={{ ...card(14) }} />
          </div>
        ))}
        <div style={{ flexGrow: 1 }} />
        <div
          style={{ height: 16, borderRadius: 3, backgroundColor: "#22D3EE" }}
        />
      </div>
    </Mockup>
  );
}

/* 05 — voice-agent */
function VoiceAgent() {
  const bars = [
    { h: 10, c: "#143438" },
    { h: 18, c: "#143438" },
    { h: 28, c: "#1A9BAC" },
    { h: 42, c: "#22D3EE" },
    { h: 58, c: "#22D3EE" },
    { h: 72, c: "#22D3EE" },
    { h: 94, c: "#22D3EE" },
    { h: 74, c: "#22D3EE" },
    { h: 56, c: "#22D3EE" },
    { h: 82, c: "#22D3EE" },
    { h: 64, c: "#22D3EE" },
    { h: 46, c: "#22D3EE" },
    { h: 34, c: "#1A9BAC" },
    { h: 22, c: "#143438" },
    { h: 14, c: "#143438" },
  ];
  return (
    <Mockup
      num="05"
      title="voice-agent.png"
      size="2.1mb"
      titleBarWidth={58}
      headerRight={
        <div
          style={{
            width: 8,
            height: 8,
            borderRadius: "50%",
            backgroundColor: "#22D3EE",
          }}
        />
      }
    >
      <div
        style={{
          display: "flex",
          flexGrow: 1,
          alignItems: "center",
          justifyContent: "center",
          gap: 3,
          paddingInline: 10,
        }}
      >
        {bars.map((b, i) => (
          <div
            key={i}
            style={{
              width: 3,
              height: b.h,
              borderRadius: 1,
              backgroundColor: b.c,
              flexShrink: 0,
            }}
          />
        ))}
      </div>
    </Mockup>
  );
}

/* 06 — analytics */
function Analytics() {
  const bars = [
    { h: 35, c: "#143438" },
    { h: 55, c: "#1A9BAC" },
    { h: 85, c: "#22D3EE" },
    { h: 65, c: "#1A9BAC" },
    { h: 105, c: "#22D3EE" },
    { h: 125, c: "#22D3EE" },
  ];
  return (
    <Mockup
      num="06"
      title="analytics.png"
      size="0.9mb"
      titleBarWidth={52}
      headerRight={<div style={sideBar(18)} />}
    >
      <div
        style={{
          display: "flex",
          flexGrow: 1,
          alignItems: "flex-end",
          gap: 8,
          paddingInline: 10,
          paddingBottom: 2,
        }}
      >
        {bars.map((b, i) => (
          <div
            key={i}
            style={{
              flex: 1,
              height: b.h,
              backgroundColor: b.c,
              borderTopLeftRadius: 2,
              borderTopRightRadius: 2,
            }}
          />
        ))}
      </div>
    </Mockup>
  );
}

/* 07 — settings */
function Settings() {
  const rows = [
    { l1: 80, l2: 120, on: true },
    { l1: 70, l2: 100, on: true },
    { l1: 90, l2: 110, on: false },
    { l1: 60, l2: 90, on: false },
  ];
  return (
    <Mockup num="07" title="settings.png" size="0.5mb" titleBarWidth={48}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          flexGrow: 1,
          gap: 9,
          paddingBlock: 4,
          paddingInline: 6,
        }}
      >
        {rows.map((r, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              borderBottom: i < 3 ? "1px solid #1A3A3E" : "none",
              paddingBottom: i < 3 ? 6 : 0,
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                flexGrow: 1,
                gap: 2,
              }}
            >
              <div
                style={{
                  width: r.l1,
                  height: 4,
                  borderRadius: 1,
                  backgroundColor: "#1A3A3E",
                }}
              />
              <div
                style={{
                  width: r.l2,
                  height: 3,
                  borderRadius: 1,
                  backgroundColor: "#143438",
                }}
              />
            </div>
            <div
              style={{
                width: 22,
                height: 12,
                borderRadius: 6,
                backgroundColor: r.on ? "#22D3EE" : "#0A1518",
                border: r.on ? "none" : "1px solid #1A3A3E",
                flexShrink: 0,
                boxSizing: "border-box",
              }}
            />
          </div>
        ))}
      </div>
    </Mockup>
  );
}

/* 08 — login */
function Login() {
  return (
    <Mockup num="08" title="login.png" size="0.4mb" titleBarWidth={36}>
      <div
        style={{
          display: "flex",
          flexGrow: 1,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 8,
            width: "70%",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              paddingBottom: 4,
            }}
          >
            <div
              style={{
                width: 24,
                height: 24,
                borderRadius: 6,
                backgroundColor: "#22D3EE",
              }}
            />
          </div>
          <div style={{ ...card(14) }} />
          <div style={{ ...card(14) }} />
          <div
            style={{ height: 16, borderRadius: 3, backgroundColor: "#22D3EE" }}
          />
        </div>
      </div>
    </Mockup>
  );
}

export function ImageTile({
  num,
  filename,
  size,
  src,
  onClick,
}: {
  num: string;
  filename: string;
  size: string;
  src: string;
  onClick: () => void;
}) {
  return (
    <div
      className="catafract-terminal-tile"
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 8,
        width: 320,
        flexShrink: 0,
      }}
    >
      <button
        onClick={onClick}
        aria-label={`Open ${filename}`}
        className="catafract-terminal-tile-box"
        style={{
          backgroundColor: "#0A1518",
          border: "1px solid #1A3A3E",
          borderRadius: 8,
          height: 180,
          padding: 0,
          cursor: "zoom-in",
          overflow: "hidden",
          boxSizing: "border-box",
          display: "block",
          width: "100%",
        }}
      >
        <img
          src={src}
          alt={filename}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: "block",
          }}
        />
      </button>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          paddingInline: 4,
        }}
      >
        <div
          className="catafract-terminal-tile-label-num"
          style={{ ...mono, color: "#555555", fontSize: 10, lineHeight: "12px" }}
        >
          {num}
        </div>
        <div
          className="catafract-terminal-tile-label-name"
          style={{
            ...mono,
            color: "#CCCCCC",
            fontSize: 11,
            fontWeight: 600,
            lineHeight: "14px",
          }}
        >
          {filename}
        </div>
        <div style={{ flexGrow: 1 }} />
        <div
          className="catafract-terminal-tile-label-size"
          style={{ ...mono, color: "#444444", fontSize: 10, lineHeight: "12px" }}
        >
          {size}
        </div>
      </div>
    </div>
  );
}

export function PhoneTile({
  num,
  filename,
  size,
  src,
  alt,
  onClick,
}: {
  num: string;
  filename: string;
  size: string;
  src: string;
  alt: string;
  onClick: () => void;
}) {
  return (
    <div
      className="catafract-terminal-phone-tile"
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 10,
        width: 260,
        flexShrink: 0,
      }}
    >
      <button
        onClick={onClick}
        aria-label={`Open ${filename}`}
        className="catafract-terminal-phone-box"
        style={{
          backgroundColor: "#0A1518",
          border: "1px solid #1A3A3E",
          borderRadius: 18,
          width: 150,
          height: 324,
          padding: 0,
          cursor: "zoom-in",
          overflow: "hidden",
          boxSizing: "border-box",
          display: "block",
        }}
      >
        <img
          src={src}
          alt={alt}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: "block",
          }}
        />
      </button>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          width: 150,
          paddingInline: 2,
        }}
      >
        <div
          className="catafract-terminal-tile-label-num"
          style={{ ...mono, color: "#555555", fontSize: 10, lineHeight: "12px" }}
        >
          {num}
        </div>
        <div
          className="catafract-terminal-tile-label-name"
          style={{
            ...mono,
            color: "#CCCCCC",
            fontSize: 11,
            fontWeight: 600,
            lineHeight: "14px",
          }}
        >
          {filename}
        </div>
        <div style={{ flexGrow: 1 }} />
        <div
          className="catafract-terminal-tile-label-size"
          style={{ ...mono, color: "#444444", fontSize: 10, lineHeight: "12px" }}
        >
          {size}
        </div>
      </div>
    </div>
  );
}

export function MockupGallery({ firstTile }: { firstTile?: ReactNode }) {
  return (
    <div
      className="catafract-terminal-gallery"
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: 18,
        paddingTop: 6,
      }}
    >
      {firstTile ?? <Dashboard />}
      <Chat />
      <Schedule />
      <Intake />
      <VoiceAgent />
      <Analytics />
      <Settings />
      <Login />
    </div>
  );
}

/* ============================================================
 * themed text tiles (doctoc green, pulso pink)
 * ============================================================ */

function TextTile({
  num,
  filename,
  size,
  bg,
  border,
  children,
}: {
  num: string;
  filename: string;
  size: string;
  bg: string;
  border: string;
  children: ReactNode;
}) {
  return (
    <div
      className="catafract-terminal-tile"
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 8,
        width: 409,
        flexShrink: 0,
      }}
    >
      <div
        className="catafract-terminal-tile-box"
        style={{
          backgroundColor: bg,
          border: `1px solid ${border}`,
          borderRadius: 8,
          height: 180,
          padding: "12px 14px",
          display: "flex",
          flexDirection: "column",
          gap: 6,
          boxSizing: "border-box",
          overflow: "hidden",
        }}
      >
        {children}
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          paddingInline: 4,
        }}
      >
        <div
          className="catafract-terminal-tile-label-num"
          style={{ ...mono, color: "#555555", fontSize: 10, lineHeight: "12px" }}
        >
          {num}
        </div>
        <div
          className="catafract-terminal-tile-label-name"
          style={{
            ...mono,
            color: "#CCCCCC",
            fontSize: 11,
            fontWeight: 600,
            lineHeight: "14px",
          }}
        >
          {filename}
        </div>
        <div style={{ flexGrow: 1 }} />
        <div
          className="catafract-terminal-tile-label-size"
          style={{ ...mono, color: "#444444", fontSize: 10, lineHeight: "12px" }}
        >
          {size}
        </div>
      </div>
    </div>
  );
}

function TileHeader({
  accent,
  title,
  titleMeta,
  right,
}: {
  accent: string;
  title: string;
  titleMeta?: string;
  right?: ReactNode;
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 6,
        paddingBottom: 2,
      }}
    >
      <div
        style={{
          width: 6,
          height: 6,
          borderRadius: "50%",
          backgroundColor: accent,
          flexShrink: 0,
        }}
      />
      <span
        style={{
          ...mono,
          color: accent,
          fontSize: 11,
          fontWeight: 700,
          lineHeight: "14px",
        }}
      >
        {title}
      </span>
      {titleMeta && (
        <span
          style={{
            ...mono,
            color: "#666666",
            fontSize: 10,
            fontWeight: 500,
            lineHeight: "14px",
          }}
        >
          {titleMeta}
        </span>
      )}
      <div style={{ flexGrow: 1 }} />
      {right}
    </div>
  );
}

/* ---------------------------- doctoc tiles ---------------------------- */

const DOCTOC_BG = "#0A1812";
const DOCTOC_BORDER = "#1A3E28";
const DOCTOC_ACCENT = "#4EC86C";
const DOCTOC_KEY = "#4EC86C";
const DOCTOC_VAL = "#CCCCCC";
const DOCTOC_DIM = "#5C7A65";

function JsonLine({ k, v }: { k: string; v: ReactNode }) {
  return (
    <div
      style={{
        ...mono,
        fontSize: 10,
        lineHeight: "14px",
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
      }}
    >
      <span style={{ color: DOCTOC_KEY }}>&quot;{k}&quot;</span>
      <span style={{ color: DOCTOC_DIM }}>: </span>
      <span style={{ color: DOCTOC_VAL }}>{v}</span>
    </div>
  );
}

function DoctocPatient() {
  return (
    <TextTile
      num="01"
      filename="Patient.json"
      size="1.2kb"
      bg={DOCTOC_BG}
      border={DOCTOC_BORDER}
    >
      <TileHeader
        accent={DOCTOC_ACCENT}
        title="Patient"
        titleMeta="v1.0"
      />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
          paddingTop: 2,
        }}
      >
        <JsonLine k="resourceType" v={`"Patient"`} />
        <JsonLine k="id" v={`"pe-42-a7f2c"`} />
        <JsonLine k="identifier" v="[{ DNI · 70123456 }]" />
        <JsonLine k="gender" v={`"female"`} />
        <JsonLine k="birthDate" v={`"1987-04-22"`} />
        <JsonLine k="address" v="[{ PE · Lima · Miraflores }]" />
        <JsonLine k="telecom" v="[{ phone · +51 ... }]" />
        <JsonLine k="managingOrganization" v={`"Doctoc"`} />
      </div>
    </TextTile>
  );
}

function DoctocMedication() {
  return (
    <TextTile
      num="02"
      filename="MedicationRequest.json"
      size="0.8kb"
      bg={DOCTOC_BG}
      border={DOCTOC_BORDER}
    >
      <TileHeader
        accent={DOCTOC_ACCENT}
        title="MedicationRequest"
        right={
          <span
            style={{
              ...mono,
              color: DOCTOC_ACCENT,
              fontSize: 10,
              fontWeight: 500,
              lineHeight: "14px",
            }}
          >
            active
          </span>
        }
      />
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          gap: 10,
          paddingTop: 4,
          paddingBottom: 4,
        }}
      >
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: 6,
            backgroundColor: "#143A22",
            border: `1px solid ${DOCTOC_BORDER}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <span
            style={{
              ...mono,
              color: DOCTOC_ACCENT,
              fontSize: 12,
              fontWeight: 700,
            }}
          >
            Rx
          </span>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 1,
            minWidth: 0,
          }}
        >
          <div
            style={{
              ...mono,
              color: "#FFFFFF",
              fontSize: 11,
              fontWeight: 700,
              lineHeight: "14px",
            }}
          >
            Amoxicillin 500 mg
          </div>
          <div
            style={{
              ...mono,
              color: DOCTOC_DIM,
              fontSize: 10,
              lineHeight: "13px",
            }}
          >
            rxnorm · 308191
          </div>
          <div
            style={{
              ...mono,
              color: DOCTOC_ACCENT,
              fontSize: 10,
              lineHeight: "13px",
            }}
          >
            1 cap · every 8h · 7 days
          </div>
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <JsonLine k="requester" v="Practitioner/dr-valdez" />
        <JsonLine k="dispenseRequest" v="{ 21 · InkaFarma }" />
        <JsonLine k="authoredOn" v={`"2026-02-14T10:32"`} />
      </div>
    </TextTile>
  );
}

function DoctocSwagger() {
  const routes: { method: "GET" | "POST"; path: string }[] = [
    { method: "GET", path: "/Patient/{id}" },
    { method: "POST", path: "/Patient" },
    { method: "GET", path: "/Encounter?patient={id}" },
    { method: "POST", path: "/Observation" },
    { method: "POST", path: "/MedicationRequest" },
    { method: "POST", path: "/Bundle" },
    { method: "GET", path: "/$export?type=Patient" },
  ];
  return (
    <TextTile
      num="03"
      filename="swagger.yaml"
      size="3.0kb"
      bg={DOCTOC_BG}
      border={DOCTOC_BORDER}
    >
      <TileHeader
        accent={DOCTOC_ACCENT}
        title="openapi"
        titleMeta="3.1"
        right={
          <span
            style={{
              ...mono,
              color: DOCTOC_DIM,
              fontSize: 10,
              lineHeight: "14px",
            }}
          >
            doctoc.health/fhir
          </span>
        }
      />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
          paddingTop: 2,
        }}
      >
        {routes.map((r) => (
          <div
            key={r.path}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <span
              style={{
                ...mono,
                color: DOCTOC_ACCENT,
                fontSize: 9,
                fontWeight: 700,
                backgroundColor: "#143A22",
                border: `1px solid ${DOCTOC_BORDER}`,
                borderRadius: 3,
                padding: "1px 5px",
                width: 28,
                textAlign: "center",
                flexShrink: 0,
              }}
            >
              {r.method}
            </span>
            <span
              style={{
                ...mono,
                color: DOCTOC_VAL,
                fontSize: 10,
                lineHeight: "14px",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {r.path}
            </span>
          </div>
        ))}
      </div>
    </TextTile>
  );
}

function DoctocEncounter() {
  return (
    <TextTile
      num="04"
      filename="Encounter.json"
      size="0.9kb"
      bg={DOCTOC_BG}
      border={DOCTOC_BORDER}
    >
      <TileHeader
        accent={DOCTOC_ACCENT}
        title="Encounter"
        titleMeta="finished"
        right={
          <span
            style={{
              ...mono,
              color: DOCTOC_DIM,
              fontSize: 10,
              lineHeight: "14px",
            }}
          >
            2026-02-14
          </span>
        }
      />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
          paddingTop: 2,
        }}
      >
        <JsonLine k="resourceType" v={`"Encounter"`} />
        <JsonLine k="status" v={`"finished"`} />
        <JsonLine k="class" v="{ AMB · ambulatory }" />
        <JsonLine k="subject" v="Patient/pe-42-a7f2c" />
        <JsonLine k="participant" v="[{ Dr. Valdez }]" />
        <JsonLine k="period" v="{ start · end }" />
        <JsonLine k="reasonCode" v="[{ 25064002 }]" />
        <JsonLine k="serviceProvider" v={`"Doctoc · Lima"`} />
      </div>
    </TextTile>
  );
}

export function DoctocGallery() {
  return (
    <div
      className="catafract-terminal-gallery"
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: 18,
        paddingTop: 6,
      }}
    >
      <DoctocPatient />
      <DoctocMedication />
      <DoctocSwagger />
      <DoctocEncounter />
    </div>
  );
}

/* ---------------------------- pulso tiles ---------------------------- */

const PULSO_BG = "#1A0A14";
const PULSO_BORDER = "#3E1A2E";
const PULSO_ACCENT = "#F472B6";
const PULSO_DIM = "#7A5A6A";
const PULSO_VAL = "#D4C0CC";

function PulsoSchema() {
  const Table = ({
    name,
    cols,
  }: {
    name: string;
    cols: string[];
  }) => (
    <div
      style={{
        flex: 1,
        minWidth: 0,
        backgroundColor: "#2A1020",
        border: `1px solid ${PULSO_BORDER}`,
        borderRadius: 5,
        padding: "5px 7px",
        display: "flex",
        flexDirection: "column",
        gap: 1,
      }}
    >
      <div
        style={{
          ...mono,
          color: PULSO_ACCENT,
          fontSize: 10,
          fontWeight: 700,
          lineHeight: "12px",
        }}
      >
        {name}
      </div>
      {cols.map((c, i) => (
        <div
          key={i}
          style={{
            ...mono,
            color: PULSO_DIM,
            fontSize: 9,
            lineHeight: "12px",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {c}
        </div>
      ))}
    </div>
  );
  const Link = () => (
    <div
      style={{
        ...mono,
        color: PULSO_DIM,
        fontSize: 11,
        alignSelf: "center",
        flexShrink: 0,
      }}
    >
      —
    </div>
  );
  return (
    <TextTile
      num="01"
      filename="schema.sql"
      size="8.4kb"
      bg={PULSO_BG}
      border={PULSO_BORDER}
    >
      <TileHeader
        accent={PULSO_ACCENT}
        title="postgres / pulso"
        right={
          <span
            style={{
              ...mono,
              color: PULSO_DIM,
              fontSize: 10,
              lineHeight: "14px",
            }}
          >
            47 tables · 2.1M rows
          </span>
        }
      />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 5,
          paddingTop: 2,
        }}
      >
        <div style={{ display: "flex", gap: 4 }}>
          <Table name="workers" cols={["id · dni · name", "company_id · fk"]} />
          <Link />
          <Table name="exams" cols={["id · worker_id · fk", "protocol_id · fk"]} />
        </div>
        <div style={{ display: "flex", gap: 4 }}>
          <Table name="companies" cols={["id · ruc · name", "sector · region"]} />
          <Link />
          <Table name="protocols" cols={["id · code · name", "sector · yaml"]} />
        </div>
      </div>
    </TextTile>
  );
}

function PulsoReport() {
  const sections: { n: string; t: string }[] = [
    { n: "01", t: "portada institucional" },
    { n: "02", t: "consentimiento informado" },
    { n: "03", t: "historia clínica ocup." },
    { n: "04", t: "examen físico" },
    { n: "05", t: "audiometría · visiometría" },
    { n: "06", t: "espirometría · rx tórax" },
    { n: "12", t: "conclusión · firma médica" },
  ];
  return (
    <TextTile
      num="02"
      filename="report.pdf"
      size="2.4mb"
      bg={PULSO_BG}
      border={PULSO_BORDER}
    >
      <div style={{ display: "flex", gap: 10, height: "100%" }}>
        <div
          style={{
            width: 110,
            flexShrink: 0,
            backgroundColor: "#2A1020",
            border: `1px solid ${PULSO_BORDER}`,
            borderRadius: 5,
            padding: "7px 8px",
            display: "flex",
            flexDirection: "column",
            gap: 5,
          }}
        >
          <div
            style={{
              ...mono,
              color: PULSO_ACCENT,
              fontSize: 8,
              fontWeight: 700,
              letterSpacing: "0.4px",
            }}
          >
            PULSO SALUD
          </div>
          <div
            style={{
              height: 1,
              backgroundColor: PULSO_BORDER,
            }}
          />
          <div
            style={{
              ...mono,
              color: "#FFFFFF",
              fontSize: 9,
              fontWeight: 700,
              lineHeight: "12px",
            }}
          >
            INFORME MÉDICO
          </div>
          <div
            style={{
              ...mono,
              color: PULSO_DIM,
              fontSize: 8,
              lineHeight: "10px",
            }}
          >
            EMO · Mina Lima
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
              paddingTop: 2,
            }}
          >
            {[40, 60, 55, 48].map((w, i) => (
              <div
                key={i}
                style={{
                  width: `${w}%`,
                  height: 2,
                  backgroundColor: PULSO_BORDER,
                  borderRadius: 1,
                }}
              />
            ))}
          </div>
          <div style={{ flexGrow: 1 }} />
          <div
            style={{
              ...mono,
              color: PULSO_ACCENT,
              fontSize: 9,
              fontWeight: 700,
            }}
          >
            APTO <span style={{ color: DOCTOC_ACCENT }}>✓</span>
          </div>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 1,
            flex: 1,
            minWidth: 0,
            paddingTop: 2,
          }}
        >
          <div
            style={{
              ...mono,
              color: PULSO_ACCENT,
              fontSize: 11,
              fontWeight: 700,
              lineHeight: "14px",
              paddingBottom: 2,
            }}
          >
            ● report · 12 pages
          </div>
          {sections.map((s) => (
            <div
              key={s.n}
              style={{
                ...mono,
                fontSize: 9,
                lineHeight: "12px",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              <span style={{ color: PULSO_ACCENT }}>{s.n}</span>{" "}
              <span style={{ color: PULSO_VAL }}>{s.t}</span>
            </div>
          ))}
        </div>
      </div>
    </TextTile>
  );
}

function PulsoWorkers() {
  const rows: { n: string; dni: string; name: string; cargo: string; apto: string; obs?: boolean }[] = [
    { n: "01", dni: "70123456", name: "A. Quispe M.", cargo: "operario", apto: "sí" },
    { n: "02", dni: "48912034", name: "M. Chávez R.", cargo: "soldador", apto: "sí" },
    { n: "03", dni: "72445081", name: "L. Mendoza A.", cargo: "electricista", apto: "obs", obs: true },
    { n: "04", dni: "42008119", name: "J. Rojas T.", cargo: "capataz", apto: "sí" },
    { n: "05", dni: "75660912", name: "R. Flores H.", cargo: "operario", apto: "sí" },
  ];
  const cellBase: CSSProperties = {
    ...mono,
    fontSize: 9,
    lineHeight: "12px",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  };
  return (
    <TextTile
      num="03"
      filename="workers.csv"
      size="1.4kb"
      bg={PULSO_BG}
      border={PULSO_BORDER}
    >
      <TileHeader
        accent={PULSO_ACCENT}
        title="12 rows · 8 cols"
        right={
          <span
            style={{
              ...mono,
              color: PULSO_DIM,
              fontSize: 10,
              lineHeight: "14px",
            }}
          >
            import:mina-lima-2026.csv
          </span>
        }
      />
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "16px 60px 1fr 72px 28px",
          rowGap: 2,
          columnGap: 6,
          paddingTop: 2,
        }}
      >
        <div style={{ ...cellBase, color: PULSO_ACCENT }}>#</div>
        <div style={{ ...cellBase, color: PULSO_DIM }}>dni</div>
        <div style={{ ...cellBase, color: PULSO_DIM }}>nombre</div>
        <div style={{ ...cellBase, color: PULSO_DIM }}>cargo</div>
        <div style={{ ...cellBase, color: PULSO_DIM }}>apto</div>
        {rows.map((r) => (
          <FragmentRow key={r.n} r={r} cellBase={cellBase} />
        ))}
        <div style={{ ...cellBase, color: PULSO_DIM }}>…</div>
        <div style={{ ...cellBase, color: PULSO_DIM, gridColumn: "2 / span 4" }}>
          7 más
        </div>
      </div>
    </TextTile>
  );
}

function FragmentRow({
  r,
  cellBase,
}: {
  r: { n: string; dni: string; name: string; cargo: string; apto: string; obs?: boolean };
  cellBase: CSSProperties;
}) {
  return (
    <>
      <div style={{ ...cellBase, color: PULSO_ACCENT }}>{r.n}</div>
      <div style={{ ...cellBase, color: PULSO_VAL }}>{r.dni}</div>
      <div style={{ ...cellBase, color: PULSO_VAL }}>{r.name}</div>
      <div style={{ ...cellBase, color: PULSO_VAL }}>{r.cargo}</div>
      <div
        style={{
          ...cellBase,
          color: r.obs ? "#F59E0B" : DOCTOC_ACCENT,
        }}
      >
        {r.apto}
      </div>
    </>
  );
}

function PulsoMigration() {
  const lines: { type: "-" | "+"; text: string }[] = [
    { type: "-", text: "ap_legacy/workers.php" },
    { type: "+", text: "app/features/workers/{route,view,form}.tsx" },
    { type: "-", text: "ap_legacy/db.sqlite" },
    { type: "+", text: "infra/db/postgres · 2.1M rows migrated" },
    { type: "-", text: "ap_legacy/reports/render.php" },
    { type: "+", text: "app/reports/pdf-generator.ts (+ai summary)" },
    { type: "+", text: "mcps/maria/ · 14 tools · 2 resources" },
    { type: "+", text: "infra/sap-bridge/ · fi invoice sync" },
  ];
  return (
    <TextTile
      num="04"
      filename="migration.diff"
      size="184kb"
      bg={PULSO_BG}
      border={PULSO_BORDER}
    >
      <TileHeader
        accent={PULSO_ACCENT}
        title="ap-legacy → ap-new"
        right={
          <span
            style={{
              ...mono,
              color: PULSO_DIM,
              fontSize: 10,
              lineHeight: "14px",
            }}
          >
            12,848 +/- · 47 files
          </span>
        }
      />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
          paddingTop: 2,
        }}
      >
        {lines.map((l, i) => {
          const isAdd = l.type === "+";
          return (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                paddingInline: 4,
                paddingBlock: 1,
                borderRadius: 2,
                backgroundColor: isAdd ? "#0F2416" : "#2A0F1A",
              }}
            >
              <span
                style={{
                  ...mono,
                  color: isAdd ? DOCTOC_ACCENT : PULSO_ACCENT,
                  fontSize: 10,
                  fontWeight: 700,
                  width: 8,
                  flexShrink: 0,
                }}
              >
                {l.type}
              </span>
              <span
                style={{
                  ...mono,
                  color: isAdd ? DOCTOC_ACCENT : PULSO_ACCENT,
                  fontSize: 9,
                  lineHeight: "12px",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {l.text}
              </span>
            </div>
          );
        })}
      </div>
    </TextTile>
  );
}

export function PulsoGallery() {
  return (
    <div
      className="catafract-terminal-gallery"
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: 18,
        paddingTop: 6,
      }}
    >
      <PulsoSchema />
      <PulsoReport />
      <PulsoWorkers />
      <PulsoMigration />
    </div>
  );
}
