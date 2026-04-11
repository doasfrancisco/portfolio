export function Hero() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 24,
        maxWidth: 820,
        margin: "0 auto",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div
          style={{
            width: 8,
            height: 8,
            borderRadius: "50%",
            backgroundColor: "#4EC86C",
          }}
        />
        <div
          style={{
            color: "#888888",
            fontSize: 13,
            fontWeight: 500,
            letterSpacing: "0.5px",
            lineHeight: "16px",
          }}
        >
          Ready to build
        </div>
      </div>
      <h1
        style={{
          margin: 0,
          color: "#FFFFFF",
          fontSize: 72,
          fontStyle: "italic",
          fontWeight: 800,
          letterSpacing: "-2.5px",
          lineHeight: 1,
          textAlign: "center",
        }}
      >
        AI-first software factory
      </h1>
      <p
        style={{
          margin: 0,
          color: "#888888",
          fontSize: 18,
          lineHeight: 1.6,
          maxWidth: 720,
          textAlign: "center",
        }}
      >
        We build products from zero. Sold one, raised on another, shipping a few
        more right now. Each color below is a project we&apos;re commiting to.
      </p>
      <a
        href="https://wa.me/51960400734?text=Catafract%20hi!"
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 8,
          backgroundColor: "#FFFFFF",
          borderRadius: 8,
          paddingBlock: 8,
          paddingInline: 16,
          color: "#000000",
          fontSize: 14,
          fontWeight: 600,
          lineHeight: "18px",
          textDecoration: "none",
        }}
      >
        Get in touch
      </a>
    </div>
  );
}
