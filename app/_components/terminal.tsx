"use client";

import { useEffect, useState, type CSSProperties, type ReactNode } from "react";
import { ImageTile, MockupGallery } from "./mockups";

const mono: CSSProperties = { fontFamily: "var(--font-mono), monospace" };

type TabKey = "maxilar" | "syntax" | "inmoba" | "damelo" | "doctoc";

const TAB_ORDER: readonly TabKey[] = [
  "maxilar",
  "syntax",
  "inmoba",
  "damelo",
  "doctoc",
] as const;

type Theme = {
  accent: string;
  activeBg: string;
  activeBadgeBg: string;
  activeBadgeBorder: string;
  inactiveDot: string;
  host: string;
  domain: string;
  commits: number;
  status: { label: string; color: string };
};

const THEMES: Record<TabKey, Theme> = {
  maxilar: {
    accent: "#22D3EE",
    activeBg: "#0F1A1C",
    activeBadgeBg: "#0A0A0A",
    activeBadgeBorder: "#1A3A38",
    inactiveDot: "#1F4044",
    host: "catafract@maxilar",
    domain: "catafract.com",
    commits: 182,
    status: { label: "● shipped", color: "#4EC86C" },
  },
  syntax: {
    accent: "#A78BFA",
    activeBg: "#15122A",
    activeBadgeBg: "#0A0820",
    activeBadgeBorder: "#2E2458",
    inactiveDot: "#3D2F5C",
    host: "catafract@syntax",
    domain: "syntax.catafract.com",
    commits: 428,
    status: { label: "● in stores", color: "#A78BFA" },
  },
  inmoba: {
    accent: "#F59E0B",
    activeBg: "#1F1708",
    activeBadgeBg: "#0A0700",
    activeBadgeBorder: "#5C4316",
    inactiveDot: "#5C4316",
    host: "catafract@inmoba",
    domain: "inmoba.app",
    commits: 94,
    status: { label: "● live", color: "#F59E0B" },
  },
  damelo: {
    accent: "#A3A3A3",
    activeBg: "#161618",
    activeBadgeBg: "#0A0A0B",
    activeBadgeBorder: "#333336",
    inactiveDot: "#333336",
    host: "catafract@d.sh",
    domain: "damelo.sh",
    commits: 71,
    status: { label: "● open source", color: "#A3A3A3" },
  },
  doctoc: {
    accent: "#4EC86C",
    activeBg: "#0E1B12",
    activeBadgeBg: "#050A07",
    activeBadgeBorder: "#1C3A22",
    inactiveDot: "#1F3A28",
    host: "catafract@doctoc",
    domain: "doctoc.health",
    commits: 216,
    status: { label: "● fhir r4", color: "#4EC86C" },
  },
};

/* ------------------------------ primitives ------------------------------ */

function Prompt({ cmd, theme }: { cmd: string; theme: Theme }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
      <span
        style={{
          ...mono,
          color: theme.accent,
          fontSize: 13,
          fontWeight: 700,
          lineHeight: "16px",
        }}
      >
        {theme.host}
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

function Cursor({ theme }: { theme: Theme }) {
  return (
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
          color: theme.accent,
          fontSize: 13,
          fontWeight: 700,
          lineHeight: "16px",
        }}
      >
        {theme.host}
      </span>
      <span style={{ ...mono, color: "#555555", fontSize: 13, lineHeight: "16px" }}>
        :~ $
      </span>
      <div style={{ width: 8, height: 16, backgroundColor: theme.accent }} />
    </div>
  );
}

function MetaItem({
  k,
  v,
  color,
}: {
  k: string;
  v: string;
  color?: string;
}) {
  return (
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
}

function Pipe() {
  return (
    <span style={{ ...mono, color: "#1A1A1A", fontSize: 12, lineHeight: "16px" }}>
      |
    </span>
  );
}

function Metadata({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 24,
        paddingTop: 20,
        flexWrap: "wrap",
      }}
    >
      {children}
    </div>
  );
}

