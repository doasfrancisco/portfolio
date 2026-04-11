"use client";

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { DoctocGallery, ImageTile, PhoneTile, PulsoGallery } from "./mockups";
import { useTab, type TabKey } from "./tab-context";
import { COMMIT_BY_PROJECT } from "../_data/commits";

const mono: CSSProperties = { fontFamily: "var(--font-mono), monospace" };

const TAB_ORDER: readonly TabKey[] = [
  "maxilar",
  "pulso",
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
    commits: COMMIT_BY_PROJECT.maxilar,
    status: { label: "● shipped", color: "#4EC86C" },
  },
  pulso: {
    accent: "#F472B6",
    activeBg: "#1F1018",
    activeBadgeBg: "#0F0610",
    activeBadgeBorder: "#5C1F3E",
    inactiveDot: "#5C1F3E",
    host: "catafract@pulso",
    domain: "pulsosalud.com",
    commits: COMMIT_BY_PROJECT.pulso,
    status: { label: "● live", color: "#F472B6" },
  },
  syntax: {
    accent: "#A78BFA",
    activeBg: "#15122A",
    activeBadgeBg: "#0A0820",
    activeBadgeBorder: "#2E2458",
    inactiveDot: "#3D2F5C",
    host: "catafract@syntax",
    domain: "syntax.catafract.com",
    commits: COMMIT_BY_PROJECT.syntax,
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
    commits: COMMIT_BY_PROJECT.inmoba,
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
    commits: COMMIT_BY_PROJECT.damelo,
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
    commits: COMMIT_BY_PROJECT.doctoc,
    status: { label: "● fhir r4", color: "#4EC86C" },
  },
};

/* ------------------------------ primitives ------------------------------ */

const TYPED_PROMPTS = new Set<string>();
const SEQUENCE_LISTENERS = new Set<() => void>();

const DEFAULT_THIRD_PROMPT = "imgcat screens/*.png";

const THIRD_PROMPT_BY_TAB: Partial<Record<TabKey, string>> = {
  doctoc: "ls fhir/ && bat *.json",
  pulso: "ls data/ # no ui yet — just the guts",
};

function cmdOrderFor(tab: string): readonly string[] {
  const third =
    THIRD_PROMPT_BY_TAB[tab as TabKey] ?? DEFAULT_THIRD_PROMPT;
  return ["cat about.md", "git log --oneline -4", third] as const;
}

function markTyped(id: string) {
  TYPED_PROMPTS.add(id);
  SEQUENCE_LISTENERS.forEach((fn) => fn());
}

function getProgress(tab: string): number {
  const order = cmdOrderFor(tab);
  let n = 0;
  for (const cmd of order) {
    if (TYPED_PROMPTS.has(`${tab}:${cmd}`)) n += 1;
    else break;
  }
  return n;
}

function useTerminalProgress(): number {
  const { activeTab } = useTab();
  const [, setTick] = useState(0);

  useEffect(() => {
    const fn = () => setTick((t) => t + 1);
    SEQUENCE_LISTENERS.add(fn);
    return () => {
      SEQUENCE_LISTENERS.delete(fn);
    };
  }, []);

  return getProgress(activeTab);
}

