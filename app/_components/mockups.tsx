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
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 8,
        width: 320,
        flexShrink: 0,
      }}
    >
      <div
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
        <div style={{ ...mono, color: "#555555", fontSize: 10, lineHeight: "12px" }}>
          {num}
        </div>
        <div
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
        <div style={{ ...mono, color: "#444444", fontSize: 10, lineHeight: "12px" }}>
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

/* 07 — reminders */
function Reminders() {
  const rows = [
    { filled: true, outlined: false },
    { filled: false, outlined: true },
    { filled: false, outlined: true },
    { filled: false, outlined: false },
    { filled: false, outlined: false },
  ];
  return (
    <Mockup num="07" title="reminders.png" size="0.7mb" titleBarWidth={62}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          flexGrow: 1,
          gap: 8,
          paddingBlock: 2,
          paddingInline: 4,
        }}
      >
        {rows.map((r, i) => (
          <div
            key={i}
            style={{ display: "flex", alignItems: "center", gap: 6 }}
          >
            <div
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                backgroundColor: r.filled ? "#22D3EE" : "#0A1518",
                border: r.outlined ? "1px solid #22D3EE" : r.filled ? "none" : "1px solid #1A3A3E",
                flexShrink: 0,
                boxSizing: "border-box",
              }}
            />
            <div
              style={{
                flexGrow: 1,
                height: 4,
                borderRadius: 1,
                backgroundColor: "#1A3A3E",
              }}
            />
            <div
              style={{
                width: 24,
                height: 3,
                borderRadius: 1,
                backgroundColor: "#143438",
              }}
            />
          </div>
        ))}
      </div>
    </Mockup>
  );
}

/* 08 — settings */
function Settings() {
  const rows = [
    { l1: 80, l2: 120, on: true },
    { l1: 70, l2: 100, on: true },
    { l1: 90, l2: 110, on: false },
    { l1: 60, l2: 90, on: false },
  ];
  return (
    <Mockup num="08" title="settings.png" size="0.5mb" titleBarWidth={48}>
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

/* 09 — login */
function Login() {
  return (
    <Mockup num="09" title="login.png" size="0.4mb" titleBarWidth={36}>
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
        <div style={{ ...mono, color: "#555555", fontSize: 10, lineHeight: "12px" }}>
          {num}
        </div>
        <div
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
        <div style={{ ...mono, color: "#444444", fontSize: 10, lineHeight: "12px" }}>
          {size}
        </div>
      </div>
    </div>
  );
}

export function MockupGallery({ firstTile }: { firstTile?: ReactNode }) {
  return (
    <div
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
      <Reminders />
      <Settings />
      <Login />
    </div>
  );
}