function GitLog({
  theme,
  commits,
}: {
  theme: Theme;
  commits: { hash: string; msg: string }[];
}) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 6,
        paddingTop: 20,
      }}
    >
      <Prompt cmd="git log --oneline -4" theme={theme} />
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
            style={{ display: "flex", alignItems: "baseline", gap: 14 }}
          >
            <span
              style={{
                ...mono,
                color: theme.accent,
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

function FooterRow({ theme }: { theme: Theme }) {
  return (
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
          href={`https://${theme.domain}`}
          target="_blank"
          rel="noreferrer"
          style={{
            ...mono,
            color: theme.accent,
            fontSize: 12,
            lineHeight: "16px",
            textDecoration: "underline",
          }}
        >
          {theme.domain}
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
          {theme.commits} commits
        </span>
        <span
          style={{
            ...mono,
            color: theme.status.color,
            fontSize: 11,
            lineHeight: "14px",
          }}
        >
          {theme.status.label}
        </span>
      </div>
    </div>
  );
}

/* --------------------------------- tabs --------------------------------- */

function TabButton({
  tab,
  active,
  onClick,
}: {
  tab: TabKey;
  active: boolean;
  onClick: () => void;
}) {
  const theme = THEMES[tab];
  const index = TAB_ORDER.indexOf(tab) + 1;
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        backgroundColor: active ? theme.activeBg : "#0A0A0A",
        border: active
          ? `1.5px solid ${theme.accent}`
          : "1px solid #1A1A1A",
        borderRadius: 8,
        paddingBlock: 10,
        paddingInline: 16,
        cursor: "pointer",
        transition: "background-color 120ms ease, border-color 120ms ease",
      }}
    >
      <div
        style={{
          width: 8,
          height: 8,
          borderRadius: 2,
          backgroundColor: active ? theme.accent : theme.inactiveDot,
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
        {tab === "damelo" ? "d.sh" : tab}
      </span>
      <div
        style={{
          backgroundColor: active ? theme.activeBadgeBg : "#050505",
          border: `1px solid ${active ? theme.activeBadgeBorder : "#1A1A1A"}`,
          borderRadius: 4,
          paddingBlock: 2,
          paddingInline: 7,
        }}
      >
        <span
          style={{
            ...mono,
            color: active ? theme.accent : "#555555",
            fontSize: 9,
            fontWeight: 700,
            lineHeight: "12px",
          }}
        >
          {index}
        </span>
      </div>
    </button>
  );
}

function TabBar({
  activeTab,
  onChange,
}: {
  activeTab: TabKey;
  onChange: (tab: TabKey) => void;
}) {
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
      <TabButton
        tab="maxilar"
        active={activeTab === "maxilar"}
        onClick={() => onChange("maxilar")}
      />
      <TabButton
        tab="syntax"
        active={activeTab === "syntax"}
        onClick={() => onChange("syntax")}
      />
      <TabButton
        tab="inmoba"
        active={activeTab === "inmoba"}
        onClick={() => onChange("inmoba")}
      />
      <TabButton
        tab="damelo"
        active={activeTab === "damelo"}
        onClick={() => onChange("damelo")}
      />
      <TabButton
        tab="doctoc"
        active={activeTab === "doctoc"}
        onClick={() => onChange("doctoc")}
      />
      <div style={{ flexGrow: 1 }} />
      <span style={{ ...mono, color: "#1A1A1A", fontSize: 11, lineHeight: "14px" }}>
        |
      </span>
    </div>
  );
}

/* --------------------------- content per tab --------------------------- */

function Heading({ children }: { children: ReactNode }) {
  return (
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
      {children}
    </h2>
  );
}

function Description({ children }: { children: ReactNode }) {
  return (
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
      {children}
    </p>
  );
}

function GallerySection({
  theme,
  firstTile,
}: {
  theme: Theme;
  firstTile?: ReactNode;
}) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        paddingTop: 4,
      }}
    >
      <div style={{ paddingTop: 20 }}>
        <Prompt cmd="imgcat screens/*.png" theme={theme} />
      </div>
      <MockupGallery firstTile={firstTile} />
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 14,
          paddingTop: 14,
        }}
      >
        <span
          style={{ ...mono, color: "#555555", fontSize: 11, lineHeight: "14px" }}
        >
          9 files · 8.7mb · rendered in 0.04s
        </span>
      </div>
      <Cursor theme={theme} />
    </div>
  );
}

function MaxilarContent() {
  const theme = THEMES.maxilar;
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
      <Prompt cmd="cat about.md" theme={theme} />
      <Heading>AI agents for cool dentists.</Heading>
      <Description>
        Maxilar built AI agents that sit inside dental practices — handling
        intake, scheduling, and follow-ups without the front desk breaking a
        sweat. Winners of Startup Peru, raised $15K equity free, shipped for a
        year, and sold to Doctoc in January with a clean HL7 FHIR handoff of
        every clinical record.
      </Description>
      <Metadata>
        <MetaItem k="role" v="co-founder · ceo" />
        <Pipe />
        <MetaItem k="award" v="startup peru winner" color="#4EC86C" />
        <Pipe />
        <MetaItem k="exit" v="acquired by doctoc" color="#4EC86C" />
        <Pipe />
        <MetaItem k="dates" v="jan 2025 — jan 2026" />
      </Metadata>
      <GitLog
        theme={theme}
        commits={[
          {
            hash: "a7f2c01",
            msg: "feat: hand off accounts to doctoc, archive infra",
          },
          {
            hash: "3d9b144",
            msg: "feat: scheduling agent now covers 12 clinics across lima",
          },
          {
            hash: "8e41a0b",
            msg: "fix: intake flow drops fewer leads after reminder rewrite",
          },
          {
            hash: "1c5ff20",
            msg: "chore: initial commit — one dentist, one agent, one dream",
          },
        ]}
      />
      <GallerySection theme={theme} />
      <FooterRow theme={theme} />
    </div>
  );
}