function Prompt({ cmd, theme }: { cmd: string; theme: Theme }) {
  const { activeTab } = useTab();
  const id = `${activeTab}:${cmd}`;
  const ref = useRef<HTMLDivElement>(null);
  const [displayed, setDisplayed] = useState(() =>
    TYPED_PROMPTS.has(id) ? cmd : ""
  );
  const [done, setDone] = useState(() => TYPED_PROMPTS.has(id));

  useEffect(() => {
    if (done) return;
    const el = ref.current;
    if (!el) return;

    let cancelled = false;
    let started = false;
    let isInView = false;
    let timer: ReturnType<typeof setTimeout> | undefined;

    const priorDone = () => {
      const order = cmdOrderFor(activeTab);
      const slot = order.indexOf(cmd);
      if (slot <= 0) return true;
      return TYPED_PROMPTS.has(`${activeTab}:${order[slot - 1]}`);
    };

    const tryStart = () => {
      if (started || cancelled) return;
      if (!isInView || !priorDone()) return;
      started = true;

      let i = 0;
      const step = () => {
        if (cancelled) return;
        i += 1;
        setDisplayed(cmd.slice(0, i));
        if (i >= cmd.length) {
          markTyped(id);
          setDone(true);
          return;
        }
        timer = setTimeout(step, 28 + Math.random() * 42);
      };
      step();
    };

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            isInView = true;
            tryStart();
            return;
          }
        }
      },
      { threshold: 0.01 }
    );
    observer.observe(el);

    const listener = () => tryStart();
    SEQUENCE_LISTENERS.add(listener);

    return () => {
      cancelled = true;
      observer.disconnect();
      SEQUENCE_LISTENERS.delete(listener);
      if (timer !== undefined) clearTimeout(timer);
    };
  }, [cmd, id, done, activeTab]);

  return (
    <div
      ref={ref}
      className="catafract-terminal-prompt"
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        flexWrap: "wrap",
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
      <span style={{ ...mono, color: "#FFFFFF", fontSize: 13, lineHeight: "16px" }}>
        {displayed}
        {!done && (
          <span
            className="catafract-terminal-caret"
            style={{ backgroundColor: theme.accent }}
            aria-hidden="true"
          />
        )}
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
      <span
        className="catafract-terminal-meta-key"
        style={{ ...mono, color: "#555555", fontSize: 11, lineHeight: "14px" }}
      >
        {k}
      </span>
      <span
        className="catafract-terminal-meta-val"
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
    <span
      className="catafract-terminal-meta-pipe"
      style={{ ...mono, color: "#1A1A1A", fontSize: 12, lineHeight: "16px" }}
    >
      |
    </span>
  );
}

function Metadata({ children }: { children: ReactNode }) {
  return (
    <div
      className="catafract-terminal-meta"
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
  const progress = useTerminalProgress();
  return (
    <div
      className="catafract-terminal-gitlog"
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
          visibility: progress >= 2 ? "visible" : "hidden",
        }}
      >
        {commits.map((c) => (
          <div
            key={c.hash}
            className="catafract-terminal-gitlog-row"
            style={{ display: "flex", alignItems: "baseline", gap: 14 }}
          >
            <span
              className="catafract-terminal-gitlog-hash"
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
              className="catafract-terminal-gitlog-msg"
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
      className="catafract-terminal-footer-row"
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
          className="catafract-terminal-footer-domain"
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
          className="catafract-terminal-footer-commits"
          style={{ ...mono, color: "#555555", fontSize: 11, lineHeight: "14px" }}
        >
          {theme.commits} commits
        </span>
        <span
          className="catafract-terminal-footer-status"
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
      className="catafract-terminal-tab"
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
        className="catafract-terminal-tab-dot"
        style={{
          width: 8,
          height: 8,
          borderRadius: 2,
          backgroundColor: active ? theme.accent : theme.inactiveDot,
        }}
      />
      <span
        className="catafract-terminal-tab-label"
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
        className="catafract-terminal-tab-badge"
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
      className="catafract-terminal-tabbar"
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
        className="catafract-terminal-traffic"
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          height: 20,
          borderRight: "1px solid #1A1A1A",
          marginRight: 2,
          paddingRight: 14,
          flexShrink: 0,
        }}
      >
        <div
          className="catafract-terminal-traffic-dot"
          style={{
            width: 12,
            height: 12,
            borderRadius: "50%",
            backgroundColor: "#FF5F57",
          }}
        />
        <div
          className="catafract-terminal-traffic-dot"
          style={{
            width: 12,
            height: 12,
            borderRadius: "50%",
            backgroundColor: "#FEBC2E",
          }}
        />
        <div
          className="catafract-terminal-traffic-dot"
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
        tab="pulso"
        active={activeTab === "pulso"}
        onClick={() => onChange("pulso")}
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
      <div
        className="catafract-terminal-tabbar-tail"
        style={{ flexGrow: 1 }}
      />
      <span
        className="catafract-terminal-tabbar-tail"
        style={{ ...mono, color: "#1A1A1A", fontSize: 11, lineHeight: "14px" }}
      >
        |
      </span>
    </div>
  );
}

/* --------------------------- content per tab --------------------------- */

function Heading({ children }: { children: ReactNode }) {
  return (
    <h2
      className="catafract-terminal-title"
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

function ProjectLogo({ src, alt }: { src: string; alt: string }) {
  return (
    <img
      src={src}
      alt={alt}
      className="catafract-terminal-logo"
      style={{
        display: "block",
        width: 120,
        height: 120,
        objectFit: "contain",
        marginTop: 22,
      }}
    />
  );
}

function Description({ children }: { children: ReactNode }) {
  return (
    <p
      className="catafract-terminal-desc"
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

function MaxilarContent({
  onImageClick,
}: {
  onImageClick: (info: {
    src: string;
    alt: string;
    label: string;
    size: string;
  }) => void;
}) {
  const theme = THEMES.maxilar;
  const shots: { num: string; filename: string; size: string; src: string; alt: string }[] = [
    { num: "01", filename: "schedule.png", size: "0.5mb", src: "/maxilar-schedule.png", alt: "maxilar schedule — patient appointment agent view" },
    { num: "02", filename: "payment.png", size: "0.5mb", src: "/maxilar-payment.png", alt: "maxilar payment — billing and receipts from the phone" },
    { num: "03", filename: "reports.png", size: "0.2mb", src: "/maxilar-reports.png", alt: "maxilar reports — clinic performance at a glance" },
  ];
  const progress = useTerminalProgress();
  return (
    <div
      className="catafract-terminal-content"
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 10,
        paddingBlock: 28,
        paddingInline: 32,
      }}
    >
      <Prompt cmd="cat about.md" theme={theme} />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 10,
          visibility: progress >= 1 ? "visible" : "hidden",
        }}
      >
        <ProjectLogo src="/maxilar-logo.png" alt="Maxilar" />
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
      </div>
      <div
        className="catafract-terminal-gallery-section"
        style={{
          display: "flex",
          flexDirection: "column",
          paddingTop: 4,
          visibility: progress >= 2 ? "visible" : "hidden",
        }}
      >
        <div style={{ paddingTop: 20 }}>
          <Prompt cmd="imgcat screens/*.png" theme={theme} />
        </div>
        <div style={{ visibility: progress >= 3 ? "visible" : "hidden" }}>
          <div
            className="catafract-terminal-gallery"
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 18,
              paddingTop: 6,
            }}
          >
            {shots.map((s) => (
              <PhoneTile
                key={s.num}
                num={s.num}
                filename={s.filename}
                size={s.size}
                src={s.src}
                alt={s.alt}
                onClick={() =>
                  onImageClick({
                    src: s.src,
                    alt: s.alt,
                    label: `${s.num} / maxilar — ${s.filename}`,
                    size: s.size,
                  })
                }
              />
            ))}
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 14,
              paddingTop: 14,
            }}
          >
            <span
              className="catafract-terminal-gallery-meta"
              style={{ ...mono, color: "#555555", fontSize: 11, lineHeight: "14px" }}
            >
              3 files · 1.2mb · rendered in 0.02s
            </span>
          </div>
          <Cursor theme={theme} />
        </div>
      </div>
      <div style={{ visibility: progress >= 3 ? "visible" : "hidden" }}>
        <FooterRow theme={theme} />
      </div>
    </div>
  );
}