function SyntaxContent({
  onImageClick,
}: {
  onImageClick: (info: {
    src: string;
    alt: string;
    label: string;
    size: string;
  }) => void;
}) {
  const theme = THEMES.syntax;
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
      <Prompt cmd="cat about.md" theme={theme} />
      <Heading>English fluency from your phone.</Heading>
      <Description>
        Syntax is an AI English tutor for speakers of Spanish. Pick a topic,
        pick an accent, then talk — the tutor listens, corrects your
        pronunciation with ML models, and answers back in real time. Built
        end-to-end: backend, audio processing, and web app. Raised $125K from
        investors in Peru, Chile, and Switzerland. Live on iOS and Android.
      </Description>
      <Metadata>
        <MetaItem k="role" v="co-founder" />
        <Pipe />
        <MetaItem k="raised" v="$125k" color="#A78BFA" />
        <Pipe />
        <MetaItem k="funding" v="vc backed · pe · cl · ch" />
        <Pipe />
        <MetaItem k="dates" v="jan 2023 — may 2024" />
      </Metadata>
      <GitLog
        theme={theme}
        commits={[
          {
            hash: "f0c8c21",
            msg: "feat: ship ios + android with unlimited conversations",
          },
          {
            hash: "b4a2e99",
            msg: "feat: pronunciation scoring via in-house ml models",
          },
          {
            hash: "79d410c",
            msg: "feat: accent picker — us, uk, au on every topic",
          },
          {
            hash: "2e11a44",
            msg: "chore: repo init — one tutor, one user, one conversation",
          },
        ]}
      />
      <GallerySection
        theme={theme}
        firstTile={
          <ImageTile
            num="01"
            filename="landing.png"
            size="1.6mb"
            src="/syntax-01.png"
            onClick={() =>
              onImageClick({
                src: "/syntax-01.png",
                alt: "syntax.catafract.com landing page",
                label: "01 / syntax — landing.png",
                size: "1.6mb",
              })
            }
          />
        }
      />
      <FooterRow theme={theme} />
    </div>
  );
}

function InmobaContent() {
  const theme = THEMES.inmoba;
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
      <Prompt cmd="cat about.md" theme={theme} />
      <Heading>Property valuations in 60 seconds.</Heading>
      <Description>
        Inmoba prices any property in the Peruvian market in under a minute.
        Drop an address, the model pulls recent comps within a 500m radius and
        spits out a full valuation report — the kind a bank or a realtor would
        normally take days to produce. Live at inmoba.app, used by owners,
        brokers, and anyone who needs a real number without the middleman.
      </Description>
      <Metadata>
        <MetaItem k="role" v="co-founder · builder" />
        <Pipe />
        <MetaItem k="focus" v="tasación · 60s" />
        <Pipe />
        <MetaItem k="status" v="live · shipping" color="#F59E0B" />
        <Pipe />
        <MetaItem k="dates" v="feb 2026 — now" />
      </Metadata>
      <GitLog
        theme={theme}
        commits={[
          {
            hash: "6c9f1a2",
            msg: "feat: valuation report in 60s — comps within 500m",
          },
          {
            hash: "41b0d8e",
            msg: "feat: scraper covers 14 distritos across lima",
          },
          {
            hash: "aa22d7f",
            msg: "feat: exportable pdf report for brokers and owners",
          },
          {
            hash: "00e1f10",
            msg: "chore: initial commit — first address priced in <60s",
          },
        ]}
      />
      <GallerySection theme={theme} />
      <FooterRow theme={theme} />
    </div>
  );
}

function DameloContent() {
  const theme = THEMES.damelo;
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
      <Prompt cmd="cat about.md" theme={theme} />
      <Heading>Share your AI sessions with your team.</Heading>
      <Description>
        Damelo is an MCP server that exports, imports, and browses Claude Code
        sessions across a whole organization. Talk to Claude in plain English
        — &quot;export this to damelo&quot; — or run the <code>/tomalo</code>{" "}
        slash command and it runs in the background while you keep shipping.
        Nothing gets lost when a teammate debugs something tricky. Built for
        teams that ship with AI.
      </Description>
      <Metadata>
        <MetaItem k="role" v="builders" />
        <Pipe />
        <MetaItem k="stack" v="mcp · claude code" />
        <Pipe />
        <MetaItem k="status" v="open source · live" color="#A3A3A3" />
        <Pipe />
        <MetaItem k="dates" v="mar 2026 — now" />
      </Metadata>
      <GitLog
        theme={theme}
        commits={[
          {
            hash: "e0b1f44",
            msg: "feat: /tomalo slash command exports in the background",
          },
          {
            hash: "9a2c8d7",
            msg: "feat: team view — browse sessions across the org",
          },
          {
            hash: "47f1b20",
            msg: "feat: import — pull a teammate's session into your ctx",
          },
          {
            hash: "0a0c101",
            msg: "chore: initial commit — mcp server + export pipeline",
          },
        ]}
      />
      <GallerySection theme={theme} />
      <FooterRow theme={theme} />
    </div>
  );
}