function PulsoContent() {
  const theme = THEMES.pulso;
  const progress = useTerminalProgress();
  return (
    <div
      className="catafract-terminal-content"
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 10,
        paddingBlock: 28,
        paddingInline: 32,
      }}
    >
      <Prompt cmd="cat about.md" theme={theme} />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 10,
          visibility: progress >= 1 ? "visible" : "hidden",
        }}
      >
        <ProjectLogo src="/pulso-logo.png" alt="Pulso" />
        <Heading>AI for occupational health.</Heading>
        <Description>
          Pulso Salud (Ana Prevention) is the occupational health platform used
          by clinics and companies across Peru to run pre-employment and periodic
          exams, manage protocols, and keep workers safe. The team is rebuilding
          it AI-native — smart intake, automated reports, and a new frontend
          that replaces a legacy system that had been in production for years.
        </Description>
        <Metadata>
          <MetaItem k="role" v="head of ai" />
          <Pipe />
          <MetaItem k="scope" v="new frontend · db · mcps" color="#F472B6" />
          <Pipe />
          <MetaItem k="status" v="live · shipping" color="#F472B6" />
          <Pipe />
          <MetaItem k="dates" v="jan 2026 — now" />
        </Metadata>
        <GitLog
          theme={theme}
          commits={[
            {
              hash: "c71a2f9",
              msg: "feat: ship new frontend replacing the ap-legacy system",
            },
            {
              hash: "b08e3d1",
              msg: "feat: maria mcp agent for clinic workflows",
            },
            {
              hash: "4f1c0a6",
              msg: "feat: sap integration for pre-employment exam billing",
            },
            {
              hash: "0d2b9c7",
              msg: "chore: initial commit — ai-native rewrite kicks off",
            },
          ]}
        />
      </div>
      <div style={{ visibility: progress >= 2 ? "visible" : "hidden" }}>
        <div
          className="catafract-terminal-gallery-section"
          style={{ display: "flex", flexDirection: "column", paddingTop: 4 }}
        >
          <div style={{ paddingTop: 20 }}>
            <Prompt
              cmd="ls data/ # no ui yet — just the guts"
              theme={theme}
            />
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              visibility: progress >= 3 ? "visible" : "hidden",
            }}
          >
            <PulsoGallery />
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 14,
                paddingTop: 14,
              }}
            >
              <span
                className="catafract-terminal-gallery-meta"
                style={{
                  ...mono,
                  color: "#555555",
                  fontSize: 11,
                  lineHeight: "14px",
                }}
              >
                8 files · 205kb · no ui (yet)
              </span>
            </div>
            <Cursor theme={theme} />
          </div>
        </div>
      </div>
      <div style={{ visibility: progress >= 3 ? "visible" : "hidden" }}>
        <FooterRow theme={theme} />
      </div>
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
  const shots: { num: string; filename: string; size: string; src: string; alt: string }[] = [
    { num: "01", filename: "login.png", size: "2.0mb", src: "/syntax-login.png", alt: "syntax login — aprende inglés hablando con ia" },
    { num: "02", filename: "home.png", size: "0.9mb", src: "/syntax-home.png", alt: "syntax home — cursos con tópicos personalizados" },
    { num: "03", filename: "lesson.png", size: "0.2mb", src: "/syntax-lesson.png", alt: "syntax lesson — feedback inmediato por cada oración" },
    { num: "04", filename: "convo.png", size: "0.3mb", src: "/syntax-conversation.png", alt: "syntax conversation — real-time speaking practice with waveform" },
    { num: "05", filename: "free-trial.png", size: "0.5mb", src: "/syntax-free-trial.png", alt: "syntax free trial — 3 lecciones gratis de regalo" },
  ];
  const progress = useTerminalProgress();
  return (
    <div
      className="catafract-terminal-content"
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 10,
        paddingBlock: 28,
        paddingInline: 32,
      }}
    >
      <Prompt cmd="cat about.md" theme={theme} />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 10,
          visibility: progress >= 1 ? "visible" : "hidden",
        }}
      >
        <ProjectLogo src="/syntax-logo.png" alt="Syntax" />
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
      </div>
      <div
        className="catafract-terminal-gallery-section"
        style={{
          display: "flex",
          flexDirection: "column",
          paddingTop: 4,
          visibility: progress >= 2 ? "visible" : "hidden",
        }}
      >
        <div style={{ paddingTop: 20 }}>
          <Prompt cmd="imgcat screens/*.png" theme={theme} />
        </div>
        <div style={{ visibility: progress >= 3 ? "visible" : "hidden" }}>
          <div
            className="catafract-terminal-gallery"
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 18,
              paddingTop: 6,
            }}
          >
            {shots.map((s) => (
              <PhoneTile
                key={s.num}
                num={s.num}
                filename={s.filename}
                size={s.size}
                src={s.src}
                alt={s.alt}
                onClick={() =>
                  onImageClick({
                    src: s.src,
                    alt: s.alt,
                    label: `${s.num} / syntax — ${s.filename}`,
                    size: s.size,
                  })
                }
              />
            ))}
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 14,
              paddingTop: 14,
            }}
          >
            <span
              className="catafract-terminal-gallery-meta"
              style={{ ...mono, color: "#555555", fontSize: 11, lineHeight: "14px" }}
            >
              5 files · 3.9mb · rendered in 0.03s
            </span>
          </div>
          <Cursor theme={theme} />
        </div>
      </div>
      <div style={{ visibility: progress >= 3 ? "visible" : "hidden" }}>
        <FooterRow theme={theme} />
      </div>
    </div>
  );
}