function DoctocContent() {
  const theme = THEMES.doctoc;
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
      <Prompt cmd="cat about.md" theme={theme} />
      <Heading>HL7 FHIR compliance for Latin American EHRs.</Heading>
      <Description>
        After Maxilar was acquired, the same team rebuilt Doctoc&apos;s clinical
        data layer to be fully HL7 FHIR R4 compliant — patient, encounter,
        observation, medication and diagnostic resources all map to the
        standard so records move cleanly between clinics, insurers, and labs.
        Doctoc is the AI-powered EHR saving doctors 3+ hours a day across
        LATAM; we made it the region&apos;s first FHIR-native option.
      </Description>
      <Metadata>
        <MetaItem k="role" v="builders · post-exit" />
        <Pipe />
        <MetaItem k="scope" v="hl7 fhir r4" color="#4EC86C" />
        <Pipe />
        <MetaItem k="status" v="live · compliant" color="#4EC86C" />
        <Pipe />
        <MetaItem k="dates" v="feb 2026 — now" />
      </Metadata>
      <GitLog
        theme={theme}
        commits={[
          {
            hash: "5d3c7b1",
            msg: "feat: patient + encounter + observation → fhir r4",
          },
          {
            hash: "b2f9a06",
            msg: "feat: medication request / dispense export to any hl7 endpoint",
          },
          {
            hash: "77c3e11",
            msg: "feat: bulk fhir export for payer and lab integrations",
          },
          {
            hash: "30a118d",
            msg: "chore: initial commit — fhir layer on top of doctoc ehr",
          },
        ]}
      />
      <GallerySection theme={theme} />
      <FooterRow theme={theme} />
    </div>
  );
}

/* ---------------------------- image modal ---------------------------- */

function ImageModal({
  src,
  alt,
  label,
  size,
  onClose,
}: {
  src: string;
  alt: string;
  label?: string;
  size?: string;
  onClose: () => void;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={alt}
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "#000000",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
        cursor: "zoom-out",
        padding: 60,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "stretch",
          gap: 18,
          width: "min(1120px, 92vw)",
          cursor: "default",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              fontFamily: "var(--font-mono), monospace",
              fontSize: 12,
              letterSpacing: "0.2px",
            }}
          >
            <span style={{ color: "#666666" }}>{label ?? alt}</span>
            {size && (
              <>
                <span style={{ color: "#333333" }}>·</span>
                <span style={{ color: "#555555" }}>{size}</span>
              </>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            style={{
              width: 32,
              height: 32,
              borderRadius: 16,
              backgroundColor: "#0E0E10",
              border: "1px solid #1C1C20",
              color: "#888888",
              fontSize: 13,
              fontWeight: 500,
              lineHeight: 1,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: 0,
            }}
          >
            ✕
          </button>
        </div>
        <div
          style={{
            display: "flex",
            width: "100%",
            backgroundColor: "#050507",
            border: "1px solid #141418",
            borderRadius: 10,
            overflow: "hidden",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <img
            src={src}
            alt={alt}
            style={{
              display: "block",
              width: "100%",
              height: "auto",
              maxHeight: "calc(100vh - 180px)",
              objectFit: "contain",
            }}
          />
        </div>
      </div>
    </div>
  );
}

/* -------------------------------- root -------------------------------- */

export function Terminal() {
  const [activeTab, setActiveTab] = useState<TabKey>("maxilar");
  const [modal, setModal] = useState<{
    src: string;
    alt: string;
    label: string;
    size: string;
  } | null>(null);

  return (
    <>
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
        <TabBar activeTab={activeTab} onChange={setActiveTab} />
        {activeTab === "maxilar" && <MaxilarContent />}
        {activeTab === "syntax" && (
          <SyntaxContent onImageClick={(info) => setModal(info)} />
        )}
        {activeTab === "inmoba" && <InmobaContent />}
        {activeTab === "damelo" && <DameloContent />}
        {activeTab === "doctoc" && <DoctocContent />}
      </div>
      {modal && (
        <ImageModal
          src={modal.src}
          alt={modal.alt}
          label={modal.label}
          size={modal.size}
          onClose={() => setModal(null)}
        />
      )}
    </>
  );
}