function InmobaContent({
  onImageClick,
}: {
  onImageClick: (info: {
    src: string;
    alt: string;
    label: string;
    size: string;
  }) => void;
}) {
  const theme = THEMES.inmoba;
  const shots: { num: string; filename: string; size: string; src: string; alt: string }[] = [
    { num: "01", filename: "hero.png", size: "0.1mb", src: "/inmoba-01.png", alt: "inmoba hero — cualquier propiedad, tasación en 60 segundos" },
    { num: "02", filename: "map.png", size: "0.2mb", src: "/inmoba-02.png", alt: "inmoba map — click en cualquier distrito para ver análisis pre-financiero" },
    { num: "03", filename: "flow.png", size: "0.1mb", src: "/inmoba-03.png", alt: "inmoba how it works — de dirección a reporte en un minuto" },
    { num: "04", filename: "cta.png", size: "0.1mb", src: "/inmoba-04.png", alt: "inmoba cta — tu próxima propiedad tasada antes del café" },
  ];
  const progress = useTerminalProgress();
  return (
    <div
      className="catafract-terminal-content"
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 10,
        paddingBlock: 28,
        paddingInline: 32,
      }}
    >
      <Prompt cmd="cat about.md" theme={theme} />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 10,
          visibility: progress >= 1 ? "visible" : "hidden",
        }}
      >
        <ProjectLogo src="/inmoba-logo.png" alt="Inmoba" />
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
      </div>
      <div
        className="catafract-terminal-gallery-section"
        style={{
          display: "flex",
          flexDirection: "column",
          paddingTop: 4,
          visibility: progress >= 2 ? "visible" : "hidden",
        }}
      >
        <div style={{ paddingTop: 20 }}>
          <Prompt cmd="imgcat screens/*.png" theme={theme} />
        </div>
        <div
          style={{ visibility: progress >= 3 ? "visible" : "hidden" }}
        >
          <div
            className="catafract-terminal-gallery"
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 18,
              paddingTop: 6,
            }}
          >
            {shots.map((s) => (
              <ImageTile
                key={s.num}
                num={s.num}
                filename={s.filename}
                size={s.size}
                src={s.src}
                onClick={() =>
                  onImageClick({
                    src: s.src,
                    alt: s.alt,
                    label: `${s.num} / inmoba — ${s.filename}`,
                    size: s.size,
                  })
                }
              />
            ))}
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 14,
              paddingTop: 14,
            }}
          >
            <span
              className="catafract-terminal-gallery-meta"
              style={{ ...mono, color: "#555555", fontSize: 11, lineHeight: "14px" }}
            >
              4 files · 0.5mb · rendered in 0.02s
            </span>
          </div>
          <Cursor theme={theme} />
        </div>
      </div>
      <div style={{ visibility: progress >= 3 ? "visible" : "hidden" }}>
        <FooterRow theme={theme} />
      </div>
    </div>
  );
}

function DameloContent({
  onImageClick,
}: {
  onImageClick: (info: {
    src: string;
    alt: string;
    label: string;
    size: string;
  }) => void;
}) {
  const theme = THEMES.damelo;
  const shots: { num: string; filename: string; size: string; src: string; alt: string }[] = [
    { num: "01", filename: "landing-top.png", size: "0.1mb", src: "/damelo-01.png", alt: "damelo.sh landing — share your AI sessions with your team" },
    { num: "02", filename: "landing-bottom.png", size: "0.1mb", src: "/damelo-02.png", alt: "damelo.sh examples — export, browse, and import sessions" },
  ];
  const progress = useTerminalProgress();
  return (
    <div
      className="catafract-terminal-content"
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 10,
        paddingBlock: 28,
        paddingInline: 32,
      }}
    >
      <Prompt cmd="cat about.md" theme={theme} />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 10,
          visibility: progress >= 1 ? "visible" : "hidden",
        }}
      >
        <ProjectLogo src="/damelo-logo.png" alt="Damelo" />
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
      </div>
      <div
        className="catafract-terminal-gallery-section"
        style={{
          display: "flex",
          flexDirection: "column",
          paddingTop: 4,
          visibility: progress >= 2 ? "visible" : "hidden",
        }}
      >
        <div style={{ paddingTop: 20 }}>
          <Prompt cmd="imgcat screens/*.png" theme={theme} />
        </div>
        <div
          style={{ visibility: progress >= 3 ? "visible" : "hidden" }}
        >
          <div
            className="catafract-terminal-gallery"
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 18,
              paddingTop: 6,
            }}
          >
            {shots.map((s) => (
              <ImageTile
                key={s.num}
                num={s.num}
                filename={s.filename}
                size={s.size}
                src={s.src}
                onClick={() =>
                  onImageClick({
                    src: s.src,
                    alt: s.alt,
                    label: `${s.num} / damelo — ${s.filename}`,
                    size: s.size,
                  })
                }
              />
            ))}
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 14,
              paddingTop: 14,
            }}
          >
            <span
              className="catafract-terminal-gallery-meta"
              style={{ ...mono, color: "#555555", fontSize: 11, lineHeight: "14px" }}
            >
              2 files · 0.2mb · rendered in 0.02s
            </span>
          </div>
          <Cursor theme={theme} />
        </div>
      </div>
      <div style={{ visibility: progress >= 3 ? "visible" : "hidden" }}>
        <FooterRow theme={theme} />
      </div>
    </div>
  );
}

function DoctocContent() {
  const theme = THEMES.doctoc;
  const progress = useTerminalProgress();
  return (
    <div
      className="catafract-terminal-content"
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 10,
        paddingBlock: 28,
        paddingInline: 32,
      }}
    >
      <Prompt cmd="cat about.md" theme={theme} />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 10,
          visibility: progress >= 1 ? "visible" : "hidden",
        }}
      >
        <ProjectLogo src="/doctoc-logo.png" alt="Doctoc" />
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
      </div>
      <div style={{ visibility: progress >= 2 ? "visible" : "hidden" }}>
        <div
          className="catafract-terminal-gallery-section"
          style={{ display: "flex", flexDirection: "column", paddingTop: 4 }}
        >
          <div style={{ paddingTop: 20 }}>
            <Prompt cmd="ls fhir/ && bat *.json" theme={theme} />
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              visibility: progress >= 3 ? "visible" : "hidden",
            }}
          >
            <DoctocGallery />
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 14,
                paddingTop: 14,
              }}
            >
              <span
                className="catafract-terminal-gallery-meta"
                style={{
                  ...mono,
                  color: "#555555",
                  fontSize: 11,
                  lineHeight: "14px",
                }}
              >
                8 files · 12.3kb · rendered in 0.04s
              </span>
            </div>
            <Cursor theme={theme} />
          </div>
        </div>
      </div>
      <div style={{ visibility: progress >= 3 ? "visible" : "hidden" }}>
        <FooterRow theme={theme} />
      </div>
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
      className="catafract-modal"
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
        className="catafract-modal-inner"
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
            gap: 12,
            width: "100%",
          }}
        >
          <div
            className="catafract-modal-meta"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              fontFamily: "var(--font-mono), monospace",
              fontSize: 12,
              letterSpacing: "0.2px",
            }}
          >
            <span
              className="catafract-modal-meta-label"
              style={{ color: "#666666" }}
            >
              {label ?? alt}
            </span>
            {size && (
              <>
                <span style={{ color: "#333333", flexShrink: 0 }}>·</span>
                <span style={{ color: "#555555", flexShrink: 0 }}>{size}</span>
              </>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="catafract-modal-close"
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
              flexShrink: 0,
            }}
          >
            ✕
          </button>
        </div>
        <div
          className="catafract-modal-image-wrap"
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
  const { activeTab, setActiveTab, registerTerminalRef } = useTab();
  const ref = useRef<HTMLDivElement | null>(null);
  const [modal, setModal] = useState<{
    src: string;
    alt: string;
    label: string;
    size: string;
  } | null>(null);

  useEffect(() => {
    registerTerminalRef(ref.current);
    return () => registerTerminalRef(null);
  }, [registerTerminalRef]);

  return (
    <>
      <div
        ref={ref}
        className="catafract-terminal-root"
        style={{
          width: "100%",
          backgroundColor: "#0A0A0A",
          border: "1px solid #1A1A1A",
          borderRadius: 12,
          overflow: "hidden",
          boxSizing: "border-box",
          scrollMarginTop: 24,
        }}
      >
        <TabBar activeTab={activeTab} onChange={setActiveTab} />
        {activeTab === "maxilar" && (
          <MaxilarContent onImageClick={(info) => setModal(info)} />
        )}
        {activeTab === "pulso" && <PulsoContent />}
        {activeTab === "syntax" && (
          <SyntaxContent onImageClick={(info) => setModal(info)} />
        )}
        {activeTab === "inmoba" && (
          <InmobaContent onImageClick={(info) => setModal(info)} />
        )}
        {activeTab === "damelo" && (
          <DameloContent onImageClick={(info) => setModal(info)} />
        )}
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
